<template>
  <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
    <div class="absolute top-0 left-0 right-0 h-1" :class="device.status === 'on' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'"></div>
    
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg" :class="device.status === 'on' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'">
            <component :is="PumpIcon" class="w-5 h-5" :class="device.status === 'on' ? 'text-green-600 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ device.name }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Код: {{ device.code }}</p>
          </div>
        </div>
        <button @click="$emit('remove', device.id)" class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition opacity-0 group-hover:opacity-100">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="mt-4 flex justify-between items-center">
        <button 
          @click="$emit('toggle', device.id)" 
          class="px-4 py-2 rounded-full text-white font-medium transition transform active:scale-95"
          :class="device.status === 'on' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
        >
          {{ device.status === 'on' ? 'Вимкнути' : 'Увімкнути' }}
        </button>
        <span class="flex items-center gap-1 text-sm" :class="device.status === 'on' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
          <span class="relative flex h-3 w-3">
            <span v-if="device.status === 'on'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3" :class="device.status === 'on' ? 'bg-green-500' : 'bg-gray-400'"></span>
          </span>
          {{ device.status === 'on' ? 'Працює' : 'Вимкнено' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { BoltIcon as PumpIcon } from '@heroicons/vue/24/outline'

defineProps({
  device: Object
})
defineEmits(['toggle', 'remove'])
</script>