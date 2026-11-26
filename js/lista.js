// GET — consulta os lançamentos cadastrados na API da Seed.
// Este arquivo é usado por historico.html e metas.html.

const URL_LANCAMENTOS = 'https://psel-api.vercel.app/api/1/lancamentos';

async function buscarLancamentos() {
	const resposta = await fetch(URL_LANCAMENTOS);

	if (!resposta.ok) {
		throw new Error(`Erro HTTP ${resposta.status} ao buscar lançamentos.`);
	}

	const lancamentos = await resposta.json();

	if (!Array.isArray(lancamentos)) {
		throw new Error('A API não retornou uma lista de lançamentos.');
	}

	return lancamentos;
}

function formatarDataLancamento(data) {
	// A data cadastrada vem no formato AAAA-MM-DD.
	const texto = String(data || '');
	const partes = texto.slice(0, 10).split('-');

	if (partes.length === 3 && partes[0].length === 4) {
		return `${partes[2]}/${partes[1]}/${partes[0]}`;
	}

	return texto || '—';
}

function mostrarMensagemHistorico(mensagem) {
	const tabela = document.getElementById('lista-lancamentos');

	if (!tabela) {
		return;
	}

	const linha = document.createElement('tr');
	const celula = document.createElement('td');

	celula.colSpan = 5;
	celula.textContent = mensagem;
	linha.appendChild(celula);
	tabela.replaceChildren(linha);
}

function mostrarLancamentos(lancamentos) {
	const tabela = document.getElementById('lista-lancamentos');

	if (!tabela) {
		return; // A página Metas não possui tabela.
	}

	if (lancamentos.length === 0) {
		mostrarMensagemHistorico('Nenhum lançamento cadastrado ainda.');
		return;
	}

	tabela.replaceChildren();

	const moeda = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	});

	// Exibe os lançamentos mais recentes primeiro.
	const ordenados = [...lancamentos].sort((a, b) =>
		String(b.data || '').localeCompare(String(a.data || ''))
	);

	ordenados.forEach(lancamento => {
		const linha = document.createElement('tr');
		const tipo = String(lancamento.tipo || '').toLowerCase();
		const valor = Number(lancamento.valor);

		const valores = [
			formatarDataLancamento(lancamento.data),
			lancamento.descricao || 'Sem descrição',
			lancamento.categoria || '—',
			lancamento.tipo || '—',
			Number.isFinite(valor)
				? `${tipo === 'gasto' ? '− ' : ''}${moeda.format(Math.abs(valor))}`
				: '—'
		];

		valores.forEach(conteudo => {
			const celula = document.createElement('td');
			// textContent evita interpretar textos da API como HTML.
			celula.textContent = String(conteudo);
			linha.appendChild(celula);
		});

		tabela.appendChild(linha);
	});
}

async function carregarLancamentos() {
	// Somente estas páginas precisam consultar a API.
	const temHistorico = document.getElementById('lista-lancamentos');
	const temMetas = document.getElementById('resumo-categorias');

	if (!temHistorico && !temMetas) {
		return;
	}

	if (temHistorico) {
		mostrarMensagemHistorico('Carregando lançamentos...');
	}

	try {
		const lancamentos = await buscarLancamentos();

		mostrarLancamentos(lancamentos);

		// app.js receberá esses mesmos dados para calcular totais e metas.
		window.dispatchEvent(new CustomEvent('pagueleve:lancamentos-carregados', {
			detail: lancamentos
		}));
	} catch (erro) {
		console.error('Erro ao consultar a API:', erro);

		if (temHistorico) {
			mostrarMensagemHistorico('Não foi possível carregar os lançamentos. Tente atualizar a página.');
		}

		window.dispatchEvent(new CustomEvent('pagueleve:lancamentos-erro', {
			detail: erro.message
		}));
	}
}

document.addEventListener('DOMContentLoaded', carregarLancamentos);

