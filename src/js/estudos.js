/* =====================================================
   AQUI, BIBIA — Estudos
   Coleção "materias":   { nome, cor, criadoEm }
   Coleção "atividades": { materiaId, nome, prioridade,
                           prazo, concluida, criadoEm }
   Coleção "estudos":    { materia, minutos, data }  (tempo)
   ===================================================== */

const CORES_MATERIAS = [
    "#6366f1", "#8b5cf6", "#3b82f6", "#06b6d4",
    "#10b981", "#f59e0b", "#ef4444", "#ec4899",
    "#14b8a6", "#a855f7", "#64748b", "#d97706"
];

let materias = [];
let atividades = [];
let materiasAbertas = {};
let editMateriaId = null;

document.addEventListener("DOMContentLoaded", iniciarEstudos);

async function iniciarEstudos() {
    document.getElementById("btn-nova-materia").addEventListener("click", abrirModalNova);
    document.getElementById("modal-mat-fechar").addEventListener("click", fecharModalMateria);
    document.getElementById("modal-materia").addEventListener("click", function (e) {
        if (e.target === this) fecharModalMateria();
    });
    document.getElementById("btn-salvar-materia").addEventListener("click", salvarMateria);
    document.getElementById("mat-nome").addEventListener("keydown", e => {
        if (e.key === "Enter") salvarMateria();
    });
    document.getElementById("btn-add-estudo").addEventListener("click", adicionarEstudo);

    await recarregarTudo();
}

async function recarregarTudo() {
    [materias, atividades] = await Promise.all([
        DB.listar("materias"),
        DB.listar("atividades")
    ]);
    materias.sort((a, b) => (a.criadoEm || "").localeCompare(b.criadoEm || ""));

    atualizarStats();
    renderMaterias();
    await renderizarTempos();
}

/* ---------- Estatísticas ---------- */

function atualizarStats() {
    const total = atividades.length;
    const concluidas = atividades.filter(a => a.concluida).length;
    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    document.getElementById("stat-materias").textContent = materias.length;
    document.getElementById("stat-atividades").textContent = total;
    document.getElementById("stat-concluidas").textContent = concluidas;
    document.getElementById("pct-geral").textContent = pct + "%";
    document.getElementById("prog-geral").style.width = pct + "%";
}

/* ---------- Matérias ---------- */

function renderMaterias() {
    const el = document.getElementById("lista-materias");

    // Datalist do registro de tempo aproveita as matérias
    document.getElementById("datalist-materias").innerHTML =
        materias.map(m => "<option value='" + escAtt(m.nome) + "'>").join("");

    if (!materias.length) {
        el.innerHTML = "<p class='empty-message'>Nenhuma matéria ainda. Crie a primeira! ✨</p>";
        return;
    }

    el.innerHTML = "";
    materias.forEach(mat => {
        const doMat = atividades.filter(a => a.materiaId === mat.id);
        const concluidas = doMat.filter(a => a.concluida).length;
        const pct = doMat.length ? Math.round((concluidas / doMat.length) * 100) : 0;
        const aberta = !!materiasAbertas[mat.id];

        const card = document.createElement("div");
        card.className = "materia-card" + (aberta ? " aberta" : "");
        card.innerHTML =
            "<button class='materia-header'>" +
                "<span class='materia-dot' style='background:" + mat.cor + ";'></span>" +
                "<span class='materia-nome'>" + esc(mat.nome) + "</span>" +
                "<span class='materia-contagem'>" + concluidas + "/" + doMat.length + "</span>" +
                "<span class='materia-seta'>" + (aberta ? "▲" : "▼") + "</span>" +
            "</button>" +
            "<div class='materia-progresso'>" +
                "<div class='progress-bar'><div class='progress-fill' style='width:" + pct + "%;background:" + mat.cor + ";'></div></div>" +
            "</div>" +
            "<div class='materia-corpo'" + (aberta ? "" : " style='display:none;'") + ">" +
                renderAtividades(mat, doMat) +
                "<div class='form-coluna form-atv'>" +
                    "<input type='text' class='atv-nome' placeholder='Nova atividade (ex: resumo cap. 3)' maxlength='80'>" +
                    "<div class='atv-linha'>" +
                        "<select class='atv-prio tipo-select'>" +
                            "<option value='baixa'>🌿 Baixa</option>" +
                            "<option value='media' selected>⭐ Média</option>" +
                            "<option value='alta'>🔥 Alta</option>" +
                        "</select>" +
                        "<input type='date' class='atv-prazo'>" +
                    "</div>" +
                    "<button class='btn-primary btn-add-atv'>+ Adicionar atividade</button>" +
                "</div>" +
                "<div class='materia-acoes'>" +
                    "<button class='btn-mini btn-editar-mat'>✏️ Editar</button>" +
                    "<button class='btn-mini btn-mini-perigo btn-del-mat'>🗑️ Remover matéria</button>" +
                "</div>" +
            "</div>";

        // Abre/fecha
        card.querySelector(".materia-header").addEventListener("click", () => {
            materiasAbertas[mat.id] = !materiasAbertas[mat.id];
            renderMaterias();
        });

        // Atividades: concluir e remover
        card.querySelectorAll("[data-toggle]").forEach(b =>
            b.addEventListener("click", () => alternarAtividade(b.dataset.toggle)));
        card.querySelectorAll("[data-del-atv]").forEach(b =>
            b.addEventListener("click", () => removerAtividade(b.dataset.delAtv)));

        // Adicionar atividade
        const inputNome = card.querySelector(".atv-nome");
        const adicionar = () => adicionarAtividade(mat.id, card);
        card.querySelector(".btn-add-atv").addEventListener("click", adicionar);
        inputNome.addEventListener("keydown", e => { if (e.key === "Enter") adicionar(); });

        // Editar / remover matéria
        card.querySelector(".btn-editar-mat").addEventListener("click", () => abrirModalEditar(mat));
        card.querySelector(".btn-del-mat").addEventListener("click", () => removerMateria(mat));

        el.appendChild(card);
    });
}

