/* =====================================================
   AQUI, BIBIA — Conexão com o Firebase (via CDN)
   =====================================================
   COMO CONFIGURAR (5 minutos):
   1. Acesse https://console.firebase.google.com
   2. Crie um projeto e adicione um "App da Web" (ícone </>)
   3. Copie o objeto firebaseConfig que aparece e cole abaixo
   4. No console, ative o Firestore Database
   5. Em Authentication → Sign-in method, ative "Anônimo"

   FOTOS:
   No plano gratuito (Spark), o Firebase não libera mais o
   Storage. Por isso as fotos são comprimidas e salvas no
   próprio Firestore (coleção "fotos") — de graça. 📸
   Se um dia você fizer upgrade pro plano Blaze e quiser
   usar o Storage, é só mudar USAR_STORAGE para true.

   ENQUANTO NÃO CONFIGURAR NADA:
   Tudo é salvo no próprio navegador (localStorage),
   então dá pra testar o site inteiro agora mesmo. 💙
   ===================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyBg5RYh0UW_qHMc0Y944iQGLO-vrdQlYwI",
    authDomain: "aqui-bia.firebaseapp.com",
    projectId: "aqui-bia",
    storageBucket: "aqui-bia.firebasestorage.app",
    messagingSenderId: "851120171925",
    appId: "1:851120171925:web:cf404ac2d5c4ba976f249c"
};

// true apenas se o projeto estiver no plano Blaze com Storage ativo
const USAR_STORAGE = false;

const usandoFirebase =
    typeof firebase !== "undefined" &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith("COLE_");

let _db = null;
let _storage = null;

if (usandoFirebase) {
    firebase.initializeApp(firebaseConfig);
    _db = firebase.firestore();

    if (USAR_STORAGE && firebase.storage) {
        _storage = firebase.storage();
    }

    // Login anônimo (necessário para as regras de segurança)
    if (firebase.auth) {
        firebase.auth().signInAnonymously().catch(function (err) {
            window._fbErroAuth = err.code || "erro";
        });
    }
}

/* Traduz erros comuns pra mensagens que ajudam a resolver */
function _msgErroFirebase(codigo) {
    if (!codigo) return "";
    if (codigo.indexOf("operation-not-allowed") >= 0 ||
        codigo.indexOf("admin-restricted") >= 0)
        return "⚠️ Ative o login Anônimo (Authentication → Sign-in method)";
    if (codigo.indexOf("unauthorized-domain") >= 0)
        return "⚠️ Domínio não autorizado (Authentication → Settings → Authorized domains)";
    if (codigo.indexOf("permission-denied") >= 0)
        return "⚠️ Sem permissão: confira as Regras do Firestore e o login Anônimo";
    if (codigo.indexOf("not-found") >= 0 || codigo.indexOf("failed-precondition") >= 0)
        return "⚠️ Crie o banco: Firestore Database → Criar banco de dados";
    return "⚠️ Erro: " + codigo;
}

/* -----------------------------------------------------
   INDICADOR DE STATUS (cantinho da tela)
   ☁️ verde  = conectado ao Firebase (dados na nuvem)
   📴 cinza  = modo local (dados só neste aparelho)
   ----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
    const badge = document.createElement("div");
    badge.className = "status-firebase";
    badge.textContent = "📴 Modo local";
    document.body.appendChild(badge);

    if (!usandoFirebase) return;
    window._badgeFirebase = badge;

    // Só fica verde quando o login anônimo realmente funcionar
    if (firebase.auth) {
        badge.textContent = "⏳ Conectando...";
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                badge.textContent = "☁️ Conectado";
                badge.classList.add("online");
            } else {
                badge.classList.remove("online");
                badge.textContent = window._fbErroAuth
                    ? _msgErroFirebase(window._fbErroAuth)
                    : "⏳ Conectando...";
            }
        });

        // Se em 6s nada aconteceu, mostra o erro (ou orientação)
        setTimeout(function () {
            if (!firebase.auth().currentUser) {
                badge.textContent = window._fbErroAuth
                    ? _msgErroFirebase(window._fbErroAuth)
                    : "⚠️ Não conectou: confira o login Anônimo no console";
                badge.classList.add("erro");
            }
        }, 6000);
    } else {
        badge.textContent = "☁️ Conectado";
        badge.classList.add("online");
    }
});

/* Quando uma operação do banco falha, mostra o motivo */
function _avisarErroDB(e) {
    const msg = _msgErroFirebase(e && e.code ? e.code : String(e));
    if (typeof toast === "function") toast(msg || "Erro ao acessar o banco 😢");
    if (window._badgeFirebase && msg) {
        window._badgeFirebase.textContent = msg;
        window._badgeFirebase.classList.remove("online");
        window._badgeFirebase.classList.add("erro");
    }
}

