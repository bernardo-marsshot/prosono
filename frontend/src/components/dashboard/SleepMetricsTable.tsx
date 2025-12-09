import type { DailySurveys } from "../../types/auth";

interface SleepMetricsTableProps {
	dailySurveys: DailySurveys;
}

const SleepMetricsTable = ({ dailySurveys }: SleepMetricsTableProps) => {
	const formatTime = (minutes: number | null): string => {
		if (minutes === null) return "N/A";
		const hours = Math.floor(minutes / 60);
		const mins = Math.floor(minutes % 60);
		return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
	};

	const formatMinutes = (minutes: number | null): string => {
		if (minutes === null) return "N/A";

		if (minutes < 60) {
			return `${minutes} m`;
		}

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (remainingMinutes === 0) {
			return hours === 1 ? "1 h" : `${hours} h`;
		}

		const hourText = hours === 1 ? "1 h" : `${hours} h`;
		const minuteText = remainingMinutes === 1 ? "1 m" : `${remainingMinutes} m`;

		return `${hourText} e ${minuteText}`;
	};

	const formatCount = (count: number | null): string => {
		if (count === null) return "N/A";
		return count.toString();
	};

	const metrics = [
		{
			name: "Duração de Sono",
			last7Days: formatMinutes(dailySurveys.meanSleepDuration.last7Days),
			last15Days: formatMinutes(dailySurveys.meanSleepDuration.last15Days),
			last30Days: formatMinutes(dailySurveys.meanSleepDuration.last30Days),
		},
		{
			name: "Hora de Levantar",
			last7Days: formatTime(dailySurveys.meanWakeTime.last7Days),
			last15Days: formatTime(dailySurveys.meanWakeTime.last15Days),
			last30Days: formatTime(dailySurveys.meanWakeTime.last30Days),
		},
		{
			name: "Hora de Deitar",
			last7Days: formatTime(dailySurveys.meanBedtime.last7Days),
			last15Days: formatTime(dailySurveys.meanBedtime.last15Days),
			last30Days: formatTime(dailySurveys.meanBedtime.last30Days),
		},
		{
			name: "Tempo para adormecer",
			last7Days: formatMinutes(dailySurveys.meanTimeToSleep.last7Days),
			last15Days: formatMinutes(dailySurveys.meanTimeToSleep.last15Days),
			last30Days: formatMinutes(dailySurveys.meanTimeToSleep.last30Days),
		},
		{
			name: "Despertares Noturnos",
			last7Days: formatCount(dailySurveys.meanNightAwakenings.last7Days),
			last15Days: formatCount(dailySurveys.meanNightAwakenings.last15Days),
			last30Days: formatCount(dailySurveys.meanNightAwakenings.last30Days),
		},
		{
			name: "Qualidade do Sono (1 — 5)",
			last7Days: formatCount(dailySurveys.meanSleepQuality.last7Days),
			last15Days: formatCount(dailySurveys.meanSleepQuality.last15Days),
			last30Days: formatCount(dailySurveys.meanSleepQuality.last30Days),
		},
	];

	return (
		<div className="card">
			<h3 className="text-lg font-semibold text-neutral-800 mb-4">
				Padrão de Sono
			</h3>

			<div className="overflow-x-auto">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b border-neutral-200">
							<th className="text-left py-3 px-2 text-sm font-medium text-neutral-600">
								Métrica
							</th>
							<th className="text-center py-3 px-2 text-sm font-medium text-neutral-600">
								Últimos 7 Registos
							</th>
							<th className="text-center py-3 px-2 text-sm font-medium text-neutral-600">
								Últimos 15 Registos
							</th>
							<th className="text-center py-3 px-2 text-sm font-medium text-neutral-600">
								Últimos 30 Registos
							</th>
						</tr>
					</thead>
					<tbody>
						{metrics.map((metric, index) => (
							<tr
								key={metric.name}
								className={`border-b border-neutral-100 ${
									index % 2 === 0 ? "bg-neutral-50/50" : "bg-white"
								}`}
							>
								<td className="py-3 px-2 text-sm font-medium text-neutral-700">
									{metric.name}
								</td>
								<td className="py-3 px-2 text-sm text-center text-neutral-600">
									{metric.last7Days}
								</td>
								<td className="py-3 px-2 text-sm text-center text-neutral-600">
									{metric.last15Days}
								</td>
								<td className="py-3 px-2 text-sm text-center text-neutral-600">
									{metric.last30Days}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SleepMetricsTable;
