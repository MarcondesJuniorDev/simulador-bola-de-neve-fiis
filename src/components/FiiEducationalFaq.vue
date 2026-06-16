<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const faqs = ref([
  {
    question: 'O que é o "Número Mágico" nos investimentos?',
    answer:
      'O "Número Mágico" (ou Magic Number) é a quantidade de cotas de um determinado ativo (como um FII) que você precisa possuir para que o dividendo mensal recebido seja igual ou superior ao preço de uma nova cota. A partir deste ponto, o ativo começa a se autofinanciar: os rendimentos compram novas cotas mensalmente sem que você precise aportar dinheiro do próprio bolso.',
  },
  {
    question: 'Como é calculado o Número Mágico de um FII?',
    answer:
      'O cálculo matemático é muito simples: você divide o preço atual da cota pelo valor do último dividendo pago por cota. O resultado é arredondado para cima (teto matemático), pois você só pode comprar cotas inteiras. A fórmula é: Número Mágico = Teto(Preço da Cota / Último Dividendo).',
  },
  {
    question: 'O que é o efeito "Bola de Neve"?',
    answer:
      'É o efeito dos juros compostos em ação na prática. Ao atingir o Número Mágico, a renda gerada pelo seu patrimônio compra novas frações de ativos, que por sua vez passarão a pagar novos dividendos no mês seguinte. Com o tempo, a quantidade de cotas cresce em ritmo exponencial, acelerando a velocidade com que seu patrimônio se multiplica.',
  },
  {
    question: 'Qual a diferença entre FIIs de Tijolo e FIIs de Papel?',
    answer:
      'FIIs de Tijolo investem diretamente em imóveis físicos reais (como galpões logísticos, escritórios corporativos e shoppings) e lucram com aluguéis. Costumam ter maior potencial de valorização do imóvel no longo prazo. FIIs de Papel compram títulos de dívida imobiliária (como CRI e LCI) e distribuem juros e correção monetária. Tendem a pagar dividendos nominais mais elevados no curto prazo, mas não contam com a valorização de imóveis físicos.',
  },
  {
    question: 'Este simulador é seguro? Meus dados são salvos?',
    answer:
      'Sim, é 100% seguro. Este simulador é executado inteiramente no seu navegador de forma estática. Valores preenchidos, histórico de buscas ou chaves de API são armazenados apenas localmente no banco de dados local do seu navegador (localStorage). Não salvamos, transmitimos ou processamos nenhuma informação financeira dos usuários em nossos servidores.',
  },
])

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div
    class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-sm mt-8"
  >
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">
      Guia Prático e Dúvidas Frequentes (FAQ)
    </h3>

    <div class="flex flex-col gap-3">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border-b border-slate-100 dark:border-slate-800/60 pb-3"
      >
        <button
          @click="toggle(index)"
          type="button"
          class="w-full flex justify-between items-center text-left py-2 text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          <span>{{ faq.question }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            :class="[
              'w-4 h-4 transition-transform duration-200 text-slate-400 shrink-0 ml-2',
              openIndex === index ? 'rotate-180 text-emerald-500' : '',
            ]"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <div
          v-show="openIndex === index"
          class="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-all duration-300"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>
  </div>
</template>
