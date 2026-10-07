# Como rodar o app

Passo a passo para abrir o app no celular e conferir as telas à mão. Os testes automatizados estão em [Testes](testes.md).

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

## 2. Variantes: beta e production

O app tem duas variantes, escolhidas pela variável `APP_VARIANT` nos scripts (mesmo esquema do tchin-app):

| Variante     | Para quê                                    | Arquivo de env    | Nome no app        | Scheme                  |
| ------------ | ------------------------------------------- | ----------------- | ------------------ | ----------------------- |
| `beta`       | Desenvolvimento, apontando para a API local | `.env.beta`       | App Converter Beta | `currencyconverterbeta` |
| `production` | A API publicada (quando existir)            | `.env.production` | App Converter      | `currencyconverter`     |

O `app.config.ts` lê o `APP_VARIANT`, carrega o `.env.<variante>` (que vence o `.env`, se existir) e ajusta nome, scheme e identificador do app. A variante fica em `Constants.expoConfig.extra.variant`.

Os dois arquivos ficam fora do Git; o modelo é o `.env.example`.

---

## 3. Primeira vez

```sh
git clone https://github.com/aqu1no1/currency-converter-app.git
cd currency-converter-app
pnpm install
cp .env.example .env.beta
```

No `.env.beta`, troque o IP pelo da sua máquina na rede (o celular não acessa `localhost`):

```sh
hostname -I | awk '{print $1}'   # Linux
ipconfig getifaddr en0           # macOS
```

```env
EXPO_PUBLIC_API_URL=http://192.168.0.42:3000
```

### Subindo a API

Só é preciso para as telas que buscam dados. Na pasta da API:

```sh
docker compose up -d --build
curl http://localhost:3000/health
```

Do celular, confira abrindo `http://<seu-ip>:3000/health` no navegador. Se não abrir, veja [Problemas comuns](#6-problemas-comuns).

---

## 4. Abrindo no celular

O jeito do dia a dia:

```sh
pnpm start:beta -c
```

O `-c` (`--clear`) limpa o cache do Metro, então mudanças no `.env.beta`, nos aliases ou no `app.config.ts` sempre entram. Depois:

- **Android:** abra o Expo Go e escaneie o QR code do terminal.
- **iPhone:** escaneie com a câmera; ela abre no Expo Go.

No Zed, o mesmo está nas tarefas (`Alt+Shift+T`): **🧪 Start Beta (Expo Go)**.

| Comando                               | Quando usar                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm start:beta -c`                  | Dia a dia: variante beta, cache limpo                                                |
| `pnpm start:beta`                     | Mesmo, sem limpar o cache (sobe mais rápido)                                         |
| `pnpm start:tunnel`                   | Beta, quando a rede bloqueia a conexão direta (faculdade, VPN, Wi-Fi com isolamento) |
| `pnpm start`                          | Variante production                                                                  |
| `pnpm android:beta` / `pnpm ios:beta` | Beta abrindo direto no emulador                                                      |

Qualquer opção do `expo start` pode ir no fim: `pnpm start:beta -c --tunnel`.

### Atalhos no terminal do Expo

| Tecla | O que faz                                                         |
| ----- | ----------------------------------------------------------------- |
| `r`   | Recarrega o app                                                   |
| `m`   | Abre o menu de desenvolvedor no celular (ou chacoalhe o aparelho) |
| `j`   | Abre o debugger                                                   |
| `?`   | Lista todos os atalhos                                            |

Salvar um arquivo atualiza o app sozinho (Fast Refresh), mantendo o estado da tela.

### O que o Expo Go não mostra

O ícone, a splash e o nome "App Converter Beta" que aparecem são os do próprio Expo Go. Os do app só aparecem num development build (`npx expo run:android`, que precisa do Android Studio, ou `eas build`).

---

## 5. Conferindo à mão

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

Para ver de novo telas que só aparecem uma vez (como a de Boas-vindas), limpe os dados do Expo Go (Android: Configurações → Apps → Expo Go → Armazenamento → Limpar dados) ou reinstale o Expo Go. **Reload** não basta, porque o AsyncStorage continua salvo.

---

## 6. Problemas comuns

| Problema                                               | Como resolver                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| O Expo Go não conecta / fica carregando                | Confira se estão na mesma rede; senão, `pnpm start:tunnel`                                                          |
| Firewall bloqueando (Linux)                            | `sudo ufw allow 8081/tcp` (Metro) e `sudo ufw allow 3000/tcp` (API)                                                 |
| "Project is incompatible with this version of Expo Go" | Atualize o Expo Go na loja                                                                                          |
| O app não acha a API                                   | IP errado no `.env.beta` ou API parada; teste `http://<seu-ip>:3000/health` no navegador do celular e suba com `-c` |
| Mudança no `.env.beta` não aparece                     | Suba com `pnpm start:beta -c`; confira se não está rodando `pnpm start` (production)                                |
| `Unable to resolve module`                             | `pnpm install` e `pnpm start:beta -c`; se persistir, `node-linker=hoisted` no `.npmrc`                              |
| Expo Doctor reclama de versão                          | `pnpm expo install --fix`                                                                                           |
| `pnpm doctor` mostra checks do pnpm, não do Expo       | Use `pnpm run doctor` (sem `run`, cai no doctor do próprio pnpm)                                                    |
