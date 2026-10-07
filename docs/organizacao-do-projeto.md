# Organização do projeto

Como o App Converter é montado: stack, pastas, convenções, padrão visual, qualidade e releases. A ideia é seguir o mesmo jeito de trabalhar da [currency-converter-api](https://github.com/aqu1no1/currency-converter-api) sempre que fizer sentido.

[← Voltar para o README](../README.md)

---

## 1. Stack

| Área                   | Ferramenta                                                        |
| ---------------------- | ----------------------------------------------------------------- |
| Base                   | React Native + Expo (Expo Go), TypeScript strict                  |
| Rotas                  | Expo Router (arquivos em `src/app`)                               |
| Gerenciador de pacotes | **pnpm**                                                          |
| HTTP                   | axios, encapsulado no `ApiService`                                |
| Dados da API           | TanStack Query (cache, loading, erro, refetch, cancelamento)      |
| Validação              | Zod (DTOs), igual à API                                           |
| Dinheiro               | decimal.js, igual à API                                           |
| Listas                 | FlashList                                                         |
| Gráficos e logo        | react-native-svg                                                  |
| Traduções              | i18next + react-i18next + expo-localization (pt-BR, en, es)       |
| Preferências           | AsyncStorage (tema, idioma, moeda principal, favoritas)           |
| Fontes                 | Bricolage Grotesque (títulos e números) e Instrument Sans (texto) |
| Lint e formatação      | oxlint + oxfmt                                                    |
| Testes                 | Jest com `jest-expo` + Testing Library                            |

### Regras de instalação

- Lib com código nativo: **sempre** `pnpm expo install <lib>` (escolhe a versão compatível com o SDK e com o Expo Go).
- Lib só JavaScript: `pnpm add <lib>`; de desenvolvimento: `pnpm add -D <lib>`.
- Nunca misturar npm ou yarn: o projeto tem só o `pnpm-lock.yaml`.
- Se aparecer erro de módulo não encontrado, usar `node-linker=hoisted` no `.npmrc`.

---

## 2. Comandos

| Comando                             | O que faz                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm start`                        | Abre o Expo (QR code para o Expo Go)                                               |
| `pnpm start:tunnel`                 | Mesmo, quando a rede bloqueia a conexão direta                                     |
| `pnpm start:clear`                  | Abre limpando o cache (depois de mudar aliases ou instalar libs)                   |
| `pnpm lint` / `pnpm lint:fix`       | oxlint com checagem de tipos, sem aceitar avisos                                   |
| `pnpm format` / `pnpm format:check` | oxfmt                                                                              |
| `pnpm typecheck`                    | `tsc --noEmit`                                                                     |
| `pnpm test` / `pnpm test:cov`       | Jest (no máximo 4 workers, configurado no `jest.config.js`)                        |
| `pnpm run doctor`                   | Expo Doctor: confere se as libs batem com o SDK (sem `run`, cai no doctor do pnpm) |
| `pnpm pr`                           | Tudo que o CI roda, antes de abrir a PR                                            |

---

## 3. Estrutura de pastas

### Raiz

```
currency-converter-app/
├── src/                      # todo o código do app
├── test/                     # testes, fora do src
├── types/                    # declarações globais (.d.ts): i18next, env, imagens
├── docs/                     # documentação (CI.md...)
├── .github/                  # workflows, script do changelog e template de PR
├── .vscode/ · .zed/          # configuração dos editores (oxc)
├── app.config.ts             # config do Expo; versão vem do package.json
├── jest.config.js
├── .oxlintrc.json · .oxfmtrc.json
├── tsconfig.json             # strict + aliases
├── .env.example
├── CHANGELOG.md
└── package.json · pnpm-lock.yaml
```

### `src/`

```
src/
├── app/           # ROTAS (expo-router): cada arquivo é uma tela
├── components/    # componentes compartilhados, por grupo
├── hooks/         # hooks customizados (useSomething.ts)
├── services/      # ApiService + uma classe por recurso da API
├── contexts/      # React Contexts de domínio (preferências)
├── theme/         # ThemeProvider + useTheme
├── constants/     # theme.ts, storage.ts, time.constants.ts
├── dtos/          # schemas Zod e tipos das respostas da API
├── models/        # modelos de domínio
├── interfaces/    # interfaces e classes genéricas (ApiError)
├── enums/         # enums (moedas, períodos)
├── utils/         # funções utilitárias
├── lib/           # configuração de libs (react-query, i18n)
├── locales/       # traduções por idioma e domínio
└── assets/        # imagens, logo
```

### Rotas (`src/app`)

```
src/app/
├── _layout.tsx           # fontes, providers e <Stack>
├── index.tsx             # Boas-vindas
└── (tabs)/
    ├── _layout.tsx       # barra de abas flutuante
    ├── inicio.tsx
    ├── converter.tsx
    ├── cotacoes.tsx
    ├── historico.tsx
    └── ajustes.tsx
```

Convenções do Expo Router: `_layout.tsx` envolve as rotas irmãs; `[param].tsx` é rota dinâmica (`useLocalSearchParams()`); `(grupo)/` agrupa sem mudar a URL. **Nada que não seja tela vai dentro de `src/app`**, porque todo arquivo ali vira rota.

### Nomes de arquivo

| Tipo                  | Padrão                            | Exemplo                            |
| --------------------- | --------------------------------- | ---------------------------------- |
| Service               | `thing.service.ts`                | `exchange-rate.service.ts`         |
| DTO                   | `thing.dto.ts`                    | `latest-rates.dto.ts`              |
| Model                 | `thing.model.ts`                  | `currency.model.ts`                |
| Enum                  | `thing.enum.ts`                   | `currency-code.enum.ts`            |
| Util                  | `thing.util.ts`                   | `format.util.ts`                   |
| Interface             | `thing.interface.ts`              | `api-error.interface.ts`           |
| Constantes            | `thing.constants.ts`              | `time.constants.ts`                |
| Componente / Provider | PascalCase                        | `ListRow.tsx`, `ThemeProvider.tsx` |
| Hook                  | `useSomething.ts`                 | `useLatestRates.ts`                |
| Teste                 | `*.spec.ts(x)` / `*.int-spec.tsx` | `format.util.spec.ts`              |

### Aliases

`@app`, `@components`, `@hooks`, `@services`, `@contexts`, `@theme`, `@constants`, `@dtos`, `@models`, `@interfaces`, `@enums`, `@utils`, `@lib`, `@locales` e `@assets`, cada um apontando para a pasta de mesmo nome em `src/`. Sempre importar pelo alias. O Expo lê os `paths` do `tsconfig.json`; o Jest repete os mesmos no `moduleNameMapper`.

### Pasta `types/`

Guarda arquivos `.d.ts`, que são **só de tipos**: não viram código no app, só ensinam o TypeScript sobre o que ele não descobre sozinho. Fica fora do `src/` porque nada ali roda no celular, e entra no `include` do `tsconfig.json` (`"types/**/*.d.ts"`). Nunca é importada por nenhum arquivo.

| Arquivo              | Para quê                                                                            |
| -------------------- | ----------------------------------------------------------------------------------- |
| `types/i18next.d.ts` | Autocomplete das chaves no `t('...')` e erro no typecheck para chave inexistente    |
| `types/env.d.ts`     | Tipos das variáveis `EXPO_PUBLIC_*` em `process.env`                                |
| `types/images.d.ts`  | Tipos de imports de arquivos que não são código (só se o Expo não cobrir o formato) |

`types/i18next.d.ts`: estende o tipo do i18next para conhecer as chaves do `ptBR`. Assim `t('converter.ti...')` sugere `title`, e `t('converter.titel')` dá erro no `pnpm typecheck`.

```ts
import 'i18next';
import type { Translations } from '@locales/pt-BR';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: Translations };
  }
}
```

`types/env.d.ts`: faz `process.env.EXPO_PUBLIC_API_URL` aparecer no autocomplete e acusa nome errado.

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL: string;
  }
}
```

