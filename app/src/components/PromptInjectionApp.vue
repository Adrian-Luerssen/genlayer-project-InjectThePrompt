<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-4">
            <div class="bg-white rounded-full p-2">
              <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">⚔️ HackThePrompt</h1>
              <p class="text-purple-200 text-sm">Decentralized AI Security Arena</p>
            </div>
            <div class="hidden md:flex items-center space-x-6 ml-8">
              <div class="text-center">
                <div class="text-xl font-bold text-green-400">{{ totalBountyPool }} ETH</div>
                <div class="text-xs text-purple-200">Total Bounty Pool</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-blue-400">{{ availablePrompts.length }}</div>
                <div class="text-xs text-purple-200">Active Challenges</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-bold text-orange-400">{{ totalAttempts }}</div>
                <div class="text-xs text-purple-200">Total Attacks</div>
              </div>
            </div>
          </div>
          
          <!-- Account Management -->
          <div class="flex items-center space-x-4">
            <div v-if="account" class="text-purple-200 text-sm">
              <div class="bg-white bg-opacity-10 rounded-lg px-3 py-2">
                <div class="text-xs text-purple-200">Hacker Account</div>
                <div class="font-mono text-white">{{ account.address.slice(0, 6) }}...{{ account.address.slice(-4) }}</div>
              </div>
            </div>
            <button
              v-if="!account"
              @click="createAccount"
              class="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all font-semibold transform hover:scale-105 shadow-lg"
            >
              🚀 Join Arena
            </button>
            <button
              v-if="account"
              @click="resetAccount"
              class="px-4 py-2 bg-white bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-all text-sm border border-white border-opacity-20"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Account Required Notice -->
    <div v-if="!account" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-gradient-to-br from-indigo-50 to-purple-100 border-2 border-indigo-200 rounded-2xl p-8 text-center shadow-xl">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-indigo-900 mb-4">🎮 Ready to Hack?</h2>
        <p class="text-lg text-indigo-700 mb-6 max-w-2xl mx-auto">
          Join the decentralized AI security arena! Create challenges, launch attacks, and earn ETH bounties through consensus-verified prompt injection testing.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="p-4 bg-white rounded-lg border border-indigo-100">
            <div class="text-2xl mb-2">🛡️</div>
            <div class="font-semibold text-indigo-900">Create Challenges</div>
            <div class="text-sm text-indigo-600">Fund bounty pools</div>
          </div>
          <div class="p-4 bg-white rounded-lg border border-indigo-100">
            <div class="text-2xl mb-2">⚔️</div>
            <div class="font-semibold text-indigo-900">Launch Attacks</div>
            <div class="text-sm text-indigo-600">Break AI security</div>
          </div>
          <div class="p-4 bg-white rounded-lg border border-indigo-100">
            <div class="text-2xl mb-2">💰</div>
            <div class="font-semibold text-indigo-900">Earn Bounties</div>
            <div class="text-sm text-indigo-600">Get paid for success</div>
          </div>
        </div>
        <button
          @click="createAccount"
          class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg transform hover:scale-105"
        >
          🚀 Join the Arena Now
        </button>
        <p class="text-sm text-indigo-600 mt-4">Powered by GenLayer consensus network</p>
      </div>
    </div>

    <!-- Main Application -->
    <main v-if="account" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Diagnostic Panel (only show if there are errors or in development) -->
      <DiagnosticPanel v-if="showDiagnostics" />
      
      <!-- Status Bar -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4 text-sm">
          <div class="flex items-center space-x-2">
            <div class="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-gray-700">Contract: {{ contractStatus }}</span>
          </div>
          <div class="text-gray-500">|</div>
          <span class="text-gray-700">💰 Total Pool: {{ totalBountyPool }} ETH</span>
          <div class="text-gray-500">|</div>
          <span class="text-gray-700">🎯 Challenges: {{ availablePrompts.length }}</span>
          <div class="text-gray-500">|</div>
          <span class="text-gray-700">⚔️ Attempts: {{ totalAttempts }}</span>
        </div>
          <div class="flex space-x-2">
            <button
              @click="showDiagnostics = !showDiagnostics"
              class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
              {{ showDiagnostics ? 'Hide Debug' : 'Debug' }}
            </button>
            <button
              @click="refreshAll"
              :disabled="refreshing"
              class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ refreshing ? 'Refreshing...' : 'Refresh All' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-2 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all transform hover:scale-105"
            :class="{
              'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg': activeTab === tab.id,
              'text-gray-600 hover:bg-gray-50 hover:text-gray-900': activeTab !== tab.id
            }"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Register New Prompt Tab -->
        <div v-if="activeTab === 'register'">
          <PromptRegistration
            @prompt-registered="onPromptRegistered"
          />
        </div>

        <!-- Browse Prompts Tab -->
        <div v-if="activeTab === 'browse'">
          <PromptList
            ref="promptListRef"
            :selected-prompt-id="selectedPrompt?.id"
            @prompt-selected="onPromptSelected"
            @prompt-deleted="onPromptDeleted"
          />
        </div>

        <!-- Attack Testing Tab -->
        <div v-if="activeTab === 'attack'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Target Selection (if no prompt selected) -->
            <div v-if="!selectedPrompt">
              <PromptList
                ref="attackPromptListRef"
                :selected-prompt-id="selectedPrompt?.id"
                @prompt-selected="onPromptSelected"
                @prompt-deleted="onPromptDeleted"
              />
            </div>
            
            <!-- Attack Interface -->
            <div :class="selectedPrompt ? 'lg:col-span-2' : ''">
              <AttackInvocation
                :selected-prompt="selectedPrompt"
                @attack-completed="onAttackCompleted"
              />
            </div>
          </div>
        </div>

        <!-- Attempt History Tab -->
        <div v-if="activeTab === 'history'">
          <AttemptLog
            ref="attemptLogRef"
            :selected-prompt-id="selectedPrompt?.id"
            :available-prompts="availablePrompts"
          />
        </div>

        <!-- All-in-One Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all transform hover:scale-105">
                <div class="flex items-center mb-3">
                  <div class="bg-blue-600 rounded-full p-2 mr-3">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-blue-900">🛡️ Create Challenge</h3>
                </div>
                <p class="text-sm text-blue-700 mb-4">Set up a new security challenge with bounty pool for hackers to attack</p>
                <button
                  @click="activeTab = 'register'"
                  class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  💰 Create & Fund Challenge
                </button>
              </div>
              
              <div class="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-all transform hover:scale-105">
                <div class="flex items-center mb-3">
                  <div class="bg-red-600 rounded-full p-2 mr-3">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-red-900">⚔️ Launch Attack</h3>
                </div>
                <p class="text-sm text-red-700 mb-4">Break security challenges and win ETH bounties. Pay attack costs to participate</p>
                <button
                  @click="activeTab = 'attack'"
                  class="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105"
                >
                  🚀 Start Hacking
                </button>
              </div>
              
              <div class="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all transform hover:scale-105">
                <div class="flex items-center mb-3">
                  <div class="bg-purple-600 rounded-full p-2 mr-3">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-purple-900">📊 View Results</h3>
                </div>
                <p class="text-sm text-purple-700 mb-4">Analyze attack histories, success rates, and earnings from security testing</p>
                <button
                  @click="activeTab = 'history'"
                  class="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                  📈 View Analytics
                </button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-green-200">
                <div class="flex items-center mb-4">
                  <div class="bg-green-600 rounded-full p-2 mr-3">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-green-900">💰 Highest Bounty Challenges</h3>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="prompt in topBountyPrompts"
                    :key="prompt.id"
                    class="p-3 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all cursor-pointer"
                    @click="selectedPrompt = prompt; activeTab = 'attack'"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div class="font-semibold text-gray-900">{{ prompt.name }}</div>
                      <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        {{ prompt.bounty_pool || '1.0' }} ETH
                      </span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                      <span>{{ prompt.attempt_count || 0 }} attempts</span>
                      <span>Attack: {{ prompt.attack_cost || '0.1' }} ETH</span>
                    </div>
                  </div>
                  <div v-if="availablePrompts.length === 0" class="text-center py-4">
                    <div class="text-gray-500 text-sm mb-2">🎯 No challenges available</div>
                    <button 
                      @click="activeTab = 'register'"
                      class="text-xs text-green-600 hover:text-green-800 underline"
                    >
                      Create the first challenge
                    </button>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-red-50 to-orange-100 rounded-xl shadow-lg p-6 border border-red-200">
                <div class="flex items-center mb-4">
                  <div class="bg-red-600 rounded-full p-2 mr-3">
                    <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-red-900">⚔️ Latest Attack Results</h3>
                </div>
                <div class="space-y-3">
                  <div
                    v-for="attempt in recentAttempts.slice(0, 3)"
                    :key="attempt.id"
                    class="p-3 rounded-lg border"
                    :class="{
                      'bg-red-100 border-red-200': attempt.success,
                      'bg-green-100 border-green-200': !attempt.success
                    }"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <div class="font-semibold" :class="{
                        'text-red-900': attempt.success,
                        'text-green-900': !attempt.success
                      }">
                        {{ attempt.success ? '💥 BREACH!' : '🛡️ BLOCKED' }}
                      </div>
                      <div class="text-xs text-gray-600">
                        {{ formatTimestamp(attempt.timestamp) }}
                      </div>
                    </div>
                    <div class="text-sm text-gray-700 mb-1">
                      Target: {{ attempt.prompt_name }}
                    </div>
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-600">By: {{ attempt.attacker_name }}</span>
                      <span 
                        class="font-bold"
                        :class="{
                          'text-red-600': attempt.success,
                          'text-green-600': !attempt.success
                        }"
                      >
                        {{ attempt.success ? '+' + calculateWinnings(attempt) : 'Lost' }} ETH
                      </span>
                    </div>
                  </div>
                  <div v-if="recentAttempts.length === 0" class="text-center py-4">
                    <div class="text-gray-500 text-sm mb-2">⚔️ No attacks launched yet</div>
                    <button 
                      @click="activeTab = 'attack'"
                      class="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Launch the first attack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Global Loading Overlay -->
    <div v-if="initializing" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
        <div class="flex items-center space-x-3">
          <svg class="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>
            <p class="font-medium text-gray-900">Initializing Contract</p>
            <p class="text-sm text-gray-600">This may take a moment...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { account, createAccount as createGenLayerAccount, removeAccount } from '../services/genlayer.js'
