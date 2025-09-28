# Next.js + React + Tailwind CSS + TypeScript + ESLint project template

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/seedabit/nextjs-react-typescript/blob/main/README.md)
[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/seedabit/nextjs-react-typescript/blob/main/README.pt-br.md)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app@12`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Index

- [TechStack](#techstack)
- [Getting Started](#getting-started)
    - [API Routes](#api-routes)
- [Learn More](#learn-more)
    - [Next.js](#nextjs)
    - [React](#react)
    - [TailwindCSS](#tailwindcss)
    - [Eslint](#eslint)
    - [Husky](#husky)
- [On commits, branches, and PRs](#on-commits-branches-and-prs)
- [On Deploying](#on-deploying)
- [Code Rules and Guidelines](#code-rules-and-guidelines)
    - [Directory Structure](#directory-structure)
    - [Naming Conventions](#naming-conventions)
    - [Code Details](#code-details)
    - [Styling Conventions](#styling-conventions)
    - [Extra](#extra)
- [Library Recommendations](#library-recommendations)
- [VSCode Extensions](#vscode-extensions)
- [License](#license)

## TechStack

- Next.js: 15.1.7
- React: ^19
- TypeScript: ^5
- ESLint: ^9
- TailwindCSS: ^3.4.17
- Husky: ^9.1.7

## Getting Started

Firstly, clone the repository:

```bash
git clone https://github.com/seedabit/nextjs-react-typescript.git
```

Then, navigate to the project directory:

```bash
cd nextjs-react-typescript
```

Now, install the necessary dependencies:

```bash
npm install
```

Furthermore, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### API Routes

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/api-route-name](http://localhost:3000/api/hello). This endpoint can be edited in `src/app/api/route.ts`.

The `src/app/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

### Next.js

Next.js is a React framework that enables functionality like server-side rendering, static site generation, and serverless functions. Allows you to build full-stack applications with routing, data fetching, and more.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

> [!IMPORTANT]
> Next.js has a clear and well documented API. It is recommended to read the documentation to understand the features and capabilities of Next.js.

> [!NOTE]
> Learn about Next's server side rendering, static site generation, and serverless functions here: [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

### React

React is a JavaScript/Typescript library for building reactive and reusable user interfaces.

