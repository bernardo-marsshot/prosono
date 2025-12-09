import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
	const { user, updateUserProfile } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		birthDate: "",
		gender: "",
		school: "",
		schoolYear: undefined as number | undefined,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				birthDate: user.birthDate || "",
				gender: user.gender || "",
				school: user.school || "",
				schoolYear: user.schoolYear,
			});
		}
	}, [user]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		const processedValue =
			name === "schoolYear" ? (value ? parseInt(value, 10) : undefined) : value;
		setFormData((prev) => ({ ...prev, [name]: processedValue }));
		setMessage(null);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage(null);

		try {
			// Exclude email from the update payload and filter out undefined values
			const { email, ...updateData } = formData;
			const payload = Object.fromEntries(
				Object.entries(updateData).filter(([_, value]) => value !== undefined),
			);
			await updateUserProfile(payload);
			setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
		} catch (error) {
			console.error("Profile update error:", error);
			setMessage({
				type: "error",
				text: "Erro ao atualizar o perfil. Tente novamente.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return (
			<div className="min-h-screen bg-neutral-50 py-8">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
						<p className="text-neutral-600">
							A carregar dados do utilizador...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-50 py-8">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200">
					<div className="px-6 py-4 border-b border-neutral-200">
						<h1 className="text-2xl font-bold text-neutral-900">
							Perfil de Utilizador - Aluno
						</h1>
						<p className="text-neutral-600 mt-1">
							Gerir as informações da tua conta
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{message && (
							<div
								className={`p-4 rounded-lg ${
									message.type === "success"
										? "bg-green-50 border border-green-200 text-green-700"
										: "bg-red-50 border border-red-200 text-red-700"
								}`}
							>
								{message.text}
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Primeiro Nome
								</label>
								<input
									id="firstName"
									name="firstName"
									type="text"
									required
									className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									value={formData.firstName}
									onChange={handleChange}
								/>
							</div>

							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Último Nome
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									required
									className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									value={formData.lastName}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-neutral-700 mb-2"
							>
								Endereço de Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								readOnly
								className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-600 cursor-not-allowed"
								value={formData.email}
							/>
						</div>

						<div>
							<label
								htmlFor="birthDate"
								className="block text-sm font-medium text-neutral-700 mb-2"
							>
								Data de Nascimento
							</label>
							<input
								id="birthDate"
								name="birthDate"
								type="date"
								required
								className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
								value={formData.birthDate}
								onChange={handleChange}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div>
								<label
									htmlFor="gender"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Sexo
								</label>
								<select
									id="gender"
									name="gender"
									className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									value={formData.gender}
									onChange={handleChange}
								>
									<option value="">Selecionar</option>
									<option value="M">Masculino</option>
									<option value="F">Feminino</option>
									<option value="O">Outro</option>
								</select>
							</div>

							<div>
								<label
									htmlFor="school"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Escola
								</label>
								<input
									id="school"
									name="school"
									type="text"
									className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									placeholder="Nome da escola"
									value={formData.school}
									onChange={handleChange}
								/>
							</div>

							<div>
								<label
									htmlFor="schoolYear"
									className="block text-sm font-medium text-neutral-700 mb-2"
								>
									Ano de Escolaridade
								</label>
								<select
									id="schoolYear"
									name="schoolYear"
									className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
									value={formData.schoolYear ?? ""}
									onChange={handleChange}
								>
									<option value="">Selecionar</option>
									<option value={10}>10º Ano</option>
									<option value={11}>11º Ano</option>
									<option value={12}>12º Ano</option>
								</select>
							</div>
						</div>

						<div className="pt-4 border-t border-neutral-200">
							<div className="flex justify-end space-x-4">
								<button
									type="button"
									className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
									onClick={() => navigate("/dashboard")}
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={isLoading}
									className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isLoading ? "A guardar..." : "Guardar Alterações"}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Profile;
