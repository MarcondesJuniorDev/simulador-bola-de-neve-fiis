<script setup>
import { computed } from 'vue'
import { useFiiStore } from '../stores/fii'

const store = useFiiStore()

const formattedCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Calculations for milestones (Escada do Número Mágico)
const milestones = computed(() => {
  const div = store.dividend || 0.01
  const list = [
    {
      name: 'Bronze (Cafezinho/Passagem)',
      targetIncome: 10,
      color: 'from-amber-600 to-amber-700 font-bold',
    },
    {
      name: 'Prata (Streaming/Netflix)',
      targetIncome: 50,
      color: 'from-slate-400 to-slate-500 font-bold',
    },
    {
      name: 'Ouro (Conta de Luz/Internet)',
      targetIncome: 150,
      color: 'from-yellow-500 to-amber-500 font-bold',
    },
    {
      name: 'Platina (Rancho de Mês)',
      targetIncome: 500,
      color: 'from-teal-400 to-emerald-500 font-bold',
    },
    {
      name: 'Número Mágico (1 Cota Grátis)',
      targetIncome: store.price,
      color: 'from-indigo-500 to-purple-500 font-bold',
    },
  ]

  return list.map((m) => {
    const required = Math.ceil(m.targetIncome / div)
    const progress =
      store.currentShares >= required ? 100 : Math.round((store.currentShares / required) * 100)
    const isCompleted = store.currentShares >= required

    return {
      ...m,
      required,
      progress,
      isCompleted,
    }
  })
})

// Format estimated months to years and months
const formattedEstimation = computed(() => {
  const totalMonths = store.monthsToMagicNumber
  if (totalMonths === 0) return 'Meta Atingida! 🎉'
  if (totalMonths >= 1200) return 'Tempo estimado muito longo. Aumente o aporte mensal.'

  const years = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12

  let result = ''
  if (years > 0) {
    result += `${years} ${years === 1 ? 'ano' : 'anos'}`
  }
  if (remainingMonths > 0) {
    if (result) result += ' e '
    result += `${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`
  }
  return result
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Main Snowball Magic Card -->
    <div
      class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800"
    >
      <div
        class="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"
      ></div>
      <div
        class="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
      ></div>

      <div class="relative z-10">
        <div class="flex justify-between items-start mb-6">
          <div>
            <span
              class="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/30"
            >
              Número Mágico ❄️
            </span>
            <h3 class="text-lg font-bold mt-3 text-slate-800 dark:text-slate-100">
              Cotas para a Bola de Neve
            </h3>
          </div>
          <div
            class="text-slate-500 dark:text-slate-400 font-mono text-sm font-semibold bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50"
          >
            {{ store.ticker }}
          </div>
        </div>

        <div
          class="flex flex-col items-center justify-center my-6 py-4 border-y border-slate-200 dark:border-slate-800/80"
        >
          <div
            class="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 tracking-tight animate-pulse"
          >
            {{ store.magicNumber }}
          </div>
          <div
            class="text-xs text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest"
          >
            Cotas necessárias
          </div>
        </div>

        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed text-center">
          Ao acumular
          <strong class="text-emerald-600 dark:text-emerald-400 font-bold"
            >{{ store.magicNumber }} cotas</strong
          >
          de
          <strong class="text-emerald-600 dark:text-emerald-400 font-bold">{{
            store.ticker
          }}</strong
          >, o seu dividendo mensal de
          <strong class="text-emerald-600 dark:text-emerald-400 font-bold">{{
            formattedCurrency(store.monthlyIncome)
          }}</strong>
          será maior ou igual ao preço de uma nova cota (<strong
            class="text-emerald-600 dark:text-emerald-400 font-bold"
            >{{ formattedCurrency(store.price) }}</strong
          >). A partir daí, o investimento cresce sozinho!
        </p>
      </div>
    </div>

    <!-- Quick Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Total Invested Card -->
      <div
        class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm flex items-center gap-4"
      >
        <div
          class="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-18 0A1.5 1.5 0 0 1 3.75 3h16.5a1.5 1.5 0 0 1 1.5 1.5m-18 0v14.25m18-14.25v14.25m-18 0A1.5 1.5 0 0 0 3.75 20h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <div>
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Investido Necessário
          </div>
          <div
            class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5 font-mono"
          >
            {{ formattedCurrency(store.totalInvested) }}
          </div>
        </div>
      </div>

      <!-- Monthly Income Card -->
      <div
        class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm flex items-center gap-4"
      >
        <div
          class="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-900/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div>
          <div
            class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider"
          >
            Renda Mensal Gerada
          </div>
          <div
            class="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5 font-mono"
          >
            {{ formattedCurrency(store.monthlyIncome) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Estimador de Tempo para Objetivo -->
    <div
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm flex items-center gap-4"
    >
      <div
        class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-900/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <div>
        <div
          class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider"
        >
          Tempo até o Número Mágico
        </div>
        <div
          class="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-0.5"
        >
          {{ formattedEstimation }}
        </div>
        <div class="text-[10px] text-slate-400 mt-1 leading-none">
          Considerando reinvestimento automático + aporte mensal de
          {{ formattedCurrency(store.monthlyContribution) }}.
        </div>
      </div>
    </div>

    <!-- Escada do Número Mágico (Metas Intermediárias) -->
    <div
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm"
    >
      <h4
        class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between"
      >
        <span>Metas de Renda (Escada do Número Mágico)</span>
        <span class="text-[10px] lowercase text-slate-400 font-normal"
          >Sua carteira: {{ store.currentShares }} cotas</span
        >
      </h4>
      <div class="flex flex-col gap-4">
        <div v-for="milestone in milestones" :key="milestone.name" class="flex flex-col gap-1.5">
          <div class="flex justify-between items-center text-xs">
            <span
              class="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span v-if="milestone.isCompleted" class="text-emerald-500">✓</span>
              <span v-else class="text-slate-400">○</span>
              {{ milestone.name }}
            </span>
            <span class="font-mono text-slate-500 font-medium">
              {{ store.currentShares }}/{{ milestone.required }} cotas ({{ milestone.progress }}%)
            </span>
          </div>
          <!-- Progress Bar -->
          <div
            class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-800/30"
          >
            <div
              :class="[
                'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                milestone.isCompleted
                  ? 'from-emerald-400 to-teal-400'
                  : 'from-slate-400 to-slate-500',
              ]"
              :style="{ width: `${milestone.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
