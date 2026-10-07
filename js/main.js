/* =========================================================
   U zapomenutého sadu : scripts
   ========================================================= */

/* ---------------------------------------------------------
   AVANCEMENT DU PROJET : seul endroit à modifier.
   status : "done" (terminé) | "current" (en cours) | "upcoming" (à venir)
   --------------------------------------------------------- */
const PROJECT_PROGRESS = {
    updated: 'octobre 2026',
    steps: [
        {
            title: 'Viabilisation des terrains',
            status: 'current',
            label: 'En cours',
            text: "Eau, électricité, tout-à-l'égout. La date du raccordement électrique dépend du gestionnaire de réseau."
        },
        {
            title: 'Permis de construire',
            status: 'current',
            label: "En cours d'instruction",
            text: 'Retour des organismes consultés attendu au printemps 2027.'
        },
        {
            title: 'Lancement des ventes',
            status: 'upcoming',
            label: 'Prévu début 2027',
            text: 'Les personnes inscrites sont informées en premier.'
        },
        {
            title: 'Construction',
            status: 'upcoming',
            label: 'À venir',
            text: 'Maisons préfabriquées en atelier, montage rapide sur le terrain.'
        },
        {
            title: 'Livraison',
            status: 'upcoming',
            label: 'Sous un an',
            text: 'Après la signature du contrat de construction.'
        }
    ]
};

/* ---------------------------------------------------------
   TERRAINS : surfaces et statuts du plan de situation.
   --------------------------------------------------------- */
const LOTS = {
    1: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    2: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    3: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    4: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    5: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    6: { area: '500 à 550 m²', status: 'Ouverture des ventes début 2027' },
    7: { area: '1 200 m²', status: 'Ouverture des ventes début 2027' }
};

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initHeader();
    initNav();
    renderTimeline();
    initPlan();
    initFacade('map-load', 'map', (btn) => {
        const f = document.createElement('iframe');
        f.src = btn.dataset.src;
        f.title = 'Carte Mapy.com : emplacement du projet à Dřetovice';
        f.loading = 'lazy';
        return f;
    });
    initFacade('video-load', 'video-player', (btn) => {
        const f = document.createElement('iframe');
        f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.id}?autoplay=1&rel=0`;
        f.title = 'Vidéo drone du terrain et du verger';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        return f;
    });
    initForm();
    initReveal();
});

/* Header transparent sur le hero, opaque ensuite */
function initHeader() {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    if (!header || !hero) return;
    const io = new IntersectionObserver(([e]) => header.classList.toggle('is-solid', !e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' });
    io.observe(hero);
}

/* Menu mobile */
function initNav() {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (!btn || !nav) return;
    const header = document.querySelector('.site-header');
    const close = () => {
        btn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
    };
    btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
        if (open && header) header.classList.add('is-solid');
    });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* Frise d'avancement */
function renderTimeline() {
    const list = document.getElementById('timeline');
    if (!list) return;
    const updated = document.getElementById('timeline-updated');
    if (updated) updated.textContent = PROJECT_PROGRESS.updated;
    list.innerHTML = PROJECT_PROGRESS.steps.map((s, i) => `
        <li class="step step--${s.status} reveal">
            <span class="step__dot" aria-hidden="true">${s.status === 'done' ? '✓' : i + 1}</span>
            <p class="step__status">${s.label}</p>
            <h3>${s.title}</h3>
            <p>${s.text}</p>
        </li>`).join('');
}

/* Plan de situation */
function initPlan() {
    const svg = document.getElementById('plan-svg');
    if (!svg) return;
    const tip = document.getElementById('plan-tooltip');
    const lots = svg.querySelectorAll('.lot');
    const num = document.getElementById('lot-num');
    const area = document.getElementById('lot-area');
    const status = document.getElementById('lot-status');
    const cta = document.getElementById('lot-cta');

    const select = (g) => {
        const id = g.dataset.lot;
        const lot = LOTS[id];
        lots.forEach((l) => { l.classList.toggle('is-active', l === g); l.setAttribute('aria-pressed', String(l === g)); });
        num.textContent = id;
        area.textContent = lot.area;
        status.textContent = lot.status;
        cta.dataset.lot = id;
    };
    const showTip = (g) => {
        const box = g.getBBox();
        const ctm = g.getScreenCTM();
        const wrap = svg.closest('.plan__map').getBoundingClientRect();
        const pt = svg.createSVGPoint();
        pt.x = box.x + box.width / 2; pt.y = box.y;
        const p = pt.matrixTransform(ctm);
        tip.textContent = `Terrain ${g.dataset.lot} · ${LOTS[g.dataset.lot].area}`;
        tip.style.left = `${p.x - wrap.left}px`;
        tip.style.top = `${p.y - wrap.top}px`;
        tip.classList.add('is-visible');
    };
    const hideTip = () => tip.classList.remove('is-visible');

    lots.forEach((g) => {
        g.addEventListener('click', () => select(g));
        g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(g); } });
        g.addEventListener('mouseenter', () => showTip(g));
        g.addEventListener('focus', () => showTip(g));
        g.addEventListener('mouseleave', hideTip);
        g.addEventListener('blur', hideTip);
    });
    select(lots[0]);

    /* Le bouton du terrain présélectionne le terrain dans le formulaire */
    cta.addEventListener('click', () => {
        const sel = document.getElementById('f-lot');
        if (sel) sel.value = cta.dataset.lot;
    });
}

/* Façade : charge un iframe tiers (carte, vidéo) uniquement au clic */
function initFacade(btnId, containerId, build) {
    const btn = document.getElementById(btnId);
    const box = document.getElementById(containerId);
    if (!btn || !box) return;
    btn.addEventListener('click', () => {
        box.appendChild(build(btn));
        btn.remove();
    }, { once: true });
}

/* Formulaire : validation côté client (la validation serveur fait foi) */
function initForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;
    const t = document.getElementById('f-t');
    if (t) t.value = String(Date.now());

    const status = document.getElementById('form-status');
    const params = new URLSearchParams(location.search);
    if (params.has('erreur') && status) {
        const msg = {
            champs: 'Merci de vérifier les champs obligatoires.',
            envoi: "L'envoi a échoué. Réessayez ou écrivez-nous directement."
        };
        status.textContent = msg[params.get('erreur')] || msg.envoi;
        status.hidden = false;
    }

    const rules = [
        { el: form.nom, err: 'e-nom', ok: (v) => v.trim().length > 1, msg: 'Merci d\'indiquer votre nom.' },
        { el: form.email, err: 'e-email', ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Merci d\'indiquer une adresse e-mail valide.' },
        { el: form.consentement, err: 'e-consent', ok: (_, el) => el.checked, msg: 'Merci de cocher la case de consentement.' }
    ];

    form.addEventListener('submit', (e) => {
        let first = null;
        rules.forEach((r) => {
            const valid = r.ok(r.el.value, r.el);
            r.el.setAttribute('aria-invalid', String(!valid));
            const out = document.getElementById(r.err);
            out.textContent = valid ? '' : r.msg;
            if (valid) r.el.removeAttribute('aria-describedby'); else r.el.setAttribute('aria-describedby', r.err);
            if (!valid && !first) first = r.el;
        });
        if (first) { e.preventDefault(); first.focus(); }
    });
}

/* Apparition douce au scroll */
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
}