import { promptInjectionService } from '../services/promptInjectionService.js'
import PromptRegistration from './PromptRegistration.vue'
import PromptList from './PromptList.vue'
import AttackInvocation from './AttackInvocation.vue'
import AttemptLog from './AttemptLog.vue'
import DiagnosticPanel from './DiagnosticPanel.vue'

// State
const activeTab = ref('dashboard')
const selectedPrompt = ref(null)
const availablePrompts = ref([])
const recentAttempts = ref([])
const initializing = ref(false)
const refreshing = ref(false)
const contractStatus = ref('Checking...')
const showDiagnostics = ref(false)

// Refs to child components
const promptListRef = ref()
const attackPromptListRef = ref()
const attemptLogRef = ref()

// Tabs configuration
const tabs = [
  { id: 'dashboard', name: '🏠 Arena', icon: '🏠' },
  { id: 'register', name: '🛡️ Create Challenge', icon: '🛡️' },
  { id: 'browse', name: '🎯 Browse Targets', icon: '🎯' },
  { id: 'attack', name: '⚔️ Launch Attack', icon: '⚔️' },
  { id: 'history', name: '📊 Battle Log', icon: '📊' }
]

// Computed
const totalAttempts = computed(() => {
  return recentAttempts.value.length
})

const totalBountyPool = computed(() => {
  return availablePrompts.value.reduce((sum, prompt) => {
    return sum + (parseFloat(prompt.bounty_pool) || 1.0)
  }, 0).toFixed(1)
})

