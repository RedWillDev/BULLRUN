<script setup>
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'

const offers = ref([])
const loading = ref(true)
const search = ref('')
const filterPrio = ref('ALL')

async function loadCSV() {
  loading.value = true
  try {
    const response = await fetch(
      `/MARCHES_PUBLICS_FINAL.csv?t=${Date.now()}`,
      { cache: 'no-store' }
    )
    const csvText = await response.text()
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
    })
    offers.value = parsed.data.map((row) => {
      const normalized = {}
      Object.entries(row).forEach(([key, value]) => {
        if (typeof key === 'string') normalized[key.trim().toLowerCase()] = value?.trim() ?? ''
      })
      return normalized
    })
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}

const counts = computed(() => ({
  ALL:       offers.value.length,
  TOP:       offers.value.filter(o => o.priorite === 'TOP').length,
  IMPORTANT: offers.value.filter(o => o.priorite === 'IMPORTANT').length,
  NORMAL:    offers.value.filter(o => o.priorite === 'NORMAL').length,
}))

const filteredOffers = computed(() => {
  const q = search.value.toLowerCase()
  return offers.value.filter((offer) => {
    const matchSearch =
      offer.titre?.toLowerCase().includes(q) ||
      offer.acheteur?.toLowerCase().includes(q)
    const matchPrio =
      filterPrio.value === 'ALL' || offer.priorite === filterPrio.value
    return matchSearch && matchPrio
  })
})

onMounted(() => {
  loadCSV()
  setInterval(loadCSV, 1000 * 60 * 5)
})
</script>

