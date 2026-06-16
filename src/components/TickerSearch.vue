<script setup>
import { ref } from 'vue'
import { useFiiStore } from '../stores/fii'

const store = useFiiStore()
const searchInput = ref('')

const handleSearch = () => {
  if (!searchInput.value) return
  store.searchTicker(searchInput.value)
  searchInput.value = ''
}

const handleSelectPopular = (fii) => {
  store.selectPopular(fii)
}

const handleSelectHistory = (historyItem) => {
  store.ticker = historyItem.symbol
  store.price = historyItem.price
  store.dividend = historyItem.dividend
  store.error = null
}
</script>

<template>
  <div
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm"
  >
    <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
      1. Escolha o Fundo Imobiliário (FII)
    </h2>

    <!-- Search Input Form -->
    <form @submit.prevent="handleSearch" class="flex gap-2 mb-4">
      <div class="relative flex-1">
        <span
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
        >
          <svg
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </span>
        <input
          v-model="searchInput"
          type="text"
          placeholder="Ex: MXRF11, HGLG11..."
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-lg font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all uppercase"
          :disabled="store.loading"
        />
      </div>
      <button
        type="submit"
        :disabled="store.loading || !searchInput"
        class="px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
      >
        <span
          v-if="store.loading"
          class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
        ></span>
        <span>{{ store.loading ? 'Buscando...' : 'Calcular' }}</span>
      </button>
    </form>

    <!-- Error/Warning Alerts -->
    <div
      v-if="store.error"
      :class="[
        'p-4 rounded-xl text-sm mb-4 border flex items-start gap-3',
        store.isDemoData
          ? 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30'
          : 'bg-rose-50 text-rose-800 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/30',
      ]"
    >
      <svg
        v-if="store.isDemoData"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5 shrink-0 mt-0.5 text-amber-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5 shrink-0 mt-0.5 text-rose-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <div>{{ store.error }}</div>
    </div>

    <!-- Popular Shortcuts -->
    <div class="mb-4">
      <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Atalhos Populares
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="fii in store.popularFiis"
          :key="fii.symbol"
          type="button"
          @click="handleSelectPopular(fii)"
          :class="[
            'px-3 py-1.5 text-xs font-bold rounded-lg border transition-all active:scale-95',
            store.ticker === fii.symbol
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
              : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300',
          ]"
        >
          {{ fii.symbol }}
        </button>
      </div>
    </div>

    <!-- History / Recent Searches -->
    <div v-if="store.history.length > 0">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >Buscas Recentes</span
        >
        <button
          @click="store.clearHistory"
          type="button"
          class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
        >
          Limpar
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="item in store.history"
          :key="item.symbol"
          type="button"
          @click="handleSelectHistory(item)"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-lg border transition-all font-mono',
            store.ticker === item.symbol
              ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold'
              : 'bg-transparent border-dashed border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300',
          ]"
        >
          {{ item.symbol }} (R$ {{ item.price.toFixed(2) }})
        </button>
      </div>
    </div>
  </div>
</template>
