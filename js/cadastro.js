/*
 * cadastro.js — cadastro de lançamentos (POST)
 * Usado em: registrar.html
 *
 * TODO (integrante responsável pelo POST):
 * - Tratar o envio do <form id="form-lancamento"> de registrar.html.
 * - Ler os campos:
 *   - valor, data e descricao: pelos ids
 *     (ex.: document.getElementById('valor').value)
 *   - tipo e categoria: são botões de opção (radio). Ler o botão marcado
 *     (ex.: document.querySelector('input[name="tipo"]:checked').value)
 * - Validar os dados antes de enviar (ex.: valor maior que zero, data preenchida).
 * - Enviar com POST em:
 *   https://psel-api.vercel.app/api/1/lancamentos
 *   (o servidor gera "id" e "createdAt" automaticamente)
 * - Depois de salvar, limpar o formulário e avisar o usuário
 *   (o Figma tem avisos de sucesso e de erro).
 * - Atenção: o desafio pede que "a tela atualize automaticamente após a criação".
 *   Como a lista agora fica em historico.html, a equipe deve decidir como mostrar
 *   o novo lançamento (ex.: abrir historico.html depois de salvar).
 *
 * Nenhuma lógica foi implementada nesta etapa.
 */
