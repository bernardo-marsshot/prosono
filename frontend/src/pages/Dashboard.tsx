import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SleepMetricsTable from "../components/dashboard/SleepMetricsTable";

const Dashboard = () => {
	const { user, isAuthenticated, refreshUser } = useAuth();

	// Helper function to check if today's survey is filled
	const getTodaysDate = (): string => {
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, "0");
		const day = today.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	// Check if today's survey is filled using dailySurveys.dates from user data
	const hasTodaysSurvey =
		user?.dailySurveys?.dates?.includes(getTodaysDate()) ?? false;

	// Helper function to get the latest evaluation data
	const getLatestEvaluationData = () => {
		const evaluationSurveys = user?.evaluationSurveys;
		if (!evaluationSurveys || evaluationSurveys.length === 0) return null;

		// Sort surveys by date and return the latest survey
		const sortedSurveys = [...evaluationSurveys].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
		);

		return sortedSurveys[0];
	};

	// Helper function to get the latest survey date
	const getLatestSurveyDate = (): string | null => {
		const dates = user?.dailySurveys?.dates;
		if (!dates || dates.length === 0) return null;

		// Sort dates and get the latest one
		const sortedDates = [...dates].sort(
			(a, b) => new Date(b).getTime() - new Date(a).getTime(),
		);
		return sortedDates[0] || null;
	};

	// Helper function to get the first survey date
	const getFirstSurveyDate = (): string | null => {
		const dates = user?.dailySurveys?.dates;
		if (!dates || dates.length === 0) return null;

		// Sort dates and get the earliest one
		const sortedDates = [...dates].sort(
			(a, b) => new Date(a).getTime() - new Date(b).getTime(),
		);
		return sortedDates[0] || null;
	};

	// Helper function to format date for display
	const formatDateForDisplay = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString("pt-PT", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	// Helper function to calculate days since first survey
	const getDaysSinceFirstSurvey = (): number => {
		const firstDate = getFirstSurveyDate();
		if (!firstDate) return 0;

		const startDate = new Date(firstDate);
		const today = new Date();
		const diffTime = today.getTime() - startDate.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	// Refresh user data when dashboard loads to get updated status
	useEffect(() => {
		const refreshUserData = async () => {
			try {
				await refreshUser();
			} catch (error) {
				console.error("Error refreshing user data:", error);
			}
		};

		// Only refresh if user is authenticated
		if (isAuthenticated) {
			refreshUserData();
		}
	}, [isAuthenticated]); // Removed refreshUser from dependencies to prevent infinite loop

	console.log("Dashboard - user:", user);
	console.log("Dashboard - isAuthenticated:", isAuthenticated);

	return (
		<div className="min-h-screen bg-neutral-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-neutral-900 mb-2">
						{user?.firstName
							? `Bem-vindo de volta, ${user.firstName}!`
							: "Bem-vindo de volta!"}
					</h1>
					<p className="text-neutral-600">
						Vê como tens dormido e melhora o teu descanso — dormir bem muda
						tudo.
					</p>
				</div>

				{/* Sleep Tracking */}
				<div className="mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
						<div className="flex items-start justify-between mb-4">
							<div>
								<div className="flex items-center gap-2 mb-2">
									<h3 className="text-lg font-semibold text-neutral-900">
										Diário do sono
									</h3>
									{hasTodaysSurvey && (
										<div className="flex items-center text-blue-600">
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											<span className="text-sm font-medium ml-1">
												Já preencheste hoje
											</span>
										</div>
									)}
								</div>
								<p className="text-neutral-600">Regista como dormiste.</p>
							</div>
							<div
								className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
									hasTodaysSurvey ? "bg-blue-100" : "bg-green-100"
								}`}
							>
								<svg
									className={`w-6 h-6 ${
										hasTodaysSurvey ? "text-blue-600" : "text-green-600"
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
						</div>
						<Link
							to="/sleep-tracking"
							className="inline-flex items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
						>
							Preencher diário de sono
						</Link>
					</div>
				</div>

				{/* Combined Progress and Sleep Metrics */}
				{user?.dailySurveys && (
					<div className="mb-8">
						<div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
									<svg
										className="w-5 h-5 text-accent-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<div className="items-center justify-between">
										<h2 className="text-lg font-semibold text-neutral-900">
											Padrão de Sono
										</h2>
									</div>
									<p className="text-sm text-neutral-600">
										Acompanha o teu padrão de sono ao longo do Programa.
									</p>
								</div>
							</div>

							{/* Progress Stats */}
							<div className="mb-6">
								<div className="flex items-center justify-center">
									{/* Center: Main progress stat component */}
									<div className="text-center">
										<div className="text-3xl font-bold text-primary-600 mb-1">
											{getFirstSurveyDate() ? (
												<>
													{user.dailySurveys.dates.length} registos de{" "}
													{getDaysSinceFirstSurvey()} dias desde{" "}
													{formatDateForDisplay(getFirstSurveyDate()!)}
												</>
											) : (
												`${user.dailySurveys.dates.length} registos`
											)}
										</div>
										{/* Right: Último date */}
										<div className="text-base text-neutral-600">
											{getLatestSurveyDate() ? (
												<span>
													Último: {formatDateForDisplay(getLatestSurveyDate()!)}
												</span>
											) : (
												<span></span>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Sleep Metrics Table */}
							<div className="border-t border-neutral-200 pt-6">
								<SleepMetricsTable dailySurveys={user.dailySurveys} />
							</div>
						</div>
					</div>
				)}

				{/* Sleep Assessment */}
				<div className="mb-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
						<div className="flex items-center gap-2 mb-6">
							<div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-100">
								<svg
									className="w-6 h-6 text-primary-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-neutral-900">
									Programa
								</h3>
								<p className="text-sm text-neutral-600">
									Avalia o estado do teu sono, no ínicio e no final do programa.
								</p>
							</div>
						</div>
						{(() => {
							const latestEvaluation = getLatestEvaluationData();
							if (latestEvaluation) {
								return (
									<div className="my-3">
										<div className="overflow-x-auto">
											<table className="w-full border-collapse">
												<tbody>
													<tr className="border-b border-neutral-100 bg-neutral-50/50">
														<td className="py-3 px-2 text-sm font-medium text-neutral-700">
															Conhecimentos sobre o Sono
														</td>
														<td className="py-3 px-2 text-sm text-neutral-600">
															{latestEvaluation.score}/20
														</td>
													</tr>
													{latestEvaluation.clevelandMean && (
														<tr className="border-b border-neutral-100 bg-white">
															<td className="py-3 px-2 text-sm font-medium text-neutral-700">
																Escala de sonolência diurna
															</td>
															<td className="py-3 px-2 text-sm text-neutral-600">
																{latestEvaluation.clevelandMean.toFixed(1)}
															</td>
														</tr>
													)}
													<tr
														className={`border-b border-neutral-100 ${latestEvaluation.clevelandMean ? "bg-neutral-50/50" : "bg-white"}`}
													>
														<td className="py-3 px-2 text-sm font-medium text-neutral-700">
															Atitudes em relação ao sono
														</td>
														<td className="py-3 px-2 text-sm text-neutral-600"></td>
													</tr>
													{latestEvaluation.mySleepMeans && (
														<>
															<tr
																className={`border-b border-neutral-100 ${latestEvaluation.clevelandMean ? "bg-white" : "bg-neutral-50/50"}`}
															>
																<td className="py-3 px-2 pl-6 text-sm text-neutral-700">
																	Durmo mal ou bem? (Muito mal - muito bem)
																</td>
																<td className="py-3 px-2 text-sm text-neutral-600">
																	{latestEvaluation.mySleepMeans.durmoMalOuBem.toFixed(
																		1,
																	)}
																</td>
															</tr>
															<tr
																className={`border-b border-neutral-100 ${latestEvaluation.clevelandMean ? "bg-neutral-50/50" : "bg-white"}`}
															>
																<td className="py-3 px-2 pl-6 text-sm text-neutral-700">
																	Gosto de dormir? (Não gosto nada - Gosto
																	muito)
																</td>
																<td className="py-3 px-2 text-sm text-neutral-600">
																	{latestEvaluation.mySleepMeans.gostoDeDormir.toFixed(
																		1,
																	)}
																</td>
															</tr>
															<tr
																className={`border-b border-neutral-100 ${latestEvaluation.clevelandMean ? "bg-white" : "bg-neutral-50/50"}`}
															>
																<td className="py-3 px-2 pl-6 text-sm text-neutral-700">
																	Acho o sono importante para mim? (Nada
																	importante - Muito importante)
																</td>
																<td className="py-3 px-2 text-sm text-neutral-600">
																	{latestEvaluation.mySleepMeans.achoSonoImportanteParaMim.toFixed(
																		1,
																	)}
																</td>
															</tr>
															<tr
																className={`${latestEvaluation.clevelandMean ? "bg-neutral-50/50" : "bg-white"}`}
															>
																<td className="py-3 px-2 pl-6 text-sm text-neutral-700">
																	O que eu sei sobre o sono? (Não sei nada - sei
																	muitas coisas)
																</td>
																<td className="py-3 px-2 text-sm text-neutral-600">
																	{latestEvaluation.mySleepMeans.oQueSeiSobreSono.toFixed(
																		1,
																	)}
																</td>
															</tr>
														</>
													)}
												</tbody>
											</table>
										</div>
									</div>
								);
							}
							return null;
						})()}
						<Link
							to="/assessments"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
						>
							Fazer Avaliação
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
