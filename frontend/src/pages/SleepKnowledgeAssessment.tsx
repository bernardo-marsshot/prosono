import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type SurveyAnswers, surveyService } from "../services/surveyService";

interface Question {
	id: string;
	text: string;
}

const questions: Question[] = [
	{
		id: "dormirPoucoAgressivoIrritadico",
		text: "Quando se dorme pouco, fica-se mais agressivo e irritadiço",
	},
	{
		id: "adormecerAumentaTemperaturaCorpo",
		text: "Quando se adormece, aumenta a temperatura do corpo",
	},
	{
		id: "horaDormirNaoInfluenciaQualidadeSono",
		text: "A hora a que se dorme não influencia a qualidade do sono",
	},
	{
		id: "computadorNoitePrejudicaSono",
		text: "Estar no computador à noite, antes de ir dormir, prejudica a qualidade do sono",
	},
	{
		id: "adolescentesDevemDormir8Horas",
		text: "Em média, os adolescentes devem dormir 8 horas por noite",
	},
	{
		id: "concentracaoIndependenteDoSono",
		text: "A capacidade de concentração é independente do sono",
	},
	{
		id: "dormirSemAtividadeCerebral",
		text: "Quando se está a dormir, não há atividade cerebral",
	},
	{
		id: "indiferenteDormirDiaOuNoite",
		text: "É indiferente dormir de dia ou à noite, desde que se durma muito",
	},
	{
		id: "comerMuitoAntesPrejudicaSono",
		text: "Comer muito antes de ir dormir reduz a qualidade do sono",
	},
	{
		id: "mensagensNoitePrejudicaSono",
		text: "Mandar mensagens durante a noite prejudica o sono",
	},
	{
		id: "dormirPoucoAumentaDoencas",
		text: "Dormir pouco aumenta a probabilidade de ficar doente",
	},
	{
		id: "estudarTardeIgualEficazDia",
		text: "Estudar até tarde é tão eficaz como estudar durante o dia",
	},
	{
		id: "muitaLuzNoiteAlteraRitmo",
		text: "Estar num ambiente com muita luz à noite altera o ritmo sono-vigília",
	},
	{
		id: "esforcoFisicoAjudaAdormecer",
		text: "Fazer um esforço físico antes de ir dormir faz adormecer mais facilmente",
	},
	{
		id: "compensarSonoPerdidoNoiteSeguinte",
		text: "Pode-se compensar o sono perdido dormindo mais na noite seguinte",
	},
	{
		id: "sonoInsuficienteEngordar",
		text: "Quando não se dorme o suficiente, há tendência para engordar",
	},
	{
		id: "sestaNaoAfetaSonoNoite",
		text: "Dormir uma sesta no final do dia não afeta o sono à noite",
	},
	{
		id: "luzSolAjudaDormirBem",
		text: "Para dormir bem, é bom apanhar luz e sol",
	},
	{
		id: "dormirPoucoAumentaAcidentes",
		text: "Dormir pouco aumenta o risco de acidentes",
	},
	{
		id: "variosTiposSonoNoite",
		text: "Ao longo de uma noite de sono, existem vários tipos de sono distintos",
	},
];

interface SleepKnowledgeAssessmentProps {
	onComplete?: (data: any) => void;
	onPrevious?: (() => void) | undefined;
	showNavigation?: boolean;
	isLastStep?: boolean;
	surveyDate?: string;
	onSurveyDateChange?: (date: string) => void;
}

const SleepKnowledgeAssessment = ({
	onComplete,
	onPrevious,
	showNavigation = true,
	isLastStep = false,
	surveyDate,
}: SleepKnowledgeAssessmentProps = {}) => {
	// Helper function to get today's date in DD-MM-YYYY format
	const getTodaysDate = (): string => {
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, "0");
		const day = today.getDate().toString().padStart(2, "0");
		return `${day}-${month}-${year}`;
	};

	// Validate DD-MM-YYYY format
	const validateDateFormat = (dateString: string): boolean => {
		const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$/;
		return dateRegex.test(dateString);
	};

	const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const handleAnswerChange = (
		questionId: keyof SurveyAnswers,
		value: boolean | string,
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
		const unanswered = questions.filter(
			(q) => answers[q.id as keyof SurveyAnswers] === undefined,
		);
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
					surveyDate: getTodaysDate(),
				};
				await surveyService.submitSurvey(dataToSubmit as SurveyAnswers);
				await refreshUser();
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Survey submission error:", error);
			setError("Erro ao submeter a avaliação. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	// Count answered questions
	const answeredQuestions = Object.keys(answers).filter(
		(key) => key !== "surveyDate",
	).length;

	return (
		<div className="min-h-screen bg-neutral-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200">
					{/* Header */}
					<div className="px-6 py-4 border-b border-neutral-200">
						<h1 className="text-2xl font-bold text-neutral-900">
							Ideias sobre o sono
						</h1>
						<p className="text-neutral-600 mt-1">
							Responde às seguintes perguntas para avaliarmos os teus
							conhecimentos sobre sono.
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
								<div key={question.id} className="bg-neutral-50 p-4 rounded-lg">
									<h3 className="text-sm font-medium text-neutral-900 mb-3">
										{index + 1}. {question.text}
									</h3>

									<div className="flex space-x-6">
										<label className="flex items-center">
											<input
												type="radio"
												name={question.id}
												value="true"
												checked={
													answers[question.id as keyof SurveyAnswers] === true
												}
												onChange={() =>
													handleAnswerChange(
														question.id as keyof SurveyAnswers,
														true,
													)
												}
												className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
											/>
											<span className="ml-2 text-sm text-neutral-700">
												Verdadeiro
											</span>
										</label>

										<label className="flex items-center">
											<input
												type="radio"
												name={question.id}
												value="false"
												checked={
													answers[question.id as keyof SurveyAnswers] === false
												}
												onChange={() =>
													handleAnswerChange(
														question.id as keyof SurveyAnswers,
														false,
													)
												}
												className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
											/>
											<span className="ml-2 text-sm text-neutral-700">
												Falso
											</span>
										</label>
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

								<div className="flex items-end gap-4">
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

export default SleepKnowledgeAssessment;
