# Next.js + React + Tailwind CSS + TypeScript + ESLint - Template de Projeto

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/seedabit/nextjs-react-typescript/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/seedabit/nextjs-react-typescript/blob/main/README.pt-br.md)

> [!WARNING]
> Os recursos externos estão em inglês.

Este é um projeto [Next.js](https://nextjs.org/) inicializado com [`create-next-app@12`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Índice

- [TechStack](#techstack)
- [Primeiros Passos](#primeiros-passos)
    - [Rotas de API](#rotas-de-api)
- [Saiba Mais](#saiba-mais)
    - [Next.js](#nextjs)
    - [React](#react)
    - [TailwindCSS](#tailwindcss)
    - [Eslint](#eslint)
    - [Husky](#husky)
- [Commits, branches e PRs](#commits-branches-e-prs)
- [Sobre o Deploy](#sobre-o-deploy)
- [Regras e Diretrizes de Código](#regras-e-diretrizes-de-código)
    - [Estrutura de Diretórios](#estrutura-de-diretórios)
    - [Convenções de Nomeação](#convencoes-de-nomeação)
    - [Detalhes do Código](#detalhes-do-codigo)
    - [Convenções de Estilização](#convenções-de-estilização)
    - [Extra](#extra)
- [Recomendações de Bibliotecas](#recomendações-de-bibliotecas)
- [Extensões para o VSCode](#extensões-para-o-vscode)
- [Licença](#licença)

## TechStack

- Next.js: 15.1.7
- React: ^19
- TypeScript: ^5
- ESLint: ^9
- TailwindCSS: ^3.4.17
- Husky: ^9.1.7

## Primeiros Passos

Primeiramente, clone o repositório:

```bash
git clone https://github.com/seedabit/nextjs-react-typescript.git
```

Em seguida, navegue até o diretório do projeto:

```bash
cd nextjs-react-typescript
```

Agora, instale as dependências do projeto:

```bash
npm install
```

Finalmente, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Rotas de API

As [rotas de API](https://nextjs.org/docs/api-routes/introduction) podem ser acessadas em [http://localhost:3000/api/api-route-name](http://localhost:3000/api/hello). Esse endpoint pode ser editado em `src/app/api/route.ts`.

O diretório `src/app/api` é mapeado para `/api/*`. Arquivos nesse diretório são tratados como [rotas de API](https://nextjs.org/docs/api-routes/introduction) em vez de páginas React.

## Saiba Mais

### Next.js

Next.js é um framework para React que permite funcionalidades como renderização no servidor, geração estática e funções serverless. Permite a criação de aplicações full-stack com roteamento, busca de dados e muito mais.

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre as funcionalidades e API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo sobre Next.js.

> [!IMPORTANT]
> Next.js tem uma API clara e bem documentada. Recomenda-se ler a documentação para entender melhor seus recursos e capacidades.

> [!NOTE]
> Aprenda sobre o servidor de renderização, geração estática e funções serverless do Next.js aqui: [Server Components Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

### React

React é uma biblioteca JavaScript/Typescript para construção de interfaces de usuário reativas e reutilizáveis.

- [Documentação do React](https://reactjs.org/docs/getting-started.html) - aprenda sobre os recursos e API do React.
- [Aprenda React](https://reactjs.org/tutorial/tutorial.html) - um tutorial interativo sobre React.

> [!CAUTION]
> Nunca use a ferramenta de criação de repositórios do React para cirar projetos, como `create-react-app`. O Next.js é umA framework que cuidará de todas as configurações necessárias para você. O uso de `create-react-app` não é recomendado nem pelo time do React.

### TailwindCSS

TailwindCSS é um framework CSS utilitário que permite a criação rápida de designs personalizados.

- [Documentação do TailwindCSS](https://tailwindcss.com/docs) - aprenda sobre os recursos e API do TailwindCSS.
- [Flexbox Cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - um guia de referência para Flexbox.
- [Grid Cheatsheet](https://css-tricks.com/snippets/css/complete-guide-grid/) - um guia de referência para Grid.


> [!IMPORTANT]
> A documentação do TailwindCSS é muito bem escrita e fácil de entender. Recomenda-se ler a documentação para entender melhor seus recursos e capacidades.

> [!NOTE]
> Para o aprendizado de TailwindCSS, recomenda-se a prática em projetos reais. A prática é a melhor maneira de aprender.

### ESLint

O ESLint é uma ferramenta para identificar e relatar padrões em código ECMAScript/JavaScript. Ele é altamente configurável e pode ser usado para manter um estilo de código consistente. Rode `npm run lint` para rodar o ESLint e checar problemas de "linting" no seu código antes de fazer um commit.

- [Documentação do ESLint](https://eslint.org/docs/user-guide/getting-started) - aprenda sobre os recursos e API do ESLint.
- [Regras do ESLint](https://eslint.org/docs/rules/) - uma lista de regras do ESLint.

> [!WARNING]
> O ESLint chamará erros se o código não estiver de acordo com as regras definidas no arquivo `.eslintrc.config.mjs`. Certifique-se de corrigir todos os erros antes de fazer um commit.

### Husky

Husky é uma ferramenta que permite a execução de scripts antes de um commit ou push. Ele é usado para rodar o ESLint antes de um commit, rodar testes e mais. Husky está configurado para rodar o ESLint antes de um commit nesse repositório, por exemplo.

- [Documentação do Husky](https://typicode.github.io/husky) - aprenda sobre os recursos e API do Husky.

> [!IMPORTANT]
> Husky é usado para checar por erros de linting e testes antes de um commit. Certifique-se de corrigir todos os erros antes de fazer um commit. SE necessário, é possivel ignorar o Husky temporariamente com a flag `--no-verify` (`git commit -m "mensagem" -m "descrição mais detalhada" --no-verify`).

> [!TIP]
> Caso queira usar o Github Desktop ou outra ferramenta de GUI para commits, é preciso se adicionar `[raiz]\Program Files\Git\bin` às variáveis de ambiente PATH do sistema, acima de `[raiz]\Program Files\Git\cmd` e `[raiz]\Windows\system32`. Isso garante que o Github Desktop encontre e use o binário do Git corretamente.

## Commits, branches e PRs

Para commits, branches e PRs, siga as seguintes regras:

- **PRs**: Sempre crie a PR para dar merge na branch `dev`. Nunca dê merge diretamente na branch `main`. Assuma que a branch `main` é a branch de produção.
- **Branches**: Crie uma branch para cada nova feature ou correção de bug. Use o padrão `feature/nome-da-feature`, `bugfix/nome-do-bug`, `issue/numero-da-issue` etc.
- **Commits**: Use o padrão de [Conventional Commits](https://github.com/iuricode/padroes-de-commits) para commits. É recomendado que se adicione descrições detalhadas para commits quando possivel para facilitar a revisão de código. Ex. `git commit -m "feat: adiciona nova feature" -m "descrição mais detalhada"`.

> [!NOTE]
> Commits são validados e checados pelo Husky e ESLint antes de serem feitos. Certifique-se de corrigir todos os erros antes de fazer um commit.

## Sobre o Deploy

Não esqueça de adicionar variáveis de ambiente e segredos para o deploy. Use `.env.local` para desenvolvimento local e `.env.production`/`.env` para produção.

Há uma variável de ambiente sempre existente em todos projetos com Node, `NODE_ENV`, que é usada para determinar o ambiente de execução. Use `process.env.NODE_ENV` para verificar o ambiente de execução.

> [!TIP]
> Não se esqueça de adicionar o prefixo `NEXT_PUBLIC_` nas variáveis de ambiente que você deseja expor para o lado cliente da aplicação.

## Regras e Diretrizes de Código

> [!NOTE]
> As regras e diretrizes de código a seguir são RECOMENDAÇÕES e não são obrigatórias. É uma recomendação seguir essas regras para manter o código consistente e de fácil manutenção.

### Estrutura de Diretórios

> [!NOTE]
> Apague os arquivos `.gitkeep` após adicionar arquivos reais ao diretório. Eles são apenas placeholders para que o Git possa rastrear diretórios vazios.

Mantenha a estrutura de diretórios do projeto para melhor organização e manutenção do código, cada diretório tem um propósito específico:

- `src/app/`: Contém todas as páginas da aplicação
    - `src/app/api`: Contém todas as rotas de API, se necessário.
- `src/components`: Contém todos os componentes usados no projeto.
    - `src/components/core`: Contém componentes básicos (core).
    - `src/components/ui`: Contém componentes de interface do usuário.
- `src/hooks`: Contém todos os hooks personalizados.
- `src/services`: Contém todos os serviços usados no projeto.
- `src/tests`: Contém todos os testes do projeto.
- `src/types`: Contém todos os tipos de dados usados no projeto.
- `src/utils`: Contém funções utilitárias.
    - `src/utils/lib`: Contém funções utilitárias de bibliotecas externas.
- `src/data`: Contém todos os dados/constantes usados no projeto.

### Convenções de Nomeação

- Use camelCase para variáveis e funções.
- Use PascalCase para componentes e classes.
- Use kebab-case para classes CSS e nomes de arquivos de componentes.

### Detalhes do Código

- Use `const` para declaração de variáveis.
- Mantenha as funções claras e concisas. Se uma função for muito longa, considere dividí-la em funções menores.
- Sempre adicione documentação às funções (se as mesmas não forem autoexplicativas).
    - Ex.
    ```typescript
    function func(a: number, b: number): number {
    /**
     * Uma explicação simples do que a função faz.
     *
     * @abstract
     * Uma explicação mais detalhada/maior do que a função faz.
     *
     * @param {number} a - O primeiro número.
     * @param {number} b - O segundo número.
     *
     * @returns {number} A soma de a e b.
     *
     * @throws {TypeError} Se a ou b não forem números.
     */
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Os argumentos devem ser números.')
        }

        return a + b
    }
    ```
- Sempre dê tipo às variáveis e funções.
- Use `null` ao invés de `undefined` para variáveis não inicializadas. Mantenha a sua intenção clara.
- Use `===` ao invés de `==` para comparações. `===` é mais seguro e evita erros de tipo.
- Crie componentes de responsabilidade única. Um componente deve fazer uma coisa e fazê-la bem. Tome cuidado com componentes que fazem coisas demais (muitos props, muitos estados, etc.).
- Tome cuidado com o tipo `any`, use apenas quando necessário. O TypeScript é uma ferramenta poderosa para evitar erros de tipo.
- Lide com todos os erros e exceções. Use `try/catch` para lidar com exceções e erros. Não assuma o comportamento do código.

### Convenções de Estilização

- Use classes do TailwindCSS para estilização ao invés de valores em pixels. Valores fixos não são responsivos e podem quebrar o layout em diferentes tamanhos de tela.
    - Ex. `w-1/2` ao invés de `width: 200px`.
- Preferencialmente, use `flex` e `grid` para layouts ao invés de `float` e `position`.
- Use `gap-{valor}` ou `space-y-{valor}` para espaçamento entre elementos ao invés de `margin` e `padding`. Mantém o código limpo, legível e de fácil de manutenção.
- Use `!important` APENAS quando necessário. O seu uso pode causar problemas de especificidade e dificultar a manutenção do código.
- A criação de arquivos CSS separados é permitida (ex. loaders animados), mas não é recomendada. Mantenha o arquivo CSS no mesmo diretório do componente que o utiliza.
- Apenas use variáveis inline quando necessário. Variáveis inline podem dificultar a manutenção do código e a reutilização de estilos.

### Extra

- Use o roteamento do Next.js para navegação entre páginas. É mais rápido e otimizado que usar `react-router`. Importe o hook `useRouter()` do Next.js (`next/navigation`) para navegação programática.
- Use o componente `<Image />` (`next/image`), por questões de performance e otimização.
- Use o `cookie` (`next/headers`) para armazenar informações do usuário no navegador.

> [!CAUTION]
> Não use o hook `useRouter()` (`next/router`). Esse está depreciado e não é recomendado para uso.

## Recomendações de Bibliotecas

> [!NOTE]
> As bibliotecas a seguir são RECOMENDAÇÕES e não são obrigatórias. Use-as se necessário para melhor performance, manutenção e legibilidade do código.

- [Shadcn](https://ui.shadcn.com): Biblioteca de componentes React/TailwindCSS.
- [Redux](https://redux.js.org): Biblioteca de gerenciamento de estados global.
- [Framer Motion](https://www.framer.com/motion/): Biblioteca de animações para React.
- [Lucide](https://lucide.dev): Biblioteca de ícones SVG.
- [Firebase](https://firebase.google.com): Plataforma com serviço de autenticação, banco de dados, armazenamento e muito mais.
- [Zod](https://zod.dev): Biblioteca de validação de esquemas com TypeScript.
- [Axios](https://axios-http.com): Biblioteca para requisições HTTP.

## Extensões para o VSCode

> [!IMPORTANT]
> A extensão do TailwindCSS é altamente recomendada para desenvolvimento com TailwindCSS. Ela fornece IntelliSense para classes do TailwindCSS.

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): IntelliSense para Tailwind CSS.
- [React](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): Suporte para React com JSX e TSX.

## Licença

Este projeto está licenciado sob uma licença especificada no arquivo [LICENSE](LICENSE).