<script setup>
defineProps({
  size: {
    type: String,
    default: 'square', // 'square' (300x250) or 'horizontal' (728x90 / responsive)
  },
})
</script>

<template>
  <div
    v-if="size === 'square'"
    class="w-[300px] h-[250px] mx-auto bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center shrink-0 shadow-inner"
  >
    <span
      class="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1"
      >Publicidade</span
    >
    <div
      class="h-8 w-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-2 text-slate-400"
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
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </div>
    <div class="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Google AdSense</div>
    <div class="text-[10px] text-slate-400/80 dark:text-slate-600 mt-1 max-w-[200px]">
      Este espaço está reservado para anúncios e monetização do simulador.
    </div>
  </div>

  <div
    v-else
    class="w-full min-h-[90px] bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-inner"
  >
    <span
      class="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-1"
      >Publicidade / AdSense Banner</span
    >
    <div class="text-[10px] text-slate-400/80 dark:text-slate-500 max-w-lg">
      Espaço reservado para banner horizontal adaptável (ex: 728x90 ou bloco de links).
    </div>
  </div>
</template>
