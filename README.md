# currency-converter-app

App mobile do **App Converter**, feito com React Native + Expo (Expo Go) e TypeScript. Consome a [currency-converter-api](https://github.com/aqu1no1/currency-converter-api).

## Como rodar

Pré-requisitos: Node 24, pnpm e o app **Expo Go** no celular.

```sh
pnpm install
cp .env.example .env   # coloque o IP da máquina em EXPO_PUBLIC_API_URL
pnpm start             # escaneie o QR code com o Expo Go
```

O celular não acessa `localhost`: use o IP da máquina na rede. Tudo que começa com `EXPO_PUBLIC_` fica visível no app, então nada secreto vai ali.

## Instalando libs

- Lib com código nativo: `pnpm expo install <lib>`
- Lib só JavaScript: `pnpm add <lib>` (desenvolvimento: `pnpm add -D <lib>`)
- Nunca usar npm ou yarn: o projeto só tem o `pnpm-lock.yaml`.

## Estrutura

```
src/
├── app/           # rotas (expo-router): cada arquivo é uma tela
├── components/    # componentes compartilhados
├── hooks/         # hooks customizados
├── services/      # ApiService + uma classe por recurso da API
├── contexts/      # contexts de domínio (preferências)
├── theme/         # ThemeProvider + useTheme
├── constants/     # tema, storage, tempo
├── dtos/          # schemas Zod das respostas da API
├── models/        # modelos de domínio
├── interfaces/    # interfaces e classes genéricas
├── enums/         # enums
├── utils/         # funções utilitárias
├── lib/           # configuração de libs (react-query, i18n)
├── locales/       # traduções
└── assets/        # imagens e logo
types/             # declarações globais (.d.ts)
```

Cada pasta tem um alias com o mesmo nome (`@components`, `@services`, `@constants`...). Sempre importe pelo alias:

```ts
import { TIME_IN_MS } from '@constants/time.constants';
```

## Documentação

- [Organização do projeto](docs/organizacao-do-projeto.md): stack, pastas, convenções, tema, traduções e testes
- [CI e releases](docs/CI.md)
- [CHANGELOG](CHANGELOG.md)
