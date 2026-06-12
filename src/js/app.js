/* =====================================================
   AQUI, BIBIA — utilidades compartilhadas + dashboard
   ===================================================== */

/* ---------- Datas ---------- */

function hojeISO() {
    const d = new Date();
    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}

function formatarData(iso) {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    return d + "/" + m + "/" + a;
}

function diaDaSemana(iso) {
    const nomes = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    return nomes[new Date(iso + "T12:00:00").getDay()];
}

/* ---------- Toast (avisos rápidos) ---------- */

function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) {
        t = document.createElement("div");
        t.className = "toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Mensagens motivacionais ---------- */

const MENSAGENS = [
    "Tenho muito orgulho de você!",
    "Eu te amo muitíssimo!!!",
    "Pensar em você já melhora meu dia.",
    "Eu acredito em você até nos dias em que você não acredita.",
    "Hoje pode ser um dia muuito produtivo, mas se não for eu continuo te amando sempre",
    "Se fizer tudo bonitinho ta podendo passar 10 horas no TikTok.",
    "Você me trás a minha melhor versão",
    "Tenho muita sorte de ter você pra viver do lado!",
    "Descansar também faz parte do processo, meu bem!",
    "Você virou meu lugar favorito sem nem perceber.",
    "Bora estudar minha futura radiologista??",
    "Você ilumina até os meus dias mais cinzas."
];

function mensagemAleatoria() {
    return MENSAGENS[Math.floor(Math.random() * MENSAGENS.length)];
}

/* ---------- Streak de treinos ---------- */

async function calcularStreak() {
    const treinos = await DB.listar("treinos");
    const dias = new Set(treinos.map(t => t.data || t.id));

    let streak = 0;
    const cursor = new Date();

    // Se ainda não treinou hoje, a sequência conta a partir de ontem
    if (!dias.has(hojeISO())) cursor.setDate(cursor.getDate() - 1);

    while (true) {
        const iso = cursor.getFullYear() + "-" +
            String(cursor.getMonth() + 1).padStart(2, "0") + "-" +
            String(cursor.getDate()).padStart(2, "0");
        if (!dias.has(iso)) break;
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

/* =====================================================
   DASHBOARD (roda apenas na index.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("resumo-treino")) return;
    iniciarDashboard();
});

async function iniciarDashboard() {
    const hoje = hojeISO();

    // Mensagem do dia (muda a cada visita)
    const msg = document.getElementById("msg-dia");
    if (msg) msg.textContent = mensagemAleatoria();

    // Resumo de hoje
    const [treinos, dietas, estudos, eventos] = await Promise.all([
        DB.listar("treinos"),
        DB.listar("dieta"),
        DB.listar("estudos"),
        DB.listar("agenda")
    ]);

    const treinouHoje = treinos.some(t => (t.data || t.id) === hoje);
    const dietaHoje = dietas.find(d => (d.data || d.id) === hoje);
    const dietaOk = dietaHoje && dietaHoje.cafe && dietaHoje.almoco &&
                    dietaHoje.cafeTarde && dietaHoje.jantar && dietaHoje.agua;
    const minutosHoje = estudos
        .filter(e => e.data === hoje)
        .reduce((soma, e) => soma + (Number(e.minutos) || 0), 0);

    setResumo("resumo-treino", treinouHoje, "💪 Treino", treinouHoje ? "Feito!" : "Pendente");
    setResumo("resumo-dieta", dietaOk, "🥗 Dieta", dietaOk ? "Completa!" : "Pendente");
    setResumo("resumo-estudos", minutosHoje > 0, "📚 Estudos",
        minutosHoje > 0 ? minutosHoje + " min hoje" : "Pendente");

    // Sequência
    const streak = await calcularStreak();
    const streakEl = document.getElementById("streak-info");
    if (streakEl) {
        streakEl.innerHTML = streak > 0
            ? "<span class='streak-num'>" + streak + "</span> dia" +
              (streak > 1 ? "s" : "") + " seguidos de treino. Que orgulho! 🔥"
            : "Comece uma sequência de treinos hoje! 💪";
    }

    // Última conquista (foto mais recente de treino ou dieta)
    const conquista = document.getElementById("conquista");
    if (conquista) {
        const fotos = [];
        treinos.forEach(t => { if (t.fotoUrl) fotos.push({ data: t.data || t.id, url: t.fotoUrl }); });
        dietas.forEach(d => (d.fotos || []).forEach(f =>
            fotos.push({ data: d.data || d.id, url: (typeof f === "string" ? f : f.url) })));
        fotos.sort((a, b) => b.data.localeCompare(a.data));
        if (fotos.length) {
            const src = await DB.resolverFoto(fotos[0].url);
            conquista.innerHTML = src
                ? "<img src='" + src + "' alt='Última conquista' class='conquista-foto'>" +
                  "<p>Registrada em " + formatarData(fotos[0].data) + " 💙</p>"
                : "<p>Você entrou no Aqui, Bibia! 🎉</p>";
        } else {
            conquista.innerHTML = "<p>Você entrou no Aqui, Bibia! 🎉</p>";
        }
    }

    // Próximo compromisso
    const prox = document.getElementById("prox-compromisso");
    if (prox) {
        const futuros = eventos
            .filter(e => e.data >= hoje)
            .sort((a, b) => (a.data + (a.hora || "")).localeCompare(b.data + (b.hora || "")));
        if (futuros.length) {
            const e = futuros[0];
            prox.innerHTML =
                "<strong>" + e.titulo + "</strong><br>" +
                formatarData(e.data) + " (" + diaDaSemana(e.data) + ")" +
                (e.hora ? " às " + e.hora : "");
        } else {
            prox.textContent = "Nenhum compromisso por enquanto. Aproveita pra descansar 💙";
        }
    }

    // Painel da Clara: como a Bibia está hoje
    const cardAdmin = document.getElementById("card-admin");
    if (cardAdmin && typeof ehAdmin === "function" && ehAdmin()) {
        cardAdmin.style.display = "block";

        // Ajusta o título do resumo pra deixar claro de quem é
        const tituloResumo = document.getElementById("titulo-resumo");
        if (tituloResumo) tituloResumo.textContent = "✨ Resumo de hoje da Bibia";

        let html = "";

        // Treino (com grupos musculares e cardio)
        const treinoHoje = treinos.find(t => (t.data || t.id) === hoje);
        if (treinoHoje) {
            const partes = [];
            if (treinoHoje.grupos && treinoHoje.grupos.length) partes.push(treinoHoje.grupos.join(", "));
            if (treinoHoje.cardio) partes.push("Cardio" + (treinoHoje.cardioMin ? " " + treinoHoje.cardioMin + "min" : ""));
            const fotoT = await DB.resolverFoto(treinoHoje.fotoUrl);
            html += "<div class='admin-bloco'><strong>💪 Treinou hoje!</strong>" +
                (partes.length ? "<p class='admin-descricao'>" + escaparApp(partes.join(" • ")) + "</p>" : "") +
                (fotoT ? "<img src='" + fotoT + "' alt='Treino' class='conquista-foto'>" : "") +
                "</div>";
        } else {
            html += "<div class='admin-bloco'><strong>💪 Treino:</strong> ainda não registrou.</div>";
        }

        // Dieta (cada refeição com o que ela comeu)
        const dHoje = dietas.find(d => (d.data || d.id) === hoje);
        if (dHoje) {
            const REFS = [
                ["cafe", "☕ Café da manhã"], ["almoco", "🍛 Almoço"],
                ["cafeTarde", "🥪 Café da tarde"], ["jantar", "🍲 Jantar"], ["agua", "💧 Água"]
            ];
            html += "<div class='admin-bloco'><strong>🥗 Dieta:</strong>";
            let marcouAlgo = false;
            REFS.forEach(([campo, rotulo]) => {
                if (!dHoje[campo]) return;
                marcouAlgo = true;
                const desc = dHoje.descricoes && dHoje.descricoes[campo];
                html += "<p class='admin-refeicao'>" + rotulo + " ✓" +
                    (desc ? " — <em>“" + escaparApp(desc) + "”</em>" : "") + "</p>";
            });
            if (!marcouAlgo) html += " nada marcado ainda.";

            const fotosBrutas = (dHoje.fotos || []).map(f =>
                typeof f === "string" ? { url: f, tipo: "" } : f);
            const fotosD = await Promise.all(fotosBrutas.map(f => DB.resolverFoto(f.url)));
            const validas = fotosBrutas.filter((f, i) => fotosD[i]);
            if (validas.length) {
                html += "<div class='foto-grid'>" +
                    fotosBrutas.map((f, i) => fotosD[i]
                        ? "<figure class='foto-card'><img src='" + fotosD[i] + "' alt='Refeição'>" +
                          (f.tipo ? "<figcaption>" + f.tipo + "</figcaption>" : "") + "</figure>"
                        : "").join("") +
                    "</div>";
            }
            html += "</div>";
        } else {
            html += "<div class='admin-bloco'><strong>🥗 Dieta:</strong> ainda não registrou nada hoje.</div>";
        }

        // Estudos (tempo + atividades das matérias)
        const atividades = await DB.listar("atividades");
        const totalAtv = atividades.length;
        const feitasAtv = atividades.filter(a => a.concluida).length;
        html += "<div class='admin-bloco'><strong>📚 Estudos:</strong> " +
            (minutosHoje > 0 ? minutosHoje + " min hoje. 👏" : "ainda não estudou hoje.") +
            (totalAtv ? "<p class='admin-refeicao'>✅ " + feitasAtv + " de " + totalAtv +
                " atividades concluídas</p>" : "") +
            "</div>";

        document.getElementById("admin-conteudo").innerHTML = html;
    }

    // Bilhetes novos pra você
    const cardRecados = document.getElementById("card-recados");
    if (cardRecados && typeof usuarioAtual === "function") {
        const eu = usuarioAtual();
        if (eu) {
            const recados = await DB.listar("recados");
            const novos = recados.filter(r => r.para === eu.id && !r.lido).length;
            if (novos > 0) {
                cardRecados.style.display = "block";
                document.getElementById("recados-novos").innerHTML =
                    "Você tem <strong>" + novos + "</strong> bilhete" +
                    (novos > 1 ? "s novos" : " novo") +
                    " te esperando na aba 💌 Recados!";
            }
        }
    }

    // Nosso momento (foto aleatória do casal)
    const destaque = document.getElementById("momento-destaque");
    if (destaque) {
        const momentos = await DB.listar("momentos");
        if (momentos.length) {
            const m = momentos[Math.floor(Math.random() * momentos.length)];
            const src = await DB.resolverFoto(m.foto);
            if (src) {
                destaque.innerHTML =
                    "<img src='" + src + "' alt='Nosso momento' class='conquista-foto'>" +
                    "<p>" + (m.legenda ? m.legenda + " • " : "") +
                    formatarData(m.data || "") + " 💜</p>";
            }
        }
    }
}

function setResumo(id, ok, rotulo, estado) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = rotulo + ": <strong>" + estado + "</strong>";
    el.classList.toggle("feito", !!ok);
}

function escaparApp(txt) {
    const div = document.createElement("div");
    div.textContent = txt || "";
    return div.innerHTML;
}
