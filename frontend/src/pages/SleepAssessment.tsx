import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SleepAttitudeSurvey from "./SleepAttitudeSurvey";
import SleepinessFrequencySurvey from "./SleepinessFrequencySurvey";
import SleepKnowledgeAssessment from "./SleepKnowledgeAssessment";
import { convertToApiFormat } from "../components/forms/SurveyDateInput";
import {
	multiStepSurveyService,
	type AttitudeSurveyFormData,
	type FrequencySurveyFormData,
} from "../services/multiStepSurveyService";
import type { SurveyAnswers } from "../services/surveyService";

type AssessmentStep = "intro" | "attitude" | "frequency" | "knowledge";

const SleepAssessment = () => {
	const [currentStep, setCurrentStep] = useState<AssessmentStep>("intro");
	const [surveyDate, setSurveyDate] = useState<string>(() => {
		// Helper function to get today's date in DD-MM-YYYY format
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, "0");
		const day = today.getDate().toString().padStart(2, "0");
		return `${day}-${month}-${year}`;
	});

	// Store survey data from each step
	const [attitudeSurveyData, setAttitudeSurveyData] = useState<
		Partial<AttitudeSurveyFormData>
	>({});
	const [frequencySurveyData, setFrequencySurveyData] = useState<
		Partial<FrequencySurveyFormData>
	>({});
	const [, setKnowledgeSurveyData] = useState<Partial<SurveyAnswers>>({});

	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const IntroStep = ({ onComplete }: { onComplete: () => void }) => (
		<div className="max-w-4xl mx-auto p-6">
			<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-neutral-900 mb-6">
						Avaliação do Sono
					</h2>
					<div className="text-left text-neutral-700 space-y-4 max-w-2xl mx-auto">
						<p>
							Ao longo do Programa ProSono, vamos pedir que respondas a algumas
							questões sobre o teu sono.
						</p>
						<p>
							Esta avaliação é muito rápida – são só 3 questionários curtos – e
							é a tua forma de nos mostrares como te sentes em relação ao teu
							sono e de podermos acompanhar o teu progresso. Não demora quase
							nada e faz toda a diferença!
						</p>
						<div className="mt-6">
							<p className="font-semibold text-neutral-900 mb-3">
								Vais preencher:
							</p>
							<ul className="list-disc list-inside space-y-2 text-neutral-700">
								<li> "O meu sono"</li>
								<li> "Escala de Sonolência Diurna"</li>
								<li> "Ideias sobre o sono"</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="text-center">
					<button
						onClick={onComplete}
						className="btn-primary px-8 py-3 text-lg"
					>
						Começar Avaliação
					</button>
				</div>
			</div>
		</div>
	);

	const steps = [
		{
			id: "intro",
			title: "Introdução",
			component: IntroStep,
		},
		{
			id: "attitude",
			title: "Atitudes sobre o Sono",
			component: SleepAttitudeSurvey,
		},
		{
			id: "frequency",
			title: "Escala de Sonolência Diurna",
			component: SleepinessFrequencySurvey,
		},
		{
			id: "knowledge",
			title: "Conhecimento sobre o Sono",
			component: SleepKnowledgeAssessment,
		},
	];

	const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
	const CurrentStepComponent = steps[currentStepIndex]?.component;

	const goToNextStep = () => {
		if (currentStepIndex < steps.length - 1) {
			setCurrentStep(steps[currentStepIndex + 1]?.id as AssessmentStep);
		}
	};

	const goToPreviousStep = () => {
		if (currentStepIndex > 0) {
			setCurrentStep(steps[currentStepIndex - 1]?.id as AssessmentStep);
		}
	};

	const handleStepComplete = async (stepData?: any) => {
		// Store the data from the current step (only for survey steps)
		if (currentStep === "attitude") {
			setAttitudeSurveyData(stepData);
		} else if (currentStep === "frequency") {
			setFrequencySurveyData(stepData);
		} else if (currentStep === "knowledge") {
			setKnowledgeSurveyData(stepData);
		}

		if (currentStepIndex < steps.length - 1) {
			goToNextStep();
		} else {
			// Final step completed - submit all surveys
			try {
				const apiDate = convertToApiFormat(surveyDate);

				const multiStepData = {
					attitudeSurvey: attitudeSurveyData as AttitudeSurveyFormData,
					frequencySurvey: frequencySurveyData as FrequencySurveyFormData,
					knowledgeSurvey: stepData as SurveyAnswers, // Final step data
					surveyDate: apiDate,
				};

				await multiStepSurveyService.submitAllSurveys(multiStepData);

				// Refresh user data to update status after successful submission
				await refreshUser();

				// Navigate to dashboard
				navigate("/dashboard");
			} catch (error) {
				console.error("Failed to submit surveys:", error);
				// Handle error (could show error message to user)
			}
		}
	};

	return (
		<div className="min-h-screen bg-neutral-50">
			{/* Step indicator */}
			<div className="bg-white border-b border-neutral-200 px-4 py-4">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-xl font-bold text-neutral-900">
							Avaliação do Sono ao longo do Programa
						</h1>
						<span className="text-sm text-neutral-600">
							Passo {currentStepIndex + 1} de {steps.length}
						</span>
					</div>

					{/* Progress indicator */}
					<div className="flex items-center space-x-4">
						{steps.map((step, index) => (
							<div key={step.id} className="flex items-center">
								<div
									className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
										index <= currentStepIndex
											? "bg-primary-600 text-white"
											: "bg-neutral-200 text-neutral-600"
									}`}
								>
									{index + 1}
								</div>
								<span
									className={`ml-2 text-sm font-medium ${
										index === currentStepIndex
											? "text-primary-600"
											: index < currentStepIndex
												? "text-neutral-900"
												: "text-neutral-500"
									}`}
								>
									{step.title}
								</span>
								{index < steps.length - 1 && (
									<div
										className={`mx-4 h-0.5 w-12 ${
											index < currentStepIndex
												? "bg-primary-600"
												: "bg-neutral-200"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Current step content */}
			<div className="flex-1">
				{CurrentStepComponent &&
					(currentStep === "intro" ? (
						<CurrentStepComponent onComplete={() => handleStepComplete()} />
					) : currentStepIndex > 1 ? (
						<CurrentStepComponent
							onComplete={handleStepComplete}
							onPrevious={goToPreviousStep}
							showNavigation={false}
							isLastStep={currentStepIndex === steps.length - 1}
							surveyDate={surveyDate}
							onSurveyDateChange={setSurveyDate}
						/>
					) : (
						<CurrentStepComponent
							onComplete={handleStepComplete}
							showNavigation={false}
							isLastStep={currentStepIndex === steps.length - 1}
							surveyDate={surveyDate}
							onSurveyDateChange={setSurveyDate}
						/>
					))}
			</div>
		</div>
	);
};

export default SleepAssessment;
