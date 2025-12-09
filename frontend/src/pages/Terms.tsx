const Terms = () => {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
					<div className="prose prose-neutral max-w-none">
						<h1 className="text-3xl font-bold text-neutral-900 mb-8">
							Termos de Serviço
						</h1>

						<div className="space-y-8 text-neutral-700 leading-relaxed">
							<p className="text-lg">
								Olá! Antes de começares a explorar o nosso protótipo, é
								importante que leias e compreendas os nossos Termos de Serviço.
								Pensa nisto como as "regras do jogo" para usares a nossa
								plataforma.
							</p>

							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									A TUA PRIVACIDADE É IMPORTANTE
								</h2>
								<p>
									A nossa principal prioridade é garantir um ambiente seguro e
									proteger a tua privacidade. Ao utilizares este protótipo,
									partimos do princípio que os teus pais ou encarregados de
									educação leram e aceitaram a declaração de consentimento
									(RGPD) que lhes foi disponibilizada. Se este passo não foi
									dado, infelizmente não conseguimos garantir a proteção dos
									teus dados pessoais nem o cumprimento dos termos legais. A
									utilização do protótipo sem esta autorização é da tua inteira
									responsabilidade.
								</p>
							</div>

							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									O QUE É ESTE PROTÓTIPO?
								</h2>
								<p className="mb-4">
									É fundamental que saibas que a aplicação que estás a usar é um
									protótipo. Isto significa que:
								</p>
								<div className="space-y-4">
									<div className="pl-4 border-l-4 border-orange-200 bg-orange-50 p-4 rounded-r-lg">
										<h3 className="font-semibold text-neutral-900 mb-2">
											Funcionalidades em Teste:
										</h3>
										<p>
											As funcionalidades que vais encontrar estão em fase de
											teste. O nosso objetivo é perceber o que funciona bem e o
											que podemos melhorar. Por isso, as funcionalidades podem
											não estar completas, podem conter erros ou ser alteradas a
											qualquer momento.
										</p>
									</div>
									<div className="pl-4 border-l-4 border-orange-200 bg-orange-50 p-4 rounded-r-lg">
										<h3 className="font-semibold text-neutral-900 mb-2">
											Não é a Versão Final:
										</h3>
										<p>
											A experiência que terás neste protótipo não representa a
											versão final e definitiva do programa. O teu feedback é
											essencial para construirmos a melhor plataforma possível,
											mas as funcionalidades e o design poderão ser muito
											diferentes no futuro.
										</p>
									</div>
									<div className="pl-4 border-l-4 border-orange-200 bg-orange-50 p-4 rounded-r-lg">
										<h3 className="font-semibold text-neutral-900 mb-2">
											Dados de Teste:
										</h3>
										<p>
											Recomendamos que não utilizes dados pessoais ou
											informações sensíveis e importantes nesta fase de
											protótipo.
										</p>
									</div>
								</div>
							</div>

							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									UTILIZAÇÃO RESPONSÁVEL
								</h2>
								<p className="mb-4">
									Ao utilizares o nosso protótipo, concordas em:
								</p>
								<ul className="space-y-2 list-disc list-inside">
									<li>Usar a plataforma de forma responsável e respeitosa.</li>
									<li>
										Não partilhar informações falsas ou que possam prejudicar
										outras pessoas.
									</li>
									<li>
										Manter a confidencialidade de qualquer informação de acesso
										que te seja fornecida.
									</li>
								</ul>
							</div>

							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									PROPRIEDADE INTELECTUAL
								</h2>
								<p>
									Todo o conteúdo e design presentes neste protótipo são
									propriedade dos seus criadores. A sua utilização destina-se
									exclusivamente ao âmbito deste teste, não sendo permitida a
									cópia, distribuição ou qualquer outra forma de reprodução sem
									autorização prévia.
								</p>
							</div>

							<div>
								<h2 className="text-2xl font-bold text-neutral-900 mb-4">
									LIMITAÇÃO DE RESPONSABILIDADE
								</h2>
								<p>
									Uma vez que se trata de um protótipo em fase de testes, não
									nos podemos responsabilizar por eventuais perdas de
									informação, falhas no sistema ou quaisquer outros problemas
									decorrentes da sua utilização. A utilização é feita por tua
									conta e risco.
								</p>
							</div>

							{/* <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-blue-800 font-medium">
									Ao clicares em "Aceito" ou ao continuares a utilizar o protótipo, estás a confirmar que leste, compreendeste e concordaste com estes Termos de Serviço.
								</p>
								<p className="text-blue-800 mt-4">
									Obrigado pela tua colaboração e esperamos que gostes da experiência!
								</p>
							</div> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Terms;