`types/images.d.ts`: só se um import de arquivo (`import logo from '@assets/logo.png'`) der erro de tipo. O Expo já declara os formatos de imagem mais comuns.

```ts
declare module '*.png' {
  const value: number;
  export default value;
}
```

Variável de ambiente nova: adicionar no `.env.example` **e** no `types/env.d.ts`.

---

## 4. Camada de API

Fluxo: **tela → hook (`useQuery`) → service → `ApiService` → axios**.

- `services/api.service.ts`: classe `ApiService` singleton (`getInstance()`), com os métodos `get`, `post`, `patch`, `put` e `delete`, que já devolvem só o `data`.
  - Interceptor de request: envia o idioma atual no `Accept-Language`, para as mensagens de erro da API virem traduzidas.
  - Interceptor de response: transforma qualquer falha num `ApiError` (`status`, `message` pronta para a tela, `code`; `status 0` = erro de rede).
  - Timeout de `10 * TIME_IN_MS.SECOND`.
- `services/<recurso>.service.ts`: uma classe por recurso, que recebe o `ApiService` no construtor e define o `baseUrl` (`/exchange-rates`, `/sync`). Cada método valida a resposta com o schema Zod do DTO e aceita um `signal` para cancelamento.
- `services/index.ts`: cria as instâncias (`new ExchangeRateService(api)`).
- **Hooks**: um por consulta (`useLatestRates`, `useHistory`, `useSyncStatus`), com `queryKey` descritiva e o `signal` do React Query repassado ao service.
- `lib/query-client.ts`: `staleTime` de `5 * TIME_IN_MS.MINUTE`; retry só em erro de rede ou 5xx, no máximo 2 vezes. O retry fica só aqui, não no axios.
- **URL da API**: `EXPO_PUBLIC_API_URL` no `.env`, com o IP da máquina na rede (o celular não acessa `localhost`). Tudo que começa com `EXPO_PUBLIC_` fica visível no app: nada secreto ali.