function renderAtividades(mat, doMat) {
    if (!doMat.length) {
        return "<p class='empty-message'>Nenhuma atividade ainda. Adicione a primeira! 💜</p>";
    }

    const ordenadas = [...doMat].sort((a, b) =>
        Number(a.concluida) - Number(b.concluida) ||
        (a.criadoEm || "").localeCompare(b.criadoEm || ""));

    const tagsPrio = {
        alta:  "<span class='tag tag-alta'>🔥 Alta</span>",
        media: "<span class='tag tag-media'>⭐ Média</span>",
        baixa: "<span class='tag tag-baixa'>🌿 Baixa</span>"
    };

    return ordenadas.map(a =>
        "<div class='atv-item" + (a.concluida ? " feita" : "") + "'>" +
            "<button class='atv-check' data-toggle='" + a.id + "' style='border-color:" + mat.cor + ";" +
                (a.concluida ? "background:" + mat.cor + ";" : "") + "'>" +
                (a.concluida ? "✓" : "") +
            "</button>" +
            "<div class='item-info'>" +
                "<span class='atv-texto'>" + esc(a.nome) + "</span>" +
                "<span class='item-sub'>" +
                    (a.prazo ? "até " + formatarData(a.prazo) + " " : "") +
                "</span>" +
            "</div>" +
            (tagsPrio[a.prioridade] || "") +
            "<button class='btn-icon' data-del-atv='" + a.id + "' aria-label='Remover'>🗑️</button>" +
        "</div>"
    ).join("");
}

/* ---------- CRUD matérias ---------- */

function abrirModalNova() {
    editMateriaId = null;
    document.getElementById("modal-mat-titulo").textContent = "💜 Nova matéria";
    document.getElementById("mat-nome").value = "";
    document.getElementById("btn-salvar-materia").textContent = "Criar matéria";
    montarColorPicker(CORES_MATERIAS[0]);
    document.getElementById("modal-materia").classList.add("open");
}

function abrirModalEditar(mat) {
    editMateriaId = mat.id;
    document.getElementById("modal-mat-titulo").textContent = "✏️ Editar matéria";
    document.getElementById("mat-nome").value = mat.nome;
    document.getElementById("btn-salvar-materia").textContent = "Salvar";
    montarColorPicker(mat.cor);
    document.getElementById("modal-materia").classList.add("open");
}

function fecharModalMateria() {
    document.getElementById("modal-materia").classList.remove("open");
}

function montarColorPicker(corAtiva) {
    const el = document.getElementById("color-picker");
    el.innerHTML = CORES_MATERIAS.map(c =>
        "<button class='cor-dot" + (c === corAtiva ? " sel" : "") + "'" +
        " data-cor='" + c + "' style='background:" + c + ";' aria-label='Cor'></button>"
    ).join("");
    el.querySelectorAll(".cor-dot").forEach(d => {
        d.addEventListener("click", () => {
            el.querySelectorAll(".cor-dot").forEach(x => x.classList.remove("sel"));
            d.classList.add("sel");
        });
    });
}

async function salvarMateria() {
    const nome = document.getElementById("mat-nome").value.trim();
    if (!nome) { toast("Dá um nome pra matéria 📚"); return; }

    const sel = document.querySelector("#color-picker .cor-dot.sel");
    const cor = sel ? sel.dataset.cor : CORES_MATERIAS[0];

    if (editMateriaId) {
        await DB.salvar("materias", editMateriaId, { nome: nome, cor: cor });
        toast("Matéria atualizada ✓");
    } else {
        await DB.adicionar("materias", {
            nome: nome, cor: cor, criadoEm: new Date().toISOString()
        });
        toast("Matéria criada! 📚💜");
    }

    fecharModalMateria();
    await recarregarTudo();
}

