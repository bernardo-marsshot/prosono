import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../static/prosono-logo-header.svg";

const Header = () => {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<header className="bg-white shadow-sm border-b border-neutral-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<img
								src={logo}
								alt="ProSono Logo"
								className="h-8 object-contain"
							/>
						</Link>
					</div>

					<nav className="hidden md:flex items-center space-x-8">
						{isAuthenticated ? (
							<>
								<Link
									to="/dashboard"
									className="text-neutral-600 hover:text-primary-600 transition-colors"
								>
									Programa
								</Link>
								<div className="flex items-center space-x-4">
									<Link
										to="/profile"
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Perfil de Utilizador
									</Link>
									<button
										onClick={handleLogout}
										className="text-neutral-600 hover:text-primary-600 transition-colors"
									>
										Sair
									</button>
								</div>
							</>
						) : (
							<div className="flex items-center space-x-4">
								<Link
									to="/login"
									className="text-neutral-600 hover:text-primary-600 transition-colors"
								>
									Entrar
								</Link>
								<Link
									to="/register"
									className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
								>
									Registar
								</Link>
							</div>
						)}
					</nav>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							type="button"
							className="text-neutral-600 hover:text-primary-600 transition-colors p-2"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
