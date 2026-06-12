/* =====================================================
   AQUI, BIBIA — Treinos
   Coleção "treinos": id = data (YYYY-MM-DD)
   { data, fotoUrl?, grupos: [], cardio: bool, cardioMin: n }
   ===================================================== */

const GRUPOS = ["Glúteo", "Quadríceps", "Inferiores", "Costas", "Bíceps",
                "Tríceps", "Ombro", "Peito", "Abdômen", "Lombar", "Panturrilha"];

let treinoHoje = null;

document.addEventListener("DOMContentLoaded", iniciarTreinos);

async function iniciarTreinos() {
    document.getElementById("btn-treinei")
        .addEventListener("click", registrarTreino);
    document.getElementById("btn-remover-treino")
        .addEventListener("click", removerTreinoHoje);
    document.getElementById("foto-treino")
        .addEventListener("change", enviarFotoTreino);

    // Chips dos grupos musculares
    const chips = document.getElementById("chips-grupos");
    chips.innerHTML = GRUPOS.map(g =>
        "<button class='chip' data-grupo='" + g + "'>" + g + "</button>"
    ).join("");
    chips.querySelectorAll(".chip").forEach(c => {
        c.addEventListener("click", () => alternarGrupo(c.dataset.grupo));
    });

    // Cardio
    document.getElementById("chk-cardio")
        .addEventListener("click", alternarCardio);
    document.getElementById("cardio-min")
        .addEventListener("change", salvarCardioMin);

    await atualizarTela();
}

async function garantirTreinoHoje() {
    const hoje = hojeISO();
    if (!treinoHoje) {
        treinoHoje = { data: hoje, grupos: [], cardio: false, cardioMin: 0 };
    }
    return treinoHoje;
}

async function registrarTreino() {
    if (treinoHoje) {
        toast("Você já registrou o treino de hoje! 🎉");
        return;
    }
    await garantirTreinoHoje();
    await DB.salvar("treinos", treinoHoje.data, treinoHoje);
    toast("Treino registrado! Orgulho de você 💙");
    await atualizarTela();
}

async function removerTreinoHoje() {
    if (!treinoHoje) return;
    if (!confirm("Remover o treino de hoje? (caso tenha marcado sem querer)")) return;

    await DB.excluir("treinos", hojeISO());
    treinoHoje = null;
    toast("Treino de hoje removido.");
    await atualizarTela();
}

async function removerTreinoDia(id) {
    if (!confirm("Remover o treino de " + formatarData(id) + "?")) return;
    await DB.excluir("treinos", id);
    if (id === hojeISO()) treinoHoje = null;
    toast("Treino removido.");
    await atualizarTela();
}

/* Marcar um grupo muscular já registra o treino do dia */
async function alternarGrupo(grupo) {
    await garantirTreinoHoje();
    treinoHoje.grupos = treinoHoje.grupos || [];

    const i = treinoHoje.grupos.indexOf(grupo);
    if (i >= 0) treinoHoje.grupos.splice(i, 1);
    else treinoHoje.grupos.push(grupo);

    await DB.salvar("treinos", treinoHoje.data, treinoHoje);
    await atualizarTela();
}

async function alternarCardio() {
    await garantirTreinoHoje();
    treinoHoje.cardio = !treinoHoje.cardio;
    if (!treinoHoje.cardio) treinoHoje.cardioMin = 0;

    await DB.salvar("treinos", treinoHoje.data, treinoHoje);
    await atualizarTela();
}

async function salvarCardioMin() {
    if (!treinoHoje) return;
    const min = Number(document.getElementById("cardio-min").value) || 0;
    treinoHoje.cardioMin = min;
    await DB.salvar("treinos", treinoHoje.data, treinoHoje);
    if (min > 0) toast(min + " min de cardio anotados 🏃");
}

