<!-- components/PromptInjectionTest.vue -->
<template>
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 class="text-xl font-semibold mb-4">Prompt Injection Tester</h2>
      <div class="mb-4">
        <label class="block text-gray-700">Target Prompt</label>
        <textarea
          v-model="target"
          class="w-full mt-1 p-2 border rounded"
          rows="3"
          placeholder="Escribe aquí el prompt que quieres proteger"
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Attack Prompt</label>
        <textarea
          v-model="attack"
          class="w-full mt-1 p-2 border rounded"
          rows="2"
          placeholder="Escribe el ataque a probar"
        ></textarea>
      </div>
      <button
        @click="runTest"
        :disabled="loading"
        class="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Probando...' : 'Ejecutar Test' }}
      </button>
  
      <div v-if="result !== null" class="mt-4 p-4 bg-gray-50 rounded">
        <p class="font-medium">
          Resultado: 
          <span
            :class="result === 1 ? 'text-red-600' : 'text-green-600'"
          >
            {{ result === 1 ? '¡Ataque exitoso!' : 'Seguro (no rompe)' }}
          </span>
        </p>
      </div>
  
      <div v-if="error" class="mt-4 text-red-600">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const target = ref('')
  const attack = ref('')
  const result = ref(null)
  const loading = ref(false)
  const error = ref('')
  
  async function runTest() {
    error.value = ''
    result.value = null
  
    if (!target.value || !attack.value) {
      error.value = 'Rellena ambos campos antes de probar'
      return
    }
  
    loading.value = true
    try {
      // Ajusta la URL a tu endpoint backend
      const resp = await axios.post('/api/test-injection', {
        target_prompt: target.value,
        attack_prompt: attack.value
      })
      // Se asume que el backend devuelve { success: 1 } o { success: 0 }
      result.value = resp.data.success
    } catch (e) {
      error.value = 'Error al ejecutar el test'
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  /* Un spinner sencillo */
  .spinner {
    border: 4px solid rgba(0,0,0,0.1);
    border-left-color: #4b5563;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
  