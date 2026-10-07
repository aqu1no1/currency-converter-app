# Testes

Como os testes automatizados do app funcionam, onde cada um fica, como rodar e como escrever. Para abrir o app e conferir à mão, veja [Como rodar o app](como-rodar.md).

[← Voltar para o README](../README.md)

---

## 1. Visão geral

| Ferramenta                                               | Papel                                                           |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| **Jest** 29 com o preset **`jest-expo`**                 | Roda os testes, já com os mocks dos módulos nativos do Expo     |
| **Testing Library** (`@testing-library/react-native` 13) | Renderiza componentes e busca elementos como o usuário vê       |
| `react-test-renderer` 19.2.3                             | Usado pela Testing Library; precisa ser a mesma versão do React |

As versões são as que o SDK 57 espera (`pnpm expo install --check`). A Testing Library fica na 13 porque a 14 pede React 19.3.

Nada roda em celular nem emulador: os testes rodam no Node, com os componentes nativos simulados. Também não precisam de rede, Docker nem da API: a API é simulada.

---

## 2. Comandos

| Comando                           | O que faz                                     |
| --------------------------------- | --------------------------------------------- |
| `pnpm test`                       | Roda todos os testes                          |
| `pnpm test:watch`                 | Roda de novo a cada arquivo salvo             |
| `pnpm test:cov`                   | Roda com cobertura (relatório em `coverage/`) |
| `pnpm test test/components/brand` | Só os testes de uma pasta                     |
| `pnpm test Logo`                  | Só os arquivos com `Logo` no nome             |
| `pnpm test -t "reduce motion"`    | Só os testes com esse texto no nome           |

O relatório de cobertura em HTML fica em `coverage/lcov-report/index.html`. No Zed, as tarefas **🧪 Test** e **📊 Test Coverage** fazem o mesmo.

---

## 3. Estrutura

A pasta `test/` fica fora do `src/` e espelha a estrutura dele: o teste de `src/components/brand/Logo.tsx` fica em `test/components/brand/Logo.spec.tsx`.

```
test/
├── unit/          # utils, DTOs, services, hooks (*.spec.ts)
├── components/    # um componente por vez (*.spec.tsx)
├── integration/   # tela inteira com providers e API simulada (*.int-spec.tsx)
├── e2e/           # fluxos no celular com Maestro (para depois)
├── setup/         # jest.setup.ts: mocks globais
├── fixtures/      # respostas de exemplo da API
└── utils/         # renderWithProviders, QueryClient de teste, ApiService falso
```

| Tipo       | Pasta               | Sufixo          | O que testa                                |
| ---------- | ------------------- | --------------- | ------------------------------------------ |
| Unitário   | `test/unit/`        | `.spec.ts`      | utils, DTOs, services, hooks               |
| Componente | `test/components/`  | `.spec.tsx`     | um componente por vez                      |
| Integração | `test/integration/` | `.int-spec.tsx` | tela inteira, com providers e API simulada |

---

## 4. Como a configuração funciona

### `jest.config.js`

| Opção                 | Valor                                       | Por quê                                                             |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| `preset`              | `jest-expo`                                 | Transforma o código com o Babel do Expo e simula os módulos nativos |
| `roots`               | `<rootDir>/test`                            | Só procura testes na pasta `test/`                                  |
| `testMatch`           | `*.spec.ts`, `*.spec.tsx`, `*.int-spec.tsx` | Os três tipos de teste                                              |
| `setupFilesAfterEnv`  | `test/setup/jest.setup.ts`                  | Mocks globais carregados antes de cada arquivo                      |
| `moduleNameMapper`    | `@components/...` → `src/components/...`    | Os mesmos aliases do `tsconfig.json`, mais `@test/*` → `test/*`     |
| `collectCoverageFrom` | `src/**`, menos `src/app/**` e `index.ts`   | Telas entram pelos testes de integração, não pela cobertura         |
| `maxWorkers`          | `4`                                         | Limite de processos em paralelo, igual em todo lugar                |

Alias novo no `tsconfig.json`? Ele entra sozinho no Jest se for uma pasta de `src/` listada no `jest.config.js`; senão, adicione lá também.

### `test/setup/jest.setup.ts`

Mocks que valem para todos os testes:

| Mock                    | O que faz                                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AsyncStorage            | Usa o mock oficial em memória, **limpo antes de cada teste**                                                                                           |
| `expo-localization`     | O celular "está" em pt-BR, fuso de São Paulo                                                                                                           |
| `react-native-worklets` | Mock dos worklets + `setUpTests()` do Reanimated, para animações com `useSharedValue` rodarem no Node (o estilo animado é lido com `getAnimatedStyle`) |
| `expo-font`             | As fontes contam como carregadas, para o `@expo/vector-icons` não atualizar estado depois do render (aviso de `act(...)`)                              |

### Tipos

O `tsconfig.json` tem `"types": ["jest"]`, então `describe`, `it`, `expect` e `jest` funcionam sem import e o `pnpm typecheck` também confere os testes.

---

