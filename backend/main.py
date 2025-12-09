import mimetypes
import os
from datetime import date
from pathlib import Path
from statistics import mean
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from auth import (
    ACCESS_TOKEN_EXPIRE_DURATION,
    create_access_token,
    generate_salt,
    hash_password,
    verify_password,
    verify_token,
)
from config import REQUIRED_DAILY_SURVEYS
from database import get_db
from logging_config import setup_logging
from models import ClevelandSurvey, DailySleepSurvey, MySleepSurvey, SleepSurvey, User
from schemas import (
    ClevelandSurveyCreate,
    DailySleepSurveyCreate,
    DailySleepSurveyResponse,
    DailySurveysInfo,
    MeanMetrics,
    MySleepSurveyCreate,
    SleepSurveyCreate,
    SurveyData,
    Token,
    UserCreate,
    UserLogin,
    UserProfileResponse,
    UserResponse,
    UserUpdate,
)
from sleep_survey_answer_key import calculate_score_from_survey

# Setup logging
logger = setup_logging()


def calculate_daily_survey_means(
    daily_surveys: list[DailySleepSurvey],
) -> dict[str, MeanMetrics]:
    """Calculate mean metrics for different time periods from daily survey data."""
    if not daily_surveys:
        empty_metrics = MeanMetrics(
            last_7_days=None, last_15_days=None, last_30_days=None
        )
        return {
            "mean_sleep_duration": empty_metrics,
            "mean_wake_time": empty_metrics,
            "mean_bedtime": empty_metrics,
            "mean_time_to_sleep": empty_metrics,
            "mean_night_awakenings": empty_metrics,
            "mean_sleep_quality": empty_metrics,
        }

    # Sort by date descending (most recent first)
    sorted_surveys = sorted(daily_surveys, key=lambda x: x.survey_date, reverse=True)

    def time_to_minutes(time_val):
        """Convert time to minutes from midnight."""
        if time_val is None:
            return None
        return time_val.hour * 60 + time_val.minute

    def calculate_mean_for_period(surveys_subset, field_name, time_converter=None):
        """Calculate mean for a specific field and time period."""
        if not surveys_subset:
            return None

        values = []
        for survey in surveys_subset:
            value = getattr(survey, field_name)
            if value is not None:
                if time_converter:
                    value = time_converter(value)
                    if value is not None:
                        values.append(value)
                else:
                    values.append(value)

        return round(sum(values) / len(values), 2) if values else None

    # Calculate means for different periods
    periods = [7, 15, 30]
    results = {}

    fields_config = [
        ("horas_que_dormiste", "mean_sleep_duration", None),
        ("hora_levantaste_hoje", "mean_wake_time", time_to_minutes),
        ("hora_deitaste_ontem", "mean_bedtime", time_to_minutes),
        ("tempo_ate_adormecer", "mean_time_to_sleep", None),
        ("vezes_acordaste_noite", "mean_night_awakenings", None),
        ("qualidade_sono_noite", "mean_sleep_quality", None),
    ]

    for field_name, result_key, converter in fields_config:
        period_means = {}
        for period in periods:
            subset = sorted_surveys[:period]
            period_means[f"last_{period}_days"] = calculate_mean_for_period(
                subset, field_name, converter
            )

        results[result_key] = MeanMetrics(**period_means)

    return results


def calculate_my_sleep_survey_means(
    my_sleep_surveys: list[MySleepSurvey],
) -> dict[str, float] | None:
    """Calculate mean values for all MySleepSurvey integer fields."""
    if not my_sleep_surveys:
        return None

    # Field mapping: database field -> camelCase key
    field_mapping = {
        "durmo_mal_ou_bem": "durmoMalOuBem",
        "gosto_de_dormir": "gostoDeDormir",
        "acho_sono_importante_para_mim": "achoSonoImportanteParaMim",
        "o_que_sei_sobre_sono": "oQueSeiSobreSono",
    }

    means = {}
    for db_field, camel_key in field_mapping.items():
        values = [
            getattr(survey, db_field)
            for survey in my_sleep_surveys
            if getattr(survey, db_field) is not None
        ]
        if values:
            means[camel_key] = round(mean(values), 2)
        else:
            means[camel_key] = None

    return means


def calculate_cleveland_mean(cleveland_surveys: list[ClevelandSurvey]) -> float | None:
    """Calculate Cleveland survey mean - function stub to be filled with formula."""
    if not cleveland_surveys:
        return None

    return mean(survey.cleveland_score() for survey in cleveland_surveys)


app = FastAPI(title="Prosono Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS", "PUT"],
    allow_headers=["*"],
)

# Mount static files
# Use absolute path for Docker, relative for local development
# static_dir = (
#     "/app/frontend/dist" if os.path.exists("/app/frontend/dist") else "../frontend/dist"
# )
# app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logger.error(f"{request}: {exc_str}")
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


