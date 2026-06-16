<script setup>
import { computed, ref } from 'vue'
import { useFiiStore } from '../stores/fii'

const store = useFiiStore()
const isCopied = ref(false)

const formattedCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

// Calculate simulation month by month for 120 months (10 years)
const chartPoints = computed(() => {
  if (store.price <= 0 || store.dividend <= 0) return []

  let cotas = store.currentShares
  let cash = 0
  const points = []
  let totalUserInvested = store.currentShares * store.price

  // Initial state (Month 0)
  points.push({
    month: 0,
    equity: cotas * store.price,
    income: cotas * store.dividend,
    invested: totalUserInvested,
  })

  for (let m = 1; m <= 120; m++) {
    // Receive dividends
    cash += cotas * store.dividend
    // Add contribution
    cash += store.monthlyContribution
    totalUserInvested += store.monthlyContribution

    // Buy new cotas
    const newCotas = Math.floor(cash / store.price)
    cotas += newCotas
    cash -= newCotas * store.price

    points.push({
      month: m,
      equity: cotas * store.price + cash,
      income: cotas * store.dividend,
      invested: totalUserInvested,
    })
  }

  return points
})

// Max value to scale Y axis
const maxEquity = computed(() => {
  if (chartPoints.value.length === 0) return 1
  return Math.max(...chartPoints.value.map((p) => p.equity)) || 1
})

// SVG Dimensions
const width = 500
const height = 180
const padding = { top: 20, right: 20, bottom: 30, left: 10 }

const chartWidth = width - padding.left - padding.right
const chartHeight = height - padding.top - padding.bottom

// Generate points for SVG path
const svgPoints = computed(() => {
  const pts = chartPoints.value
  if (pts.length === 0) return []

  return pts.map((p) => {
    const x = padding.left + (p.month / 120) * chartWidth
    const y = padding.top + chartHeight - (p.equity / maxEquity.value) * chartHeight
    return { x, y, ...p }
  })
})

const linePath = computed(() => {
  const pts = svgPoints.value
  if (pts.length === 0) return ''
  return pts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
})

const areaPath = computed(() => {
  const path = linePath.value
  if (!path) return ''
  const startX = svgPoints.value[0].x
  const endX = svgPoints.value[svgPoints.value.length - 1].x
  const bottomY = padding.top + chartHeight
  return `${path} L ${endX.toFixed(1)} ${bottomY} L ${startX.toFixed(1)} ${bottomY} Z`
})

// Key milestone coordinates for dots (Year 1, 3, 5, 10)
const milestoneDots = computed(() => {
  const pts = svgPoints.value
  if (pts.length === 0) return []

  const indices = [12, 36, 60, 120]
  return indices
    .map((idx) => {
      const p = pts[idx]
      if (!p) return null
      return {
        label: idx === 12 ? '1a' : idx === 36 ? '3a' : idx === 60 ? '5a' : '10a',
        ...p,
      }
    })
    .filter(Boolean)
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(store.shareUrl)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Falha ao copiar link:', err)
  }
}
</script>

<template>
  <div
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm flex flex-col gap-4"
  >
    <!-- Header with Copy Link -->
    <div
      class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3"
    >
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
          4. Curva de Crescimento
        </h3>
        <p class="text-[10px] text-slate-400">Projeção gráfica do patrimônio ao longo do tempo.</p>
      </div>

      <button
        type="button"
        @click="copyLink"
        :class="[
          'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm border',
          isCopied
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800',
        ]"
      >
        <svg
          v-if="isCopied"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        <svg
          v-else
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
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186.007-.006a2.25 2.25 0 0 1 2.812-.008l6.399-3.2a1.125 1.125 0 1 1 1.012 1.961l-6.4 3.2a2.25 2.25 0 0 1 0 1.984l6.4 3.2a1.125 1.125 0 1 1-1.013 1.962l-6.399-3.2a2.25 2.25 0 0 1-2.827-.004l-.008-.007m0-3.785.002-.002"
          />
        </svg>
        <span>{{ isCopied ? 'Link Copiado!' : 'Compartilhar' }}</span>
      </button>
    </div>

    <!-- SVG Chart Container -->
    <div
      class="relative w-full overflow-hidden flex justify-center items-center py-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-200/20 dark:border-slate-800/10"
    >
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        class="w-full h-auto max-w-[500px] text-slate-400 dark:text-slate-600 font-mono"
        style="overflow: visible"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Grid Lines (Horizontal) -->
        <g stroke="currentColor" stroke-opacity="0.08" stroke-width="1">
          <line
            :x1="padding.left"
            :y1="padding.top"
            :x2="width - padding.right"
            :y2="padding.top"
          />
          <line
            :x1="padding.left"
            :y1="padding.top + chartHeight / 2"
            :x2="width - padding.right"
            :y2="padding.top + chartHeight / 2"
          />
          <line
            :x1="padding.left"
            :y1="padding.top + chartHeight"
            :x2="width - padding.right"
            :y2="padding.top + chartHeight"
          />
        </g>

        <!-- Area Under Curve -->
        <path v-if="areaPath" :d="areaPath" fill="url(#chartGrad)" />

        <!-- Line Curve -->
        <path
          v-if="linePath"
          :d="linePath"
          fill="none"
          stroke="#10b981"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Milestone Interactive Dots -->
        <g v-for="dot in milestoneDots" :key="dot.label">
          <circle
            :cx="dot.x"
            :cy="dot.y"
            r="4.5"
            fill="#10b981"
            stroke="white"
            stroke-width="1.5"
            class="transition-all duration-300 hover:r-6"
          />
          <text
            :x="dot.x"
            :y="dot.y - 10"
            text-anchor="middle"
            class="text-[9px] font-bold fill-slate-700 dark:fill-slate-300"
          >
            {{ formattedCurrency(dot.equity) }}
          </text>
        </g>

        <!-- Axis Labels (X Axis Years) -->
        <g class="text-[9px] fill-slate-400 dark:fill-slate-500 font-semibold" text-anchor="middle">
          <text :x="padding.left" :y="height - 5">Começo</text>
          <text :x="padding.left + (12 / 120) * chartWidth" :y="height - 5">1 Ano</text>
          <text :x="padding.left + (36 / 120) * chartWidth" :y="height - 5">3 Anos</text>
          <text :x="padding.left + (60 / 120) * chartWidth" :y="height - 5">5 Anos</text>
          <text :x="padding.left + (120 / 120) * chartWidth" :y="height - 5">10 Anos</text>
        </g>
      </svg>
    </div>
  </div>
</template>
