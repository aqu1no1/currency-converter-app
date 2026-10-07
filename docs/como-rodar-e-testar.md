# Como rodar e testar o app

Passo a passo para abrir o app no celular, rodar os testes e conferir tudo antes de abrir uma PR.

[← Voltar para o README](../README.md)

---

## 1. Pré-requisitos

| O quê          | Versão / onde                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Node           | 24                                                                                             |
| pnpm           | a do campo `packageManager` do `package.json` (o Corepack resolve sozinho)                     |
| Expo Go        | Play Store ou App Store, **atualizado** (o projeto usa o SDK 57)                               |
| API (opcional) | [currency-converter-api](https://github.com/aqu1no1/currency-converter-api) rodando na máquina |

O celular e o computador precisam estar **na mesma rede Wi-Fi**.

---

## 2. Primeira vez

```sh
git clone https://github.com/aqu1no1/currency-converter-app.git
cd currency-converter-app
pnpm install
cp .env.example .env
```

No `.env`, troque o IP pelo da sua máquina na rede (o celular não acessa `localhost`):

```sh
hostname -I | awk '{print $1}'   # Linux
ipconfig getifaddr en0           # macOS
```

```env
EXPO_PUBLIC_API_URL=http://192.168.0.42:3000
```

Mudou o `.env`? Reinicie com `pnpm start:clear`: as variáveis `EXPO_PUBLIC_*` entram no bundle na hora de subir.

### Subindo a API

Só é preciso para as telas que buscam dados. Na pasta da API:

```sh
docker compose up -d --build
curl http://localhost:3000/health
```

Do celular, confira abrindo `http://<seu-ip>:3000/health` no navegador. Se não abrir, veja [Problemas comuns](#6-problemas-comuns).

---

## 3. Abrindo no celular

```sh
pnpm start
```

- **Android:** abra o Expo Go e escaneie o QR code do terminal.
- **iPhone:** escaneie com a câmera; ela abre no Expo Go.

No Zed, o mesmo está nas tarefas (`Alt+Shift+T`): **📱 Start (Expo Go)**, **🌐 Start (Tunnel)** e **🧹 Start (Clear Cache)**.

| Comando             | Quando usar                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `pnpm start`        | Dia a dia                                                               |
| `pnpm start:tunnel` | A rede bloqueia a conexão direta (faculdade, VPN, Wi-Fi com isolamento) |
| `pnpm start:clear`  | Depois de mudar o `.env`, aliases, `app.config.ts` ou instalar lib      |

### Atalhos no terminal do Expo

| Tecla | O que faz                                                         |
| ----- | ----------------------------------------------------------------- |
| `r`   | Recarrega o app                                                   |
| `m`   | Abre o menu de desenvolvedor no celular (ou chacoalhe o aparelho) |
| `j`   | Abre o debugger                                                   |
| `?`   | Lista todos os atalhos                                            |

Salvar um arquivo atualiza o app sozinho (Fast Refresh), mantendo o estado da tela.

### O que o Expo Go não mostra

O ícone e a splash que aparecem são os do próprio Expo Go. Os do app só aparecem num development build (`npx expo run:android`, que precisa do Android Studio, ou `eas build`).

---

## 4. Testando à mão

### Tema claro e escuro

Troque o tema do celular (ou em Ajustes, quando a tela existir) e confira as duas versões de cada tela.

### Reduzir movimento

Com a opção ligada, animações como o logo ficam paradas. O app reage na hora, sem precisar reabrir.

- **iPhone:** Ajustes → Acessibilidade → Movimento → **Reduzir Movimento**
- **Android:** Configurações → Acessibilidade → **Remover animações** (no Samsung: Acessibilidade → Melhorias de visibilidade → Reduzir animações)

Desligue depois: vale para o celular inteiro.

### Idioma

Troque o idioma do celular entre português, inglês e espanhol (ou em Ajustes, quando a tela existir). Nenhum texto pode ficar fixo.

### Sem conexão

Pare a API (`docker compose stop api`) ou ligue o modo avião com o app aberto: a tela precisa mostrar o erro e o botão de tentar de novo, sem travar.

### Primeiro acesso

Para ver de novo telas que só aparecem uma vez (como a de Boas-vindas), limpe os dados do app: no menu de desenvolvedor, **Reload** não basta; apague os dados do Expo Go (Android: Configurações → Apps → Expo Go → Armazenamento → Limpar dados) ou reinstale o Expo Go.

---

## 5. Testes automatizados

### Comandos

| Comando                           | O que faz                                     |
| --------------------------------- | --------------------------------------------- |
| `pnpm test`                       | Roda todos os testes                          |
| `pnpm test:watch`                 | Roda de novo a cada arquivo salvo             |
| `pnpm test:cov`                   | Roda com cobertura (relatório em `coverage/`) |
| `pnpm test test/components/brand` | Só os testes de uma pasta                     |
| `pnpm test Logo`                  | Só os arquivos com `Logo` no nome             |
| `pnpm test -t "reduce motion"`    | Só os testes com esse texto no nome           |

O relatório de cobertura em HTML fica em `coverage/lcov-report/index.html`.

### Onde cada teste fica

| Tipo       | Pasta               | Sufixo          | O que testa                                |
| ---------- | ------------------- | --------------- | ------------------------------------------ |
| Unitário   | `test/unit/`        | `.spec.ts`      | utils, DTOs, services, hooks               |
| Componente | `test/components/`  | `.spec.tsx`     | um componente por vez                      |
| Integração | `test/integration/` | `.int-spec.tsx` | tela inteira, com providers e API simulada |

A pasta `test/` espelha a de `src/`: o teste de `src/components/brand/Logo.tsx` fica em `test/components/brand/Logo.spec.tsx`.

### Ferramentas prontas

| Onde                                | Para quê                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `@test/utils/render-with-providers` | `renderWithProviders(<Tela />)`: renderiza com os providers do app           |
| `@test/utils/query-client`          | QueryClient de teste, sem retry e sem cache entre testes                     |
| `@test/utils/fake-api.service`      | `createFakeApiService()`: ApiService falso para injetar nos services         |
| `test/fixtures/`                    | Respostas de exemplo da API                                                  |
| `test/setup/jest.setup.ts`          | Mocks globais: AsyncStorage (limpo a cada teste), expo-localization e fontes |

### Exemplo: componente

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

### Exemplo: service com a API simulada

Os services recebem o `ApiService` no construtor, então o teste passa o falso no lugar e decide a resposta. Nada de rede nem Docker. (Os services chegam com a API-32; o formato é este.)

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

### Exemplo: animação e "reduzir movimento"

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

### Boas práticas

- Busque elementos como o usuário vê: `getByText`, `getByRole`, `getByLabelText`. Use `testID` só quando não houver texto nem rótulo.
- Para o que aparece depois de uma requisição, use `findBy...` (espera) em vez de `getBy...`.
- Aviso de `act(...)` no console é sinal de atualização de estado que o teste não esperou: envolva em `await act(async () => {})` ou use `findBy...`.
- Nomes dos testes em inglês, descrevendo o comportamento (`'shows the error when the api fails'`).

---

## 6. Antes de abrir uma PR

```sh
pnpm pr
```

Roda o mesmo que o CI: lint, format, typecheck, testes com cobertura e Expo Doctor. Se o lint ou o format reclamar:

```sh
pnpm lint:fix
pnpm format
```

Depois, preencha o checklist do template de PR (inclui testar no Expo Go, nos temas claro e escuro). Detalhes do CI em [CI e releases](CI.md).

---

## 7. Problemas comuns

| Problema                                               | Como resolver                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| O Expo Go não conecta / fica carregando                | Confira se estão na mesma rede; senão, `pnpm start:tunnel`                                                                |
| Firewall bloqueando (Linux)                            | `sudo ufw allow 8081/tcp` (Metro) e `sudo ufw allow 3000/tcp` (API)                                                       |
| "Project is incompatible with this version of Expo Go" | Atualize o Expo Go na loja                                                                                                |
| O app não acha a API                                   | IP errado no `.env` ou API parada; teste `http://<seu-ip>:3000/health` no navegador do celular, depois `pnpm start:clear` |
| Mudança no `.env` ou nos aliases não aparece           | `pnpm start:clear`                                                                                                        |
| `Unable to resolve module`                             | `pnpm install` e `pnpm start:clear`; se persistir, `node-linker=hoisted` no `.npmrc`                                      |
| Expo Doctor reclama de versão                          | `pnpm expo install --fix`                                                                                                 |
| `pnpm doctor` mostra checks do pnpm, não do Expo       | Use `pnpm run doctor` (sem `run`, cai no doctor do próprio pnpm)                                                          |
| Teste passa sozinho e falha com os outros              | Estado vazando entre testes: restaure mocks (`jest.restoreAllMocks()`) e timers no `afterEach`                            |
