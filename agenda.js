:root {
    --primary: #5B7CFA;
    --secondary: #A78BFA;

    --background: #EEF2FF;
    --surface: #FFFFFF;

    --text: #1e293b;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background:
        radial-gradient(
            circle at top left,
            rgba(79,125,255,.15),
            transparent 40%
        ),
        radial-gradient(
            circle at bottom right,
            rgba(139,92,246,.15),
            transparent 40%
        ),
        #F7F8FC;
}

header{
    background: linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color: white;

    padding: 2rem;

    border-radius: 20px;

    margin-bottom: 1.5rem;
}

header h1 {
    color: white;

    margin-bottom: .5rem;
}

main {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding-bottom: 5rem;
}

.card {
    background: rgba(255,255,255,.75);

    backdrop-filter: blur(10px);

    padding: 1rem;

    border-radius: 20px;

}

.card h2 {
    margin-bottom: .75rem;
}

.card ul {
    list-style: none;
}

.card li {
    margin-bottom: .5rem;
}

.message-card {
    background: linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color: white;
}

nav {
    position: fixed;

    bottom: 0;
    left: 0;

    width: 100%;

    background: white;

    display: flex;
    justify-content: space-around;

    padding:1rem;

    border-top: 1px solid #ddd;
}

nav a {
    text-decoration: none;

    font-size: 1.3rem;
}

/* ===================================
   AGENDA - AQUI, BIBIA
=================================== */
.tabs {
    display: flex;
    gap: 10px;
}

.tab-btn {
    flex: 1;
    border: none;
    cursor: pointer;

    padding: 12px;

    border-radius: 12px;

    background: #eef2ff;

    color: var(--text);

    font-weight: 600;

    transition: .2s;
}

.tab-btn.active {
    background: var(--primary);
    color: white;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: block;
}

/* ===================================
   CALENDÁRIO
=================================== */

.calendar-header {
    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 20px;
}

.calendar-header h2 {
    font-size: 1.1rem;
}

.calendar-header button {
    border: none;

    background: var(--primary);

    color: white;

    width: 40px;
    height: 40px;

    border-radius: 10px;

    cursor: pointer;
}

.weekdays {
    display: grid;

    grid-template-columns: repeat(7, 1fr);

    text-align: center;

    margin-bottom: 10px;

    font-size: .85rem;

    font-weight: 600;

    color: #64748b;
}

.calendar-grid {
    display: grid;

    grid-template-columns: repeat(7, 1fr);

    gap: 8px;
}

.cal-day {
    aspect-ratio: 1;

    display: flex;

    justify-content: center;

    align-items: center;

    border-radius: 12px;

    cursor: pointer;

    background: #f8fafc;

    transition: .2s;
}

.cal-day:hover {
    background: #e2e8f0;
}

.cal-empty {
    background: transparent;
    cursor: default;
}

.cal-day.today {
    border: 2px solid var(--primary);
}

.cal-day.selected {
    background: var(--primary);
    color: white;
}

.cal-day.has-event::after {
    content: "";

    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: #22c55e;

    position: absolute;
}

.cal-day {
    position: relative;
}

/* ===================================
   PRÓXIMOS EVENTOS
=================================== */

#lista-proximos {
    margin-top: 15px;
}

.proximo-evento {
    display: flex;

    align-items: center;

    gap: 10px;

    padding: 12px 0;

    border-bottom: 1px solid #e5e7eb;
}

.event-dot {
    width: 10px;
    height: 10px;

    border-radius: 50%;

    background: var(--primary);
}

.event-info {
    flex: 1;
}

.event-title {
    font-weight: 600;
}

.event-date {
    font-size: .8rem;
    color: #64748b;
}

.empty-message {
    text-align: center;

    color: #64748b;

    padding: 20px 10px;

    line-height: 1.5;
}

/* ===================================
   DIA SELECIONADO
=================================== */

.day-header {
    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 20px;
}

.slot-list {
    display: flex;

    flex-direction: column;

    gap: 12px;
}

.slot-hora {
    display: flex;

    gap: 12px;
}

.slot-label {
    width: 60px;

    font-weight: 600;

    color: #64748b;
}

.slot-events {
    flex: 1;
}

.ev-block {
    background: #eef2ff;

    border-left: 4px solid var(--primary);

    border-radius: 10px;

    padding: 10px;

    margin-bottom: 10px;
}

.ev-info {
    display: flex;

    flex-direction: column;

    gap: 4px;
}

.ev-time {
    font-size: .8rem;

    color: #64748b;
}

