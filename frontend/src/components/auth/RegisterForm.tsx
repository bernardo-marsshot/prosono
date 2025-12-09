import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ApiError, RegisterData } from "../../types";

const RegisterForm = () => {
	const [formData, setFormData] = useState<RegisterData>({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		birthDate: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

	const { register } = useAuth();

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		if (name === "confirmPassword") {
			setConfirmPassword(value);
		} else {
			if (name === "schoolYear") {
				const numberValue = value ? parseInt(value, 10) : undefined;
				if (numberValue !== undefined) {
					setFormData((prev) => ({ ...prev, [name]: numberValue }));
				} else {
					const { schoolYear, ...rest } = formData;
					setFormData(rest);
				}
			} else if (name === "gender" || name === "school") {
				if (value) {
					setFormData((prev) => ({ ...prev, [name]: value }));
				} else {
					const { [name]: _, ...rest } = formData as any;
					setFormData(rest);
				}
			} else {
				setFormData((prev) => ({ ...prev, [name]: value }));
			}
		}
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = "O primeiro nome é obrigatório";
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = "O último nome é obrigatório";
		}

		if (!formData.email.trim()) {
			newErrors.email = "O email é obrigatório";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}

		if (!formData.password) {
			newErrors.password = "A palavra-passe é obrigatória";
		} else if (formData.password.length < 8) {
			newErrors.password = "A palavra-passe deve ter pelo menos 8 caracteres";
		}

		if (formData.password !== confirmPassword) {
			newErrors.confirmPassword = "As palavras-passe não coincidem";
		}

		if (!formData.birthDate) {
			newErrors.birthDate = "A data de nascimento é obrigatória";
		} else if (import.meta.env.VITE_ENABLE_AGE_VALIDATION === "true") {
			const today = new Date();
			const birthDate = new Date(formData.birthDate);
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			const dayDiff = today.getDate() - birthDate.getDate();

			const actualAge =
				age - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);

			if (actualAge < 15 || actualAge > 18) {
				newErrors.birthDate = "Deve ter entre 15 e 18 anos";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			await register(formData);
			setIsRegistrationSuccess(true);
		} catch (error) {
			const apiError = error as ApiError;

			if (apiError.status === 409) {
				setErrors({ general: "O email usado já foi registado" })
			} else {
				setErrors({
					general: apiError.message || "Ocorreu um erro durante o registo",
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Show success state if registration was successful
	if (isRegistrationSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div className="text-center">
						<div className="flex justify-center">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
								<svg
									className="w-8 h-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
						</div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
							Conta criada com sucesso!
						</h2>
						<p className="mt-2 text-center text-sm text-neutral-600">
							A tua conta foi criada. Podes agora fazer login para aceder à
							plataforma.
						</p>
					</div>

					<div className="space-y-4">
						<Link
							to="/login"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
						>
							Fazer Login
						</Link>

						<Link
							to="/"
							className="group relative w-full flex justify-center py-2 px-4 border border-neutral-300 text-sm font-medium rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
						>
							Voltar ao Início
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<div className="flex justify-center">
						<div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-2xl">P</span>
						</div>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
						Cria a tua conta
					</h2>
					<p className="mt-2 text-center text-sm text-neutral-600">
						Ou{" "}
						<Link
							to="/login"
							className="font-medium text-primary-600 hover:text-primary-500"
						>
							entra na tua conta
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{errors.general && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
							{errors.general}
						</div>
					)}

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="firstName"
									className="block text-sm font-medium text-neutral-700"
								>
									Primeiro Nome
								</label>
								<input
									id="firstName"
									name="firstName"
									type="text"
									required
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
									placeholder="Primeiro nome"
									value={formData.firstName}
									onChange={handleChange}
								/>
								{errors.firstName && (
									<p className="mt-1 text-sm text-red-600">
										{errors.firstName}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor="lastName"
									className="block text-sm font-medium text-neutral-700"
								>
									Último Nome
								</label>
								<input
									id="lastName"
									name="lastName"
									type="text"
									required
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
									placeholder="Último nome"
									value={formData.lastName}
									onChange={handleChange}
								/>
								{errors.lastName && (
									<p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-neutral-700"
							>
								Endereço de Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								placeholder="Insere o teu email"
								value={formData.email}
								onChange={handleChange}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="birthDate"
								className="block text-sm font-medium text-neutral-700"
							>
								Data de Nascimento
							</label>
							<input
								id="birthDate"
								name="birthDate"
								type="date"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								value={formData.birthDate}
								onChange={handleChange}
							/>
							{errors.birthDate && (
								<p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label
									htmlFor="gender"
									className="block text-sm font-medium text-neutral-700"
								>
									Sexo
								</label>
								<select
									id="gender"
									name="gender"
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
									value={formData.gender || ""}
									onChange={handleChange}
								>
									<option value="">Selecionar</option>
									<option value="M">Masculino</option>
									<option value="F">Feminino</option>
									<option value="O">Outro</option>
								</select>
								{errors.gender && (
									<p className="mt-1 text-sm text-red-600">{errors.gender}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="school"
									className="block text-sm font-medium text-neutral-700"
								>
									Escola
								</label>
								<input
									id="school"
									name="school"
									type="text"
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
									placeholder="Nome da escola"
									value={formData.school || ""}
									onChange={handleChange}
								/>
								{errors.school && (
									<p className="mt-1 text-sm text-red-600">{errors.school}</p>
								)}
							</div>

							<div>
								<label
									htmlFor="schoolYear"
									className="block text-sm font-medium text-neutral-700"
								>
									Ano de Escolaridade
								</label>
								<select
									id="schoolYear"
									name="schoolYear"
									className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
									value={formData.schoolYear ?? ""}
									onChange={handleChange}
								>
									<option value="">Selecionar</option>
									<option value={10}>10º Ano</option>
									<option value={11}>11º Ano</option>
									<option value={12}>12º Ano</option>
								</select>
								{errors.schoolYear && (
									<p className="mt-1 text-sm text-red-600">
										{errors.schoolYear}
									</p>
								)}
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-neutral-700"
							>
								Palavra-passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								placeholder="Crie uma palavra-passe"
								value={formData.password}
								onChange={handleChange}
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-600">{errors.password}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-neutral-700"
							>
								Confirmar Palavra-passe
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								autoComplete="new-password"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								placeholder="Confirma a tua palavra-passe"
								value={confirmPassword}
								onChange={handleChange}
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-sm text-red-600">
									{errors.confirmPassword}
								</p>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isLoading ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									A criar conta...
								</div>
							) : (
								"Criar conta"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