const topBountyPrompts = computed(() => {
  return [...availablePrompts.value]
    .sort((a, b) => (parseFloat(b.bounty_pool) || 1.0) - (parseFloat(a.bounty_pool) || 1.0))
    .slice(0, 3)
})

const calculateWinnings = (attempt) => {
  if (!attempt.success) return '0.0'
  // Find the prompt to get bounty info
  const prompt = availablePrompts.value.find(p => p.id === attempt.prompt_id)
  if (!prompt) return '0.0'
  const bountyPool = parseFloat(prompt.bounty_pool) || 1.0
  const winnerPercentage = prompt.winner_reward_percentage || 80
  return (bountyPool * winnerPercentage / 100).toFixed(2)
}

// Methods
const createAccount = async () => {
  try {
    createGenLayerAccount()
    // Reload the page to ensure proper initialization
    window.location.reload()
  } catch (error) {
    console.error('Error creating account:', error)
  }
}

const resetAccount = async () => {
  if (confirm('Are you sure you want to reset your account? This will clear all data.')) {
    removeAccount()
    await promptInjectionService.resetContract()
    location.reload()
  }
}

const initializeApp = async () => {
  if (!account) return

  initializing.value = true
  try {
    // Initialize the service
    const contractAddress = await promptInjectionService.initialize()
    contractStatus.value = `${contractAddress.slice(0, 8)}...${contractAddress.slice(-6)}`
    
    // Load initial data
    await loadPrompts()
    await loadRecentAttempts()
  } catch (error) {
    console.error('Error initializing app:', error)
    contractStatus.value = 'Error'
  } finally {
    initializing.value = false
  }
}

