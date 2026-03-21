<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Шапка з перемикачем теми та сповіщеннями -->
    <div class="sticky top-0 z-50 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              ESP8266 Dashboard
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Моніторинг та керування пристроями</p>
          </div>
          <div class="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>

    <!-- Основний контент -->
    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <!-- Секція датчиків -->
      <section class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Датчики</h2>
          <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">{{ sensors.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SensorCard
            v-for="sensor in sensors"
            :key="sensor.id"
            :device="sensor"
            @remove="removeDevice(sensor.id)"
          />
        </div>
      </section>

      <!-- Секція насосів -->
      <section class="mb-10">
        <div class="flex items-center gap-2 mb-4">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Насоси</h2>
          <span class="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">{{ pumps.length }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <PumpCard
            v-for="pump in pumps"
            :key="pump.id"
            :device="pump"
            @toggle="togglePump"
            @remove="removeDevice"
          />
        </div>
      </section>

      <!-- Кнопка для відкриття модального вікна -->
      <div class="flex justify-center md:justify-start">
        <button 
          @click="openAddModal" 
          class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
        >
          <PlusIcon class="w-5 h-5" />
          Додати новий пристрій
        </button>
      </div>
    </div>

    <!-- Модальне вікно -->
    <AddDeviceModal 
      :is-open="isModalOpen" 
      @close="closeAddModal"
      @add="addDevice"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDeviceStore } from '@/stores/deviceStore'
import SensorCard from '@/components/SensorCard.vue'
import PumpCard from '@/components/PumpCard.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import AddDeviceModal from '@/components/AddDeviceModal.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const store = useDeviceStore()
const isModalOpen = ref(false)

const sensors = computed(() => store.devices.filter(d => d.type === 'sensor'))
const pumps = computed(() => store.devices.filter(d => d.type === 'pump'))

function openAddModal() {
  isModalOpen.value = true
}

function closeAddModal() {
  isModalOpen.value = false
}

function addDevice(device) {
  store.addDevice(device)
}

function togglePump(id) {
  store.togglePump(id)
}

function removeDevice(id) {
  console.log(id);
  store.removeDevice(id)
}

// Імітація оновлення даних датчиків (для прототипу)
let interval
onMounted(() => {
  store.fetchDevices();
  interval = setInterval(() => {
    store.fetchDevices()
  }, 5000)
  // interval = setInterval(() => {
  //   sensors.value.forEach(sensor => {
  //     let newVal = sensor.value
  //     if (sensor.subtype === 'temperature') newVal = (20 + Math.random() * 5).toFixed(1)
  //     else if (sensor.subtype === 'humidity') newVal = Math.round(40 + Math.random() * 30)
  //     else if (sensor.subtype === 'pressure') newVal = Math.round(1000 + Math.random() * 20)
  //     store.updateSensorValue(sensor.id, newVal)
  //   })
  // }, 3000)
})

onUnmounted(() => clearInterval(interval))
</script>