Endpoints usados: `GET /currencies`, `GET /exchange-rates/convert`, `GET /exchange-rates/latest/:base`, `GET /exchange-rates/history`, `GET /sync/status` e `GET /sync`.

---

## 5. Tema

- `constants/theme.ts`: interface `Colors`, paletas `lightColors` e `darkColors`, e as escalas `SIZES`, `RADIUS` e `TYPE`.
- `theme/ThemeProvider.tsx`: contexto com `dark`, `colors`, `scheme` e `setScheme`. Opções: `system` (padrão, segue o celular), `light` e `dark`, salvas no AsyncStorage.
- O provider fica **no topo** do `_layout.tsx`, o valor é memorizado com `useMemo` e o contexto **só tem tema**.
- `useTheme()` fora do provider lança erro, em vez de devolver cores padrão em silêncio.

Regras:

- Usar tokens semânticos (`textPrimary`, `surfacePrimary`, `border`), nunca hex fixo.
- Cores aplicadas inline (`[styles.card, { backgroundColor: colors.surfacePrimary }]`); **nunca** `colors.*` dentro de `StyleSheet.create`, que não reage à troca de tema.
- Cor nova: adicionar na interface `Colors` e em `lightColors` **e** `darkColors`.
- A marca é verde nos dois temas; o modo escuro ainda precisa ser validado no design.

### Padrão visual (das telas do design)

| Item                             | Valor                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| Primária / menta / menta suave   | `#0F3D2E` / `#9FE1CB` / `#E1F2E7`                                                             |
| Fundo / texto / texto secundário | `#F3F7F4` / `#14211B` / `#4F5F57`                                                             |
| Texto                            | Display 40 · título 32 · seção 17 · valor 18 · texto 16 · secundário 13 · legenda 12 · aba 11 |
| Espaçamento                      | Margem lateral 20 · entre seções 24 · entre itens 12 · padding de cartão 16                   |
| Tamanhos                         | Linha de lista 64 · botão 52 · tecla 44 · toque mínimo 44 · ícone de moeda 40                 |
| Cantos                           | Cartão 24 · lista 20 · botão e campo 16 · ícone, tecla e opção 12 · chips arredondados        |

---

## 6. Traduções

