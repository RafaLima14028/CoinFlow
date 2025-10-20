<h1 align="center">CoinFlow</h1>

CoinFlow é um site minimalista que exibe câmbio entre moedas, com design elegante e funcionalidades intuitivas. Desenvolvido com o auxílio de LLMs ([Mistral AI](https://mistral.ai/), [Grok](https://grok.com/), [Gemini](https://gemini.google.com/) e [Copilot](https://copilot.microsoft.com/)) e inteiramente com **vibe coding**.

Acesse a versão online aqui: **[https://coinflow-rafalima.vercel.app/](https://coinflow-rafalima.vercel.app/)**

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML, CSS e JavaScript
- **AIs:**
  - **Mistral AI:** Utilizada para a criação da paleta de cores.
  - **Grok:** Auxiliou na geração de ideias e estruturas de código.
  - **Gemini & GitHub Copilot:** Usados intensivamente no desenvolvimento e refatoração do código.
- **Outros:**
  - **[AwesomeAPI](https://awesomeapi.com.br/):** Fornece os dados de câmbio em tempo real.
  - **Git & GitHub:** Para versionamento de código.
  - **[Vercel](http://vercel.com/):** Usado para hospedagem da página.

## ✨ Funcionalidades

- Exibição de câmbio em tempo real entre diversas moedas.
- Gráfico dinâmico que mostra a variação do valor ao longo do tempo (7, 15 ou 30 dias).
- Modo claro e escuro para melhor conforto visual.
- Design totalmente responsivo, adaptado para desktops e dispositivos móveis.

## ⚙️ Como Rodar o Projeto Localmente

Não há pré-requisitos complexos, apenas um navegador moderno.

```bash
# 1. Clone o repositório
git clone https://github.com/RafaLima14028/CoinFlow.git

# 2. Navegue até o diretório do projeto
cd CoinFlow

# 3. Abra o arquivo principal no seu navegador (no Windows)
start index.html
```

## 📂 Estrutura do Projeto

O projeto é organizado de forma simples e direta:

```
.
├── .gitignore       # Arquivos ignorados pelo Git
├── favicon.png      # Ícone da aba do navegador
├── index.html       # Estrutura principal da página (HTML)
├── robots.txt       # Instruções para crawlers de busca (SEO)
├── script.js        # Lógica, chamadas de API e manipulação do DOM
├── sitemap.xml      # Mapa do site para buscadores (SEO)
└── style.css        # Estilização visual da página (CSS)
```

## 🎨 Decisões de Design

- **Paleta de Cores:** A paleta foi gerada pela Mistral AI, buscando um contraste agradável tanto no modo claro quanto no escuro, com um azul como cor de destaque para elementos interativos.
- **Tipografia:** A fonte escolhida foi a **Roboto**, por sua excelente legibilidade e design moderno, que se alinha à proposta minimalista do projeto.
- **Inspirações:** O design segue uma abordagem minimalista e elegante, com foco na experiência do usuário (UX) e na clareza das informações, evitando distrações.

## 🧠 Aprendizados e Desafios

Este projeto foi uma jornada de aprendizado sobre a colaboração entre humano e IA no desenvolvimento de software.

### Aprendizados:

1.  **Desenvolvimento com Vibe Coding:** Aprendi a programar de forma mais fluida e experimental, focando no fluxo contínuo de desenvolvimento com o auxílio de IAs.
2.  **Revisão de Código Gerado:** Ficou clara a importância de revisar e refatorar o código gerado por LLMs para garantir que ele seja eficiente, semântico e livre de bugs.
3.  **Contexto para APIs:** Compreendi que, para integrar APIs, é crucial fornecer um contexto detalhado (endpoints, estrutura de resposta, etc.) para que as IAs possam gerar implementações corretas.

### Desafios:

1.  **Layout do Botão de Troca:** Durante os testes em dispositivos móveis, o botão de inversão de moedas ocupava um espaço vertical excessivo após ser rotacionado. A solução foi ajustar seu `width` para `fit-content` e centralizá-lo, resolvendo o problema de layout.
2.  **Responsividade do Gráfico:** Foi um desafio fazer com que as IAs entendessem a lógica de layout desejada, onde o gráfico deveria ocupar 100% da largura em telas menores e se posicionar à direita em telas maiores. A solução exigiu ajustes manuais no CSS com `flexbox` e `media queries`.
3.  **Integração da API:** Sem o devido contexto sobre a `AwesomeAPI`, as IAs inicialmente não conseguiram implementar a lógica de busca de dados corretamente, reforçando a necessidade de guiar a IA com informações precisas.
