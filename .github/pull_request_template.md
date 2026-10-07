# Pull Request

## 📌 Descrição

<!-- Descreva claramente o que esta PR faz. -->

---

## 🏷 Tipo de PR

Marque uma opção:

- [ ] 🐛 Bugfix
- [ ] ✨ Feature
- [ ] ♻️ Refactor
- [ ] ⚡ Performance
- [ ] 🧪 Testes
- [ ] 📚 Documentação
- [ ] 🔧 Chore
- [ ] 🚨 Hotfix

---

## 🔗 Links Relacionados

- Task no Linear:

- Tela no design:

---

## 🧠 Contexto

<!-- Explique o problema que esta PR resolve. -->

---

## 📋 Checklist

### Código

- [ ] Código segue os padrões do projeto (pastas, nomes de arquivo e imports por alias)
- [ ] Não há `console.log` desnecessários
- [ ] Não há código comentado desnecessário
- [ ] Componentes novos têm JSDoc nas props e no componente; o resto do código fica sem comentários
- [ ] Nenhum texto fixo na tela: tudo passa pelo `t()` e está em `pt-BR`, `en` e `es`
- [ ] Cores vêm do `useTheme()` (tokens semânticos, nada de hex fixo nem `colors.*` no `StyleSheet.create`)
- [ ] Chamadas à API passam por um service e um hook do TanStack Query, com a resposta validada pelo Zod
- [ ] Tempos usam as constantes de `time.constants.ts`

### Qualidade

- [ ] Rodei o linter (`pnpm lint`)
- [ ] Rodei o formatter (`pnpm format`)
- [ ] Typecheck passou (`pnpm typecheck`)
- [ ] Testes passaram localmente (`pnpm test`)
- [ ] Adicionei ou atualizei os testes da mudança
- [ ] Testei no Expo Go
- [ ] Conferi no tema claro e no escuro
- [ ] Atualizei o `CHANGELOG.md` em `[Unreleased]` (se a mudança afeta quem usa o app)
- [ ] Atualizei a documentação (`README.md`, `docs/`), se aplicável

### Acessibilidade

- [ ] Elementos tocáveis têm `accessibilityRole` e `accessibilityLabel`
- [ ] Área de toque mínima de 44
- [ ] Contraste de texto ok nos dois temas

### Variáveis de ambiente (se aplicável)

- [ ] Adicionei ao `.env.example` e ao `types/env.d.ts`
- [ ] Nada secreto em variável `EXPO_PUBLIC_*`

---

## 📸 Evidências (se aplicável)

<!-- Prints ou vídeos antes/depois, nos temas claro e escuro. -->

| Antes | Depois |
| ----- | ------ |
|       |        |

---

## 🚀 Observações adicionais

<!-- Informações extras relevantes. -->
