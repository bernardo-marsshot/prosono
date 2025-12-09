import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { convertToApiFormat } from "../components/forms/SurveyDateInput";

interface SleepAttitudeSurveyData {
	durmo_mal_ou_bem: number;
	gosto_de_dormir: number;
	acho_sono_importante: number;
	o_que_sei_sobre_sono: number;
	surveyDate: string;
}

interface Question {
	id: keyof Omit<SleepAttitudeSurveyData, "surveyDate">;
	text: string;
}

const questions: Question[] = [
	{
		id: "durmo_mal_ou_bem",
		text: "Durmo mal ou bem?",
	},
	{
		id: "gosto_de_dormir",
		text: "Gosto de dormir?",
	},
	{
		id: "acho_sono_importante",
		text: "Acho o sono importante para mim?",
	},
	{
		id: "o_que_sei_sobre_sono",
		text: "O que eu sei sobre o sono?",
	},
];

interface SleepAttitudeSurveyProps {
	onComplete?: (data: any) => void;
	onPrevious?: (() => void) | undefined;
	showNavigation?: boolean;
	isLastStep?: boolean;
	surveyDate?: string;
	onSurveyDateChange?: (date: string) => void;
}

const SleepAttitudeSurvey = ({
	onComplete,
	onPrevious,
	showNavigation = true,
	isLastStep = false,
	surveyDate,
}: SleepAttitudeSurveyProps = {}) => {
	// Validate DD-MM-YYYY format
	const validateDateFormat = (dateString: string): boolean => {
		const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$/;
		return dateRegex.test(dateString);
	};

	const [answers, setAnswers] = useState<Partial<SleepAttitudeSurveyData>>({
		durmo_mal_ou_bem: 5,
		gosto_de_dormir: 5,
		acho_sono_importante: 5,
		o_que_sei_sobre_sono: 5,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const handleAnswerChange = (
		questionId: keyof SleepAttitudeSurveyData,
		value: string | number,
	) => {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
		setError("");
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validate survey date is provided and in correct format
		if (!surveyDate) {
			setError("Por favor, selecione a data da avaliação.");
			return;
		}

		if (!validateDateFormat(surveyDate)) {
			setError(
				"Formato inválido para a data. Use DD-MM-YYYY (ex: 25-12-2024).",
			);
			return;
		}

		// Validate all questions are answered
		const unanswered = questions.filter((q) => answers[q.id] === undefined);
		if (unanswered.length > 0) {
			setError("Por favor, responda a todas as perguntas antes de submeter.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Call completion callback or navigate to dashboard
			if (onComplete) {
				onComplete(answers);
			} else {
				// For standalone use, submit to API
				const dataToSubmit = {
					...answers,
					surveyDate: convertToApiFormat(surveyDate!),
				};

				console.log("Sleep attitude survey data:", dataToSubmit);
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await refreshUser();
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Sleep attitude survey submission error:", error);
			setError("Erro ao submeter a avaliação. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	// Count answered questions
	const answeredQuestions = questions.filter(
		(q) => answers[q.id] !== undefined,
	).length;

	return (
		<div className="min-h-screen bg-neutral-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200">
					{/* Header */}
					<div className="px-6 py-4 border-b border-neutral-200">
						<h1 className="text-2xl font-bold text-neutral-900">O meu sono</h1>
						<p className="text-neutral-600 mt-1">
							Responde às seguintes perguntas sobre o teu sono, para te
							conhecermos melhor.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-6">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
								{error}
							</div>
						)}

						<div className="space-y-6">
							{questions.map((question, index) => (
								<div key={question.id} className="bg-neutral-50 p-6 rounded-lg">
									<h3 className="text-lg font-medium text-neutral-900">
										{index + 1}. {question.text}
									</h3>

									<div className="text-neutral-500 text-sm mb-4">
										<span>
											(Marca o número que melhor corresponde ao que achas do teu
											sono)
										</span>
									</div>

									<div className="space-y-3">
										{/* Slider with labels */}
										<div className="flex items-center space-x-4">
											<span className="text-sm text-neutral-600 font-medium">
												Nada
											</span>
											<div className="flex-1 relative">
												<input
													type="range"
													id={question.id}
													min="0"
													max="10"
													step="1"
													value={answers[question.id] ?? 5}
													onChange={(e) =>
														handleAnswerChange(
															question.id,
															parseInt(e.target.value),
														)
													}
													className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
												/>

												{/* Slider track styling */}
												<style>{`
                          .slider::-webkit-slider-thumb {
                            appearance: none;
                            height: 20px;
                            width: 20px;
                            border-radius: 50%;
                            background: #2563eb;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                          }
                          .slider::-moz-range-thumb {
                            height: 20px;
                            width: 20px;
                            border-radius: 50%;
                            background: #2563eb;
                            cursor: pointer;
                            border: 2px solid white;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                          }
                        `}</style>
											</div>
											<span className="text-sm text-neutral-600 font-medium">
												Muito
											</span>
										</div>

										{/* Scale markers */}
										<div className="flex justify-between text-xs text-neutral-400 mt-1 mx-14">
											{Array.from({ length: 11 }, (_, i) => (
												<span key={i} className="text-center">
													{i}
												</span>
											))}
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="pt-6 border-t border-neutral-200 mt-8">
							<div className="flex justify-between items-center">
								<div>
									{onPrevious && (
										<button
											type="button"
											onClick={onPrevious}
											className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
										>
											← Anterior
										</button>
									)}
									{showNavigation && !onPrevious && (
										<button
											type="button"
											onClick={() => navigate("/dashboard")}
											className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
										>
											Cancelar
										</button>
									)}
								</div>

								<div>
									{onComplete && (
										<button
											type="button"
											onClick={() => onComplete(answers)}
											disabled={answeredQuestions < questions.length}
											className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Continuar →
										</button>
									)}
									{isLastStep && (
										<button
											type="submit"
											disabled={
												isLoading || answeredQuestions < questions.length
											}
											className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											{isLoading ? "A submeter..." : "Submeter Avaliação"}
										</button>
									)}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SleepAttitudeSurvey;
