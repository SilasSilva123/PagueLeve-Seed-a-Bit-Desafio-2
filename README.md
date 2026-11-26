# PagueLeve - Seed a Bit, Desafio 2

**MVP desenvolvido pelo Grupo 1 para o Desafio 2 do processo seletivo da Seed a Bit (PSEL 27.1).**

O **PagueLeve** é uma aplicação web que ajuda pessoas a organizar seus lançamentos financeiros, visualizar gastos por categoria e simular cenários de negociação de dívidas de forma simples.

## Acesse o projeto

- **Aplicação publicada (GitHub Pages):** [Github Pages](https://silassilva123.github.io/PagueLeve-Seed-a-Bit-Desafio-2/)
- **Código-fonte:** [Repositório no GitHub](https://github.com/SilasSilva123/Seed-a-Bit---Desafio-2-PagueLeve-).
- **Protótipo:** [PagueLeve no Figma](https://www.figma.com/design/GpYvaAhcKPEa2miWlQFVbg/Prototipa%C3%A7%C3%A3o?node-id=0-1).

## Problema e público-alvo

Muitas pessoas têm dificuldade para acompanhar seus gastos e organizar dívidas, especialmente quando as ferramentas financeiras exigem planilhas ou conhecimento técnico.

O PagueLeve propõe uma experiência acessível para pessoas endividadas e com pouca familiaridade com finanças, incluindo trabalhadores informais, microempreendedores, jovens no primeiro emprego e aposentados.

### ODS impactada

O projeto está relacionado principalmente à **ODS 8 — Trabalho Decente e Crescimento Econômico**, por incentivar organização e educação financeira.

Como impactos secundários propostos, relaciona-se à **ODS 3 — Saúde e Bem-Estar** e à **ODS 4 — Educação de Qualidade**.

## Funcionalidades do MVP

- **Registrar:** cadastro de lançamentos com tipo, valor, data, categoria e descrição, por meio de requisição `POST`.
- **Histórico:** consulta dos lançamentos cadastrados com requisição `GET`, além de totais de gastos e dívidas calculados no navegador.
- **Metas / Planejamento do mês:** soma dos gastos do mês por categoria, porcentagens, barras e gráfico de distribuição calculados em JavaScript.
- **Dívidas:** simulador ilustrativo de desconto, uso opcional de FGTS e parcelamento. Os cálculos são feitos localmente, sem enviar os dados da simulação para a API.
- **Interface responsiva:** páginas adaptadas a desktop e dispositivos móveis.

O simulador **não realiza negociação real com credores**. Seus resultados são estimativas demonstrativas, sem compromisso de oferta ou condições bancárias. Os relatos da página inicial também são ilustrativos.

## Tecnologias

- HTML5
- CSS3
- JavaScript (sem frameworks)
- API HTTP da Seed, consumida com `fetch`
- GitHub Pages para hospedagem estática

## Integração com a API da Seed

**URL base:** `https://psel-api.vercel.app`

**Squad:** `1`

**Coleção:** `lancamentos`

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| GET | `/api/1/lancamentos` | Buscar e listar lançamentos |
| POST | `/api/1/lancamentos` | Cadastrar um lançamento |

**Exemplo de registro enviado no POST:**

```json
{
  "valor": 120.50,
  "tipo": "gasto",
  "categoria": "alimentação",
  "data": "2026-11-24",
  "descricao": "Compras do mês"
}
```

O servidor gera automaticamente os campos `id` e `createdAt`, que não são enviados pelo formulário.

Após um cadastro bem-sucedido, a aplicação direciona o usuário ao Histórico, onde os dados são consultados novamente pelo `GET`.

Os totais, os filtros de período utilizados no planejamento e os percentuais são processados no **JavaScript do navegador**, a partir dos registros obtidos da API.

**Privacidade:** a API do desafio não possui autenticação e os dados da coleção são acessíveis a quem conhece o identificador do squad. Não utilize dados pessoais ou financeiros reais.

## Estrutura do projeto

```text
index.html            Página inicial
registrar.html        Formulário de lançamentos
historico.html        Histórico financeiro
metas.html            Planejamento mensal
dividas.html          Simulador de dívidas
css/style.css         Estilos e responsividade
js/cadastro.js        Integração POST
js/lista.js           Integração GET
js/app.js             Totais, metas e simulador
assets/img/           Ilustrações e ícones
README.md             Documentação
```

## Como executar localmente

1. Baixe o repositório em **Code → Download ZIP** e extraia os arquivos.
2. Abra `index.html` em um navegador.
3. Navegue para **Registrar**, **Histórico**, **Dívidas** ou **Metas** pelo menu.

A consulta e o cadastro de lançamentos exigem conexão com a internet para acessar a API. O simulador de dívidas funciona localmente.

## Publicação no GitHub Pages

1. Abra o repositório no GitHub e acesse **Settings → Pages**.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha `main` e `/ (root)`, depois clique em **Save**.
4. Quando o GitHub exibir o endereço público, teste a aplicação publicada e adicione esse link na seção **Acesse o projeto** deste README.

## Escopo e limitações

O objetivo é demonstrar um MVP funcional, com **GET e POST reais**.

O projeto não oferece login, contas individuais, dados privados, contratação de serviços financeiros ou negociação de dívidas com instituições. A simulação financeira e as sugestões de planejamento são demonstrativas.

Recursos como edição e exclusão de lançamentos (`PATCH` e `DELETE`) não fazem parte do escopo implementado nesta versão.

---

*Projeto acadêmico desenvolvido para o Desafio 2 — Seed a Bit / PSEL 27.1.*