const loadPrompts = async () => {
  try {
    const result = await promptInjectionService.getAllPrompts()
    const promptsData = result?.result || result || []
    availablePrompts.value = Array.isArray(promptsData) ? promptsData : []
  } catch (error) {
    console.error('Error loading prompts:', error)
    availablePrompts.value = [] // Ensure it's always an array
  }
}

const loadRecentAttempts = async () => {
  try {
    const result = await promptInjectionService.getLatestAttempts(10)
    const attemptsData = result?.result || result || []
    recentAttempts.value = Array.isArray(attemptsData) ? attemptsData : []
  } catch (error) {
    console.error('Error loading recent attempts:', error)
    recentAttempts.value = [] // Ensure it's always an array
  }
}

const refreshAll = async () => {
  refreshing.value = true
  try {
    await Promise.all([
      loadPrompts(),
      loadRecentAttempts(),
      promptListRef.value?.loadPrompts(),
      attackPromptListRef.value?.loadPrompts(),
      attemptLogRef.value?.loadAttempts()
    ])
  } finally {
    refreshing.value = false
  }
}

const onPromptRegistered = (newPrompt) => {
  availablePrompts.value.unshift(newPrompt)
  promptListRef.value?.addPrompt(newPrompt)
  attackPromptListRef.value?.addPrompt(newPrompt)
  
  // Switch to browse tab to see the new prompt
  activeTab.value = 'browse'
}

const onPromptSelected = (prompt) => {
  selectedPrompt.value = prompt
}

const onPromptDeleted = (promptId) => {
  availablePrompts.value = availablePrompts.value.filter(p => p.id !== promptId)
  if (selectedPrompt.value?.id === promptId) {
    selectedPrompt.value = null
  }
}

const onAttackCompleted = (attempt) => {
  recentAttempts.value.unshift(attempt)
  attemptLogRef.value?.addAttempt(attempt)
  
  // Update attempt count for the prompt
  const prompt = availablePrompts.value.find(p => p.id === attempt.prompt_id)
  if (prompt) {
    prompt.attempt_count = (prompt.attempt_count || 0) + 1
  }
  
  // Switch to history tab to see the result
  activeTab.value = 'history'
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp * 1000).toLocaleString()
}

// Initialize app on mount
onMounted(() => {
  if (account) {
    initializeApp()
  }
})
</script> 