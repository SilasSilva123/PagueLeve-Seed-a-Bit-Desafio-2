// POST — envia os dados do formulário para a API da Seed.
// Este arquivo é usado apenas por registrar.html.

const URL_CADASTRO = 'https://psel-api.vercel.app/api/1/lancamentos';
const formulario = document.getElementById('form-lancamento');

if (formulario) {
	formulario.addEventListener('submit', async function (evento) {
		evento.preventDefault(); // Evita recarregar a página ao enviar.

		const campoValor = document.getElementById('valor');
		const campoData = document.getElementById('data');
		const campoDescricao = document.getElementById('descricao');
		const tipoSelecionado = formulario.querySelector('input[name="tipo"]:checked');
		const categoriaSelecionada = formulario.querySelector('input[name="categoria"]:checked');
		const botaoSalvar = formulario.querySelector('button[type="submit"]');

		const valor = Number(campoValor.value);
		const data = campoData.value;
		const descricao = campoDescricao.value.trim();

		if (!formulario.checkValidity()) {
			formulario.reportValidity();
			return;
		}

		if (!Number.isFinite(valor) || valor <= 0) {
			alert('Informe um valor maior que zero.');
			campoValor.focus();
			return;
		}

		if (!data || !tipoSelecionado || !categoriaSelecionada) {
			alert('Preencha a data, o tipo e a categoria.');
			return;
		}

		// Os nomes dos campos seguem o formulário e o modelo do PagueLeve.
		// id e createdAt NÃO são enviados: o servidor os gera.
		const lancamento = {
			valor: valor,
			categoria: categoriaSelecionada.value,
			data: data,
			tipo: tipoSelecionado.value,
			descricao: descricao
		};

		botaoSalvar.disabled = true;
		botaoSalvar.textContent = 'Salvando...';

		try {
			const resposta = await fetch(URL_CADASTRO, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(lancamento)
			});

			if (!resposta.ok) {
				throw new Error(`Erro HTTP ${resposta.status} ao salvar lançamento.`);
			}

			formulario.reset();
			alert('Lançamento salvo com sucesso!');

			// O Histórico executará GET ao abrir e mostrará o novo registro.
			window.location.href = 'historico.html';
		} catch (erro) {
			console.error('Erro ao cadastrar lançamento:', erro);
			alert('Não foi possível salvar o lançamento. Tente novamente.');
		} finally {
			botaoSalvar.disabled = false;
			botaoSalvar.textContent = 'Salvar lançamento';
		}
	});
}