.ev-dia-todo {
    display: flex;

    flex-direction: column;

    gap: 10px;
}

.ev-dia-pill {
    display: flex;

    align-items: center;

    gap: 10px;

    padding: 12px;

    border-radius: 10px;

    background: #eef2ff;
}

/* ===================================
   VISÃO ANUAL
=================================== */

.ano-grid {
    display: grid;

    grid-template-columns: repeat(2, 1fr);

    gap: 15px;
}

.mes-mini-card {
    background: #f8fafc;

    padding: 12px;

    border-radius: 12px;

    cursor: pointer;

    transition: .2s;
}

.mes-mini-card:hover {
    transform: translateY(-2px);
}

.mes-mini-title {
    text-align: center;

    font-weight: 600;

    margin-bottom: 10px;
}

.mes-mini-grid {
    display: grid;

    grid-template-columns: repeat(7, 1fr);

    gap: 3px;
}

.mmd-header {
    text-align: center;

    font-size: .7rem;

    color: #64748b;
}

.mmd-day {
    text-align: center;

    font-size: .7rem;

    padding: 3px;

    border-radius: 6px;
}

.mmd-day.today {
    background: var(--primary);

    color: white;
}

.mmd-day.has-ev {
    background: #dbeafe;
}

/* ===================================
   BOTÕES
=================================== */

.btn-primary {
    border: none;

    cursor: pointer;

    padding: 12px 18px;

    border-radius: 12px;

    background: linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color: white;

    font-weight: 600;
}

.btn-icon {
    border: none;

    background: transparent;

    cursor: pointer;

    font-size: 1rem;
}

/* ===================================
   MODAL
=================================== */

.modal {
    position: fixed;

    inset: 0;

    background: rgba(0,0,0,.4);

    display: none;

    justify-content: center;

    align-items: center;

    padding: 20px;

    z-index: 1000;
}

.modal.open {
    display: flex;
}

.modal-content {
    background: white;

    width: 100%;
    max-width: 500px;

    border-radius: 20px;

    padding: 24px;

    display: flex;

    flex-direction: column;

    gap: 12px;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
    width: 100%;

    padding: 12px;

    border-radius: 10px;

    border: 1px solid #d1d5db;
}

.modal-close {
    align-self: flex-end;

    border: none;

    background: transparent;

    font-size: 1.2rem;

    cursor: pointer;
}

/* ===================================
   DESKTOP
=================================== */

@media (min-width: 768px) {

    .ano-grid {
        grid-template-columns: repeat(4, 1fr);
    }

}
/* ===================================
   COMPLEMENTOS GERAIS
   (adicionados sem alterar o que já existia)
=================================== */

body {
    font-family: 'Poppins', sans-serif;
    color: var(--text);
    padding: 16px;
    min-height: 100vh;
}

h1, h2 {
    font-weight: 600;
}

.card h2 {
    font-size: 1.05rem;
}

/* Nav inferior: alvos de toque maiores e item ativo */
nav a {
    padding: 10px 12px;
    border-radius: 12px;
    line-height: 1;
    transition: background .2s;
}

nav a.ativo {
    background: #eef2ff;
}

nav a:active {
    background: #e0e7ff;
}

.hint {
    font-size: .85rem;
    color: #64748b;
    margin-top: 8px;
}

/* ===================================
   BOTÕES GRANDES (mobile-first)
=================================== */

.btn-big {
    display: block;
    width: 100%;
    border: none;
    cursor: pointer;

    padding: 16px;
    margin-top: 12px;

    border-radius: 16px;

    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;

    font-family: inherit;
    font-size: 1.05rem;
    font-weight: 600;

    transition: transform .15s, opacity .2s;
}

.btn-big:active {
    transform: scale(.98);
}

.btn-big:disabled {
    opacity: .65;
    cursor: default;
}

.btn-claro {
    display: inline-block;
    border: none;
    cursor: pointer;

    margin-top: 12px;
    padding: 10px 16px;

    border-radius: 12px;

    background: rgba(255,255,255,.25);
    color: white;

    font-family: inherit;
    font-weight: 600;
}

/* ===================================
   DESTAQUE / STREAK
=================================== */

.destaque-card {
    text-align: center;
}

.streak-grande {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 10px 0;
}

