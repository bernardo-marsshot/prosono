import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="bg-neutral-900 text-neutral-300">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-2 mb-4">
							<div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">P</span>
							</div>
							<span className="text-xl font-semibold text-white">ProSono</span>
						</div>
						<p className="text-neutral-400 max-w-md">
							Programa de Educação sobre o sono baseado em evidências
							científicas para melhorar o desempenho académico, a saúde e o
							bem-estar geral.
						</p>
					</div>

					<div>
						<h3 className="text-white font-semibold mb-4">Recursos</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/about"
									className="text-neutral-400 hover:text-primary-400 transition-colors"
								>
									Sobre Nós
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="text-neutral-400 hover:text-primary-400 transition-colors"
								>
									Contacto
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-white font-semibold mb-4">Legal</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/privacy"
									className="text-neutral-400 hover:text-primary-400 transition-colors"
								>
									Política de Privacidade
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="text-neutral-400 hover:text-primary-400 transition-colors"
								>
									Termos de Serviço
								</Link>
							</li>
							<li>
								<Link
									to="/licences"
									className="text-neutral-400 hover:text-primary-400 transition-colors"
								>
									Licenças
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-neutral-800 mt-8 pt-8 text-center">
					<p className="text-neutral-400">
						© {new Date().getFullYear()} ProSono. Todos os direitos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
