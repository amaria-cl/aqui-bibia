# 💙 Aqui, Bibia

Painel pessoal de organização: treinos, dieta, estudos, agenda e recados.

## Como rodar

Abra o `index.html` com o **Live Server** do VS Code (ou direto no navegador).
Funciona imediatamente: enquanto o Firebase não estiver configurado, os dados
ficam salvos no próprio navegador (localStorage).

## Como conectar o Firebase

1. Acesse https://console.firebase.google.com e crie um projeto
2. Adicione um **App da Web** (ícone `</>`) e copie o objeto `firebaseConfig`
3. Cole as credenciais em `src/js/firebase.js` (substituindo os `COLE_AQUI`)
4. No console do Firebase, ative o **Firestore Database**
   (não precisa do Storage — veja a nota sobre fotos abaixo)
5. Em **Authentication → Sign-in method**, ative o provedor **Anônimo**
6. Em **Firestore Database → Regras**, cole apenas isto e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

7. Se for hospedar (ex: GitHub Pages), adicione o domínio do site
   em **Authentication → Settings → Authorized domains**

Pronto! A partir daí tudo (inclusive as fotos) é salvo na nuvem
e sincroniza entre o celular e o computador.

## 📸 Sobre as fotos (importante)

O plano gratuito do Firebase (Spark) não libera mais o Storage
para projetos novos. Por isso, as fotos são comprimidas no
navegador e salvas direto no **Firestore**, na coleção `fotos` —
totalmente de graça (1GB ≈ milhares de fotos).

Se um dia você fizer upgrade para o plano Blaze e quiser usar o
Storage, basta mudar `USAR_STORAGE` para `true` no
`src/js/firebase.js` e publicar estas regras na aba
**Storage → Regras**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Estrutura

```
index.html            → dashboard (resumo do dia, streak, mensagem)
pages/
  treinos.html        → "Treinei hoje", streak, foto do treino
  dieta.html          → checklist diário + fotos das refeições
  estudos.html        → registro de matéria e tempo
  agenda.html         → calendário mensal/anual + compromissos
  recados.html        → recados e mensagens motivacionais
src/css/style.css     → estilos (mobile-first, azul e roxo)
src/js/
  firebase.js         → conexão Firebase (CDN) + fallback local
  app.js              → utilidades compartilhadas + dashboard
  treinos.js / dieta.js / estudos.js / agenda.js / recados.js
```

## Onde os dados ficam

| Coleção   | Documento                                            |
|-----------|------------------------------------------------------|
| `treinos` | id = data → `{ data, fotoUrl }`                      |
| `dieta`   | id = data → `{ cafe, almoco, jantar, agua, fotos[] }`|
| `estudos` | id automático → `{ materia, minutos, data }`         |
| `agenda`  | id automático → `{ titulo, data, hora, descricao }`  |
| `recados` | id automático → `{ texto, criadoEm }`                |

Fotos: coleção `fotos` no Firestore → `{ pasta, base64, criadoEm }`
(comprimidas automaticamente antes de salvar). Nos documentos de
treino/dieta fica só a referência `foto:ID`.
