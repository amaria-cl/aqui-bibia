/* =====================================================
   AQUI, BIBIA — Agenda
   Coleção "agenda": id automático
   { titulo, data (YYYY-MM-DD), hora (HH:MM ou ""), descricao }
   ===================================================== */

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let eventos = [];
let mesAtual, anoAtual, anoVisao;
let diaSelecionado = null;

document.addEventListener("DOMContentLoaded", iniciarAgenda);

async function iniciarAgenda() {
    const hoje = new Date();
    mesAtual = hoje.getMonth();
    anoAtual = hoje.getFullYear();
    anoVisao = anoAtual;

    // Abas
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
        });
    });

    // Navegação do calendário
    document.getElementById("mes-ant").addEventListener("click", () => mudarMes(-1));
    document.getElementById("mes-prox").addEventListener("click", () => mudarMes(1));
    document.getElementById("ano-ant").addEventListener("click", () => mudarAno(-1));
    document.getElementById("ano-prox").addEventListener("click", () => mudarAno(1));

    // Modal
    document.getElementById("btn-novo-evento").addEventListener("click", () => abrirModal());
    document.getElementById("btn-add-dia").addEventListener("click", () => abrirModal(diaSelecionado));
    document.getElementById("modal-fechar").addEventListener("click", fecharModal);
    document.getElementById("modal-evento").addEventListener("click", function (e) {
        if (e.target === this) fecharModal();
    });
    document.getElementById("ev-salvar").addEventListener("click", salvarEvento);

    await recarregar();
}

async function recarregar() {
    eventos = await DB.listar("agenda");
    desenharMes();
    desenharAno();
    desenharProximos();
    if (diaSelecionado) desenharDia(diaSelecionado);
}

function mudarMes(delta) {
    mesAtual += delta;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    desenharMes();
}

function mudarAno(delta) {
    anoVisao += delta;
    document.getElementById("ano-titulo").textContent = anoVisao;
    desenharAno();
}

function isoDe(ano, mes, dia) {
    return ano + "-" + String(mes + 1).padStart(2, "0") + "-" + String(dia).padStart(2, "0");
}

/* ---------- Calendário mensal ---------- */

function desenharMes() {
    document.getElementById("cal-mes-ano").textContent =
        MESES[mesAtual] + " " + anoAtual;

    const grid = document.getElementById("cal-grid");
    grid.innerHTML = "";

    const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const hoje = hojeISO();
    const diasComEvento = new Set(eventos.map(e => e.data));

    for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement("div");
        vazio.className = "cal-day cal-empty";
        grid.appendChild(vazio);
    }

    for (let d = 1; d <= totalDias; d++) {
        const iso = isoDe(anoAtual, mesAtual, d);
        const cel = document.createElement("button");
        cel.className = "cal-day";
        cel.textContent = d;
        if (iso === hoje) cel.classList.add("today");
        if (iso === diaSelecionado) cel.classList.add("selected");
        if (diasComEvento.has(iso)) cel.classList.add("has-event");
        cel.addEventListener("click", () => selecionarDia(iso));
        grid.appendChild(cel);
    }
}

function selecionarDia(iso) {
    diaSelecionado = iso;
    desenharMes();
    desenharDia(iso);
}

function desenharDia(iso) {
    const wrap = document.getElementById("dia-wrap");
    wrap.style.display = "block";

    document.getElementById("dia-titulo").textContent =
        formatarData(iso) + " (" + diaDaSemana(iso) + ")";

    const doDia = eventos
        .filter(e => e.data === iso)
        .sort((a, b) => (a.hora || "").localeCompare(b.hora || ""));

    const content = document.getElementById("dia-content");
    if (!doDia.length) {
        content.innerHTML = "<p class='empty-message'>Nada marcado nesse dia. Dia livre! 💙</p>";
        return;
    }

    content.innerHTML = doDia.map(e =>
        "<div class='ev-block'>" +
            "<div class='ev-info'>" +
                "<strong>" + escaparAg(e.titulo) + "</strong>" +
                (e.hora ? "<span class='ev-time'>⏰ " + e.hora + "</span>" : "") +
                (e.descricao ? "<span class='ev-time'>" + escaparAg(e.descricao) + "</span>" : "") +
            "</div>" +
            "<button class='btn-icon' aria-label='Remover' onclick=\"removerEvento('" + e.id + "')\">🗑️</button>" +
        "</div>"
    ).join("");
}

