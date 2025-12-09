const About = () => {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
					<div className="prose prose-neutral max-w-none">
						<h1 className="text-3xl font-bold text-neutral-900 mb-8">
							Sobre Nós
						</h1>

						<div className="space-y-6 text-neutral-700 leading-relaxed">
							<p className="text-lg">Olá! Bem-vindo(a) ao ProSono.</p>

							<p>
								Sabias que quase 80% dos adolescentes em Portugal não dormem o
								suficiente? Este é um problema sério que afeta a saúde mental, o
								sucesso escolar e até as tuas relações com os outros. Foi a
								pensar em ti que criámos o ProSono.
							</p>

							<div className="mt-8">
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									A Nossa Missão
								</h2>
								<p>
									Queremos investir no futuro da literacia do sono para
									transformar a vida dos jovens portugueses. O nosso objetivo é
									simples: ajudar-te a compreender o poder do sono e a criar
									hábitos saudáveis para que tenhas mais energia, concentração e
									bem-estar.
								</p>
							</div>

							<div className="mt-8">
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									O Que é o ProSono?
								</h2>
								<p>
									Não somos apenas mais uma app. O ProSono é um programa
									educativo digital, criado por psicólogos especialistas em sono
									e baseado em ferramentas cientificamente testadas.
								</p>
								<p>
									A versão que tens à tua frente é um protótipo funcional – uma
									primeira amostra para testarmos e melhorarmos com a tua ajuda.
									Neste momento, focámo-nos na faixa etária dos 15 aos 18 anos.
									Vais poder usar algumas das nossas ferramentas principais,
									como o Diário de Sono e os questionários de conhecimento.
								</p>
								<p>
									No futuro, a plataforma completa terá muito mais. Por agora, a
									tua participação é o passo mais importante para construirmos a
									melhor ferramenta possível!
								</p>
							</div>

							<div className="mt-8">
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									Quem Somos Nós?
								</h2>
								<p>
									O ProSono é uma iniciativa da{" "}
									<a
										href="https://www.psicologiadosono.com/"
										className="text-primary-600 hover:text-primary-700 underline"
									>
										Clínica Teresa Rebelo Pinto
									</a>
									, uma referência nacional em Psicologia do Sono. Não somos uma
									startup de tecnologia; somos uma equipa de profissionais de
									saúde, acadêmicos e gestores que usa a tecnologia para levar o
									conhecimento sobre o sono mais longe.
								</p>
								<p>
									Para o desenvolvimento tecnológico deste protótipo, contamos
									com a parceria da{" "}
									<a
										href="https://www.marsshot.eu/"
										className="text-primary-600 hover:text-primary-700 underline"
									>
										Mars Shot
									</a>
									, uma equipa de engenharia de elite que transforma a nossa
									ciência numa plataforma digital intuitiva e segura para ti.
								</p>
							</div>

							<div className="mt-10 p-6 bg-primary-50 border border-primary-200 rounded-lg text-center">
								<p className="text-lg font-semibold text-primary-800">
									Junta-te a nós e descobre como dormir bem pode mudar tudo!
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
