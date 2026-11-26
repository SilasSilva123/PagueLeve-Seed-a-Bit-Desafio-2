 /*
 * PagueLeve — integração das páginas Histórico, Metas e Dívidas.
 * GET e POST permanecem nos arquivos lista.js e cadastro.js.
 * O simulador calcula tudo no navegador: não envia dados financeiros à API.
 */

// Utilitários compartilhados.
function moedaPagueLeve(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
    }).format(valor);
}

function normalizarTexto(texto) {
    return String(texto || '').trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function valorLancamento(lancamento) {
    const numero = Number(lancamento.valor);
    return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

// 1. HISTÓRICO — soma todos os registros recuperados pelo GET.
function atualizarTotaisHistorico(lancamentos) {
    const elemento = document.getElementById('totais-historico');
    if (!elemento) return;

    let gastos = 0;
    let dividas = 0;

    lancamentos.forEach(item => {
        const tipo = normalizarTexto(item.tipo);
        if (tipo === 'gasto') gastos += valorLancamento(item);
        if (tipo === 'divida') dividas += valorLancamento(item);
    });

    elemento.textContent = `${lancamentos.length} lançamento(s) • ` +
        `Gastos: ${moedaPagueLeve(gastos)} • Dívidas: ${moedaPagueLeve(dividas)}`;
}

// 2. METAS — gastos do mês atual, separados pelas categorias do formulário.
const CATEGORIAS_PAGUELEVE = [
    { chave: 'moradia', nome: 'Moradia', cor: '#0E7A54' },
    { chave: 'alimentacao', nome: 'Alimentação', cor: '#2FA875' },
    { chave: 'transporte', nome: 'Transporte', cor: '#FFC94A' },
    { chave: 'saude', nome: 'Saúde', cor: '#063472' },
    { chave: 'lazer', nome: 'Lazer', cor: '#8FDCB4' }
];

function atualizarMetas(lancamentos) {
    const painel = document.getElementById('resumo-categorias');
    if (!painel) return;

    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    const totais = Object.fromEntries(CATEGORIAS_PAGUELEVE.map(c => [c.chave, 0]));

    lancamentos.forEach(item => {
        if (normalizarTexto(item.tipo) !== 'gasto') return;
        if (String(item.data || '').slice(0, 7) !== mesAtual) return;

        const categoria = normalizarTexto(item.categoria);
        if (Object.hasOwn(totais, categoria)) {
            totais[categoria] += valorLancamento(item);
        }
    });

    const total = Object.values(totais).reduce((soma, valor) => soma + valor, 0);
    const valorTotal = document.getElementById('total-mes');
    const dica = document.getElementById('dica-planejamento');
    const grafico = document.getElementById('grafico-distribuicao');

    const nomeMes = new Intl.DateTimeFormat('pt-BR', {
        month: 'long', year: 'numeric'
    }).format(agora);
    valorTotal.textContent = `Total (${nomeMes}): ${moedaPagueLeve(total)}`;
    painel.replaceChildren();

    CATEGORIAS_PAGUELEVE.forEach(categoria => {
        const valor = totais[categoria.chave];
        const percentual = total > 0 ? (valor / total) * 100 : 0;

        const linha = document.createElement('div');
        linha.className = 'linha-categoria';
        const cabecalho = document.createElement('div');
        cabecalho.className = 'linha-categoria__cabecalho';

        const nome = document.createElement('span');
        nome.textContent = categoria.nome;
        const quantia = document.createElement('strong');
        quantia.textContent = `${moedaPagueLeve(valor)} (${percentual.toFixed(0)}%)`;
        cabecalho.append(nome, quantia);

        const barra = document.createElement('div');
        barra.className = 'barra-categoria';
        const preenchimento = document.createElement('div');
        preenchimento.className = 'barra-categoria__preenchimento';
        preenchimento.style.width = `${percentual}%`;
        preenchimento.style.backgroundColor = categoria.cor;
        barra.appendChild(preenchimento);
        linha.append(cabecalho, barra);
        painel.appendChild(linha);
    });

    if (total === 0) {
        dica.textContent = 'Ainda não há gastos registrados neste mês. Registre um gasto para começar seu planejamento.';
    } else {
        const maior = CATEGORIAS_PAGUELEVE.reduce((anterior, atual) =>
            totais[atual.chave] > totais[anterior.chave] ? atual : anterior
        );
        dica.textContent = `Seu maior gasto do mês foi com ${maior.nome.toLowerCase()} ` +
            `(${moedaPagueLeve(totais[maior.chave])}). Que tal revisar essa categoria?`;
    }

    // Gráfico de rosca desenhado apenas com CSS, sem bibliotecas externas.
    if (!grafico) return;
    grafico.replaceChildren();

    const rosca = document.createElement('div');
    rosca.className = 'grafico-rosca';
    rosca.setAttribute('role', 'img');
    rosca.setAttribute('aria-label', `Distribuição dos gastos do mês: ${moedaPagueLeve(total)}`);

    let inicio = 0;
    const partes = [];
    CATEGORIAS_PAGUELEVE.forEach(categoria => {
        const fatia = total > 0 ? (totais[categoria.chave] / total) * 100 : 0;
        if (fatia > 0) {
            partes.push(`${categoria.cor} ${inicio}% ${inicio + fatia}%`);
            inicio += fatia;
        }
    });
    rosca.style.background = partes.length > 0
        ? `conic-gradient(${partes.join(', ')})`
        : 'conic-gradient(#e0ede6 0 100%)';

    const legenda = document.createElement('div');
    legenda.className = 'legenda-grafico';
    CATEGORIAS_PAGUELEVE.forEach(categoria => {
        const item = document.createElement('p');
        const marca = document.createElement('span');
        marca.style.display = 'inline-block';
        marca.style.width = '10px';
        marca.style.height = '10px';
        marca.style.borderRadius = '50%';
        marca.style.marginRight = '8px';
        marca.style.backgroundColor = categoria.cor;
        item.append(marca, document.createTextNode(
            `${categoria.nome}: ${moedaPagueLeve(totais[categoria.chave])}`
        ));
        legenda.appendChild(item);
    });

    grafico.append(rosca, legenda);
}

// lista.js anuncia os registros após cada GET. Os dados são reutilizados sem outra chamada à API.
window.addEventListener('pagueleve:lancamentos-carregados', evento => {
    const lancamentos = evento.detail;
    if (!Array.isArray(lancamentos)) return;
    atualizarTotaisHistorico(lancamentos);
    atualizarMetas(lancamentos);
});

window.addEventListener('pagueleve:lancamentos-erro', () => {
    const totais = document.getElementById('totais-historico');
    const resumo = document.getElementById('resumo-categorias');
    if (totais) totais.textContent = 'Não foi possível calcular os totais.';
    if (resumo) resumo.textContent = 'Não foi possível carregar os gastos. Atualize a página.';
});

// 3. DÍVIDAS — simulação ilustrativa sem juros adicionais e sem chamadas de API.
function iniciarSimuladorPagueLeve() {
    const form = document.getElementById('form-simulador');
    if (!form) return;

    const valor = document.getElementById('sim-valor');
    const modalidade = document.getElementById('sim-modalidade');
    const atraso = document.getElementById('sim-atraso');
    const fgts = document.getElementById('sim-fgts');
    const desconto = document.getElementById('sim-desconto');
    const parcelas = document.getElementById('sim-parcelas');
    const saidaDesconto = document.getElementById('sim-desconto-valor');
    const saidaParcelas = document.getElementById('sim-parcelas-valor');
    const resultado = document.getElementById('resultado-simulador');
    const resumo = document.getElementById('resumo-dados-simulador');
    const continuar = document.getElementById('botao-continuar');
    const recomecar = document.getElementById('botao-simular-de-novo');
    let jaSimulou = false;

    const centavos = numero => Math.round((numero + Number.EPSILON) * 100) / 100;

    function atualizarControles() {
        saidaDesconto.textContent = `${desconto.value}%`;
        saidaParcelas.textContent = `${parcelas.value}x`;
        if (jaSimulou) calcular(false);
    }

    function validar(silencioso = false) {
        const valorDivida = Number(valor.value);
        const fgtsSolicitado = fgts.value === '' ? 0 : Number(fgts.value);

        if (!Number.isFinite(valorDivida) || valorDivida <= 0) {
            if (!silencioso) {
                alert('Informe um valor de dívida maior que zero.');
                valor.focus();
            }
            return null;
        }
        if (!Number.isFinite(fgtsSolicitado) || fgtsSolicitado < 0 || fgtsSolicitado > 1000) {
            if (!silencioso) {
                alert('Informe um valor de FGTS entre R$ 0,00 e R$ 1.000,00.');
                fgts.focus();
            }
            return null;
        }
        return { valorDivida, fgtsSolicitado };
    }

    function adicionarLinha(titulo, quantia, destaque = false) {
        const linha = document.createElement('p');
        linha.style.display = 'flex';
        linha.style.justifyContent = 'space-between';
        linha.style.gap = '12px';
        linha.style.margin = '0 0 8px';
        if (destaque) linha.style.fontWeight = '800';
        const texto = document.createElement('span');
        texto.textContent = titulo;
        const numero = document.createElement('strong');
        numero.textContent = quantia;
        linha.append(texto, numero);
        resultado.appendChild(linha);
    }

    function calcular(mostrarAlerta = true) {
        // Na digitação dos sliders, não repetimos alertas de validação.
        if (!mostrarAlerta && !jaSimulou) return false;
        const dados = validar(!mostrarAlerta);
        if (!dados) {
            if (!mostrarAlerta) resultado.textContent = 'Revise o valor da dívida ou do FGTS.';
            return false;
        }

        const percentual = Number(desconto.value);
        const quantidade = Number(parcelas.value);
        const economiaDesconto = centavos(dados.valorDivida * percentual / 100);
        const saldoDescontado = centavos(dados.valorDivida - economiaDesconto);
        const fgtsUsado = centavos(Math.min(dados.fgtsSolicitado, saldoDescontado, 1000));
        const totalRestante = centavos(Math.max(0, saldoDescontado - fgtsUsado));
        const parcela = centavos(totalRestante / quantidade);

        resultado.replaceChildren();
        adicionarLinha('Valor original', moedaPagueLeve(dados.valorDivida));
        adicionarLinha(`Desconto (${percentual}%)`, `− ${moedaPagueLeve(economiaDesconto)}`);
        adicionarLinha('Saldo com desconto', moedaPagueLeve(saldoDescontado));
        adicionarLinha('FGTS utilizado', `− ${moedaPagueLeve(fgtsUsado)}`);
        adicionarLinha('Total restante', moedaPagueLeve(totalRestante), true);
        adicionarLinha(`Parcela estimada (${quantidade}x)`, moedaPagueLeve(parcela), true);
        adicionarLinha('Economia pelo desconto', moedaPagueLeve(economiaDesconto));
        jaSimulou = true;
        return true;
    }

    desconto.addEventListener('input', atualizarControles);
    parcelas.addEventListener('input', atualizarControles);
    [valor, fgts].forEach(campo => campo.addEventListener('input', () => {
        if (jaSimulou) calcular(false);
    }));

    form.addEventListener('submit', evento => {
        evento.preventDefault();
        calcular();
    });

    continuar.addEventListener('click', () => {
        if (!calcular()) return;
        resumo.textContent = `${moedaPagueLeve(Number(valor.value))} • ` +
            `${modalidade.selectedOptions[0].textContent} • ${atraso.selectedOptions[0].textContent}`;
        form.classList.add('mostrando-resultado');
    });

    recomecar.addEventListener('click', () => {
        form.classList.remove('mostrando-resultado');
        valor.focus();
    });

    atualizarControles();
}

document.addEventListener('DOMContentLoaded', iniciarSimuladorPagueLeve);
