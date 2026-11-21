/*
 * app.js — integração geral da aplicação
 * Usado em: registrar.html, historico.html, dividas.html e metas.html
 * (é sempre o último script carregado em cada página)
 *
 * TODO (integrante responsável pela integração):
 * - Definir em um só lugar o endereço da API usado pelos outros arquivos:
 *   https://psel-api.vercel.app/api/1/lancamentos
 *   Atenção: como app.js é carregado por último, os outros arquivos só podem
 *   usar esse endereço dentro de funções chamadas depois que a página carregar.
 * - Iniciar o que cada página precisa quando ela carregar
 *   (ex.: em historico.html e metas.html, buscar os lançamentos com lista.js).
 * - historico.html: calcular a quantidade de lançamentos e os totais de gastos e
 *   dívidas e mostrar em <p id="totais-historico">.
 * - metas.html ("Planejamento do mês"): somar os gastos por categoria, calcular as
 *   porcentagens e mostrar em <p id="total-mes">, <div id="resumo-categorias">,
 *   <p id="dica-planejamento"> e <div id="grafico-distribuicao">.
 *   Tudo calculado na tela, em JavaScript.
 * - dividas.html (simulador): usar os campos do <form id="form-simulador">
 *   (sim-valor, sim-modalidade, sim-atraso, sim-fgts, sim-desconto, sim-parcelas),
 *   mostrar o valor atual dos controles em sim-desconto-valor e sim-parcelas-valor
 *   e o resultado em <div id="resultado-simulador">.
 *   A simulação é feita só na tela, sem enviar nada à API.
 * - dividas.html no mobile: trocar entre as etapas <fieldset id="etapa-dados"> e
 *   <fieldset id="etapa-negociacao"> com os botões "botao-continuar" e
 *   "botao-simular-de-novo", e preencher <p id="resumo-dados-simulador">.
 *
 * Nenhuma lógica foi implementada nesta etapa.
 */