/* -----------------------------------------------------
   API ÚNICA DE DADOS
   As páginas usam sempre DB.listar / DB.salvar / etc.
   e não precisam saber se é Firebase ou localStorage.
   ----------------------------------------------------- */

// Cache de fotos já resolvidas (evita buscar de novo)
const _cacheFotos = {};

const DB = {

    // Lista todos os documentos de uma coleção
    async listar(colecao) {
        if (usandoFirebase) {
            try {
                const snap = await _db.collection(colecao).get();
                return snap.docs.map(d => ({ id: d.id, ...d.data() }));
            } catch (e) { _avisarErroDB(e); return []; }
        }
        return JSON.parse(localStorage.getItem("bibia_" + colecao) || "[]");
    },

    // Cria/atualiza um documento com id conhecido (ex: a data do dia)
    async salvar(colecao, id, dados) {
        if (usandoFirebase) {
            try {
                await _db.collection(colecao).doc(id).set(dados, { merge: true });
                return id;
            } catch (e) { _avisarErroDB(e); throw e; }
        }
        const lista = JSON.parse(localStorage.getItem("bibia_" + colecao) || "[]");
        const i = lista.findIndex(x => x.id === id);
        if (i >= 0) lista[i] = { ...lista[i], ...dados, id };
        else lista.push({ ...dados, id });
        localStorage.setItem("bibia_" + colecao, JSON.stringify(lista));
        return id;
    },

    // Adiciona um documento com id automático
    async adicionar(colecao, dados) {
        if (usandoFirebase) {
            try {
                const ref = await _db.collection(colecao).add(dados);
                return ref.id;
            } catch (e) { _avisarErroDB(e); throw e; }
        }
        const id = "id_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
        return DB.salvar(colecao, id, dados);
    },

    // Remove um documento
    async excluir(colecao, id) {
        if (usandoFirebase) {
            try {
                await _db.collection(colecao).doc(id).delete();
                return;
            } catch (e) { _avisarErroDB(e); throw e; }
        }
        const lista = JSON.parse(localStorage.getItem("bibia_" + colecao) || "[]");
        localStorage.setItem(
            "bibia_" + colecao,
            JSON.stringify(lista.filter(x => x.id !== id))
        );
    },

    /* Upload de foto (treinos e dieta).
       A imagem é comprimida e, dependendo do modo:
       - Storage (Blaze):  sobe pro Firebase Storage → retorna URL
       - Firestore (Spark): vira um documento na coleção "fotos"
                            → retorna "foto:ID"
       - Local:             retorna o base64 direto             */
    async uploadFoto(pasta, file) {
        const base64 = await comprimirImagem(file, 800, 0.75);

        if (usandoFirebase && _storage) {
            const nome = pasta + "/" + Date.now() + ".jpg";
            const ref = _storage.ref(nome);
            await ref.putString(base64, "data_url");
            return await ref.getDownloadURL();
        }

        if (usandoFirebase) {
            const ref = await _db.collection("fotos").add({
                pasta: pasta,
                base64: base64,
                criadoEm: new Date().toISOString()
            });
            _cacheFotos[ref.id] = base64;
            return "foto:" + ref.id;
        }

        return base64;
    },

    /* Converte o valor salvo (URL, base64 ou "foto:ID")
       em algo que o <img src> consegue exibir. */
    async resolverFoto(valor) {
        if (!valor) return "";
        if (!valor.startsWith("foto:")) return valor;

        const id = valor.slice(5);
        if (_cacheFotos[id]) return _cacheFotos[id];

        try {
            const doc = await _db.collection("fotos").doc(id).get();
            const base64 = doc.exists ? (doc.data().base64 || "") : "";
            _cacheFotos[id] = base64;
            return base64;
        } catch (e) {
            return "";
        }
    }
};

// Reduz a imagem para no máximo `maxLado` px e converte pra JPEG
function comprimirImagem(file, maxLado, qualidade) {
    return new Promise(function (resolve, reject) {
        const img = new Image();
        img.onload = function () {
            const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * escala);
            canvas.height = Math.round(img.height * escala);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", qualidade));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}