- Arquivos `.ts` por idioma e domínio: `src/locales/pt-BR/{common,tabs,converter,rates,history,settings,currencies,errors}.ts`, reunidos num `index.ts`. `en` e `es` seguem as mesmas chaves e são tipados como `Translations`, então o TypeScript acusa chave faltando.
- `lib/i18n.ts` configura o i18next. Prioridade: idioma escolhido em Ajustes → idioma do celular → pt-BR.
- `types/i18next.d.ts` dá autocomplete das chaves.
- Nas telas, sempre `const { t } = useTranslations()`; **nunca texto fixo**.
- Dinheiro e datas com `Intl` no idioma ativo (`utils/format.util.ts`); datas das cotações com `timeZone: 'UTC'`.

---

## 7. Constantes de tempo

`constants/time.constants.ts`, igual ao da API: `TIME_IN_MS`, `TIME_IN_SECONDS` e `TIME_IN_MINUTES`. Qualquer tempo no código usa essas constantes (`10 * TIME_IN_MS.SECOND`, `5 * TIME_IN_MS.MINUTE`, `30 * TIME_IN_MS.DAY`), nunca `60 * 1000` solto.

---

## 8. Testes

Pasta `test/`, separada do `src/`, espelhando a estrutura do código:

```
test/
├── unit/          # utils, dtos, services, hooks, interfaces (*.spec.ts)
├── components/    # um componente por vez (*.spec.tsx)
├── integration/   # tela inteira com providers e API simulada (*.int-spec.tsx)
├── e2e/           # fluxos no celular com Maestro (para depois)
├── setup/         # jest.setup.ts: mocks de AsyncStorage, expo-localization e i18n
├── fixtures/      # respostas de exemplo da API
└── utils/         # renderWithProviders, QueryClient de teste, ApiService falso
```

- A API é simulada passando um `ApiService` falso para o service (injeção pelo construtor). Não precisa de Docker nem de rede.
- Máximo de **4 workers** em todos os comandos (`maxWorkers: 4` no `jest.config.js`).

---

## 9. Qualidade, CI e releases

- **oxlint** (`.oxlintrc.json`): plugins `typescript`, `react` (regras de hooks), `import`, `unicorn` e `oxc`; `no-explicit-any` e `no-floating-promises` como erro; `__DEV__` global.
- **oxfmt** (`.oxfmtrc.json`): aspas simples, vírgula final, 100 colunas (igual à API).
- **Editores**: VS Code com a extensão `oxc.oxc-vscode` e Zed com oxlint e oxfmt como language servers; os dois formatam e aplicam os fixes seguros ao salvar.
- `ci.yml`: em todo push e PR na `main`, três jobs em paralelo: lint + format + typecheck, testes com cobertura e Expo Doctor.
- `release.yml`: por tag `v*.*.*`: preflight (tag na `main`, versão do `package.json` igual ao tag, seção no CHANGELOG) → CI → GitHub Release com a seção do CHANGELOG.
- **CHANGELOG.md**: Keep a Changelog + Semantic Versioning, mudanças em `[Unreleased]`. Versões `0.x.y` até o app ir para as lojas.
- **Template de PR**: tipo, link da task no Linear, tela no design, checklist de código (traduções, tema, services), qualidade (lint, format, typecheck, testes, Expo Go, claro e escuro), acessibilidade e prints antes/depois.
- **Commits**: `tipo: descrição em inglês` (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`, `version:`).

Detalhes dos workflows e problemas comuns: [CI e releases](CI.md).

### Lançar uma versão

```sh
# mover o [Unreleased] do CHANGELOG para ## [0.1.0] - AAAA-MM-DD
pnpm version 0.1.0 --no-git-tag-version
git commit -am "version: release v0.1.0"
git tag v0.1.0
git push origin main v0.1.0
```

---

## 10. Limites do Expo Go

O Expo Go só roda libs nativas que já vêm dentro dele; todas as da stack são compatíveis. Se um dia precisar de uma lib nativa fora dessa lista, o projeto passa para um development build (`expo-dev-client` + EAS).

---

## Como manter

- Mudou uma pasta, convenção ou lib? Atualize a seção correspondente.
- Mudou um workflow ou script? Atualize as seções 2 e 9.
- Mesma página no Linear: [Organização do projeto](https://linear.app/api-converter/document/organizacao-do-projeto-33e4a1de4502). Mudou aqui, atualize lá também.
