<script setup>
import { ref, onMounted } from 'vue'
import { useFiiStore } from '../stores/fii'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const store = useFiiStore()
const tokenInput = ref('')
const showToken = ref(false)

onMounted(() => {
  tokenInput.value = store.brapiToken
})

const handleSave = () => {
  store.saveToken(tokenInput.value.trim())
  emit('close')
}

const handleClear = () => {
  tokenInput.value = ''
  store.saveToken('')
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm transition-opacity"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5 text-emerald-500"
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
          Configurações da API
        </h3>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        Para consultar cotações reais e dividendos de qualquer FII (fora dos atalhos de teste),
        informe um token gratuito obtido na
        <a
          href="https://brapi.dev"
          target="_blank"
          class="text-emerald-500 hover:underline font-semibold"
          >Brapi.dev</a
        >.
      </p>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label
            for="token-input"
            class="text-xs font-bold uppercase tracking-wider text-slate-400"
          >
            Token de API da Brapi
          </label>
          <div class="relative">
            <input
              id="token-input"
              v-model="tokenInput"
              :type="showToken ? 'text' : 'password'"
              placeholder="Digite ou cole seu token"
              class="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              @click="showToken = !showToken"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <!-- Eye open / eye closed icon -->
              <svg
                v-if="showToken"
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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
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
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3a10.476 10.476 0 0 1-5.186 1.488c-1.895 0-3.69-.502-5.244-1.378m3.65-3.65L12 12m0 0H9m3 0v3"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button
            v-if="store.brapiToken"
            @click="handleClear"
            type="button"
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-95 transition-all"
          >
            Excluir Token
          </button>
          <button
            @click="handleSave"
            type="button"
            class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
