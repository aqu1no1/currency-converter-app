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
| EAS (builds)   | conta grátis em [expo.dev](https://expo.dev/signup) e `npm i -g eas-cli` (só para gerar APKs)  |

O celular e o computador precisam estar **na mesma rede Wi-Fi**.

---

## 2. Variantes: beta e production

O app tem duas variantes, escolhidas pela variável `APP_VARIANT` nos scripts:

| Variante     | Para quê                                    | Arquivo de env | Nome no app    | Scheme                  |
| ------------ | ------------------------------------------- | -------------- | -------------- | ----------------------- |
| `beta`       | Desenvolvimento, apontando para a API local | `.env`         | Converter Beta | `currencyconverterbeta` |
| `production` | A API publicada (quando existir)            | `.env`         | Converter      | `currencyconverter`     |

O `app.config.ts` carrega sempre o único arquivo `.env`. `APP_VARIANT` continua selecionando apenas o nome, scheme e identificador do app; ela não troca a URL da API. A variante fica em `Constants.expoConfig.extra.variant`. Se um build precisar usar uma API diferente, defina `EXPO_PUBLIC_API_URL` no ambiente do build; essa variável tem precedência sobre o `.env`.

O `.env` fica fora do Git; o modelo é o `.env.example`. Ele também não sobe para os builds do EAS, que usam as variáveis cadastradas no próprio EAS (veja [Builds com EAS](#5-builds-com-eas)).

---

## 3. Primeira vez

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

### Subindo a API

Só é preciso para as telas que buscam dados. Na pasta da API:

```sh
docker compose up -d --build
curl http://localhost:3000/health
```

Do celular, confira abrindo `http://<seu-ip>:3000/health` no navegador. Se não abrir, veja [Problemas comuns](#7-problemas-comuns).

---

## 4. Abrindo no celular

O jeito do dia a dia:

```sh
pnpm start:beta -c
```

O `-c` (`--clear`) limpa o cache do Metro, então mudanças no `.env`, nos aliases ou no `app.config.ts` sempre entram. Depois:

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

O ícone, a splash e o nome que aparecem são os do próprio Expo Go. Os do app (ícone do Converter e nome "Converter Beta") só aparecem num development build: veja [Builds com EAS](#5-builds-com-eas).

---

## 5. Builds com EAS

Para ter o app instalado com o ícone, a splash e o nome do Converter, os builds são gerados no [EAS Build](https://docs.expo.dev/build/introduction/), a nuvem da Expo (plano grátis). Não precisa de Android Studio, Android SDK nem JDK na máquina. Por enquanto só Android.

### Os três tipos

|                      | Onde roda o JavaScript      | De onde vem a `EXPO_PUBLIC_API_URL`        |
| -------------------- | --------------------------- | ------------------------------------------ |
| Expo Go              | No Metro, no seu computador | Do `.env` local                            |
| Development build    | No Metro, no seu computador | Do `.env` local (o JS continua vindo dele) |
| Preview / production | Embutido no APK             | Das variáveis do EAS, gravadas no build    |

As variáveis `EXPO_PUBLIC_*` são copiadas para dentro do app no momento do build. Como o `.env` está no `.gitignore`, ele não sobe para o EAS; por isso os builds de preview e production precisam da variável cadastrada no EAS. Sem ela, o `app.config.ts` interrompe o build com `Missing EXPO_PUBLIC_API_URL`.

### Perfis (`eas.json`)

| Perfil             | Script                    | Para quê                                                              | Variante     | Ambiente do EAS | Saída |
| ------------------ | ------------------------- | --------------------------------------------------------------------- | ------------ | --------------- | ----- |
| `development-beta` | `pnpm build:dev:beta`     | Substitui o Expo Go no dia a dia, com Fast Refresh e menu de debug    | `beta`       | `development`   | APK   |
| `preview-beta`     | `pnpm build:preview:beta` | App completo, sem Metro, para testar como se fosse da loja ou mostrar | `beta`       | `preview`       | APK   |
| `production`       | `pnpm build:android`      | Reservado para as lojas (ainda não é gerado)                          | `production` | `production`    | AAB   |

- `env` de cada perfil define o `APP_VARIANT` (nome, scheme, pacote e ícone do app).
- `environment` escolhe de qual ambiente do EAS vêm as variáveis, como a `EXPO_PUBLIC_API_URL`.
- `appVersionSource: "remote"`: o EAS controla e sobe sozinho o número interno do build (`versionCode`). A versão que o usuário vê continua vindo do `package.json`.

### Primeira vez

1. Crie a conta em [expo.dev](https://expo.dev/signup) e instale o CLI:

   ```sh
   npm i -g eas-cli
   eas login        # ou: eas login --device, que confirma pelo navegador
   eas whoami
   ```

2. O projeto já está ligado ao EAS pelo `owner`, `slug` e `extra.eas.projectId` no `app.config.ts`. Como a configuração é dinâmica, o `eas init` não consegue escrever nela: se um dia precisar ligar a outro projeto, ele mostra os valores e você coloca à mão.

3. Cadastre a URL da API em cada ambiente usado (os valores ficam na sua conta da Expo, não no Git):

   ```sh
   eas env:create --environment development --name EXPO_PUBLIC_API_URL --value http://<seu-ip>:3000 --visibility plaintext
   eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value http://<seu-ip>:3000 --visibility plaintext
   eas env:list --environment preview
   ```

   `plaintext` porque tudo que é `EXPO_PUBLIC_` fica visível dentro do app de qualquer jeito. Para trocar o valor depois: `eas env:update`.

### Gerando e instalando

```sh
pnpm build:dev:beta       # ou pnpm build:preview:beta
```

- Na primeira vez, o EAS pergunta se pode gerar um **keystore** do Android: responda que sim. Ele guarda a chave de assinatura na sua conta.
- O upload respeita o `.gitignore`: `.env`, `node_modules/` e `coverage/` não sobem.
- O build leva uns 10 a 20 minutos na fila grátis. Dá para acompanhar o log pelo link do terminal ou em expo.dev → projeto **converter** → Builds.
- No fim aparecem um link e um QR code. Abra no celular, baixe o APK e permita instalar de "fontes desconhecidas".

### Usando o development build

```sh
pnpm start:beta -c
```

Abra o app **Converter Beta** (não o Expo Go). Com `launchMode: "most-recent"`, ele conecta direto no último servidor; na primeira vez, escolha o servidor que aparece na lista ou escaneie o QR code do terminal. Fast Refresh e o menu de desenvolvedor funcionam como no Expo Go.

Só é preciso gerar outro development build quando mudar algo nativo: uma lib com código nativo, um plugin ou o `app.config.ts`. Mudanças só de JavaScript e no `.env` entram pelo Metro.

### API em HTTP

O Android bloqueia `http://` em builds de release, como o preview. Enquanto a API for o IP da máquina, o `expo-build-properties` libera HTTP **só na variante beta** (`usesCleartextTraffic`). A production continua exigindo HTTPS.

Com o IP local, o APK de preview só funciona **na mesma Wi-Fi** e com a API rodando no computador. Quando a API for publicada com HTTPS, troque a variável no EAS (`eas env:update`) e gere o APK de novo, sem mudar o código.

---

## 6. Conferindo à mão

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

Para ver de novo telas que só aparecem uma vez (como a de Boas-vindas), limpe os dados do Expo Go (Android: Configurações → Apps → Expo Go → Armazenamento → Limpar dados) ou reinstale o Expo Go. No development build, faça o mesmo com o app Converter Beta. **Reload** não basta, porque o AsyncStorage continua salvo.

---

## 7. Problemas comuns

| Problema                                               | Como resolver                                                                                                  |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| O Expo Go não conecta / fica carregando                | Confira se estão na mesma rede; senão, `pnpm start:tunnel`                                                     |
| Firewall bloqueando (Linux)                            | `sudo ufw allow 8081/tcp` (Metro) e `sudo ufw allow 3000/tcp` (API)                                            |
| "Project is incompatible with this version of Expo Go" | Atualize o Expo Go na loja                                                                                     |
| O app não acha a API                                   | IP errado no `.env` ou API parada; teste `http://<seu-ip>:3000/health` no navegador do celular e suba com `-c` |
| Mudança no `.env` não aparece                          | Suba com `pnpm start:beta -c` para limpar o cache do Metro                                                     |
| `Unable to resolve module`                             | `pnpm install` e `pnpm start:beta -c`; se persistir, `node-linker=hoisted` no `.npmrc`                         |
| Expo Doctor reclama de versão                          | `pnpm expo install --fix`                                                                                      |
| `pnpm doctor` mostra checks do pnpm, não do Expo       | Use `pnpm run doctor` (sem `run`, cai no doctor do próprio pnpm)                                               |
| Build do EAS falha com `Missing EXPO_PUBLIC_API_URL`   | A variável não está no ambiente do perfil: `eas env:list --environment <ambiente>`                             |
| Build do EAS falha no `pnpm install`                   | A nuvem usou outra versão do pnpm: adicione `"pnpm": "<versão do packageManager>"` ao perfil no `eas.json`     |
| APK de preview abre mas não carrega as cotações        | API parada, IP errado no EAS, celular em outra rede, ou API `http://` num build sem `usesCleartextTraffic`     |
| `eas init` reclama de slug diferente                   | O `slug` do `app.config.ts` tem que ser igual ao do projeto em expo.dev (hoje, `converter`)                    |
