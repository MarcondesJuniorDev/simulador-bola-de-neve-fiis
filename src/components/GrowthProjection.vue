<script setup>
import { useFiiStore } from '../stores/fii'

const store = useFiiStore()

const formattedCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>

<template>
  <div
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm"
  >
    <div class="flex flex-col gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
        3. Projeção de Crescimento da Bola de Neve
      </h3>
      <p class="text-[11px] text-slate-400">
        Evolução estimada com aporte de {{ formattedCurrency(store.monthlyContribution) }}/mês +
        dividendos reinvestidos.
      </p>
    </div>

    <!-- Responsive Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr
            class="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider"
          >
            <th class="py-2.5">Período</th>
            <th class="py-2.5 text-right">Cotas</th>
            <th class="py-2.5 text-right">Aportado</th>
            <th class="py-2.5 text-right">Patrimônio</th>
            <th class="py-2.5 text-right text-emerald-600 dark:text-emerald-400">Renda/mês</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300 font-medium"
        >
          <tr
            v-for="row in store.projectionData"
            :key="row.label"
            class="hover:bg-slate-50/50 dark:hover:bg-slate-950/20"
          >
            <td class="py-3 font-semibold text-slate-800 dark:text-slate-100">{{ row.label }}</td>
            <td class="py-3 text-right font-mono">{{ row.cotas }}</td>
            <td class="py-3 text-right font-mono text-slate-500">
              {{ formattedCurrency(row.totalInvested) }}
            </td>
            <td class="py-3 text-right font-mono font-bold">
              {{ formattedCurrency(row.totalEquity) }}
            </td>
            <td class="py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {{ formattedCurrency(row.monthlyIncome) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-800/40 flex items-start gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18ZM12 18c-2.29 0-3.5-2.06-3.5-3.5 0-1.285.56-2.46 1.485-3.267M12 18c2.29 0 3.5-2.06 3.5-3.5 0-1.285-.56-2.46-1.485-3.267"
        />
      </svg>
      <p class="text-[10px] text-slate-400 leading-normal">
        O efeito bola de neve faz com que o reinvestimento de dividendos compre novas cotas
        adicionais. Isso acelera o crescimento exponencial do seu patrimônio sem que você precise
        aumentar o seu aporte do bolso.
      </p>
    </div>
  </div>
</template>
