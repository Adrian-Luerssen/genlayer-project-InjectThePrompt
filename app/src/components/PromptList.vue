<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 flex items-center">
          🎯 Active Security Challenges
        </h2>
        <p class="text-gray-600 mt-1">Choose a target to attack and win bounties</p>
      </div>
      <button
        @click="loadPrompts"
        :disabled="loading"
        class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all font-semibold shadow-lg"
      >
        <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else>🔄 Refresh</span>
      </button>
    </div>

    <!-- Summary Stats -->
    <div v-if="!loading && prompts.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
        <div class="flex items-center">
          <div class="bg-green-100 rounded-full p-2 mr-3">
            <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-green-600 font-medium">Total Bounty</p>
            <p class="text-xl font-bold text-green-900">{{ totalBounty }} ETH</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center">
          <div class="bg-blue-100 rounded-full p-2 mr-3">
            <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-blue-600 font-medium">Challenges</p>
            <p class="text-xl font-bold text-blue-900">{{ prompts.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
        <div class="flex items-center">
          <div class="bg-purple-100 rounded-full p-2 mr-3">
            <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-purple-600 font-medium">Total Attempts</p>
            <p class="text-xl font-bold text-purple-900">{{ totalAttempts }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
        <div class="flex items-center">
          <div class="bg-orange-100 rounded-full p-2 mr-3">
            <svg class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-orange-600 font-medium">Avg Difficulty</p>
            <p class="text-xl font-bold text-orange-900">{{ averageDifficulty }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && prompts.length === 0" class="text-center py-12">
      <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
        <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Security Challenges Available</h3>
      <p class="text-gray-500 mb-4">Be the first to create a challenge and start earning bounties!</p>
      <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        Create First Challenge
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="border border-gray-200 rounded-lg p-6">
          <div class="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Challenges Grid -->
    <div v-if="!loading && prompts.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="prompt in prompts"
        :key="prompt.id"
        class="relative border rounded-xl p-6 transition-all duration-300 cursor-pointer group"
        :class="{
          'border-blue-500 bg-blue-50 shadow-lg transform scale-105': selectedPromptId === prompt.id,
          'border-gray-200 hover:border-blue-300 hover:shadow-md': selectedPromptId !== prompt.id
        }"
        @click="selectPrompt(prompt)"
      >
        <!-- Difficulty Badge -->
        <div class="absolute top-4 right-4">
          <span 
            class="px-3 py-1 rounded-full text-xs font-bold"
            :class="getDifficultyClass(prompt.difficulty)"
          >
            {{ getDifficultyLabel(prompt.difficulty) }}
          </span>
        </div>

        <!-- Header -->
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900 mb-2 pr-20">{{ prompt.name }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            {{ prompt.description || 'No description provided' }}
          </p>
        </div>

        <!-- Bounty Info -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ prompt.bounty_pool || '1.0' }} ETH</div>
              <div class="text-xs text-green-700 font-medium">💰 Bounty Pool</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-blue-600">{{ prompt.attack_cost || '0.1' }} ETH</div>
              <div class="text-xs text-blue-700 font-medium">🎯 Attack Cost</div>
            </div>
          </div>
          
          <div class="mt-3 pt-3 border-t border-green-200">
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-600">Max Attempts: <strong>{{ prompt.max_attempts || 10 }}</strong></span>
              <span class="text-gray-600">Winner Gets: <strong>{{ prompt.winner_reward_percentage || 80 }}%</strong></span>
            </div>
          </div>
        </div>

        <!-- Prompt Preview -->
        <div class="mb-4">
          <p class="text-xs font-medium text-gray-500 mb-2">🛡️ Target Prompt:</p>
          <div class="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-700 max-h-20 overflow-y-auto border">
            {{ prompt.target_prompt }}
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
              </svg>
              ID: {{ prompt.id }}
            </span>
            <span class="flex items-center">
              <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(prompt.created_at) }}
            </span>
          </div>
          <span class="flex items-center">
            <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ prompt.attempt_count || 0 }} attempts
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click.stop="selectPrompt(prompt)"
            class="flex-1 py-2 px-4 rounded-lg font-semibold transition-all"
            :class="selectedPromptId === prompt.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transform hover:scale-105'"
          >
            {{ selectedPromptId === prompt.id ? '✅ Selected' : '🚀 Attack Now' }}
          </button>

          <button
            @click.stop="deletePrompt(prompt)"
            class="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
            :disabled="deleting === prompt.id"
            title="Delete Challenge"
          >
            {{ deleting === prompt.id ? '⏳' : '🗑️' }}
          </button>
        </div>

        <!-- Selection Indicator -->
        <div 
          v-if="selectedPromptId === prompt.id"
          class="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
        >
          <div class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error Loading Challenges</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { promptInjectionService } from '../services/promptInjectionService.js'

