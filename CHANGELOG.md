# Changelog

Todas as mudanças relevantes do app ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o versionamento segue o [Semantic Versioning](https://semver.org/lang/pt-BR/). Versões `0.x.y` até o app ir para as lojas.

## [Unreleased]

### Added

- Ícone, ícone adaptável do Android e splash com a identidade do Converter.
- Logo animado: os anéis se cruzam e a moeda no diamante troca a cada 1,8 s entre as 10 moedas. Com "reduzir movimento" ligado, fica parado no R$.
- Ícones de interface do MaterialCommunityIcons com nomes do projeto (`<Icon name="history" />`).

## [0.1.0] - 2026-10-07

Primeira versão: a base do projeto, ainda sem telas. O app abre no Expo Go com uma tela inicial vazia.

### Added

- Projeto Expo (SDK 57) com Expo Router, TypeScript strict e pnpm.
- Estrutura de pastas em `src/` com um alias por pasta (`@components`, `@services`, `@constants`...).
- Libs da stack instaladas: TanStack Query, axios, Zod, decimal.js, i18next, FlashList, react-native-svg, AsyncStorage e as fontes Bricolage Grotesque e Instrument Sans.
- Configuração do Expo em `app.config.ts`, com a versão vinda do `package.json`.
- Variável `EXPO_PUBLIC_API_URL` para apontar para a API.
- Lint e formatação com oxlint e oxfmt, com configuração para VS Code e Zed.
- Testes com Jest (`jest-expo`) e Testing Library, com helpers para renderizar com providers e simular a API.
- CI em todo push e PR na `main` (lint, format, typecheck, testes e Expo Doctor) e release por tag `v*.*.*`.
- Template de pull request e documentação da organização do projeto e do CI.