.streak-num {
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* ===================================
   CHECKLIST DA DIETA
=================================== */

.checklist {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
}

.check-item {
    display: flex;
    align-items: center;

    border: 2px solid #e2e8f0;
    cursor: pointer;

    padding: 14px 16px;

    border-radius: 14px;

    background: #f8fafc;
    color: var(--text);

    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    text-align: left;

    transition: all .2s;
}

.check-item::after {
    content: "";
    margin-left: auto;

    width: 22px;
    height: 22px;

    border: 2px solid #cbd5e1;
    border-radius: 50%;

    transition: all .2s;
}

.check-item.marcado {
    background: #eef2ff;
    border-color: var(--primary);
}

.check-item.marcado::after {
    content: "✓";
    display: flex;
    justify-content: center;
    align-items: center;

    border-color: var(--primary);
    background: var(--primary);
    color: white;

    font-size: .8rem;
    font-weight: 700;
}

/* ===================================
   UPLOAD E FOTOS
=================================== */

.upload-label {
    display: block;

    margin-top: 12px;
    padding: 16px;

    border: 2px dashed var(--secondary);
    border-radius: 16px;

    background: #faf5ff;
    color: var(--text);

    text-align: center;
    font-weight: 600;

    cursor: pointer;

    transition: background .2s;
}

.upload-label:active {
    background: #f3e8ff;
}

.foto-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 14px;
}

.foto-card {
    margin: 0;
    border-radius: 16px;
    overflow: hidden;
    background: #f1f5f9;
}

.foto-card img {
    display: block;
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
}

.conquista-foto {
    display: block;
    width: 100%;
    max-height: 260px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 10px;
}

/* ===================================
   LISTAS (histórico, estudos...)
=================================== */

.lista-item {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px 0;

    border-bottom: 1px solid #eef2f7;
}

.lista-item:last-child {
    border-bottom: none;
}

.thumb {
    width: 48px;
    height: 48px;

    border-radius: 12px;
    object-fit: cover;

    flex-shrink: 0;
}

