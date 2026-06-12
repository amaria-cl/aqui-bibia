/* =====================================================
   AQUI, BIBIA — Dieta
   Coleção "dieta": id = data (YYYY-MM-DD)
   {
     data, cafe, almoco, cafeTarde, jantar, agua,
     descricoes: { cafe: "...", almoco: "...", ... },
     fotos: [ { url, tipo } ]   (antigas podem ser só string)
   }
   ===================================================== */

const REFEICOES = [
    { campo: "cafe",      rotulo: "☕ Café da manhã" },
    { campo: "almoco",    rotulo: "🍛 Almoço" },
    { campo: "cafeTarde", rotulo: "🥪 Café da tarde" },
    { campo: "jantar",    rotulo: "🍲 Jantar" },
    { campo: "agua",      rotulo: "💧 Água" }
];

let dietaHoje = null;

document.addEventListener("DOMContentLoaded", iniciarDieta);

async function iniciarDieta() {
    const hoje = hojeISO();
    document.getElementById("dieta-data").textContent = "— " + formatarData(hoje);

    // Monta o checklist com a caixinha de descrição de cada refeição
    const wrap = document.getElementById("checklist-dieta");
    wrap.innerHTML = REFEICOES.map(r =>
        "<div class='check-wrap'>" +
            "<button class='check-item' data-campo='" + r.campo + "'>" + r.rotulo + "</button>" +
            "<div class='desc-box' id='desc-" + r.campo + "' style='display:none;'>" +
                "<textarea rows='2' maxlength='300' data-campo='" + r.campo + "'" +
                    " placeholder='Conta aqui o que você comeu (ex: Crepioca, Pão, Café...)'></textarea>" +
                "<button class='btn-mini' data-campo='" + r.campo + "'>💾 Salvar</button>" +
            "</div>" +
        "</div>"
    ).join("");

    wrap.querySelectorAll(".check-item").forEach(btn => {
        btn.addEventListener("click", () => alternarItem(btn.dataset.campo));
    });
    wrap.querySelectorAll(".btn-mini").forEach(btn => {
        btn.addEventListener("click", () => salvarDescricao(btn.dataset.campo));
    });

    document.getElementById("foto-dieta")
        .addEventListener("change", enviarFotoDieta);

    await carregarDieta();
}

async function carregarDieta() {
    const hoje = hojeISO();
    const lista = await DB.listar("dieta");
    dietaHoje = lista.find(d => (d.data || d.id) === hoje) ||
        { data: hoje, cafe: false, almoco: false, cafeTarde: false,
          jantar: false, agua: false, descricoes: {}, fotos: [] };
    dietaHoje.descricoes = dietaHoje.descricoes || {};

    await renderizarDieta(lista);
}

async function alternarItem(campo) {
    dietaHoje[campo] = !dietaHoje[campo];
    dietaHoje.concluido = REFEICOES.every(r => !!dietaHoje[r.campo]);

    await DB.salvar("dieta", dietaHoje.data, dietaHoje);

    if (dietaHoje.concluido) toast("Dia completo! Você é incrível 🥗💙");
    await carregarDieta();
}

async function salvarDescricao(campo) {
    const ta = document.querySelector("#desc-" + campo + " textarea");
    dietaHoje.descricoes = dietaHoje.descricoes || {};
    dietaHoje.descricoes[campo] = ta.value.trim();
    await DB.salvar("dieta", dietaHoje.data, dietaHoje);
    toast("Anotado! 🍽️");
}

/* Normaliza fotos antigas (string) e novas ({url, tipo}) */
function fotoInfo(f) {
    if (!f) return null;
    if (typeof f === "string") return { url: f, tipo: "" };
    return { url: f.url || "", tipo: f.tipo || "" };
}

async function enviarFotoDieta(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    const tipo = document.getElementById("tipo-foto").value;

    toast("Enviando foto...");
    try {
        const url = await DB.uploadFoto("dieta", file);
        dietaHoje.fotos = dietaHoje.fotos || [];
        dietaHoje.fotos.push({ url: url, tipo: tipo });
        await DB.salvar("dieta", dietaHoje.data, dietaHoje);
        toast("Foto de " + tipo.toLowerCase() + " salva! 📸");
        await carregarDieta();
    } catch (e) {
        toast("Não consegui enviar a foto. Tente de novo?");
    }
    ev.target.value = "";
}

async function renderizarDieta(lista) {
    // Checklist + caixinhas de descrição
    REFEICOES.forEach(r => {
        const marcado = !!dietaHoje[r.campo];
        const btn = document.querySelector(".check-item[data-campo='" + r.campo + "']");
        btn.classList.toggle("marcado", marcado);

        // A descrição abre ao tocar na refeição marcada
        const box = document.getElementById("desc-" + r.campo);
        box.style.display = marcado ? "block" : "none";

        const ta = box.querySelector("textarea");
        if (document.activeElement !== ta) {
            ta.value = (dietaHoje.descricoes && dietaHoje.descricoes[r.campo]) || "";
        }
    });

    // Status
    const feitos = REFEICOES.filter(r => dietaHoje[r.campo]).length;
    document.getElementById("dieta-status").textContent =
        feitos === REFEICOES.length
            ? "🎉 Dia concluído! Todas as refeições em dia."
            : feitos + " de " + REFEICOES.length + " itens concluídos.";

    // Fotos de hoje (com a classificação)
    const grid = document.getElementById("fotos-dieta");
    const fotos = (dietaHoje.fotos || []).map(fotoInfo).filter(Boolean);
    const srcs = await Promise.all(fotos.map(f => DB.resolverFoto(f.url)));
    grid.innerHTML = fotos.map((f, i) => {
        if (!srcs[i]) return "";
        return "<figure class='foto-card'>" +
            "<img src='" + srcs[i] + "' alt='Refeição'>" +
            (f.tipo ? "<figcaption>" + f.tipo + "</figcaption>" : "") +
        "</figure>";
    }).join("");

    // Histórico
    const hoje = hojeISO();
    const anteriores = lista
        .filter(d => (d.data || d.id) !== hoje)
        .sort((a, b) => (b.data || b.id).localeCompare(a.data || a.id))
        .slice(0, 14);

    const hist = document.getElementById("historico-dieta");
    if (!anteriores.length) {
        hist.innerHTML = "<p class='empty-message'>Os dias completos vão aparecer aqui 💙</p>";
        return;
    }

    hist.innerHTML = anteriores.map(d => {
        const data = d.data || d.id;
        const feitosDia = REFEICOES.filter(r => d[r.campo]).length;
        const completo = feitosDia === REFEICOES.length;
        const nFotos = (d.fotos || []).length;
        return "<div class='lista-item'>" +
            "<span class='thumb thumb-vazio'>" + (completo ? "🌟" : "🥗") + "</span>" +
            "<div class='item-info'>" +
                "<strong>" + formatarData(data) + "</strong>" +
                "<span class='item-sub'>" + feitosDia + " de " + REFEICOES.length + " itens" +
                    (nFotos ? " • " + nFotos + " foto(s)" : "") + "</span>" +
            "</div>" +
            (completo ? "<span class='badge'>completo ✓</span>" : "") +
        "</div>";
    }).join("");
}
