import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useFiiStore = defineStore('fii', () => {
  // State
  const ticker = ref('MXRF11')
  const price = ref(10.05)
  const dividend = ref(0.09)
  const loading = ref(false)
  const error = ref(null)
  const isDemoData = ref(false)

  // New States for Improvements
  const currentShares = ref(10) // default 10 cotas
  const monthlyContribution = ref(200) // default R$ 200/month
  const isDark = ref(localStorage.getItem('theme') !== 'light') // defaults to dark

  const userToken = ref(localStorage.getItem('brapi_token') || '')
  const systemToken = import.meta.env.VITE_BRAPI_TOKEN || ''

  const brapiToken = computed(() => userToken.value || systemToken)
  const hasSystemToken = computed(() => !!systemToken)
  const hasUserToken = computed(() => !!userToken.value)
  const history = ref(JSON.parse(localStorage.getItem('fii_history') || '[]'))

  // Popular FIIs
  const popularFiis = ref([
    { symbol: 'MXRF11', name: 'Maxi Renda FII', price: 10.05, dividend: 0.09, type: 'Papel' },
    {
      symbol: 'HGLG11',
      name: 'CGG Logística FII',
      price: 163.5,
      dividend: 1.1,
      type: 'Tijolo (Galpões)',
    },
    {
      symbol: 'XPML11',
      name: 'XP Malls FII',
      price: 112.2,
      dividend: 0.92,
      type: 'Tijolo (Shoppings)',
    },
    {
      symbol: 'CPTS11',
      name: 'Capitânia Securities II',
      price: 8.1,
      dividend: 0.07,
      type: 'Papel',
    },
    {
      symbol: 'KNIP11',
      name: 'Kinea Índices de Preços',
      price: 95.8,
      dividend: 0.8,
      type: 'Papel',
    },
    {
      symbol: 'VISC11',
      name: 'Vinci Shopping Centers',
      price: 115.4,
      dividend: 0.85,
      type: 'Tijolo (Shoppings)',
    },
    {
      symbol: 'BTLG11',
      name: 'BTG Pactual Logística',
      price: 102.5,
      dividend: 0.78,
      type: 'Tijolo (Galpões)',
    },
  ])

  // Getters
  const magicNumber = computed(() => {
    if (price.value <= 0 || dividend.value <= 0) return 0
    return Math.ceil(price.value / dividend.value)
  })

  const totalInvested = computed(() => {
    return magicNumber.value * price.value
  })

  const monthlyIncome = computed(() => {
    return magicNumber.value * dividend.value
  })

  const yieldOnCost = computed(() => {
    if (price.value <= 0) return 0
    return (dividend.value / price.value) * 100
  })

  // 1. Month Estimator to Magic Number
  const monthsToMagicNumber = computed(() => {
    if (price.value <= 0 || dividend.value <= 0) return 0
    const target = magicNumber.value
    if (target <= 0) return 0
    if (currentShares.value >= target) return 0

    let cotas = currentShares.value
    let cash = 0
    let months = 0

    // Simulate month by month
    while (cotas < target && months < 1200) {
      months++
      // Receive dividend
      cash += cotas * dividend.value
      // Add contribution
      cash += monthlyContribution.value
      // Buy new cotas
      const newCotas = Math.floor(cash / price.value)
      cotas += newCotas
      cash -= newCotas * price.value
    }

    return months
  })

  // 2. Growth Projection
  const projectionData = computed(() => {
    if (price.value <= 0 || dividend.value <= 0) return []

    let cotas = currentShares.value
    let cash = 0
    let totalUserInvested = currentShares.value * price.value

    const milestones = [
      { label: '1 Ano', months: 12 },
      { label: '3 Anos', months: 36 },
      { label: '5 Anos', months: 60 },
      { label: '10 Anos', months: 120 },
    ]

    const results = []
    let milestoneIdx = 0

    for (let m = 1; m <= 120; m++) {
      // Receive dividend
      cash += cotas * dividend.value
      // Add contribution
      cash += monthlyContribution.value
      totalUserInvested += monthlyContribution.value

      // Buy new cotas
      const newCotas = Math.floor(cash / price.value)
      cotas += newCotas
      cash -= newCotas * price.value

      if (m === milestones[milestoneIdx].months) {
        results.push({
          label: milestones[milestoneIdx].label,
          months: m,
          cotas,
          totalEquity: cotas * price.value + cash,
          totalInvested: totalUserInvested,
          monthlyIncome: cotas * dividend.value,
        })
        milestoneIdx++
        if (milestoneIdx >= milestones.length) break
      }
    }

    return results
  })

  // Watchers
  watch(
    history,
    (newHistory) => {
      localStorage.setItem('fii_history', JSON.stringify(newHistory))
    },
    { deep: true },
  )

  // Actions
  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function saveToken(token) {
    userToken.value = token
    if (token) {
      localStorage.setItem('brapi_token', token)
    } else {
      localStorage.removeItem('brapi_token')
    }
  }

  function selectPopular(fii) {
    ticker.value = fii.symbol.toUpperCase()
    price.value = fii.price
    dividend.value = fii.dividend
    isDemoData.value = true
    error.value = null
    addToHistory(fii.symbol, fii.price, fii.dividend, fii.name)
  }

  function addToHistory(symbol, lastPrice, lastDividend, name = '') {
    const uppercaseSymbol = symbol.toUpperCase()
    history.value = history.value.filter((item) => item.symbol !== uppercaseSymbol)

    history.value.unshift({
      symbol: uppercaseSymbol,
      name: name || `${uppercaseSymbol} FII`,
      price: lastPrice,
      dividend: lastDividend,
      timestamp: Date.now(),
    })

    if (history.value.length > 5) {
      history.value.pop()
    }
  }

  function clearHistory() {
    history.value = []
  }

  async function searchTicker(tickerSymbol) {
    if (!tickerSymbol) return

    const cleanSymbol = tickerSymbol.trim().toUpperCase()
    ticker.value = cleanSymbol
    loading.value = true
    error.value = null
    isDemoData.value = false

    if (!brapiToken.value) {
      const popular = popularFiis.value.find((f) => f.symbol === cleanSymbol)
      if (popular) {
        price.value = popular.price
        dividend.value = popular.dividend
        isDemoData.value = true
        addToHistory(popular.symbol, popular.price, popular.dividend, popular.name)
        loading.value = false
        error.value =
          'Demonstração: Usando dados simulados para este ticker popular. Insira seu Token Brapi gratuito nas configurações para cotações reais.'
        return
      }

      const isTestTicker = ['PETR4', 'MGLU3', 'VALE3', 'ITUB4'].includes(cleanSymbol)
      if (!isTestTicker) {
        loading.value = false
        error.value =
          'Token Brapi ausente. Insira o token gratuito nas configurações para buscar qualquer ativo em tempo real, ou digite os valores manualmente abaixo.'
        return
      }
    }

    try {
      let fetchedPrice = 0
      let fetchedDividend = 0
      let name = ''

      const tokenParam = brapiToken.value ? `&token=${brapiToken.value}` : ''
      const quoteUrl = `https://brapi.dev/api/quote/${cleanSymbol}?dividends=true${tokenParam}`

      const res = await fetch(quoteUrl)
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Token Inválido ou Expirado. Verifique as configurações da API Brapi.')
        }
        throw new Error(`Ativo não encontrado ou erro na API (${res.status})`)
      }

      const data = await res.json()
      if (!data.results || data.results.length === 0) {
        throw new Error('Ticker não encontrado na API Brapi.')
      }

      const result = data.results[0]
      fetchedPrice = result.regularMarketPrice || 0
      name = result.shortName || result.longName || ''

      if (
        result.dividendsData &&
        result.dividendsData.cashDividends &&
        result.dividendsData.cashDividends.length > 0
      ) {
        const sortedDividends = [...result.dividendsData.cashDividends].sort(
          (a, b) => new Date(b.paymentDate || b.date) - new Date(a.paymentDate || a.date),
        )
        fetchedDividend = sortedDividends[0].rate || sortedDividends[0].value || 0
      }

      if (fetchedDividend === 0 && brapiToken.value) {
        try {
          const fiiUrl = `https://brapi.dev/api/v2/fii/dividends?symbols=${cleanSymbol}${tokenParam}`
          const fiiRes = await fetch(fiiUrl)
          if (fiiRes.ok) {
            const fiiData = await fiiRes.json()
            if (fiiData.results && fiiData.results.length > 0) {
              const fiiResult = fiiData.results[0]
              if (fiiResult.dividends && fiiResult.dividends.length > 0) {
                const sortedFiiDividends = [...fiiResult.dividends].sort(
                  (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
                )
                fetchedDividend = sortedFiiDividends[0].value || sortedFiiDividends[0].rate || 0
              }
            }
          }
        } catch (fiiErr) {
          console.warn('FII dedicated endpoint failed:', fiiErr)
        }
      }

      if (fetchedPrice > 0) {
        price.value = fetchedPrice
        if (fetchedDividend > 0) {
          dividend.value = Number(fetchedDividend.toFixed(4))
        } else {
          dividend.value = dividend.value || 0.1
          error.value =
            'Preço obtido! No entanto, não encontramos histórico recente de dividendos. Por favor, ajuste o valor do dividendo manualmente.'
        }

        addToHistory(cleanSymbol, price.value, dividend.value, name)
      } else {
        throw new Error('Não foi possível obter um preço válido para este ticker.')
      }
    } catch (err) {
      console.error(err)
      error.value =
        err.message ||
        'Erro desconhecido ao carregar os dados. Você pode preencher os valores manualmente.'
    } finally {
      loading.value = false
    }
  }

  // 3. Sharing Logic
  const shareUrl = computed(() => {
    const url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set('ticker', ticker.value)
    url.searchParams.set('price', price.value.toFixed(2))
    url.searchParams.set('dividend', dividend.value.toFixed(4))
    url.searchParams.set('contrib', monthlyContribution.value.toFixed(0))
    url.searchParams.set('shares', currentShares.value.toString())
    return url.toString()
  })

  function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search)
    let loaded = false
    if (params.has('ticker')) {
      ticker.value = params.get('ticker').toUpperCase()
      loaded = true
    }
    if (params.has('price')) {
      price.value = parseFloat(params.get('price')) || price.value
      loaded = true
    }
    if (params.has('dividend')) {
      dividend.value = parseFloat(params.get('dividend')) || dividend.value
      loaded = true
    }
    if (params.has('contrib')) {
      monthlyContribution.value = parseFloat(params.get('contrib')) || monthlyContribution.value
      loaded = true
    }
    if (params.has('shares')) {
      currentShares.value = parseInt(params.get('shares')) || currentShares.value
      loaded = true
    }
    return loaded
  }

  return {
    ticker,
    price,
    dividend,
    loading,
    error,
    isDemoData,
    currentShares,
    monthlyContribution,
    isDark,
    userToken,
    hasSystemToken,
    hasUserToken,
    brapiToken,
    history,
    popularFiis,
    magicNumber,
    totalInvested,
    monthlyIncome,
    yieldOnCost,
    monthsToMagicNumber,
    projectionData,
    shareUrl,
    saveToken,
    selectPopular,
    searchTicker,
    clearHistory,
    toggleTheme,
    applyTheme,
    loadFromUrlParams,
  }
})