async function enviarFotoTreino(ev) {
    const file = ev.target.files[0];
    if (!file) return;

    toast("Enviando foto...");
    try {
        await garantirTreinoHoje();
        const url = await DB.uploadFoto("treinos", file);
        treinoHoje.fotoUrl = url;
        await DB.salvar("treinos", treinoHoje.data, treinoHoje);
        toast("Foto salva! 📸");
        await atualizarTela();
    } catch (e) {
        toast("Não consegui enviar a foto. Tente de novo?");
    }
    ev.target.value = "";
}

function resumoTreino(t) {
    const partes = [];
    if (t.grupos && t.grupos.length) partes.push(t.grupos.join(", "));
    if (t.cardio) partes.push("Cardio" + (t.cardioMin ? " " + t.cardioMin + "min" : ""));
    return partes.join(" • ");
}

async function atualizarTela() {
    const hoje = hojeISO();
    const treinos = await DB.listar("treinos");
    treinos.sort((a, b) => (b.data || b.id).localeCompare(a.data || a.id));

    treinoHoje = treinos.find(t => (t.data || t.id) === hoje) || treinoHoje;

    // Streak
    const streak = await calcularStreak();
    document.getElementById("streak-treino").innerHTML =
        streak > 0
            ? "<span class='streak-num'>" + streak + "</span> dia" + (streak > 1 ? "s" : "") + " 🔥"
            : "Comece hoje! ✨";

    // Botões registrar/remover
    const btn = document.getElementById("btn-treinei");
    const btnRemover = document.getElementById("btn-remover-treino");
    const status = document.getElementById("treino-status");
    if (treinoHoje) {
        btn.disabled = true;
        btn.textContent = "✅ Treino de hoje registrado!";
        btnRemover.style.display = "block";
        status.textContent = "Volta amanhã pra manter a sequência 💙";
    } else {
        btn.disabled = false;
        btn.textContent = "💪 Treinei hoje!";
        btnRemover.style.display = "none";
        status.textContent = "";
    }

    // Chips refletem o que foi treinado
    const grupos = (treinoHoje && treinoHoje.grupos) || [];
    document.querySelectorAll("#chips-grupos .chip").forEach(c => {
        c.classList.toggle("on", grupos.indexOf(c.dataset.grupo) >= 0);
    });

    // Cardio
    const cardioOn = !!(treinoHoje && treinoHoje.cardio);
    document.getElementById("chk-cardio").classList.toggle("marcado", cardioOn);
    const inputMin = document.getElementById("cardio-min");
    inputMin.style.display = cardioOn ? "block" : "none";
    if (cardioOn && document.activeElement !== inputMin) {
        inputMin.value = treinoHoje.cardioMin || "";
    }

    // Preview da foto de hoje
    const preview = document.getElementById("preview-treino");
    if (treinoHoje && treinoHoje.fotoUrl) {
        const src = await DB.resolverFoto(treinoHoje.fotoUrl);
        preview.innerHTML = src
            ? "<figure class='foto-card'><img src='" + src + "' alt='Treino de hoje'></figure>"
            : "";
    } else {
        preview.innerHTML = "";
    }

    // Histórico
    const hist = document.getElementById("historico-treinos");
    if (!treinos.length) {
        hist.innerHTML = "<p class='empty-message'>Nenhum treino registrado ainda. O primeiro é sempre o mais especial! 💙</p>";
        return;
    }

    const recentes = treinos.slice(0, 30);
    const fotos = await Promise.all(recentes.map(t => DB.resolverFoto(t.fotoUrl)));

    hist.innerHTML = recentes.map((t, i) => {
        const data = t.data || t.id;
        const detalhe = resumoTreino(t);
        return "<div class='lista-item'>" +
            (fotos[i]
                ? "<img src='" + fotos[i] + "' alt='Treino' class='thumb'>"
                : "<span class='thumb thumb-vazio'>💪</span>") +
            "<div class='item-info'>" +
                "<strong>" + formatarData(data) + "</strong>" +
                "<span class='item-sub'>" + diaDaSemana(data) +
                    (detalhe ? " • " + detalhe : "") + "</span>" +
            "</div>" +
            "<button class='btn-icon' aria-label='Remover' onclick=\"removerTreinoDia('" + data + "')\">🗑️</button>" +
        "</div>";
    }).join("");
}
