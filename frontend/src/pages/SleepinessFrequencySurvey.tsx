import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { convertToApiFormat } from "../components/forms/SurveyDateInput";

interface SleepinessFrequencySurveyData {
	adormeço_aulas_manha: number;
	aguento_dia_escola_sem_cansaco: number;
	adormeço_ultima_aula: number;
	sonolento_carro_5min: number;
	bem_acordado_todo_dia: number;
	adormeço_aulas_tarde: number;
	desperto_durante_aulas: number;
	sonolento_fim_dia_aulas: number;
	sonolento_autocarro_atividade: number;
	manha_escola_adormeço: number;
	bem_desperto_aulas: number;
	sonolento_trabalhos_casa_noite: number;
	desperto_ultima_aula: number;
	adormeço_transportes: number;
	momentos_adormeço_escola: number;
	adormeço_trabalhos_casa_noite: number;
	surveyDate: string;
}

interface Question {
	id: keyof Omit<SleepinessFrequencySurveyData, "surveyDate">;
	text: string;
}

const questions: Question[] = [
	{
		id: "adormeço_aulas_manha",
		text: "Adormeço durante as aulas da manhã",
	},
	{
		id: "aguento_dia_escola_sem_cansaco",
		text: "Consigo aguentar o dia inteiro na escola sem me sentir cansado",
	},
	{
		id: "adormeço_ultima_aula",
		text: "Adormeço na última aula do dia",
	},
	{
		id: "sonolento_carro_5min",
		text: "Fico sonolento(a) quando ando de carro mais de 5 minutos",
	},
	{
		id: "bem_acordado_todo_dia",
		text: "Fico bem acordado(a) durante todo o dia",
	},
	{
		id: "adormeço_aulas_tarde",
		text: "Adormeço na escola nas aulas da tarde",
	},
	{
		id: "desperto_durante_aulas",
		text: "Sinto-me desperto (a) durante as aulas",
	},
	{
		id: "sonolento_fim_dia_aulas",
		text: "Sinto-me sonolento(a) ao fim do dia depois das aulas",
	},
	{
		id: "sonolento_autocarro_atividade",
		text: "Sinto-me sonolento(a) quando vou de autocarro para uma atividade da escola (por ex. visita de estudo, jogo desportivo)",
	},
	{
		id: "manha_escola_adormeço",
		text: "De manhã, quando estou na escola, adormeço",
	},
	{
		id: "bem_desperto_aulas",
		text: "Quando estou nas aulas, sinto-me bem desperto(a)",
	},
	{
		id: "sonolento_trabalhos_casa_noite",
		text: "Sinto-me sonolento quando faço os trabalhos de casa à noite depois da escola",
	},
	{
		id: "desperto_ultima_aula",
		text: "Estou bem desperto(a) na última aula do dia",
	},
	{
		id: "adormeço_transportes",
		text: "Adormeço quando ando de carro, de autocarro ou de comboio",
	},
	{
		id: "momentos_adormeço_escola",
		text: "Durante o dia na escola, há momentos em que me dou conta que acabei de adormecer",
	},
	{
		id: "adormeço_trabalhos_casa_noite",
		text: "Adormeço quando faço os trabalhos da escola à noite em casa",
	},
];

const frequencyOptions = [
	{ value: 0, label: "Nunca", description: "(0 vezes por mês)" },
	{ value: 1, label: "Raramente", description: "(3 vezes por mês)" },
	{ value: 2, label: "Algumas vezes", description: "(1-2 vezes por semana)" },
	{ value: 3, label: "Frequentemente", description: "(3-4 vezes por semana)" },
	{
		value: 4,
		label: "Quase sempre",
		description: "(5 ou mais vezes por semana)",
	},
];

interface SleepinessFrequencySurveyProps {
	onComplete?: (data: any) => void;
	onPrevious?: (() => void) | undefined;
	showNavigation?: boolean;
	isLastStep?: boolean;
	surveyDate?: string;
	onSurveyDateChange?: (date: string) => void;
}

const SleepinessFrequencySurvey = ({
	onComplete,
	onPrevious,
	showNavigation = true,
	isLastStep = false,
	surveyDate,
}: SleepinessFrequencySurveyProps = {}) => {
	// Validate DD-MM-YYYY format
	const validateDateFormat = (dateString: string): boolean => {
		const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-([0-9]{4})$/;
		return dateRegex.test(dateString);
	};

	const [answers, setAnswers] = useState<
		Partial<SleepinessFrequencySurveyData>
	>({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const handleAnswerChange = (
		questionId: keyof SleepinessFrequencySurveyData,
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

				console.log("Sleepiness frequency survey data:", dataToSubmit);
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await refreshUser();
				navigate("/dashboard");
			}
		} catch (error) {
			console.error("Sleepiness frequency survey submission error:", error);
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200">
					{/* Header */}
					<div className="px-6 py-4 border-b border-neutral-200">
						<h1 className="text-2xl font-bold text-neutral-900">
							Questionário de Sonolência Diurna
						</h1>
						<p className="text-neutral-600 mt-1">
							Lê com atenção as frases que se seguem acerca do teu sono. Marca
							um X na opção que melhor corresponde ao que se passa habitualmente
							contigo durante o dia.
							<br /> Não peças ajuda a ninguém. É importante que sejas tu a
							responder. Aqui não há respostas certas ou erradas. O que é
							importante é responder com sinceridade.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-6">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
								{error}
							</div>
						)}

						<div className="space-y-6">
							{/* Survey Table */}
							<div className="bg-neutral-50 p-4 rounded-lg overflow-x-auto">
								<table className="w-full border-collapse">
									<thead>
										<tr>
											<th className="text-left p-3 border-b border-neutral-300 font-medium text-neutral-900 min-w-80">
												Situações
											</th>
											{frequencyOptions.map((option) => (
												<th
													key={option.value}
													className="text-center p-3 border-b border-neutral-300 font-medium text-neutral-900 min-w-32"
												>
													<div className="text-sm">
														<div className="font-semibold">{option.label}</div>
														<div className="text-xs text-neutral-600 mt-1">
															{option.description}
														</div>
													</div>
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{questions.map((question, index) => (
											<tr
												key={question.id}
												className={
													index % 2 === 0 ? "bg-white" : "bg-neutral-25"
												}
											>
												<td className="p-3 border-b border-neutral-200 text-sm text-neutral-900">
													{index + 1}. {question.text}
												</td>
												{frequencyOptions.map((option) => (
													<td
														key={option.value}
														className="p-3 border-b border-neutral-200 text-center"
													>
														<input
															type="radio"
															name={question.id}
															value={option.value}
															checked={answers[question.id] === option.value}
															onChange={() =>
																handleAnswerChange(question.id, option.value)
															}
															className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
														/>
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
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

export default SleepinessFrequencySurvey;
