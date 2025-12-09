import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ApiError, LoginCredentials } from "../../types";

const LoginForm = () => {
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/dashboard";

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await login(credentials);
			navigate(from, { replace: true });
		} catch (error) {
			const apiError = error as ApiError;
			setError(apiError.message || "Ocorreu um erro durante o login");
		} finally {
			setIsLoading(false);
		}
	};

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
						Entra na tua conta
					</h2>
					<p className="mt-2 text-center text-sm text-neutral-600">
						Ou{" "}
						<Link
							to="/register"
							className="font-medium text-primary-600 hover:text-primary-500"
						>
							cria uma nova conta
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
							{error}
						</div>
					)}

					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-neutral-700"
							>
								Endereço de email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Insere o teu email"
								value={credentials.email}
								onChange={handleChange}
							/>
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
								autoComplete="current-password"
								required
								className="mt-1 appearance-none relative block w-full px-3 py-2 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
								placeholder="Insere a tua palavra-passe"
								value={credentials.password}
								onChange={handleChange}
							/>
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
									A entrar...
								</div>
							) : (
								"Entrar"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