.thumb-vazio {
    display: flex;
    justify-content: center;
    align-items: center;

    background: #eef2ff;
    font-size: 1.3rem;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.item-sub {
    font-size: .8rem;
    color: #64748b;
}

.badge {
    background: #dcfce7;
    color: #15803d;

    font-size: .75rem;
    font-weight: 600;

    padding: 4px 10px;
    border-radius: 999px;

    white-space: nowrap;
}

/* ===================================
   FORMULÁRIOS
=================================== */

.form-coluna {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 8px;
}

.form-coluna input,
.form-coluna textarea {
    width: 100%;
    padding: 14px;

    border: 1px solid #d1d5db;
    border-radius: 12px;

    font-family: inherit;
    font-size: 1rem;

    background: white;
}

.form-coluna input:focus,
.form-coluna textarea:focus,
.modal-content input:focus,
.modal-content textarea:focus {
    outline: 2px solid var(--primary);
    border-color: var(--primary);
}

.form-coluna .btn-big {
    margin-top: 4px;
}

/* ===================================
   RECADOS
=================================== */

.recado {
    background: #f8f7ff;
    border-left: 4px solid var(--secondary);
    border-radius: 12px;

    padding: 14px;
    margin-bottom: 12px;
}

.recado-texto {
    line-height: 1.5;
    white-space: pre-wrap;
}

.recado-rodape {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

/* ===================================
   TOAST (aviso rápido)
=================================== */

.toast {
    position: fixed;
    left: 50%;
    bottom: 90px;

    transform: translateX(-50%) translateY(20px);

    background: var(--text);
    color: white;

    padding: 12px 20px;
    border-radius: 999px;

    font-size: .9rem;
    font-weight: 500;

    opacity: 0;
    pointer-events: none;

    transition: all .3s;

    z-index: 2000;

    max-width: calc(100% - 32px);
    text-align: center;
}

.toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* ===================================
   ACESSIBILIDADE E AJUSTES FINOS
=================================== */

button {
    font-family: inherit;
}

.cal-day {
    border: none;
    font-family: inherit;
    font-size: .95rem;
    min-height: 42px;
}

.cal-day.today {
    border: 2px solid var(--primary);
}

@media (prefers-reduced-motion: reduce) {
    * {
        transition: none !important;
        animation: none !important;
    }
}

/* ===================================
   DESKTOP (complemento)
=================================== */

@media (min-width: 768px) {

    body {
        max-width: 720px;
        margin: 0 auto;
        padding: 24px;
    }

    .foto-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    nav {
        left: 50%;
        transform: translateX(-50%);
        max-width: 720px;
        border-radius: 20px 20px 0 0;
    }
}

/* ===================================
   PERFIS (Quem está aí?)
=================================== */

.perfil-overlay {
    position: fixed;
    inset: 0;

    background: linear-gradient(135deg, var(--primary), var(--secondary));

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 20px;
    z-index: 3000;
}

.perfil-box {
    background: white;

    width: 100%;
    max-width: 340px;

    border-radius: 24px;
    padding: 28px 24px;

    text-align: center;

    display: flex;
    flex-direction: column;
    gap: 12px;
}

.perfil-btn {
    border: 2px solid #e2e8f0;
    cursor: pointer;

    padding: 16px;
    border-radius: 16px;

    background: #f8fafc;
    color: var(--text);

    font-family: inherit;
    font-size: 1.1rem;
    font-weight: 600;

    transition: all .2s;
}

.perfil-btn:active {
    background: #eef2ff;
    border-color: var(--primary);
    transform: scale(.98);
}

.quem-sou {
    margin-top: 10px;
    font-size: .85rem;
    opacity: .9;
}

.link-trocar {
    border: none;
    background: rgba(255,255,255,.25);
    color: white;

    cursor: pointer;

    padding: 4px 10px;
    border-radius: 999px;

    font-family: inherit;
    font-size: .75rem;
    font-weight: 600;
}

/* ===================================
   RECADOS — recebidos e novos
=================================== */

.recado-recebido {
    background: #eef2ff;
    border-left-color: var(--primary);
}

.badge-novo {
    display: inline-block;
    background: #fce7f3;
    color: #be185d;
    margin-bottom: 8px;
}

/* ===================================
   GALERIA — Nossos momentos
=================================== */

.galeria {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
}

.momento-card {
    margin: 0;

    border-radius: 18px;
    overflow: hidden;

    background: #f8fafc;
    border: 1px solid #eef2f7;
}

.momento-card img {
    display: block;
    width: 100%;
    max-height: 340px;
    object-fit: cover;
}

.momento-card figcaption {
    padding: 12px 14px;
}

.momento-card figcaption p {
    font-size: .95rem;
    line-height: 1.4;
}

/* Nav com 7 itens: alvos um pouco mais compactos */
nav {
    gap: 2px;
}

nav a {
    padding: 10px 8px;
    font-size: 1.2rem;
}

@media (min-width: 768px) {
    .galeria {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ===================================
   STATUS DO FIREBASE (canto fixo)
=================================== */

.status-firebase {
    position: fixed;
    top: 10px;
    right: 10px;

    background: rgba(255, 255, 255, .92);
    color: #64748b;

    border: 1px solid #e2e8f0;
    border-radius: 999px;

    padding: 5px 12px;

    font-size: .72rem;
    font-weight: 600;

    z-index: 2500;

    box-shadow: 0 2px 8px rgba(0, 0, 0, .08);

    pointer-events: none;
}

.status-firebase.online {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
}

/* ===================================
   PERFIL CLARA (administração)
=================================== */

/* A agenda sai do perfil da Clara */
.perfil-clara nav a[aria-label="Agenda"] {
    display: none;
}

.perfil-clara #card-agenda {
    display: none;
}

/* Painel "Como a Bibia está hoje" */
.admin-bloco {
    padding: 12px 0;
    border-bottom: 1px solid #eef2f7;
    font-size: .95rem;
    line-height: 1.5;
}

.admin-bloco:last-child {
    border-bottom: none;
}

.admin-bloco .conquista-foto {
    margin-top: 10px;
    margin-bottom: 0;
}

.admin-descricao {
    margin-top: 6px;
    color: #475569;
    font-style: italic;
}

/* ===================================
   TREINO — grupos musculares e cardio
=================================== */

.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.chip {
    border: 2px solid #e2e8f0;
    cursor: pointer;

    padding: 10px 14px;
    border-radius: 999px;

    background: #f8fafc;
    color: var(--text);

    font-family: inherit;
    font-size: .9rem;
    font-weight: 500;

    transition: all .15s;
}

.chip.on {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-color: transparent;
    color: white;
}

.chip:active {
    transform: scale(.96);
}

.cardio-wrap {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cardio-wrap input {
    padding: 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    font-family: inherit;
    font-size: 1rem;
}

.btn-perigo {
    display: block;
    width: 100%;
    border: 2px solid #fecaca;
    cursor: pointer;

    margin-top: 12px;
    padding: 12px;

    border-radius: 14px;

    background: #fef2f2;
    color: #b91c1c;

    font-family: inherit;
    font-size: .9rem;
    font-weight: 600;
}

/* ===================================
   DIETA — descrição por refeição
=================================== */

.check-wrap {
    display: flex;
    flex-direction: column;
}

.check-wrap .check-item {
    width: 100%;
}

.desc-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 14px 14px;

    margin-top: -6px;
    padding: 12px;

    display: flex;
    flex-direction: column;
    gap: 8px;
}

.desc-box textarea {
    width: 100%;
    padding: 10px;

    border: 1px solid #d1d5db;
    border-radius: 10px;

    font-family: inherit;
    font-size: .95rem;
}

.btn-mini {
    align-self: flex-end;

    border: none;
    cursor: pointer;

    padding: 8px 14px;
    border-radius: 10px;

    background: var(--primary);
    color: white;

    font-family: inherit;
    font-size: .85rem;
    font-weight: 600;
}

.tipo-select {
    width: 100%;
    margin-top: 10px;
    padding: 14px;

    border: 1px solid #d1d5db;
    border-radius: 12px;

    font-family: inherit;
    font-size: 1rem;

    background: white;
}

.foto-card figcaption {
    padding: 6px 8px;
    font-size: .75rem;
    color: #64748b;
    text-align: center;
}

.admin-refeicao {
    margin-top: 4px;
    font-size: .9rem;
}

/* Badge de erro do Firebase */
.status-firebase.erro {
    background: #fef2f2;
    color: #b91c1c;
    border-color: #fecaca;

    max-width: 75vw;
    white-space: normal;
    text-align: right;
}

/* ===================================
   ESTUDOS — matérias e atividades
=================================== */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 16px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 14px 8px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    box-shadow: 0 2px 10px rgba(99, 102, 241, .08);
}

.stat-num {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.stat-num.stat-verde {
    background: linear-gradient(135deg, #059669, #10b981);
    -webkit-background-clip: text;
    background-clip: text;
}

.stat-label {
    font-size: .75rem;
    color: #64748b;
}

.progress-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.progress-bar {
    width: 100%;
    height: 10px;

    background: #eef2f7;
    border-radius: 999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 999px;
    transition: width .4s ease;
}

/* Cartão de matéria */
.materia-card {
    border: 1px solid #eef2f7;
    border-radius: 16px;

    margin-bottom: 12px;
    overflow: hidden;

    background: #fdfdff;
}

.materia-header {
    display: flex;
    align-items: center;
    gap: 10px;

    width: 100%;
    padding: 14px;

    border: none;
    background: none;
    cursor: pointer;

    font-family: inherit;
    text-align: left;
}

.materia-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
}

.materia-nome {
    flex: 1;
    font-weight: 600;
    font-size: 1rem;
    color: var(--text);
    min-width: 0;
    overflow-wrap: anywhere;
}

.materia-contagem {
    font-size: .8rem;
    color: #64748b;
    white-space: nowrap;
}

.materia-seta {
    font-size: .7rem;
    color: #94a3b8;
}

.materia-progresso {
    padding: 0 14px 12px;
}

.materia-progresso .progress-bar {
    height: 6px;
}

.materia-corpo {
    padding: 4px 14px 14px;
    border-top: 1px solid #eef2f7;
}

/* Atividades */
.atv-item {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
}

.atv-item:last-of-type {
    border-bottom: none;
}

.atv-check {
    width: 26px;
    height: 26px;
    flex-shrink: 0;

    border: 2px solid var(--primary);
    border-radius: 50%;

    background: white;
    color: white;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: .8rem;
    font-weight: 700;

    transition: all .15s;
}

.atv-texto {
    font-size: .95rem;
    overflow-wrap: anywhere;
}

.atv-item.feita .atv-texto {
    text-decoration: line-through;
    color: #94a3b8;
}

.tag {
    font-size: .68rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 999px;
    white-space: nowrap;
}

.tag-alta  { background: #fee2e2; color: #b91c1c; }
.tag-media { background: #fef3c7; color: #b45309; }
.tag-baixa { background: #f1f5f9; color: #64748b; }

/* Formulário de nova atividade */
.form-atv {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #e2e8f0;
}

.atv-linha {
    display: flex;
    gap: 8px;
}

.atv-linha .tipo-select {
    margin-top: 0;
    flex: 1;
}

.atv-linha .atv-prazo {
    flex: 1;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    font-family: inherit;
    font-size: .9rem;
    min-width: 0;
}

.form-atv .btn-primary {
    width: 100%;
    padding: 12px;
}

.materia-acoes {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 12px;
}

.btn-mini-perigo {
    background: #fef2f2;
    color: #b91c1c;
}

/* Color picker do modal */
.color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 4px 0 8px;
}

.cor-dot {
    width: 34px;
    height: 34px;

    border-radius: 50%;
    border: 3px solid transparent;

    cursor: pointer;
    transition: transform .15s, border-color .15s;
}

.cor-dot.sel {
    border-color: var(--text);
    transform: scale(1.12);
}
