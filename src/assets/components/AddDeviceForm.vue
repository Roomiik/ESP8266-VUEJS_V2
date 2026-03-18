<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">➕ Додати новий пристрій</h2>
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Назва пристрою</label>
        <input v-model="form.name" type="text" required 
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent outline-none transition">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Термінальний код</label>
        <input v-model="form.code" type="text" required placeholder="напр. 00Т01" 
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent outline-none transition">
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Формат: два символи зони, літера типу (Т, К, …), два символи номера</p>
      </div>
      
      <!-- Поля для датчика -->
      <div v-if="isSensor" class="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Тип датчика</label>
          <select v-model="form.subtype" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500">
            <option value="temperature">🌡️ Температура</option>
            <option value="humidity">💧 Вологість</option>
            <option value="pressure">📊 Тиск</option>
            <option value="other">🔧 Інше</option>
          </select>
        </div>
        <div v-if="form.subtype === 'other'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Одиниця виміру</label>
          <input v-model="form.unit" type="text" placeholder="напр. lux" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
        </div>
      </div>

      <button type="submit" 
        class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-md">
        Додати пристрій
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const emit = defineEmits(['add'])

const form = reactive({
  name: '',
  code: '',
  subtype: 'temperature',
  unit: ''
})

const isSensor = computed(() => {
  // Визначаємо за літерою в коді (після двох цифр)
  const match = form.code.match(/^\d{2}([A-Za-zА-Яа-я])/)
  return match && match[1].toUpperCase() === 'Т'
})

function handleSubmit() {
  const typeLetter = form.code.match(/^\d{2}([A-Za-zА-Яа-я])/)?.[1].toUpperCase()
  let deviceType = 'unknown'
  if (typeLetter === 'T') deviceType = 'sensor'
  else if (typeLetter === 'К') deviceType = 'pump'

  const newDevice = {
    name: form.name,
    code: form.code,
    type: deviceType,
  }

  if (deviceType === 'sensor') {
    newDevice.subtype = form.subtype
    newDevice.unit = form.unit || (form.subtype === 'temperature' ? '°C' : form.subtype === 'humidity' ? '%' : form.subtype === 'pressure' ? 'hPa' : '')
    newDevice.value = 0 // початкове значення
  } else if (deviceType === 'pump') {
    newDevice.status = 'off'
  } else {
    alert('Невідомий тип пристрою. Використовуйте Т для датчика, К для насоса.')
    return
  }

  emit('add', newDevice)
  // очистити форму
  form.name = ''
  form.code = ''
  form.subtype = 'temperature'
  form.unit = ''
}
</script>