# Changelog

Todas as mudanças relevantes do app ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o versionamento segue o [Semantic Versioning](https://semver.org/lang/pt-BR/). Versões `0.x.y` até o app ir para as lojas.

## [Unreleased]

## [0.2.0] - 2026-10-14

### Added

- Ícone, ícone adaptável do Android e splash com a identidade do Converter.
- Logo novo, com quatro anéis em volta do diamante: estático no ícone, na splash e na loja, e animado no app (os anéis se cruzam e a moeda no diamante troca a cada 1,8 s entre as 10 moedas). Com "reduzir movimento" ligado, mostra o logo estático com o "$".
- Tela de Boas-vindas com o logo, as 10 moedas, os botões "Começar" e "Converter agora" e moedas flutuando no fundo (paradas com "reduzir movimento").
- Fontes Bricolage Grotesque (títulos) e Instrument Sans (texto).
- Tema claro e escuro: segue o celular por padrão e guarda a escolha.
- Textos em português, inglês e espanhol, conforme o idioma salvo ou o idioma do celular, com formatação localizada de valores e datas.
- Componentes compartilhados de layout, cards, listas, moedas, botões, feedback e gráficos para as telas do app.
- Nome exibido do aplicativo atualizado para "Converter".
- Comunicação com a API: moedas, conversão, últimas cotações, histórico e status da sincronização, com respostas validadas, mensagens de erro no idioma do app e aviso de falta de conexão.
- Navegação por cinco abas, preferências persistidas de moeda principal e favoritas, e tela Início com cotação USD/BRL, gráfico de 30 dias, favoritas e status de sincronização.
- Onboarding em três etapas com conversões de exemplo offline, introdução ao histórico e seleção persistida de moeda principal e idioma.
- Ícones de interface do MaterialCommunityIcons com nomes do projeto (`<Icon name="history" />`).
- Tela Converter: digite um valor e veja na hora quanto ele vale nas outras 9 moedas, com a taxa de cada par. Tocar numa moeda converte a partir dela. Teclado próprio com vírgula, `00`, apagar, limpar, `+100` e `+1 mil`, e vibração leve. A conversão é feita no aparelho com precisão decimal, sem chamar a API a cada tecla.

### Changed

- Boas-vindas, onboarding e Início seguem o design: espaçamentos, tipografia, símbolos das moedas (US$, AR$, C$, A$), seletor de idioma, gráfico de 12 meses com destaque no último valor e lista de favoritas com o título no plural ("Suas moedas em reais").
- Um único arquivo `.env` para as variantes beta e production; o app avisa ao iniciar se `EXPO_PUBLIC_API_URL` estiver faltando.

### Fixed

- Cotações de exemplo do primeiro passo do onboarding não apareciam.
- Mínima, máxima e "Desde" do segundo passo apareciam coladas e cortadas, e o texto encostava nos botões em telas menores.
- Símbolos das moedas invisíveis no tema escuro e área clara em volta da barra de abas.
- Horário da sincronização no Início aparecia em UTC e sempre como "hoje"; agora usa o fuso do celular e mostra "hoje", "ontem" ou a data.

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