def get_current_user(
    authorization: Annotated[str, Header()], db: Annotated[Session, Depends(get_db)]
) -> User:
    if not authorization.startswith("Bearer "):
        logger.warning("Invalid authorization header format")
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        logger.warning("Invalid or expired token")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        logger.warning("Invalid token payload - missing user ID")
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        logger.warning(f"User not found for ID: {user_id}")
        raise HTTPException(status_code=401, detail="User not found")

    return user


@app.post("/auth/register")
def register_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    logger.info(f"Registration attempt for email: {user.email}")

    # Check if user with email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        logger.warning(f"Registration failed - email already exists: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    # Generate salt and hash password
    salt = generate_salt()
    password_hash = hash_password(user.password, salt)

    # Create new user
    db_user = User(
        email=user.email,
        password_hash=password_hash,
        salt=salt,
        first_name=user.first_name,
        last_name=user.last_name,
        birth_date=user.birth_date,
        gender=user.gender,
        school=user.school,
        school_year=user.school_year,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    logger.info(f"User registered successfully: {user.email}")


@app.post("/auth/login", response_model=Token)
def login(user_credentials: UserLogin, db: Annotated[Session, Depends(get_db)]):
    logger.info(f"Login attempt for email: {user_credentials.email}")

    # Find user by email
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        logger.warning(f"Login failed - user not found: {user_credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(user_credentials.password, user.salt, user.password_hash):
        logger.warning(f"Login failed - invalid password: {user_credentials.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=ACCESS_TOKEN_EXPIRE_DURATION
    )
    logger.info(f"User logged in successfully: {user_credentials.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/user", response_model=UserResponse)
def get_user(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(f"User info requested: {current_user.email}")

    # Get all sleep surveys for this user, ordered by creation date
    all_sleep_surveys = (
        db.query(SleepSurvey)
        .filter(SleepSurvey.user_id == current_user.id)
        .order_by(SleepSurvey.created_at.asc())
        .all()
    )

    # Get MySleepSurvey and ClevelandSurvey data for the user
    my_sleep_surveys = (
        db.query(MySleepSurvey)
        .filter(MySleepSurvey.user_id == current_user.id)
        .order_by(MySleepSurvey.survey_date.asc())
        .all()
    )

    cleveland_surveys = (
        db.query(ClevelandSurvey)
        .filter(ClevelandSurvey.user_id == current_user.id)
        .order_by(ClevelandSurvey.survey_date.asc())
        .all()
    )

    # Calculate means
    my_sleep_means = calculate_my_sleep_survey_means(my_sleep_surveys)
    cleveland_mean = calculate_cleveland_mean(cleveland_surveys)

    # Build list of evaluation surveys
    evaluation_surveys = []
    for survey in all_sleep_surveys:
        score = calculate_score_from_survey(survey)
        evaluation_surveys.append(
            SurveyData(
                date=survey.survey_date,
                score=score,
                my_sleep_means=my_sleep_means,
                cleveland_mean=cleveland_mean,
            )
        )

    # Get all daily survey data for this user with all fields needed for calculations
    daily_surveys = (
        db.query(DailySleepSurvey)
        .filter(DailySleepSurvey.user_id == current_user.id)
        .order_by(DailySleepSurvey.survey_date.asc())
        .all()
    )

    daily_survey_dates = [survey.survey_date for survey in daily_surveys]

    # Calculate mean metrics for different time periods
    mean_metrics = calculate_daily_survey_means(daily_surveys)

    # Create response with evaluation surveys and daily survey data
    return UserResponse(
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        birth_date=current_user.birth_date,
        gender=current_user.gender,
        school=current_user.school,
        school_year=current_user.school_year,
        evaluation_surveys=evaluation_surveys,
        daily_surveys=DailySurveysInfo(
            target=REQUIRED_DAILY_SURVEYS,
            dates=daily_survey_dates,
            mean_sleep_duration=mean_metrics["mean_sleep_duration"],
            mean_wake_time=mean_metrics["mean_wake_time"],
            mean_bedtime=mean_metrics["mean_bedtime"],
            mean_time_to_sleep=mean_metrics["mean_time_to_sleep"],
            mean_night_awakenings=mean_metrics["mean_night_awakenings"],
            mean_sleep_quality=mean_metrics["mean_sleep_quality"],
        ),
    )


@app.put("/user", response_model=UserProfileResponse)
def update_user(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(f"User update requested: {current_user.email}")

    # Update user fields using dict approach
    updated_fields = []
    for field_name, field_value in user_update.model_dump(exclude_unset=True).items():
        if field_value is not None:
            setattr(current_user, field_name, field_value)
            updated_fields.append(field_name)

    db.commit()
    db.refresh(current_user)

    logger.info(f"User updated successfully: {current_user.email}")

    return UserProfileResponse(
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        birth_date=current_user.birth_date,
        gender=current_user.gender,
        school=current_user.school,
        school_year=current_user.school_year,
    )


@app.post("/surveys")
def create_survey(
    survey: SleepSurveyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(f"Survey creation/update requested by user: {current_user.email}")

    # Perform PostgreSQL upsert operation
    survey_data = survey.model_dump()
    survey_data["user_id"] = current_user.id

    stmt = insert(SleepSurvey).values(**survey_data)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "survey_date"],
        set_={
            key: stmt.excluded[key]
            for key in survey_data.keys()
            if key not in ["user_id", "survey_date"]
        },
    )
    stmt = stmt.returning(SleepSurvey.id)

    result = db.execute(stmt)
    survey_id = result.scalar()
    db.commit()

    logger.info(f"Survey saved successfully for user: {current_user.email}")
    return {"id": survey_id}


@app.post("/daily-surveys")
def create_daily_survey(
    survey: DailySleepSurveyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(f"Daily survey creation/update requested by user: {current_user.email}")

    # Perform PostgreSQL upsert operation
    survey_data = survey.model_dump()
    survey_data["user_id"] = current_user.id

    stmt = insert(DailySleepSurvey).values(**survey_data)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "survey_date"],
        set_={
            key: stmt.excluded[key]
            for key in survey_data.keys()
            if key not in ["user_id", "survey_date"]
        },
    )
    stmt = stmt.returning(DailySleepSurvey.id)

    result = db.execute(stmt)
    survey_id = result.scalar()
    db.commit()

    logger.info(f"Daily survey saved successfully for user: {current_user.email}")
    return {"id": survey_id}


@app.get("/daily-surveys", response_model=DailySleepSurveyResponse)
def get_daily_survey(
    survey_date: date,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(
        f"Daily survey for {survey_date} requested by user: {current_user.email}"
    )

    daily_survey = (
        db.query(DailySleepSurvey)
        .filter(
            DailySleepSurvey.user_id == current_user.id,
            DailySleepSurvey.survey_date == survey_date,
        )
        .first()
    )

    if not daily_survey:
        logger.info(
            f"No daily survey found for {survey_date} for user: {current_user.email}"
        )
        raise HTTPException(
            status_code=404, detail=f"No daily survey found for {survey_date}"
        )

    logger.info(
        f"Daily survey for {survey_date} retrieved for user: {current_user.email}"
    )
    return daily_survey


@app.post("/cleveland-surveys")
def create_cleveland_survey(
    survey: ClevelandSurveyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(
        f"Cleveland survey creation/update requested by user: {current_user.email}"
    )

    # Perform PostgreSQL upsert operation
    survey_data = survey.model_dump()
    survey_data["user_id"] = current_user.id

    stmt = insert(ClevelandSurvey).values(**survey_data)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "survey_date"],
        set_={
            key: stmt.excluded[key]
            for key in survey_data.keys()
            if key not in ["user_id", "survey_date"]
        },
    )
    stmt = stmt.returning(ClevelandSurvey.id)

    result = db.execute(stmt)
    survey_id = result.scalar()
    db.commit()

    logger.info(f"Cleveland survey saved successfully for user: {current_user.email}")
    return {"id": survey_id}


@app.post("/my-sleep-surveys")
def create_my_sleep_survey(
    survey: MySleepSurveyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    logger.info(
        f"My sleep survey creation/update requested by user: {current_user.email}"
    )

    # Perform PostgreSQL upsert operation
    survey_data = survey.model_dump()
    survey_data["user_id"] = current_user.id

    stmt = insert(MySleepSurvey).values(**survey_data)
    stmt = stmt.on_conflict_do_update(
        index_elements=["user_id", "survey_date"],
        set_={
            key: stmt.excluded[key]
            for key in survey_data.keys()
            if key not in ["user_id", "survey_date"]
        },
    )
    stmt = stmt.returning(MySleepSurvey.id)

    result = db.execute(stmt)
    survey_id = result.scalar()
    db.commit()

    logger.info(f"My sleep survey saved successfully for user: {current_user.email}")
    return {"id": survey_id}


@app.get("/health")
def health():
    return {"status": "healthy"}


# @app.get("/assets/{path:path}")
# def serve_assets(path: str):
#     """Serve frontend asset files with proper MIME types"""
#     static_dir = Path(__file__).parent / "../frontend/dist/assets"
#     file_path = static_dir / path

#     if file_path.exists() and file_path.is_file():
#         # Determine media type based on file extension
#         media_type, _ = mimetypes.guess_type(str(file_path))
#         return FileResponse(file_path, media_type=media_type)
#     else:
#         raise HTTPException(status_code=404, detail="Asset not found")


# @app.get("/app/{path:path}")
# def serve_frontend(path: str):
#     """Serve frontend application with SPA routing support"""
#     static_dir = Path(__file__).parent / "../frontend/dist"
#     index_path = static_dir / "index.html"

#     return FileResponse(index_path, media_type="text/html")


# @app.get("/")
# def root() -> FileResponse:
#     """Serve frontend application root"""
#     static_dir = Path(__file__).parent / "../frontend/dist"
#     index_path = static_dir / "index.html"

#     return FileResponse(index_path, media_type="text/html")


# @app.options("/{path:path}")
# def options_handler(path: str):
#     return {"message": "OK"}


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting Prosono Backend server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
