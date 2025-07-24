<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Attack Attempts</h2>
      <div class="flex space-x-2">
        <select
          v-model="filterPrompt"
          class="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="">All Prompts</option>
          <option
            v-for="prompt in availablePrompts"
            :key="prompt.id"
            :value="prompt.id"
          >
            {{ prompt.name }}
          </option>
        </select>
        <button
          @click="loadAttempts"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div v-if="!loading && attempts.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-green-600">Safe</p>
            <p class="text-2xl font-semibold text-green-900">{{ safeCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-red-600">Successful Attacks</p>
            <p class="text-2xl font-semibold text-red-900">{{ successCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-blue-600">Total Attempts</p>
            <p class="text-2xl font-semibold text-blue-900">{{ attempts.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && attempts.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No attempts found</h3>
      <p class="mt-1 text-sm text-gray-500">Start testing prompts to see attack attempts here.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Attempts List -->
    <div v-if="!loading && attempts.length > 0" class="space-y-4">
      <div
        v-for="attempt in paginatedAttempts"
        :key="attempt.id"
        class="border border-gray-200 rounded-lg p-4"
        :class="{
          'border-red-300 bg-red-50': attempt.success,
          'border-green-300 bg-green-50': !attempt.success
        }"
      >
        <!-- Result Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div
                class="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                :class="{
                  'bg-red-500': attempt.success,
                  'bg-green-500': !attempt.success
                }"
              >
                {{ attempt.success ? '⚠️' : '✅' }}
              </div>
            </div>
            <div>
              <h3 class="font-medium" :class="{
                'text-red-900': attempt.success,
                'text-green-900': !attempt.success
              }">
                {{ attempt.success ? 'ATTACK SUCCESSFUL' : 'SAFE' }}
              </h3>
              <p class="text-sm text-gray-600">
                Target: {{ attempt.prompt_name }} | By: {{ attempt.attacker_name }}
              </p>
            </div>
          </div>
          <div class="text-right text-sm text-gray-500">
            <p>{{ formatTimestamp(attempt.timestamp) }}</p>
            <p v-if="attempt.confidence !== undefined" class="text-xs">
              Confidence: {{ attempt.confidence }}%
            </p>
          </div>
        </div>

        <!-- Attack Content -->
        <div class="mb-3">
          <p class="text-sm font-medium text-gray-700 mb-1">Attack Prompt:</p>
          <div class="bg-white p-2 rounded border text-sm text-gray-800">
            {{ attempt.attack_prompt }}
          </div>
        </div>

        <!-- Explanation -->
        <div v-if="attempt.explanation" class="mb-3">
          <p class="text-sm font-medium text-gray-700 mb-1">Analysis:</p>
          <div class="bg-white p-2 rounded border text-sm text-gray-700">
            {{ attempt.explanation }}
          </div>
        </div>

        <!-- Expand Details Button -->
        <button
          @click="toggleDetails(attempt.id)"
          class="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {{ expandedAttempts.has(attempt.id) ? 'Hide' : 'Show' }} Response Details
        </button>

        <!-- Expanded Details -->
        <div v-if="expandedAttempts.has(attempt.id)" class="mt-3 space-y-3">
          <div v-if="attempt.baseline_output">
            <p class="text-sm font-medium text-gray-700 mb-1">Baseline Response (without attack):</p>
            <div class="bg-gray-50 p-3 rounded border text-sm text-gray-800 max-h-32 overflow-y-auto">
              {{ attempt.baseline_output }}
            </div>
          </div>
          
          <div v-if="attempt.attacked_output">
            <p class="text-sm font-medium text-gray-700 mb-1">Attacked Response:</p>
            <div class="bg-gray-50 p-3 rounded border text-sm text-gray-800 max-h-32 overflow-y-auto">
              {{ attempt.attacked_output }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && attempts.length > itemsPerPage" class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, attempts.length) }} of {{ attempts.length }} attempts
      </div>
      <div class="flex space-x-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= Math.ceil(attempts.length / itemsPerPage)"
          class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">
            {{ errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { promptInjectionService } from '../services/promptInjectionService.js'

const props = defineProps({
  selectedPromptId: String,
  availablePrompts: {
    type: Array,
    default: () => []
  }
})

const attempts = ref([])
const loading = ref(false)
const errorMessage = ref('')
const filterPrompt = ref('')
const expandedAttempts = ref(new Set())
const currentPage = ref(1)
const itemsPerPage = 10

const filteredAttempts = computed(() => {
  if (!filterPrompt.value) return attempts.value
  return attempts.value.filter(attempt => attempt.prompt_id === filterPrompt.value)
})

const paginatedAttempts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAttempts.value.slice(start, end)
})

const successCount = computed(() => {
  return filteredAttempts.value.filter(attempt => attempt.success).length
})

const safeCount = computed(() => {
  return filteredAttempts.value.filter(attempt => !attempt.success).length
})

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

const toggleDetails = (attemptId) => {
  if (expandedAttempts.value.has(attemptId)) {
    expandedAttempts.value.delete(attemptId)
  } else {
    expandedAttempts.value.add(attemptId)
  }
}

const loadAttempts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await promptInjectionService.getAllAttempts()
    const attemptsList = result?.result || result || []
    const attemptsArray = Array.isArray(attemptsList) ? attemptsList : []
    
    // Sort by timestamp (newest first)
    attempts.value = attemptsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  } catch (error) {
    console.error('Error loading attempts:', error)
    errorMessage.value = error.message || 'Failed to load attempts. Please try again.'
    attempts.value = [] // Ensure it's always an array
  } finally {
    loading.value = false
  }
}

// Add new attempt to the list
const addAttempt = (newAttempt) => {
  attempts.value.unshift(newAttempt)
}

// Reset pagination when filter changes
watch(filterPrompt, () => {
  currentPage.value = 1
})

onMounted(() => {
  loadAttempts()
})

// Expose methods to parent
defineExpose({
  loadAttempts,
  addAttempt
})
</script> 