<script setup>
import { computed } from 'vue'
import { useFiiStore } from '../stores/fii'

const store = useFiiStore()

const formattedYield = computed(() => {
  return store.yieldOnCost.toFixed(2)
})
</script>

<template>
  <div
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm flex flex-col gap-6"
  >
    <div
      class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3"
    >
      <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
        2. Ajuste Fino & Simulação
      </h2>
      <div
        class="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-200/40 dark:border-emerald-800/30"
      >
        DY Mensal: {{ formattedYield }}%
      </div>
    </div>

    <!-- Cota Price Input -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label
          for="price-input"
          class="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
        >
          <span>Preço da Cota (R$)</span>
          <span class="text-xs text-slate-400 font-normal">(Valor Unitário)</span>
        </label>
        <span class="font-mono text-base font-bold text-slate-800 dark:text-slate-200">
          R$ {{ store.price.toFixed(2) }}
        </span>
      </div>
      <div class="relative">
        <span
          class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-medium font-mono"
        >
          R$
        </span>
        <input
          id="price-input"
          v-model.number="store.price"
          type="number"
          step="0.01"
          min="0.10"
          max="10000"
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-base font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>
      <!-- Slider Cota Price -->
      <input
        type="range"
        v-model.number="store.price"
        min="1.00"
        max="250.00"
        step="0.05"
        class="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer mt-1"
      />
    </div>

    <!-- Último Dividendo Input -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <label
          for="dividend-input"
          class="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
        >
          <span>Último Dividendo (R$)</span>
          <span class="text-xs text-slate-400 font-normal">(Rendimento por Cota)</span>
        </label>
        <span class="font-mono text-base font-bold text-slate-800 dark:text-slate-200">
          R$ {{ store.dividend.toFixed(4) }}
        </span>
      </div>
      <div class="relative">
        <span
          class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-medium font-mono"
        >
          R$
        </span>
        <input
          id="dividend-input"
          v-model.number="store.dividend"
          type="number"
          step="0.0001"
          min="0.0001"
          max="50"
          class="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-base font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>
      <!-- Slider Dividendo -->
      <input
        type="range"
        v-model.number="store.dividend"
        min="0.01"
        max="3.00"
        step="0.01"
        class="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer mt-1"
      />
    </div>
  </div>
</template>

<style scoped>
/* Remove spinner arrows on numeric input */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