## 5. Ferramentas prontas

| Import                              | Para quê                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `@test/utils/render-with-providers` | `renderWithProviders(<Tela />)`: renderiza com os providers do app       |
| `@test/utils/query-client`          | `createTestQueryClient()`: sem retry e sem coletar cache durante o teste |
| `@test/utils/fake-api.service`      | `createFakeApiService()`: ApiService falso, cada método é um `jest.fn()` |
| `test/fixtures/`                    | Respostas de exemplo da API                                              |

Hoje o `renderWithProviders` só tem o React Query. Tema e traduções entram quando existirem (API-30 e API-31), e todo teste que usa o helper passa a ter os dois sem mudar nada.

### Como a API é simulada

Os services recebem o `ApiService` no construtor. No teste, o service recebe o `createFakeApiService()` no lugar, e cada teste decide a resposta com `mockResolvedValueOnce` (sucesso) ou `mockRejectedValueOnce` (erro). Sem rede, sem Docker, e dá para conferir com que URL e parâmetros o service chamou a API.

---

## 6. Exemplos

### Componente

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { render, screen } from '@testing-library/react-native';

import { Icon } from '@components/icons/Icon';

describe('Icon', () => {
  it('uses the color passed by prop', () => {
    render(<Icon name="close" color="#9FE1CB" />);

    expect(screen.UNSAFE_getByType(MaterialCommunityIcons).props.color).toBe('#9FE1CB');
  });
});
```

### Service com a API simulada

Os services chegam com a API-32; o formato é este.

```ts
import { CurrencyService } from '@services/currency.service';
import { createFakeApiService } from '@test/utils/fake-api.service';

it('lists the supported currencies', async () => {
  const api = createFakeApiService();
  api.get.mockResolvedValueOnce([{ code: 'BRL', name: 'Real' }]);

  const currencies = await new CurrencyService(api).list();

  expect(api.get).toHaveBeenCalledWith('/currencies', expect.anything());
  expect(currencies).toEqual([{ code: 'BRL', name: 'Real' }]);
});
```

### Animação e "reduzir movimento"

Com `jest.useFakeTimers()`, o tempo só anda quando o teste manda (`advanceTimersByTime`), então dá para testar uma animação de 10 s instantaneamente.

```tsx
import { AccessibilityInfo } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';

import { Logo } from '@components/brand/Logo';
import { TIME_IN_MS } from '@constants/time.constants';

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it('stays still with reduce motion on', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  render(<Logo />);
  await act(async () => {});

  await act(async () => {
    jest.advanceTimersByTime(10 * TIME_IN_MS.SECOND);
  });

  expect(screen.getByTestId('logo-currency-BRL')).toBeTruthy();
});
```

### Tela inteira (integração)

Para quando as telas usarem dados: renderiza a tela com `renderWithProviders`, simula a API e confere o que aparece e para onde os botões levam (`expo-router/testing-library` tem `renderRouter` para testar a navegação).

---

## 7. Boas práticas

- Busque elementos como o usuário vê: `getByText`, `getByRole`, `getByLabelText`. Use `testID` só quando não houver texto nem rótulo.
- Para o que aparece depois de uma requisição ou de um `await`, use `findBy...` (espera) em vez de `getBy...`.
- Para conferir que algo **não** está na tela, use `queryBy...` (devolve `null` em vez de lançar erro).
- Aviso de `act(...)` no console é atualização de estado que o teste não esperou: envolva em `await act(async () => {})` ou use `findBy...`.
- Restaure mocks e timers no `afterEach` (`jest.restoreAllMocks()`, `jest.useRealTimers()`): senão um teste vaza estado para o outro.
- Um comportamento por teste, com o nome em inglês descrevendo o comportamento (`'shows the error when the api fails'`).
- Teste o que o usuário percebe (texto, navegação, estado da tela), não detalhes internos (estado do componente, nome de função).

---

## 8. No CI e antes da PR

```sh
pnpm pr
```

Roda lint, format, typecheck, `pnpm test:cov` e o Expo Doctor, o mesmo que o CI roda em todo push e PR na `main`. No CI, o relatório de cobertura fica como artefato do job **Testes** por 7 dias. Detalhes em [CI e releases](CI.md).

---

## 9. Problemas comuns

| Problema                                  | Causa e solução                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `Cannot find module '@algo/...'`          | Alias que não está no `moduleNameMapper` do `jest.config.js`                      |
| Aviso de `act(...)`                       | Estado atualizado depois do teste; use `findBy...` ou `await act(async () => {})` |
| Teste passa sozinho e falha com os outros | Estado vazando: restaure mocks e timers no `afterEach`                            |
| Teste com animação nunca termina          | Faltou `jest.useFakeTimers()` e `advanceTimersByTime`                             |
| Erro de sintaxe vindo de `node_modules`   | Lib publicada sem compilar; adicione ao `transformIgnorePatterns` do `jest-expo`  |
| `describe is not defined` no typecheck    | Faltou `"types": ["jest"]` no `tsconfig.json`                                     |