async function removerMateria(mat) {
    const doMat = atividades.filter(a => a.materiaId === mat.id);
    if (!confirm("Remover \"" + mat.nome + "\"" +
        (doMat.length ? " e " + doMat.length + " atividade(s)?" : "?"))) return;

    await DB.excluir("materias", mat.id);
    for (const a of doMat) await DB.excluir("atividades", a.id);

    toast("Matéria removida.");
    await recarregarTudo();
}

/* ---------- CRUD atividades ---------- */

async function adicionarAtividade(materiaId, card) {
    const nome = card.querySelector(".atv-nome").value.trim();
    if (!nome) { toast("Qual é a atividade? ✏️"); return; }

    await DB.adicionar("atividades", {
        materiaId: materiaId,
        nome: nome,
        prioridade: card.querySelector(".atv-prio").value,
        prazo: card.querySelector(".atv-prazo").value || "",
        concluida: false,
        criadoEm: new Date().toISOString()
    });

    materiasAbertas[materiaId] = true;
    toast("Atividade adicionada ✓");
    await recarregarTudo();
}

async function alternarAtividade(id) {
    const a = atividades.find(x => x.id === id);
    if (!a) return;

    await DB.salvar("atividades", id, { concluida: !a.concluida });
    if (!a.concluida) toast("Concluída! Mandou bem 💜");
    await recarregarTudo();
}

async function removerAtividade(id) {
    if (!confirm("Remover esta atividade?")) return;
    await DB.excluir("atividades", id);
    toast("Removida.");
    await recarregarTudo();
}

/* ---------- Tempo de estudo ---------- */

async function adicionarEstudo() {
    const materia = document.getElementById("materia").value.trim();
    const minutos = Number(document.getElementById("minutos").value);

    if (!materia) { toast("Qual matéria você estudou? 📚"); return; }
    if (!minutos || minutos < 1) { toast("Quantos minutos de estudo?"); return; }

    await DB.adicionar("estudos", {
        materia: materia, minutos: minutos, data: hojeISO()
    });

    document.getElementById("materia").value = "";
    document.getElementById("minutos").value = "";

    toast("Tempo registrado! Mandou bem 💜");
    await renderizarTempos();
}

async function removerEstudo(id) {
    await DB.excluir("estudos", id);
    toast("Registro removido.");
    await renderizarTempos();
}

function formatarMinutos(min) {
    if (min < 60) return min + " min";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h + "h" + (m ? String(m).padStart(2, "0") : "");
}

async function renderizarTempos() {
    const hoje = hojeISO();
    const estudos = await DB.listar("estudos");
    estudos.sort((a, b) => (b.data || "").localeCompare(a.data || ""));

    const totalHoje = estudos
        .filter(e => e.data === hoje)
        .reduce((s, e) => s + (Number(e.minutos) || 0), 0);
    document.getElementById("total-hoje").textContent = formatarMinutos(totalHoje);

    const limite = new Date();
    limite.setDate(limite.getDate() - 6);
    const limiteISO = limite.getFullYear() + "-" +
        String(limite.getMonth() + 1).padStart(2, "0") + "-" +
        String(limite.getDate()).padStart(2, "0");
    const totalSemana = estudos
        .filter(e => e.data >= limiteISO)
        .reduce((s, e) => s + (Number(e.minutos) || 0), 0);
    document.getElementById("total-semana").textContent =
        "Nos últimos 7 dias: " + formatarMinutos(totalSemana);

    const lista = document.getElementById("lista-estudos");
    if (!estudos.length) {
        lista.innerHTML = "<p class='empty-message'>Nenhum estudo registrado ainda. Bora começar? ✨</p>";
        return;
    }

    lista.innerHTML = estudos.slice(0, 30).map(e =>
        "<div class='lista-item'>" +
            "<span class='thumb thumb-vazio'>📖</span>" +
            "<div class='item-info'>" +
                "<strong>" + esc(e.materia) + "</strong>" +
                "<span class='item-sub'>" + formatarData(e.data) + " • " +
                    formatarMinutos(Number(e.minutos) || 0) + "</span>" +
            "</div>" +
            "<button class='btn-icon' aria-label='Remover' onclick=\"removerEstudo('" + e.id + "')\">🗑️</button>" +
        "</div>"
    ).join("");
}

/* ---------- Utilidades ---------- */

function esc(txt) {
    const div = document.createElement("div");
    div.textContent = txt || "";
    return div.innerHTML;
}

function escAtt(txt) {
    return esc(txt).replace(/'/g, "&#39;");
}
