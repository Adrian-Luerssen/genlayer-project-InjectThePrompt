<template>
  <div class="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-blue-500">
    <h3 class="font-medium text-gray-900 mb-3">🔧 Diagnostic Panel</h3>
    
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span>Account:</span>
        <span :class="account ? 'text-green-600' : 'text-red-600'">
          {{ account ? '✅ Connected' : '❌ Not Connected' }}
        </span>
      </div>
      
      <div v-if="account" class="flex justify-between">
        <span>Address:</span>
        <span class="font-mono text-xs">{{ account.address }}</span>
      </div>
      
      <div class="flex justify-between">
        <span>Client:</span>
        <span :class="client ? 'text-green-600' : 'text-red-600'">
          {{ client ? '✅ Initialized' : '❌ Not Initialized' }}
        </span>
      </div>
      
      <div class="flex justify-between">
        <span>Contract Address:</span>
        <span class="font-mono text-xs">{{ contractAddress || 'Not deployed' }}</span>
      </div>
      
      <div class="flex justify-between">
        <span>Service Status:</span>
        <span :class="serviceStatus === 'Ready' ? 'text-green-600' : 'text-yellow-600'">
          {{ serviceStatus }}
        </span>
      </div>
    </div>
    
    <div class="mt-4 space-x-2">
      <button
        @click="testConnection"
        :disabled="testing"
        class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
      >
        {{ testing ? 'Testing...' : 'Test Connection' }}
      </button>
      
      <button
        @click="deployNewContract"
        :disabled="deploying"
        class="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
      >
        {{ deploying ? 'Deploying...' : 'Deploy Contract' }}
      </button>
      
      <button
        @click="togglePanel"
        class="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
      >
        {{ showDetails ? 'Hide Details' : 'Show Details' }}
      </button>
    </div>
    
    <div v-if="showDetails" class="mt-4 p-3 bg-gray-50 rounded text-xs">
      <h4 class="font-medium mb-2">Debug Info:</h4>
      <pre class="whitespace-pre-wrap">{{ debugInfo }}</pre>
    </div>
    
    <div v-if="testResult" class="mt-3 p-2 rounded text-xs" :class="testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
      {{ testResult.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { account, client } from '../services/genlayer.js'
import { promptInjectionService } from '../services/promptInjectionService.js'

const testing = ref(false)
const deploying = ref(false)
const showDetails = ref(false)
const testResult = ref(null)
const debugInfo = ref('')

const contractAddress = computed(() => {
  return promptInjectionService.contractAddress || localStorage.getItem('promptInjectionContractAddress')
})

const serviceStatus = computed(() => {
  if (!account) return 'No Account'
  if (!client) return 'No Client'
  if (!contractAddress.value) return 'No Contract'
  return 'Ready'
})

const updateDebugInfo = () => {
  debugInfo.value = JSON.stringify({
    account: account ? {
      address: account.address,
      type: typeof account
    } : null,
    client: client ? 'Initialized' : null,
    contractAddress: contractAddress.value,
    localStorage: {
      accountKey: !!localStorage.getItem('accountPrivateKey'),
      contractAddress: localStorage.getItem('promptInjectionContractAddress')
    },
    serviceContractAddress: promptInjectionService.contractAddress
  }, null, 2)
}

const testConnection = async () => {
  testing.value = true
  testResult.value = null
  
  try {
    if (!account) {
      throw new Error('No account available')
    }
    
    if (!contractAddress.value) {
      throw new Error('No contract deployed')
    }
    
    // Try to get prompts
    const result = await promptInjectionService.getAllPrompts()
    
    testResult.value = {
      success: true,
      message: `✅ Connection successful! Found ${result?.result?.length || 0} prompts.`
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `❌ Connection failed: ${error.message}`
    }
  } finally {
    testing.value = false
    updateDebugInfo()
  }
}

const deployNewContract = async () => {
  deploying.value = true
  testResult.value = null
  
  try {
    const newAddress = await promptInjectionService.deployContract()
    testResult.value = {
      success: true,
      message: `✅ Contract deployed successfully at: ${newAddress}`
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `❌ Deployment failed: ${error.message}`
    }
  } finally {
    deploying.value = false
    updateDebugInfo()
  }
}

const togglePanel = () => {
  showDetails.value = !showDetails.value
  if (showDetails.value) {
    updateDebugInfo()
  }
}

onMounted(() => {
  updateDebugInfo()
})
</script> 