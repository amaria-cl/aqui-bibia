/* =====================================================
   AQUI, BIBIA — Nossos momentos (galeria do casal)
   Coleção "momentos": id automático
   { foto, legenda, de, deNome, deEmoji, data, criadoEm }
   ===================================================== */

let arquivoPendente = null;

document.addEventListener("DOMContentLoaded", iniciarMomentos);

async function iniciarMomentos() {
    document.getElementById("foto-momento")
        .addEventListener("change", escolherFoto);
    document.getElementById("btn-salvar-momento")
        .addEventListener("click", salvarMomento);

    await renderizarGaleria();
}

async function escolherFoto(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    arquivoPendente = file;

    // Mostra a prévia antes de salvar
    const preview = document.getElementById("preview-momento");
    const base64 = await comprimirImagem(file, 800, 0.75);
    preview.innerHTML =
        "<figure class='foto-card'><img src='" + base64 + "' alt='Prévia'></figure>";
    preview.style.display = "grid";

    document.getElementById("btn-salvar-momento").disabled = false;
}

async function salvarMomento() {
    if (!arquivoPendente) { toast("Escolhe uma foto primeiro 📷"); return; }

    const eu = usuarioAtual();
    const btn = document.getElementById("btn-salvar-momento");
    btn.disabled = true;
    btn.textContent = "Guardando...";

    try {
        const ref = await DB.uploadFoto("momentos", arquivoPendente);

        await DB.adicionar("momentos", {
            foto: ref,
            legenda: document.getElementById("legenda-momento").value.trim(),
            de: eu ? eu.id : "",
            deNome: eu ? eu.nome : "",
            deEmoji: eu ? eu.emoji : "💙",
            data: hojeISO(),
            criadoEm: new Date().toISOString()
        });

        toast("Momento guardado pra sempre 💙");

        arquivoPendente = null;
        document.getElementById("legenda-momento").value = "";
        document.getElementById("foto-momento").value = "";
        const preview = document.getElementById("preview-momento");
        preview.innerHTML = "";
        preview.style.display = "none";

        await renderizarGaleria();
    } catch (e) {
        toast("Não consegui guardar a foto. Tente de novo?");
    }

    btn.disabled = true;
    btn.textContent = "💙 Guardar momento";
}

async function removerMomento(id) {
    if (!confirm("Remover essa lembrança da galeria?")) return;
    await DB.excluir("momentos", id);
    toast("Momento removido.");
    await renderizarGaleria();
}

async function renderizarGaleria() {
    const momentos = await DB.listar("momentos");
    momentos.sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));

    const galeria = document.getElementById("galeria-momentos");
    if (!momentos.length) {
        galeria.innerHTML =
            "<p class='empty-message'>Ainda não tem fotos por aqui. Vamos começar a nossa coleção? 💙</p>";
        return;
    }

    const srcs = await Promise.all(momentos.map(m => DB.resolverFoto(m.foto)));

    galeria.innerHTML = momentos.map((m, i) => {
        if (!srcs[i]) return "";
        return "<figure class='momento-card'>" +
            "<img src='" + srcs[i] + "' alt='Nosso momento'>" +
            "<figcaption>" +
                (m.legenda ? "<p>" + escaparMom(m.legenda) + "</p>" : "") +
                "<div class='recado-rodape'>" +
                    "<span class='item-sub'>" +
                        (m.deEmoji || "💙") + " " + formatarData(m.data || "") +
                    "</span>" +
                    "<button class='btn-icon' aria-label='Remover' onclick=\"removerMomento('" + m.id + "')\">🗑️</button>" +
                "</div>" +
            "</figcaption>" +
        "</figure>";
    }).join("");
}

function escaparMom(txt) {
    const div = document.createElement("div");
    div.textContent = txt || "";
    return div.innerHTML;
}