- [React Documentation](https://reactjs.org/docs/getting-started.html) - learn about React features and API.
- [Learn React](https://reactjs.org/tutorial/tutorial.html) - an interactive React tutorial.

> [!CAUTION]
> Never use React's own repo creating tools like `create-react-app` with Next.js. Next.js is a React framework that handles all the configurations for you. The common use case for `create-react-app` is not recommended even by the React team.

### TailwindCSS

TailwindCSS is a utility-first CSS framework for rapidly building custom designs.

- [TailwindCSS Documentation](https://tailwindcss.com/docs) - learn about TailwindCSS features and API.
- [Flexbox Cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - a guide to Flexbox.
- [Grid Cheatsheet](https://css-tricks.com/snippets/css/complete-guide-grid/) - a guide to Grid.

> [!IMPORTANT]
> TailwindCSS has a clear and well documented API. It is recommended to read the documentation to understand the features and capabilities of TailwindCSS.

> [!NOTE]
> To learn the basics of TailwindCSS, the best way is to try it out in a project.

### Eslint

EsLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. It is highly configurable and can be used to enforce a consistent coding style across your project. Run `npm run lint` to check for linting errors before pushing your code.

- [Eslint Documentation](https://eslint.org/docs/user-guide/getting-started) - learn about Eslint features and API.
- [Eslint Rules](https://eslint.org/docs/rules/) - a list of all Eslint rules.

> [!WARNING]
> Eslint will throw errors if the code does not follow the rules defined in `.eslintrc.config.mjs`. It is recommended to fix all linting errors before pushing your code.

### Husky

Husky is a tool that allows you to run scripts before committing or pushing your code. It is used to check for linting errors, run tests, and more. Husky is configured to run Eslint before committing your code in this repository, for example.

- [Husky Documentation](https://typicode.github.io/husky) - learn about Husky features and API.

> [!NOTE]
> Husky is used to check for linting errors and run tests before committing your code. Make sure to fix all errors before pushing your code. If NEEDED you can skip the Husky checks by adding the `--no-verify` flag to the commit command (`git commit -m "message" -m "detailed description" --no-verify`).

> [!TIP]
> If you want to use Github Desktop or other GUI tools, you need to add `[root-dir]\Program Files\Git\bin` to the PATH environment variable, above the `[root-dir]\Program Files\Git\cmd` and `[root-dir]\Windows\system32`. Ensuring that Github Desktop finds and uses the correct Git binary.

## On commits, branches, and PRs

For commits, branches, and PRs, follow the guidelines below:

- **PRs**: Always create a PR to merge with the `dev` branch. Never merge directly to the `main` branch. Assume the `main` branch is the production branch.
- **Branches**: Create branches for each feature or bug fix. Use the format `feature/feature-name`, `bugfix/bug-name`, `issue/issue-number`, etc.
- **Commits**: Use the [Conventional Commits](https://github.com/iuricode/padroes-de-commits) format for commits.  It's recommended to add a bigger description to the commit message for better understanding. E.g. `git commit -m "feat(login): added login" -m "Added login feature using the firebase auth api`.

> [!NOTE]
> Commits are checked and validated by Husky and Lint-staged tested. Make sure to fix all errors before pushing your code.

## On Deploying

Don't forget to add environment variables and secrets for deployment. You can use `.env.local` for local development and `.env.production`/`.env` for production. For Github Actions, you can use Github Secrets or Github Environment variables.

There is an always existing environment variable in all Node projects `NODE_ENV`. It's used to track the current execution environment. Use `process.env.NODE_ENV` to check the current environment.

> [!TIP]
> Don't forget to add the `NEXT_PUBLIC_` prefix to the environment variables you want to use in the client-side code.

## Code Rules and Guidelines

> [!NOTE]
> The following rules are RECOMMENDED guidelines and aren't strictly forbidden. It is recommended to follow these guidelines for consistency and maintainability.

### Directory Structure

> [!NOTE]
> Delete the `.gitkeep` files in the directories once you add files to them. It's used so that the directories are tracked by Git.

Maintain the defined directory system for better organization and maintainability, each directory has a specific purpose:

- `src/app/`: Contains all the application pages
    - `src/app/api`: Contains all the API routes if needed.
- `src/components`: Contains all the components used in the project.
    - `src/components/core`: Contains all the core components used in the project.
    - `src/components/ui`: Contains all the UI components used in the project.
- `src/hooks`: Contains all the custom hooks used in the project.
- `src/services`: Contains all the services used in the project.
- `src/tests`: Contains all the tests for the project.
- `src/types`: Contains all the types used in the project.
- `src/utils`: Contains all the utility functions used in the project.
    - `src/utils/lib`: Contains all the library functions used in the project.
- `src/data`: Contains all the data used in the project.

### Naming Conventions

- Use camelCase for variables and functions.
- Use PascalCase for components and classes.
- Use kebab-case for CSS classes and file names for components.

### Code Details

- Use `const` for variables for safety, if possible.
- Keep functions clear and concise. If a function is too long, consider breaking it down into smaller functions.
- Always add documentation to functions (if not self-explanatory).
    - E.g.
    ```typescript
    function func(a: number, b: number): number {
    /**
     * Simple function explanation.
     *
     * @abstract
     * Better/longer function explanation.
     *
     * @param {number} a - The first number.
     * @param {number} b - The second number.
     *
     * @returns {number} The sum of the two numbers.
     *
     * @throws {TypeError} If the parameters are not numbers.
     */
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Parameters must be numbers.')
        }

        return a + b
    }
    ```
- Always type your variables and functions with TypeScript.
- Use `null` instead of `undefined` for uninitialized variables. Keep your intent clear.
- Use `===` instead of `==` for comparison. `===` is more strict and prevents type coercion.
- Create single responsibility components. A component should do one thing and do it well. Be careful of components that do too much (too many props, too many states, etc.).
- Be careful of the `any` type, only use it when necessary. It defeats the purpose of TypeScript.
- Handle all possible errors and edge cases. Don't assume the input will always be correct.

### Styling Conventions

- Use TailwindCSS classes for styling instead of pixel values. Fixed values aren't responsive and can cause issues on different screen sizes.
    - E.g. `w-1/2` instead of `width: 200px`.
- Prefer using `flex` and `grid` for layout instead of `float` and `position`.
- Use `gap-{value}` or `space-y-{value}` instead of `margin`/`padding` for spacing between elements. Keeps the code cleaner, readable, and responsive.
- Use `!important` ONLY when necessary. It can cause specificity issues and make the code harder to maintain.
- You may create separate CSS files for specific use cases (e.g. animated loaders). Keep the CSS file in the same directory as the component using it.
- Only use inline styles when necessary. It is harder to maintain and can cause specificity issues.

### Extra

- Use Next.js's internal routing system for navigation. It is faster and more optimized than using `react-router`. Import `useRouter()` from `next/navigation`.
- Use the `<Image />` component from `next/image` for images (for optimization).
- Use `cookie` from `next/headers` for setting and getting cookies.

> [!CAUTION]
> Don't use `useRouter()` from `next/router` for navigation. It's deprecated and not recommended.

#### Generating Icons for your Application

To quickly and easily generate favicons for the app, go to [Favicon Generator](https://realfavicongenerator.net). Upload your image and generate the favicons. Download the zip file and extract it to the `public` directory. Add the instructed code to the `head` tag in the main `layout.tsx` file.

## Library Recommendations

> [!NOTE]
> The following libraries are RECOMMENDED for use in the project. It is recommended to use these libraries for better performance, maintainability, and readability.

- [Shadcn](https://ui.shadcn.com): A utility library for React/TailwindCSS components, easily customizable and extendable. Use the CLI to generate components, hooks, and more.
- [Redux](https://redux.js.org): A state management library for React. Easy to use and integrate with React, with a lot of features. Great for global state management.
- [Framer Motion](https://www.framer.com/motion/): A library for animations in React. Simple and easy to use, with a lot of features.
- [Lucide](https://lucide.dev): A library of icons for React.
- [Firebase](https://firebase.google.com): A backend service for authentication, database, storage, and more. Easy to use and integrate with React.
- [Zod](https://zod.dev): A library for data validation in TypeScript. Quick, robust and easy to use.
- [Axios](https://axios-http.com): A library for making HTTP requests in React. Easy to use and configure, creating axios instances for different APIs.

## VSCode Extensions

> [!IMPORTANT]
> The TailwindCSS extension is a must-have for TailwindCSS projects. It provides IntelliSense for TailwindCSS classes.

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): IntelliSense for Tailwind CSS.
- [React](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets): React snippets for JSX and TSX.

## License

This project is licensed, see the [LICENSE](LICENSE) file for details.