<template>
  <Suspense>
    <template #default>
      <PromptInjectionApp />
    </template>
    <template #fallback>
      <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-lg font-medium text-gray-900">Loading Prompt Injection Tester</p>
          <p class="text-sm text-gray-600">Initializing GenLayer application...</p>
        </div>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import PromptInjectionApp from "./components/PromptInjectionApp.vue";
</script>