<template>
  <div class="root">

    <div class="bg-layer" aria-hidden="true">
      <div class="bg-orb bg-orb--top" />
      <div class="bg-orb bg-orb--bottom" />
      <div class="bg-grid" />
    </div>

    <div class="container">

      <!-- HEADER -->
      <header class="header glass">
        <div class="header__inner">
          <div class="header__brand">
            <div class="brand-icon">
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 28 C10 18, 6 8, 14 4 C18 2, 22 8, 20 18 Z" fill="#F97316" />
                <path d="M82 28 C90 18, 94 8, 86 4 C82 2, 78 8, 80 18 Z" fill="#F97316" />
                <ellipse cx="50" cy="52" rx="32" ry="28" fill="#292524" />
                <ellipse cx="50" cy="67" rx="18" ry="12" fill="#3D2E28" />
                <ellipse cx="43" cy="69" rx="4" ry="3" fill="#0F0A08" />
                <ellipse cx="57" cy="69" rx="4" ry="3" fill="#0F0A08" />
                <ellipse cx="35" cy="46" rx="8" ry="7" fill="#FFF7ED" />
                <ellipse cx="65" cy="46" rx="8" ry="7" fill="#FFF7ED" />
                <ellipse cx="38" cy="44" rx="4.5" ry="5" fill="#EF4444" />
                <ellipse cx="62" cy="44" rx="4.5" ry="5" fill="#EF4444" />
                <ellipse cx="39" cy="43" rx="2.5" ry="3" fill="#0F0A08" />
                <ellipse cx="63" cy="43" rx="2.5" ry="3" fill="#0F0A08" />
                <path d="M27 38 C31 33, 37 34, 42 37" stroke="#F97316" stroke-width="3.5" stroke-linecap="round" fill="none" />
                <path d="M73 38 C69 33, 63 34, 58 37" stroke="#F97316" stroke-width="3.5" stroke-linecap="round" fill="none" />
                <path d="M46 36 L50 30 L54 36" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                <path d="M28 58 C24 54, 20 56, 16 52" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />
                <path d="M72 58 C76 54, 80 56, 84 52" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />
                <circle cx="50" cy="63" r="5" stroke="#F97316" stroke-width="2.5" fill="none" />
              </svg>
            </div>
            <div>
              <h1 class="header__title">BULLRUN</h1>
              <p class="header__subtitle">Surveillance des appels d'offres en temps réel</p>
            </div>
          </div>
          <div class="status-badge">
            <span class="status-dot" />
            <span>{{ offers.length }} offres actives</span>
          </div>
        </div>
      </header>

      <!-- FILTRES PRIORITÉ -->
      <div class="filters">
        <button
          v-for="prio in ['ALL', 'TOP', 'IMPORTANT', 'NORMAL']"
          :key="prio"
          class="filter-btn"
          :class="[`filter-btn--${prio.toLowerCase()}`, { active: filterPrio === prio }]"
          @click="filterPrio = prio"
        >
          <span v-if="prio !== 'ALL'" class="filter-dot" :class="`dot--${prio.toLowerCase()}`" />
          {{ prio === 'ALL' ? 'Toutes' : prio }}
          <span class="filter-count">{{ counts[prio] }}</span>
        </button>
      </div>

      <!-- SEARCH -->
      <div class="search-wrapper">
        <div class="search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher une offre, un acheteur…"
          class="search-input"
        />
        <kbd v-if="!search" class="search-kbd">⌘K</kbd>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="loading-state">
        <div class="spinner" />
        <p class="loading-text">Chargement des offres…</p>
      </div>

      <!-- EMPTY -->
      <div v-else-if="filteredOffers.length === 0" class="empty-state glass">
        <div class="empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <p class="empty-title">Aucune offre trouvée</p>
        <p class="empty-sub">Essayez un autre mot-clé ou filtre</p>
      </div>

      <!-- GRID -->
      <div v-else class="grid">
        <article
          v-for="(offer, index) in filteredOffers"
          :key="index"
          class="card glass"
          :class="`card--${(offer.priorite || 'NORMAL').toLowerCase()}`"
        >
          <div class="card__header">
            <span class="card__badge" :class="`badge--${(offer.priorite || 'NORMAL').toLowerCase()}`">
              {{ offer.priorite || 'NORMAL' }}
            </span>
            <span class="card__score" v-if="offer.score">Score {{ offer.score }}</span>
          </div>

          <h2 class="card__title">{{ offer.titre || 'Sans titre' }}</h2>

          <div class="card__meta">
            <div class="meta-row">
              <span class="meta-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                Acheteur
              </span>
              <span class="meta-value">{{ offer.acheteur || '—' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Publication
              </span>
              <span class="meta-value">{{ offer.date_publication || '—' }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Date limite
              </span>
              <span class="meta-value meta-value--date">{{ offer.date_limite || '—' }}</span>
            </div>
            <div class="meta-row" v-if="offer.source_csv">
              <span class="meta-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
                Source
              </span>
              <span class="meta-value meta-value--source">{{ offer.source_csv }}</span>
            </div>
          </div>

          <div class="card__footer">
            <a v-if="offer.url" :href="offer.url" target="_blank" class="btn-primary">
              Voir l'offre
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <span v-else class="btn-disabled">Pas de lien</span>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.root {
  min-height: 100svh;
  background: #080A10;
  color: #E8EAF0;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  position: relative;
  overflow-x: hidden;
}

.bg-layer { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: .18; }
.bg-orb--top { width: 700px; height: 700px; top: -200px; left: 50%; transform: translateX(-50%); background: radial-gradient(circle, #F97316 0%, #EF4444 50%, transparent 100%); }
.bg-orb--bottom { width: 500px; height: 500px; bottom: -100px; right: -100px; background: radial-gradient(circle, #A78BFA 0%, transparent 70%); opacity: .12; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%); }

.container { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 48px 24px 80px; }

.glass { background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.09); backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); }

/* HEADER */
.header { border-radius: 20px; margin-bottom: 24px; padding: 28px 32px; position: relative; overflow: hidden; }
.header::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(56,189,248,.07) 0%, transparent 50%, rgba(129,140,248,.07) 100%); pointer-events: none; }
.header__inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.header__brand { display: flex; align-items: center; gap: 16px; }
.brand-icon { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, rgba(249,115,22,.15), rgba(239,68,68,.1)); border: 1px solid rgba(249,115,22,.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 24px rgba(249,115,22,.18); }
.header__title { font-size: 32px; font-weight: 800; letter-spacing: .08em; background: linear-gradient(135deg, #FDBA74 0%, #F97316 40%, #EF4444 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.15; }
.header__subtitle { font-size: 13px; color: #64748B; margin-top: 3px; }
.status-badge { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; border: 1px solid rgba(52,211,153,.2); background: rgba(52,211,153,.08); padding: 7px 16px; font-size: 13px; font-weight: 500; color: #6EE7B7; white-space: nowrap; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #34D399; box-shadow: 0 0 8px rgba(52,211,153,.7); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(.85); } }

/* FILTERS */
.filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.filter-btn { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); font-size: 13px; font-weight: 500; color: #94A3B8; cursor: pointer; transition: all .2s; }
.filter-btn:hover { background: rgba(255,255,255,.08); color: #E2E8F0; }
.filter-btn.active { color: #fff; }
.filter-btn--top.active    { background: rgba(249,115,22,.18); border-color: rgba(249,115,22,.4); color: #FDBA74; }
.filter-btn--important.active { background: rgba(234,179,8,.15); border-color: rgba(234,179,8,.35); color: #FDE047; }
.filter-btn--normal.active { background: rgba(56,189,248,.12); border-color: rgba(56,189,248,.3); color: #7DD3FC; }
.filter-btn--all.active    { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: #E2E8F0; }
.filter-dot { width: 7px; height: 7px; border-radius: 50%; }
.dot--top       { background: #F97316; }
.dot--important { background: #EAB308; }
.dot--normal    { background: #38BDF8; }
.filter-count { font-size: 11px; background: rgba(255,255,255,.08); padding: 1px 7px; border-radius: 999px; font-variant-numeric: tabular-nums; }

/* SEARCH */
.search-wrapper { position: relative; margin-bottom: 32px; }
.search-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
.search-input { width: 100%; border-radius: 14px; border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 16px 52px 16px 50px; font-size: 15px; color: #E2E8F0; outline: none; transition: all .2s; caret-color: #38BDF8; }
.search-input::placeholder { color: #475569; }
.search-input:focus { border-color: rgba(56,189,248,.4); background: rgba(255,255,255,.07); box-shadow: 0 0 0 3px rgba(56,189,248,.1), inset 0 1px 0 rgba(255,255,255,.06); }
.search-kbd { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 11px; color: #475569; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; padding: 2px 7px; pointer-events: none; }

/* LOADING */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 0; }
.spinner { width: 36px; height: 36px; border-radius: 50%; border: 2.5px solid rgba(255,255,255,.08); border-top-color: #38BDF8; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 13px; color: #475569; }

/* EMPTY */
.empty-state { border-radius: 20px; border-style: dashed; padding: 64px 24px; text-align: center; }
.empty-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #475569; }
.empty-title { font-size: 16px; font-weight: 500; color: #94A3B8; }
.empty-sub { font-size: 13px; color: #475569; margin-top: 4px; }

/* GRID */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

/* CARD */
.card { border-radius: 18px; padding: 22px 24px 20px; display: flex; flex-direction: column; gap: 14px; transition: transform .25s cubic-bezier(.34,1.56,.64,1), border-color .25s, box-shadow .25s; position: relative; overflow: hidden; }
.card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.15) 50%, transparent); }
.card:hover { transform: translateY(-3px); background: rgba(255,255,255,.065); box-shadow: 0 20px 48px rgba(0,0,0,.4); }

/* Card priority accent */
.card--top       { border-left: 3px solid rgba(249,115,22,.6) !important; }
.card--important { border-left: 3px solid rgba(234,179,8,.5) !important; }
.card--normal    { border-left: 3px solid rgba(56,189,248,.3) !important; }

/* CARD HEADER */
.card__header { display: flex; align-items: center; justify-content: space-between; }
.card__badge { font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; }
.badge--top       { color: #FDBA74; background: rgba(249,115,22,.15); border: 1px solid rgba(249,115,22,.3); }
.badge--important { color: #FDE047; background: rgba(234,179,8,.12); border: 1px solid rgba(234,179,8,.3); }
.badge--normal    { color: #7DD3FC; background: rgba(56,189,248,.1);  border: 1px solid rgba(56,189,248,.2); }
.card__score { font-size: 11px; font-weight: 600; color: #475569; font-variant-numeric: tabular-nums; }

/* CARD TITLE */
.card__title { font-size: 15px; font-weight: 600; line-height: 1.45; color: #E2E8F0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; letter-spacing: -0.01em; }

/* META */
.card__meta { display: flex; flex-direction: column; gap: 5px; }
.meta-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; border-radius: 10px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.055); }
.meta-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .06em; color: #475569; flex-shrink: 0; }
.meta-value { font-size: 13px; font-weight: 500; color: #CBD5E1; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
.meta-value--date   { color: #A5F3FC; font-variant-numeric: tabular-nums; }
.meta-value--source { color: #6B7280; font-size: 11px; }

/* FOOTER */
.card__footer { margin-top: auto; padding-top: 4px; }
.btn-primary { display: inline-flex; align-items: center; gap: 7px; text-decoration: none; font-size: 13px; font-weight: 600; color: #0F172A; background: linear-gradient(135deg, #38BDF8, #818CF8); padding: 9px 18px; border-radius: 10px; transition: transform .15s, box-shadow .15s; box-shadow: 0 4px 16px rgba(56,189,248,.25); }
.btn-primary:hover { transform: translateY(-1px) scale(1.02); box-shadow: 0 8px 24px rgba(56,189,248,.35); }
.btn-disabled { font-size: 12px; color: #334155; }

@media (max-width: 640px) {
  .container { padding: 24px 16px 60px; }
  .header { padding: 20px; }
  .header__title { font-size: 22px; }
  .grid { grid-template-columns: 1fr; }
  .status-badge span:last-child { display: none; }
}
</style>