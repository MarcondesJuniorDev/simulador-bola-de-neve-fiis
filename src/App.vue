<script setup>
import { ref, onMounted } from 'vue'
import { useFiiStore } from './stores/fii'
import TickerSearch from './components/TickerSearch.vue'
import SimulationInputs from './components/SimulationInputs.vue'
import MagicResultCard from './components/MagicResultCard.vue'
import GrowthChart from './components/GrowthChart.vue'
import GrowthProjection from './components/GrowthProjection.vue'
import AdSenseBanner from './components/AdSenseBanner.vue'
import SettingsModal from './components/SettingsModal.vue'

const store = useFiiStore()
const isSettingsOpen = ref(false)

onMounted(() => {
  store.applyTheme()

  const hasParams = store.loadFromUrlParams()
  const params = new URLSearchParams(window.location.search)

  if (!hasParams) {
    store.searchTicker('MXRF11')
  } else {
    // If they provided a ticker but no price/dividend, fetch it.
    // If they provided price/dividend, keep them so we don't overwrite custom inputs.
    if (params.has('ticker') && (!params.has('price') || !params.has('dividend'))) {
      store.searchTicker(store.ticker)
    }
  }
})
</script>

<template>
  <div
    class="min-h-screen relative bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans overflow-x-hidden transition-colors duration-300"
  >
    <!-- Ambient Light/Blur Orbs -->
    <div
      class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-300/20 dark:bg-emerald-900/10 blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-300/20 dark:bg-indigo-900/10 blur-[150px] pointer-events-none"
    ></div>

    <!-- Top Navigation / Header -->
    <header
      class="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md"
    >
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div
            class="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
              />
            </svg>
          </div>
          <div>
            <h1
              class="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white"
            >
              Número Mágico
            </h1>
            <p
              class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none"
            >
              Bola de Neve FIIs
            </p>
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-2">
          <!-- Theme Toggle Button -->
          <button
            @click="store.toggleTheme()"
            class="p-2 text-slate-500 dark:text-slate-400 bg-slate-100/85 dark:bg-slate-900/85 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200/50 dark:border-slate-800/50 rounded-xl transition-all active:scale-95"
            title="Alternar Tema"
          >
            <!-- Sun Icon (visible in dark mode) -->
            <svg
              v-if="store.isDark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
            <!-- Moon Icon (visible in light mode) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          </button>

          <!-- Settings Button -->
          <button
            @click="isSettingsOpen = true"
            class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-xl hover:shadow-sm transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>Configurações</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 relative z-10 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
      <!-- Title Section -->
      <div class="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <h2
          class="text-3xl md:text-4.5xl font-black tracking-tight text-slate-800 dark:text-slate-100 leading-tight"
        >
          Simulador do
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400"
            >Número Mágico</span
          >
          de FIIs
        </h2>
        <p class="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-3 font-medium">
          Descubra quantas cotas você precisa para criar uma bola de neve financeira, onde os
          dividendos compram novas cotas automaticamente.
        </p>
      </div>

      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: inputs (span 5) -->
        <section class="lg:col-span-5 flex flex-col gap-6 w-full">
          <TickerSearch />
          <SimulationInputs />

          <!-- Desktop Sidebar AdSpace (300x250) -->
          <div class="hidden lg:block">
            <AdSenseBanner size="square" />
          </div>
        </section>

        <!-- Right Column: Results & Projections (span 7) -->
        <section class="lg:col-span-7 flex flex-col gap-6 w-full">
          <MagicResultCard />
          <GrowthChart />
          <GrowthProjection />

          <!-- Mobile AdSpace (Horizontal) -->
          <div class="block lg:hidden">
            <AdSenseBanner size="horizontal" />
          </div>
        </section>
      </div>
    </main>

    <!-- Bottom Footer AdSpace (Horizontal) -->
    <div class="relative z-10 max-w-6xl w-full mx-auto px-4 pb-6">
      <AdSenseBanner size="horizontal" />
    </div>

    <!-- Footer -->
    <footer
      class="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm mt-auto py-8"
    >
      <div class="max-w-6xl mx-auto px-4 text-center">
        <p class="text-xs text-slate-400 dark:text-slate-500 max-w-3xl mx-auto leading-relaxed">
          <strong>Aviso de Isenção de Responsabilidade (Disclaimer):</strong> As informações
          fornecidas por esta ferramenta são exclusivamente para fins informativos e educacionais.
          Esta aplicação não realiza recomendações de compra, venda ou investimentos de quaisquer
          ativos financeiros. O desempenho passado não é garantia de resultados futuros.
          Investimentos em renda variável possuem riscos. Consulte um profissional certificado antes
          de investir.
        </p>
        <p class="text-[10px] text-slate-400 dark:text-slate-600 mt-6">
          © 2026 Simulador Número Mágico FII. Todos os direitos reservados. Hospedado na Cloudflare
          Pages.
        </p>
      </div>
    </footer>

    <!-- Configuration Settings Modal -->
    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>
