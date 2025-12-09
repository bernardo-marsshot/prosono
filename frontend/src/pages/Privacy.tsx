const Privacy = () => {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
					<div className="prose prose-neutral max-w-none">
						<h1 className="text-3xl font-bold text-neutral-900 mb-8">
							Política de Privacidade
						</h1>
						
						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<p className="text-lg">
								No ProSono, levamos a tua privacidade muito a sério. Esta página explica as informações tuas que guardamos, porque o fazemos e como as protegemos, em total conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).
							</p>
							
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									1. Quem é o responsável pelos teus dados?
								</h2>
								<p>
									O responsável pelo tratamento dos teus dados é a Clínica Teresa Rebelo Pinto - Psicologia & Sono, Lda.
								</p>
							</div>
							
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									2. Que informações tuas vamos recolher?
								</h2>
								<p className="mb-4">
									Para usares a plataforma ProSono, vamos pedir-te dois tipos de informação:
								</p>
								<div className="space-y-4">
									<div className="pl-4 border-l-4 border-primary-200 bg-primary-50 p-4 rounded-r-lg">
										<h3 className="font-semibold text-neutral-900 mb-2">Dados de Perfil:</h3>
										<p>
											O teu email, nome, escola e idade. Usamos estes dados apenas para criar e proteger a tua conta na plataforma.
										</p>
									</div>
									<div className="pl-4 border-l-4 border-primary-200 bg-primary-50 p-4 rounded-r-lg">
										<h3 className="font-semibold text-neutral-900 mb-2">Dados sobre o Sono:</h3>
										<p>
											As tuas respostas aos questionários e ao "Diário de Sono" (por exemplo, a que horas te deitas, como sentes que dormiste, etc.). Esta informação é considerada um dado de saúde e, por isso, é tratada com o máximo cuidado e segurança.
										</p>
									</div>
								</div>
							</div>
							
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									3. Para que vamos usar as tuas informações?
								</h2>
								<p className="mb-4">
									As tuas informações têm duas finalidades muito importantes:
								</p>
								<ul className="space-y-3 list-disc list-inside">
									<li>
										<strong>Para o programa funcionar:</strong> Para que possas ver o teu progresso, receber dicas personalizadas e participar em todas as atividades interativas da plataforma.
									</li>
									<li>
										<strong>Para investigação científica:</strong> Para nos ajudar a compreender melhor o sono dos jovens em Portugal e criar melhores ferramentas no futuro. Sempre que possível, o teu nome e email são substituídos por um código secreto para proteger a tua identidade.
									</li>
								</ul>
							</div>
							
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									4. Quem terá acesso aos teus dados?
								</h2>
								<p>
									Apenas o teu psicólogo escolar (se o programa for implementado na tua escola) e a equipa de investigação da Clínica Teresa Rebelo Pinto.
								</p>
							</div>
							
							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									5. Tu estás no controlo! Quais são os teus direitos?
								</h2>
								<p className="mb-4">
									A tua participação é 100% voluntária. A qualquer momento, tu podes:
								</p>
								<ul className="space-y-2 list-disc list-inside mb-4">
									<li>Aceder aos teus dados.</li>
									<li>Corrigir qualquer informação que esteja incorreta.</li>
									<li>Pedir para apagar todos os teus dados.</li>
									<li>Retirar o teu consentimento e sair do programa, sem qualquer problema ou consequência.</li>
								</ul>
								<p>
									Para exerceres qualquer um destes direitos, basta falares com o psicólogo da tua escola ou contactares-nos diretamente através do email{" "}
									<a 
										href="mailto:info@psicologiadosono.com" 
										className="text-primary-600 hover:text-primary-700 underline"
									>
										info@psicologiadosono.com
									</a>.
								</p>
							</div>
							
							<div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-start space-x-3">
									<div className="flex-shrink-0">
										<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<title>Shield icon</title>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
										</svg>
									</div>
									<div>
										<h3 className="font-semibold text-green-900 mb-2">A tua privacidade é a nossa prioridade</h3>
										<p className="text-green-800">
											Todos os dados são armazenados de forma segura e tratados com o máximo cuidado, seguindo as melhores práticas de segurança e privacidade.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Privacy;