const props = defineProps({
  selectedPromptId: String
})

const emit = defineEmits(['promptSelected', 'promptDeleted'])

const prompts = ref([])
const loading = ref(false)
const deleting = ref(null)
const errorMessage = ref('')

// Computed stats
const totalBounty = computed(() => {
  return prompts.value.reduce((sum, prompt) => sum + (parseFloat(prompt.bounty_pool) || 1.0), 0).toFixed(1)
})

const totalAttempts = computed(() => {
  return prompts.value.reduce((sum, prompt) => sum + (prompt.attempt_count || 0), 0)
})

const averageDifficulty = computed(() => {
  if (prompts.value.length === 0) return 'N/A'
  
  const difficultyMap = { easy: 1, medium: 2, hard: 3, expert: 4 }
  const totalDifficulty = prompts.value.reduce((sum, prompt) => {
    return sum + (difficultyMap[prompt.difficulty] || 2)
  }, 0)
  
  const avg = totalDifficulty / prompts.value.length
  if (avg <= 1.5) return '🟢 Easy'
  if (avg <= 2.5) return '🟡 Medium' 
  if (avg <= 3.5) return '🔴 Hard'
  return '⚫ Expert'
})

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp * 1000).toLocaleDateString()
}

const getDifficultyClass = (difficulty) => {
  const classes = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    hard: 'bg-red-100 text-red-800',
    expert: 'bg-gray-100 text-gray-800'
  }
  return classes[difficulty] || classes.medium
}

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: '🟢 Easy',
    medium: '🟡 Medium',
    hard: '🔴 Hard', 
    expert: '⚫ Expert'
  }
  return labels[difficulty] || '🟡 Medium'
}

const loadPrompts = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const result = await promptInjectionService.getAllPrompts()
    const promptsData = result?.result || result || []
    prompts.value = Array.isArray(promptsData) ? promptsData : []
  } catch (error) {
    console.error('Error loading prompts:', error)
    errorMessage.value = error.message || 'Failed to load challenges. Please try again.'
    prompts.value = [] // Ensure it's always an array
  } finally {
    loading.value = false
  }
}

const selectPrompt = (prompt) => {
  emit('promptSelected', prompt)
}

const deletePrompt = async (prompt) => {
  if (!confirm(`Are you sure you want to delete "${prompt.name}"? This will also forfeit the ${prompt.bounty_pool || 1.0} ETH bounty pool. This action cannot be undone.`)) {
    return
  }

  deleting.value = prompt.id
  
  try {
    await promptInjectionService.deletePrompt(prompt.id)
    
    // Remove from local list
    prompts.value = prompts.value.filter(p => p.id !== prompt.id)
    
    emit('promptDeleted', prompt.id)
  } catch (error) {
    console.error('Error deleting prompt:', error)
    errorMessage.value = error.message || 'Failed to delete challenge. Please try again.'
  } finally {
    deleting.value = null
  }
}

// Refresh prompts when a new one is registered
const addPrompt = (newPrompt) => {
  prompts.value.unshift(newPrompt)
}

onMounted(() => {
  loadPrompts()
})

// Expose method to parent
defineExpose({
  loadPrompts,
  addPrompt
})
</script>

<style scoped>
.group:hover .transform {
  transform: translateY(-2px);
}
</style> 