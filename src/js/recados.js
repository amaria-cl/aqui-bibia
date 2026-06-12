/* =====================================================
   AQUI, BIBIA — Recados e bilhetes
   Coleção "recados": id automático
   { texto, de, deNome, deEmoji, para, lido, criadoEm }
   ===================================================== */

document.addEventListener("DOMContentLoaded", iniciarRecados);

async function iniciarRecados() {
    document.getElementById("btn-add-recado")
        .addEventListener("click", adicionarRecado);

    const eu = usuarioAtual();
    if (eu) {
        const dest = outroUsuario();
        document.getElementById("para-quem").textContent =
            "Esse bilhete vai pra " + dest.emoji + " " + dest.nome;
    }

    await renderizarRecados();
}

async function adicionarRecado() {
    const eu = usuarioAtual();
    if (!eu) { toast("Escolha seu perfil primeiro 💙"); return; }

    const campo = document.getElementById("texto-recado");
    const texto = campo.value.trim();
    if (!texto) { toast("Escreve alguma coisa primeiro 💙"); return; }

    const dest = outroUsuario();

    await DB.adicionar("recados", {
        texto: texto,
        de: eu.id,
        deNome: eu.nome,
        deEmoji: eu.emoji,
        para: dest.id,
        lido: false,
        criadoEm: new Date().toISOString()
    });

    campo.value = "";
    toast("Bilhete enviado pra " + dest.nome + " 💌");
    await renderizarRecados();
}

async function removerRecado(id) {
    await DB.excluir("recados", id);
    toast("Recado removido.");
    await renderizarRecados();
}

async function renderizarRecados() {
    const eu = usuarioAtual();
    const recados = await DB.listar("recados");
    recados.sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));

    // Recados antigos (sem "para") aparecem pra todo mundo
    const recebidos = recados.filter(r => !r.para || (eu && r.para === eu.id));
    const enviados = eu ? recados.filter(r => r.de === eu.id) : [];

    montarLista("lista-recebidos", recebidos, true,
        "Nenhum bilhete pra você ainda... mas aposto que logo chega um 💙");
    montarLista("lista-enviados", enviados, false,
        "Você ainda não mandou nenhum bilhete. Que tal agora? ✨");

    // Marca como lidos os que eram pra mim
    if (eu) {
        const naoLidos = recebidos.filter(r => r.para === eu.id && !r.lido);
        for (const r of naoLidos) {
            await DB.salvar("recados", r.id, { lido: true });
        }
    }
}

function montarLista(idEl, lista, recebido, msgVazia) {
    const el = document.getElementById(idEl);
    if (!el) return;

    if (!lista.length) {
        el.innerHTML = "<p class='empty-message'>" + msgVazia + "</p>";
        return;
    }

    el.innerHTML = lista.map(r => {
        const dataISO = (r.criadoEm || "").slice(0, 10);
        const remetente = r.deNome
            ? (r.deEmoji || "💌") + " " + r.deNome
            : "💌";
        const novo = recebido && r.para && !r.lido;

        return "<div class='recado" + (recebido ? " recado-recebido" : "") + "'>" +
            (novo ? "<span class='badge badge-novo'>novo ✨</span>" : "") +
            "<p class='recado-texto'>" + escaparTexto(r.texto) + "</p>" +
            "<div class='recado-rodape'>" +
                "<span class='item-sub'>" +
                    (recebido ? "De " + remetente + " • " : "") +
                    (dataISO ? formatarData(dataISO) : "") +
                "</span>" +
                "<button class='btn-icon' aria-label='Remover' onclick=\"removerRecado('" + r.id + "')\">🗑️</button>" +
            "</div>" +
        "</div>";
    }).join("");
}

function escaparTexto(txt) {
    const div = document.createElement("div");
    div.textContent = txt || "";
    return div.innerHTML;
}
