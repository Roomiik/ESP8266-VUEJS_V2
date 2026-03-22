<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">Історія показників</h1>

      <!-- Вибір датчика -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Виберіть датчик</label>
        <select v-model="selectedSensor" class="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option v-for="sensor in sensors" :key="sensor.code" :value="sensor.code">
            {{ sensor.name }} ({{ sensor.code }})
          </option>
        </select>
      </div>

      <!-- Графік -->
      <SensorChart
        v-if="chartData.length"
        :title="selectedSensorName"
        :data="chartData"
      />
      <div v-else class="text-center text-gray-500 py-10">
        Немає даних для обраного датчика
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useDeviceStore } from '@/stores/deviceStore';
import SensorChart from '@/components/SensorChart.vue';

const store = useDeviceStore();
const sensors = ref([]);
const selectedSensor = ref('');
const chartData = ref([]);
const selectedSensorName = ref('');

const API_URL = 'https://esp8266-serve-v2.onrender.com/api'; // замініть на вашу адресу

// Завантажуємо список датчиків
onMounted(async () => {
  await store.fetchDevices();
  sensors.value = store.devices.filter(d => d.type === 'sensor');
  if (sensors.value.length) {
    selectedSensor.value = sensors.value[0].code;
    selectedSensorName.value = sensors.value[0].name;
    loadHistory();
  }
});

// Слідкуємо за зміною вибраного датчика
watch(selectedSensor, (newCode) => {
  const sensor = sensors.value.find(s => s.code === newCode);
  if (sensor) selectedSensorName.value = sensor.name;
  loadHistory();
});

async function loadHistory() {
  if (!selectedSensor.value) return;
  try {
    const response = await axios.get(`${API_URL}/sensors/${selectedSensor.value}/history`);
    chartData.value = response.data;
  } catch (error) {
    console.error('Помилка завантаження історії:', error);
  }
}
</script>
