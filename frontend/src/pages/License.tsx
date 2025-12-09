const License = () => {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
					<h1 className="text-3xl font-bold text-neutral-900 mb-8">
						Licenças
					</h1>
					
					<div className="space-y-6">
						<div>
							<h2 className="text-xl font-semibold text-neutral-800 mb-4">
								Atribuições de Ícones
							</h2>
							<div className="space-y-3 text-neutral-700">
								<p>
									group by Thays Malcher from{" "}
									<a 
										href="https://thenounproject.com/browse/icons/term/group/" 
										target="_blank" 
										rel="noopener noreferrer"
										title="group Icons"
										className="text-primary-600 hover:text-primary-700 underline"
									>
										Noun Project
									</a>{" "}
									(CC BY 3.0)
								</p>
								<p>
									Brain by Cédric Villain from{" "}
									<a 
										href="https://thenounproject.com/browse/icons/term/brain/" 
										target="_blank" 
										rel="noopener noreferrer"
										title="Brain Icons"
										className="text-primary-600 hover:text-primary-700 underline"
									>
										Noun Project
									</a>{" "}
									(CC BY 3.0)
								</p>
								<p>
									books by Adrien Coquet from{" "}
									<a 
										href="https://thenounproject.com/browse/icons/term/books/" 
										target="_blank" 
										rel="noopener noreferrer"
										title="books Icons"
										className="text-primary-600 hover:text-primary-700 underline"
									>
										Noun Project
									</a>{" "}
									(CC BY 3.0)
								</p>
							</div>
						</div>
						
						<div className="border-t border-neutral-200 pt-6">
							<h2 className="text-xl font-semibold text-neutral-800 mb-4">
								Sobre as Licenças CC BY 3.0
							</h2>
							<p className="text-neutral-700">
								Os ícones utilizados nesta aplicação estão licenciados sob{" "}
								<a 
									href="https://creativecommons.org/licenses/by/3.0/" 
									target="_blank" 
									rel="noopener noreferrer"
									className="text-primary-600 hover:text-primary-700 underline"
								>
									Creative Commons Attribution 3.0 Unported (CC BY 3.0)
								</a>
								. Esta licença permite o uso, distribuição e modificação dos trabalhos, 
								desde que seja dada a devida atribuição aos autores originais.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default License;