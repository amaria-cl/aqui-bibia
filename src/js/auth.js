/* =====================================================
   AQUI, BIBIA — Perfis (quem está usando o app)
   =====================================================
   Dois perfis: você e ela. Na primeira visita, a pessoa
   escolhe quem é ("Quem está aí?") e isso fica salvo no
   aparelho. Os recados usam isso pra saber quem mandou
   e quem recebe. 💌

   PERSONALIZE AQUI:
   - troque "Amor" pelo seu nome
   - se quiser, defina um PIN pra cada um (ex: pin: "1234")
     deixando "" o app não pede senha nenhuma
   ===================================================== */

const PERFIS = {
    clara: { id: "clara", nome: "Clara", emoji: "💙", pin: "" },
    bibia: { id: "bibia", nome: "Bibia", emoji: "💜", pin: "" }
};

function usuarioAtual() {
    const id = localStorage.getItem("bibia_usuario");
    return PERFIS[id] || null;
}

function outroUsuario() {
    const eu = usuarioAtual();
    if (!eu) return null;
    return eu.id === "clara" ? PERFIS.bibia : PERFIS.clara;
}

function ehAdmin() {
    const eu = usuarioAtual();
    return !!eu && eu.id === "clara";
}

function trocarUsuario() {
    localStorage.removeItem("bibia_usuario");
    location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    const eu = usuarioAtual();
    if (!eu) {
        mostrarEscolhaPerfil();
    } else {
        document.body.classList.add("perfil-" + eu.id);
        marcarQuemSou();
    }
});

function mostrarEscolhaPerfil() {
    const overlay = document.createElement("div");
    overlay.className = "perfil-overlay";
    overlay.innerHTML =
        "<div class='perfil-box'>" +
            "<h2>Quem está aí? 👀</h2>" +
            "<p class='hint'>Escolha seu perfil pra continuar</p>" +
            "<button class='perfil-btn' data-id='bibia'>" +
                PERFIS.bibia.emoji + " " + PERFIS.bibia.nome +
            "</button>" +
            "<button class='perfil-btn' data-id='clara'>" +
                PERFIS.clara.emoji + " " + PERFIS.clara.nome +
            "</button>" +
        "</div>";
    document.body.appendChild(overlay);

    overlay.querySelectorAll(".perfil-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const perfil = PERFIS[btn.dataset.id];

            if (perfil.pin) {
                const digitado = prompt("PIN de " + perfil.nome + ":");
                if (digitado !== perfil.pin) {
                    alert("PIN incorreto 🙈");
                    return;
                }
            }

            localStorage.setItem("bibia_usuario", perfil.id);
            location.reload();
        });
    });
}

/* Mostra "Você está como X • trocar" se a página tiver
   um elemento com id="quem-sou" (a index tem). */
function marcarQuemSou() {
    const el = document.getElementById("quem-sou");
    if (!el) return;
    const eu = usuarioAtual();
    el.innerHTML =
        "Você está como " + eu.emoji + " <strong>" + eu.nome + "</strong> " +
        "<button class='link-trocar' onclick='trocarUsuario()'>trocar</button>";
}
