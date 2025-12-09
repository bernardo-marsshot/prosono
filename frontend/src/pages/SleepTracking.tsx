import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	type DailySurveyData,
	dailySurveyService,
} from "../services/dailySurveyService";
import {
	convertToApiFormat,
	SurveyDateInput,
} from "../components/forms/SurveyDateInput";

const SleepTracking = () => {
	// Helper functions to convert between time format and minutes
	const timeToMinutes = (timeString: string): number => {
		const [hours, minutes] = timeString.split(":").map(Number);
		// @ts-ignore: the time passed here is well formatted
		return hours * 60 + minutes;
	};

	// Helper function to get today's date in DD-MM-YYYY format
	const getTodaysDate = (): string => {
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, "0");
		const day = today.getDate().toString().padStart(2, "0");
		return `${day}-${month}-${year}`;
	};

	const [formData, setFormData] = useState<DailySurveyData>({
		horaLevantasteHoje: "",
		horaDeitasteOntem: "",
		tempoAteAdormecer: 0,
		vezesAcordasteNoite: 0,
		horasQueDormiste: 0,
		qualidadeSonoNoite: 3,
		observacaoNoitePassada: "",
		surveyDate: getTodaysDate(),
	});
	const [sleepDurationDisplay, setSleepDurationDisplay] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();

	const handleInputChange = (
		field: keyof DailySurveyData,
		value: string | number,
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError("");
	};

	const handleDateChange = (newDate: string) => {
		// If date changed, reset form data to defaults but keep the new date
		setFormData({
			horaLevantasteHoje: "",
			horaDeitasteOntem: "",
			tempoAteAdormecer: 0,
			vezesAcordasteNoite: 0,
			horasQueDormiste: 0,
			qualidadeSonoNoite: 3,
			observacaoNoitePassada: "",
			surveyDate: newDate,
		});
		setSleepDurationDisplay("");
		setError("");
	};

	const handleSleepDurationChange = (timeString: string) => {
		setSleepDurationDisplay(timeString);
		const minutes = timeToMinutes(timeString);
		setFormData((prev) => ({ ...prev, horasQueDormiste: minutes }));
		setError("");
	};

	// Validate HH:MM format
	const validateTimeFormat = (timeString: string): string | null => {
		const [hours, minutes] = timeString.split(":");
		if (!hours || !minutes) {
			return null;
		}

		const parsedHours = Number.parseInt(hours);
		const parsedMinutes = Number.parseInt(minutes);
		if (
			parsedHours === undefined ||
			parsedHours === null ||
			Number.isNaN(parsedHours) ||
			parsedMinutes === undefined ||
			parsedMinutes === null ||
			Number.isNaN(parsedMinutes)
		) {
			return null;
		}

		if (
			parsedHours < 0 ||
			parsedHours > 23 ||
			parsedMinutes < 0 ||
			parsedMinutes > 59
		) {
			return null;
		}

		return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
	};

	const validateForm = (): boolean => {
		if (
			!formData.horaLevantasteHoje ||
			!formData.horaDeitasteOntem ||
			!sleepDurationDisplay ||
			!formData.surveyDate
		) {
			setError("Por favor, preencha todos os campos obrigatórios.");
			return false;
		}

		// Validate time format for wake up time
		if (!validateTimeFormat(formData.horaLevantasteHoje)) {
			setError(
				"Formato inválido para a hora de levantar. Use HH:MM (00:00 a 23:59).",
			);
			return false;
		}

		// Validate time format for bed time
		if (!validateTimeFormat(formData.horaDeitasteOntem)) {
			setError(
				"Formato inválido para a hora de deitar. Use HH:MM (00:00 a 23:59).",
			);
			return false;
		}

		// Validate time format for sleep duration
		if (!validateTimeFormat(sleepDurationDisplay)) {
			setError(
				"Formato inválido para as horas de sono. Use HH:MM (00:00 a 23:59).",
			);
			return false;
		}

		if (
			formData.tempoAteAdormecer < 0 ||
			formData.vezesAcordasteNoite < 0 ||
			formData.horasQueDormiste < 0
		) {
			setError("Os valores numéricos não podem ser negativos.");
			return false;
		}

		if (formData.qualidadeSonoNoite < 0 || formData.qualidadeSonoNoite > 5) {
			setError("A qualidade do sono deve estar entre 0 e 5.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Remove empty observation field if not provided and convert date format
			const dataToSubmit = {
				...formData,
				// Format times (validation already confirmed they're valid)
				horaLevantasteHoje: validateTimeFormat(formData.horaLevantasteHoje)!,
				horaDeitasteOntem: validateTimeFormat(formData.horaDeitasteOntem)!,
				surveyDate: convertToApiFormat(formData.surveyDate),
			};
			if (!dataToSubmit.observacaoNoitePassada?.trim()) {
				delete dataToSubmit.observacaoNoitePassada;
			}

			await dailySurveyService.submitDailySurvey(dataToSubmit);

			// Navigate back to dashboard on success
			navigate("/dashboard");
		} catch (error) {
			console.error("Daily survey submission error:", error);
			setError("Erro ao submeter os dados do sono. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-50 py-8">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200">
					{/* Header */}
					<div className="px-6 py-4 border-b border-neutral-200">
						<h1 className="text-2xl font-bold text-neutral-900">
							Como dormiste esta noite?
						</h1>
						<p className="text-neutral-600 mt-1">
							Este diário é a tua ferramenta secreta para teres mais energia e
							estares no teu melhor. Podes registar os teus dados a qualquer
							momento. O dia deve ser o da manhã em que acordaste, e as
							respostas referem-se à noite anterior. Podes preencher para hoje
							ou para qualquer noite anterior.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-6">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
								{error}
							</div>
						)}
						<div className="space-y-6">
							{/* Survey Date - Customizable */}
							<SurveyDateInput
								value={formData.surveyDate}
								onChange={handleDateChange}
								label="Dia * (DD-MM-YYYY)"
								id="survey_date"
							/>

							{/* Wake up time */}
							<div>
								<label
									htmlFor="horaLevantasteHoje"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									A que horas te levantaste hoje de manhã? * (formato 24h)
								</label>
								<input
									type="text"
									id="horaLevantasteHoje"
									value={formData.horaLevantasteHoje}
									onChange={(e) =>
										handleInputChange("horaLevantasteHoje", e.target.value)
									}
									className="input-field w-full"
									placeholder="HH:MM (ex: 08:30)"
									pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
									required
								/>
							</div>

							{/* Bed time */}
							<div>
								<label
									htmlFor="horaDeitasteOntem"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									A que horas te deitaste ontem à noite? * (formato 24h)
								</label>
								<input
									type="text"
									id="horaDeitasteOntem"
									value={formData.horaDeitasteOntem}
									onChange={(e) =>
										handleInputChange("horaDeitasteOntem", e.target.value)
									}
									className="input-field w-full"
									placeholder="HH:MM (ex: 23:00)"
									pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
									required
								/>
							</div>

							{/* Time to fall asleep */}
							<div>
								<label
									htmlFor="tempoAteAdormecer"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Quanto tempo demoraste até adormecer? (em minutos)
								</label>
								<input
									type="number"
									id="tempoAteAdormecer"
									min="0"
									placeholder="Ex: 15"
									value={formData.tempoAteAdormecer || ""}
									onChange={(e) =>
										handleInputChange(
											"tempoAteAdormecer",
											e.target.value === "" ? 0 : parseInt(e.target.value),
										)
									}
									className="input-field w-full"
								/>
							</div>

							{/* Times woken up */}
							<div>
								<label
									htmlFor="vezesAcordasteNoite"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Quantas vezes acordaste durante a noite?
								</label>
								<input
									type="number"
									id="vezesAcordasteNoite"
									min="0"
									placeholder="Ex: 2"
									value={formData.vezesAcordasteNoite || ""}
									onChange={(e) =>
										handleInputChange(
											"vezesAcordasteNoite",
											e.target.value === "" ? 0 : parseInt(e.target.value),
										)
									}
									className="input-field w-full"
								/>
							</div>

							{/* Hours slept */}
							<div>
								<label
									htmlFor="horasQueDormiste"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Quantas horas achas que dormiste? (formato HH:MM)
								</label>
								<input
									type="text"
									id="horasQueDormiste"
									value={sleepDurationDisplay}
									onChange={(e) => handleSleepDurationChange(e.target.value)}
									className="input-field w-full"
									placeholder="HH:MM (ex: 08:30)"
									pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
								/>
								<p className="text-xs text-neutral-500 mt-1">
									Exemplo: 08:30 para 8 horas e 30 minutos
								</p>
							</div>

							{/* Sleep quality */}
							<div>
								<label
									htmlFor="qualidadeSonoNoite"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Como foi o teu sono esta noite? (0 = Muito mau, 5 = Excelente)
								</label>
								<select
									id="qualidadeSonoNoite"
									value={formData.qualidadeSonoNoite}
									onChange={(e) =>
										handleInputChange(
											"qualidadeSonoNoite",
											parseInt(e.target.value),
										)
									}
									className="input-field w-full"
								>
									<option value={0}>0 - Muito mau</option>
									<option value={1}>1 - Mau</option>
									<option value={2}>2 - Razoável</option>
									<option value={3}>3 - Bom</option>
									<option value={4}>4 - Muito bom</option>
									<option value={5}>5 - Excelente</option>
								</select>
							</div>

							{/* Observations */}
							<div>
								<label
									htmlFor="observacaoNoitePassada"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Tens alguma observação importante sobre a noite passada?
								</label>
								<textarea
									id="observacaoNoitePassada"
									rows={3}
									value={formData.observacaoNoitePassada || ""}
									onChange={(e) =>
										handleInputChange("observacaoNoitePassada", e.target.value)
									}
									className="input-field w-full resize-none"
									placeholder="Opcional: notas sobre a qualidade do sono, sonhos, interrupções, sestas, etc."
								/>
							</div>
						</div>

						{/* Submit buttons */}
						<div className="pt-6 border-t border-neutral-200 mt-8">
							<div className="flex justify-between items-center">
								<button
									type="button"
									onClick={() => navigate("/dashboard")}
									className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
								>
									Cancelar
								</button>

								<button
									type="submit"
									disabled={isLoading}
									className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isLoading ? "A submeter..." : "Guardar Dados do Sono"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SleepTracking;
