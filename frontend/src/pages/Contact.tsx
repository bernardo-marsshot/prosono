const Contact = () => {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
					<div className="prose prose-neutral max-w-none">
						<h1 className="text-3xl font-bold text-neutral-900 mb-8">
							Contacto
						</h1>
						
						<div className="space-y-6 text-neutral-700 leading-relaxed">
							<p className="text-lg">
								Tens alguma dúvida, sugestão ou queres saber mais sobre o ProSono? Estamos aqui para te ajudar.
							</p>
							
							<p>
								Podes contactar-nos diretamente ou através da Clínica Teresa Rebelo Pinto.
							</p>
							
							<div className="mt-8">
								<h2 className="text-2xl font-bold text-neutral-900 mb-6">
									Os nossos contactos:
								</h2>
								
								<div className="space-y-4">
									<div className="flex items-start space-x-3">
										<div className="flex-shrink-0 w-6 h-6 mt-0.5">
											<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
										</div>
										<div>
											<span className="font-semibold text-neutral-900">Morada:</span>
											<p className="mt-1">Campo Grande 28, 2.ºG, 1700-093 Lisboa</p>
										</div>
									</div>
									
									<div className="flex items-start space-x-3">
										<div className="flex-shrink-0 w-6 h-6 mt-0.5">
											<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
											</svg>
										</div>
										<div>
											<span className="font-semibold text-neutral-900">Telefone:</span>
											<p className="mt-1">
												<a href="tel:217970369" className="text-primary-600 hover:text-primary-700">217 970 369</a>
												{" / "}
												<a href="tel:911155125" className="text-primary-600 hover:text-primary-700">911 155 125</a>
											</p>
										</div>
									</div>
									
									<div className="flex items-start space-x-3">
										<div className="flex-shrink-0 w-6 h-6 mt-0.5">
											<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<div>
											<span className="font-semibold text-neutral-900">Email para projetos:</span>
											<p className="mt-1">
												<a 
													href="mailto:projetos@psicologiadosono.com" 
													className="text-primary-600 hover:text-primary-700"
												>
													projetos@psicologiadosono.com
												</a>
											</p>
										</div>
									</div>
									
									<div className="flex items-start space-x-3">
										<div className="flex-shrink-0 w-6 h-6 mt-0.5">
											<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<div>
											<span className="font-semibold text-neutral-900">Email geral:</span>
											<p className="mt-1">
												<a 
													href="mailto:info@psicologiadosono.com" 
													className="text-primary-600 hover:text-primary-700"
												>
													info@psicologiadosono.com
												</a>
											</p>
										</div>
									</div>
								</div>
							</div>
							
							<div className="mt-10 p-6 bg-primary-50 border border-primary-200 rounded-lg">
								<h2 className="text-xl font-bold text-primary-900 mb-4">
									Queres agendar uma demonstração?
								</h2>
								<p className="text-primary-800 mb-4">
									Se és uma escola, um psicólogo ou um investidor, agenda uma conversa connosco para uma demonstração exclusiva da nossa plataforma. Envia-nos um email e entraremos em contacto.
								</p>
								<div className="text-center">
									<a 
										href="mailto:projetos@psicologiadosono.com?subject=Pedido de Demonstração ProSono"
										className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
									>
										<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										Solicitar Demonstração
									</a>
								</div>
							</div>
							
							<div className="mt-8 text-center">
								<p className="text-lg font-medium text-neutral-800 italic">
									Dorme sobre o assunto (basta uma noite!) e depois fala connosco. Estamos à tua espera!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;