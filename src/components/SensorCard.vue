<template>
  <div class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
    <!-- Верхня кольорова смужка -->
    <div class="absolute top-0 left-0 right-0 h-1" :class="gradientClass"></div>
    
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-3">
          <!-- Іконка залежно від типу датчика -->
          <div class="p-2 rounded-lg" :class="iconBgClass">
            <component :is="sensorIcon" class="w-5 h-5" :class="iconColorClass" />
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

      <!-- Значення датчика -->
      <div class="mt-4 flex items-end justify-between">
        <div>
          <span class="text-3xl font-light text-gray-900 dark:text-white">{{ device.value }}</span>
          <span class="text-lg text-gray-600 dark:text-gray-400 ml-1">{{ device.unit }}</span>
        </div>
        <span class="text-xs px-2 py-1 rounded-full" :class="typeClass">{{ subtypeLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { 
  SunIcon as TemperatureIcon,
  CloudIcon as HumidityIcon,
  ArrowPathIcon as PressureIcon,
  CircleStackIcon as OtherIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  device: Object
})
defineEmits(['remove'])

const subtypeLabel = computed(() => {
  const map = { temperature: 'Температура', humidity: 'Вологість', pressure: 'Тиск', ppm: 0, rs: 0, adc: 0 }
  return map[props.device.subtype] || props.device.subtype
})

const sensorIcon = computed(() => {
  const map = {
    temperature: TemperatureIcon,
    humidity: HumidityIcon,
    pressure: PressureIcon
  }
  return map[props.device.subtype] || OtherIcon
})

const gradientClass = computed(() => {
  const map = {
    temperature: 'bg-gradient-to-r from-blue-400 to-blue-600',
    humidity: 'bg-gradient-to-r from-green-400 to-green-600',
    pressure: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  }
  return map[props.device.subtype] || 'bg-gradient-to-r from-gray-400 to-gray-600'
})

const iconBgClass = computed(() => {
  const map = {
    temperature: 'bg-blue-100 dark:bg-blue-900',
    humidity: 'bg-green-100 dark:bg-green-900',
    pressure: 'bg-yellow-100 dark:bg-yellow-900'
  }
  return map[props.device.subtype] || 'bg-gray-100 dark:bg-gray-700'
})

const iconColorClass = computed(() => {
  const map = {
    temperature: 'text-blue-600 dark:text-blue-300',
    humidity: 'text-green-600 dark:text-green-300',
    pressure: 'text-yellow-600 dark:text-yellow-300'
  }
  return map[props.device.subtype] || 'text-gray-600 dark:text-gray-300'
})

const typeClass = computed(() => {
  const map = {
    temperature: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    humidity: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pressure: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return map[props.device.subtype] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
})
</script>