/* ---------- Próximos eventos ---------- */

function desenharProximos() {
    const hoje = hojeISO();
    const futuros = eventos
        .filter(e => e.data >= hoje)
        .sort((a, b) => (a.data + (a.hora || "")).localeCompare(b.data + (b.hora || "")))
        .slice(0, 5);

    const lista = document.getElementById("lista-proximos");
    if (!futuros.length) {
        lista.innerHTML = "<p class='empty-message'>Nenhum compromisso por enquanto. Aproveita pra descansar um pouquinho, Bibia 💙</p>";
        return;
    }

    lista.innerHTML = futuros.map(e =>
        "<div class='proximo-evento'>" +
            "<span class='event-dot'></span>" +
            "<div class='event-info'>" +
                "<div class='event-title'>" + escaparAg(e.titulo) + "</div>" +
                "<div class='event-date'>" + formatarData(e.data) +
                    (e.hora ? " às " + e.hora : "") + "</div>" +
            "</div>" +
        "</div>"
    ).join("");
}

/* ---------- Visão anual ---------- */

function desenharAno() {
    document.getElementById("ano-titulo").textContent = anoVisao;
    const grid = document.getElementById("ano-grid");
    grid.innerHTML = "";

    const hoje = hojeISO();
    const diasComEvento = new Set(eventos.map(e => e.data));

    for (let m = 0; m < 12; m++) {
        const card = document.createElement("div");
        card.className = "mes-mini-card";

        let html = "<div class='mes-mini-title'>" + MESES[m] + "</div>" +
                   "<div class='mes-mini-grid'>";

        ["D", "S", "T", "Q", "Q", "S", "S"].forEach(d => {
            html += "<span class='mmd-header'>" + d + "</span>";
        });

        const primeiro = new Date(anoVisao, m, 1).getDay();
        const total = new Date(anoVisao, m + 1, 0).getDate();

        for (let i = 0; i < primeiro; i++) html += "<span class='mmd-day'></span>";
        for (let d = 1; d <= total; d++) {
            const iso = isoDe(anoVisao, m, d);
            let cls = "mmd-day";
            if (iso === hoje) cls += " today";
            else if (diasComEvento.has(iso)) cls += " has-ev";
            html += "<span class='" + cls + "'>" + d + "</span>";
        }
        html += "</div>";

        card.innerHTML = html;
        card.addEventListener("click", function () {
            mesAtual = m;
            anoAtual = anoVisao;
            document.querySelector("[data-tab='mensal']").click();
            desenharMes();
        });
        grid.appendChild(card);
    }
}

/* ---------- Modal / CRUD ---------- */

function abrirModal(dataInicial) {
    document.getElementById("ev-titulo").value = "";
    document.getElementById("ev-hora").value = "";
    document.getElementById("ev-descricao").value = "";
    document.getElementById("ev-data").value = dataInicial || hojeISO();
    document.getElementById("modal-evento").classList.add("open");
}

function fecharModal() {
    document.getElementById("modal-evento").classList.remove("open");
}

async function salvarEvento() {
    const titulo = document.getElementById("ev-titulo").value.trim();
    const data = document.getElementById("ev-data").value;

    if (!titulo) { toast("Dá um nome pro compromisso 💜"); return; }
    if (!data) { toast("Escolhe a data do compromisso."); return; }

    await DB.adicionar("agenda", {
        titulo: titulo,
        data: data,
        hora: document.getElementById("ev-hora").value || "",
        descricao: document.getElementById("ev-descricao").value.trim()
    });

    fecharModal();
    toast("Compromisso salvo! 📅");
    await recarregar();
}

async function removerEvento(id) {
    await DB.excluir("agenda", id);
    toast("Compromisso removido.");
    await recarregar();
}

function escaparAg(txt) {
    const div = document.createElement("div");
    div.textContent = txt || "";
    return div.innerHTML;
}
