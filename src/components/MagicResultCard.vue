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

const remainder = computed(() => {
  if (store.monthlyIncome <= 0 || store.price <= 0) return 0
  return store.monthlyIncome - store.price
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Main Snowball Magic Card -->
    <div
      class="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-xl border border-slate-800"
    >
      <!-- Ambient light glowing effect -->
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
              class="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/30"
            >
              Número Mágico atingido! ❄️
            </span>
            <h3 class="text-lg font-bold mt-3 text-slate-100">Cotas para a Bola de Neve</h3>
          </div>
          <div
            class="text-slate-400 font-mono text-sm font-semibold bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700/50"
          >
            {{ store.ticker }}
          </div>
        </div>

        <div
          class="flex flex-col items-center justify-center my-6 py-4 border-y border-slate-800/80"
        >
          <div
            class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 tracking-tight animate-pulse"
          >
            {{ store.magicNumber }}
          </div>
          <div class="text-sm text-slate-400 mt-2 font-medium">Cotas necessárias</div>
        </div>

        <p class="text-slate-300 text-sm leading-relaxed text-center">
          Ao acumular
          <strong class="text-emerald-400 font-bold">{{ store.magicNumber }} cotas</strong> de
          <strong class="text-emerald-400 font-bold">{{ store.ticker }}</strong
          >, o seu dividendo mensal de
          <strong class="text-emerald-400 font-bold">{{
            formattedCurrency(store.monthlyIncome)
          }}</strong>
          será maior ou igual ao preço de uma nova cota (<strong
            class="text-emerald-400 font-bold"
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
          <div class="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
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
            class="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5"
          >
            {{ formattedCurrency(store.monthlyIncome) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Snowball Step visualization -->
    <div
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm"
    >
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
        Como funciona o Número Mágico?
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <!-- Step 1 -->
        <div class="flex flex-col items-center text-center">
          <div
            class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm mb-2"
          >
            1
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Acumule Cotas</div>
          <p class="text-[11px] text-slate-500 leading-normal">
            Você investe até atingir o número mágico de {{ store.magicNumber }} cotas.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="flex flex-col items-center text-center">
          <div
            class="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-sm mb-2 border border-emerald-100 dark:border-emerald-900/20"
          >
            2
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Receba Rendas</div>
          <p class="text-[11px] text-slate-500 leading-normal">
            Sua renda total passa a ser de {{ formattedCurrency(store.monthlyIncome) }}.
          </p>
        </div>

        <!-- Step 3 -->
        <div class="flex flex-col items-center text-center">
          <div
            class="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-2 border border-indigo-100 dark:border-indigo-900/20"
          >
            3
          </div>
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Reinvestimento Automático
          </div>
          <p class="text-[11px] text-slate-500 leading-normal">
            Use a renda para comprar 1 nova cota mensal (sobrando
            {{ formattedCurrency(remainder) }}).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
