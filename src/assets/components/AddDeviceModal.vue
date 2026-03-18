<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <!-- Затемнений фон -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Центрування модального вікна -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
              <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                <span>➕ Додати новий пристрій</span>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </DialogTitle>

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

                <div class="flex gap-3 mt-6">
                  <button type="button" @click="closeModal" 
                    class="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition">
                    Скасувати
                  </button>
                  <button type="submit" 
                    class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition">
                    Додати
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'add'])

const form = reactive({
  name: '',
  code: '',
  subtype: 'temperature',
  unit: ''
})

const isSensor = computed(() => {
  const match = form.code.match(/^\d{2}([A-Za-zА-Яа-я])/)
  return match && match[1].toUpperCase() === "T"
})

function closeModal() {
  emit('close')
  // Очищаємо форму при закритті
  form.name = ''
  form.code = ''
  form.subtype = 'temperature'
  form.unit = ''
}

function handleSubmit() {
  const typeLetter = form.code.match(/^\d{2}([A-Za-zА-Яа-я])/)?.[1].toUpperCase()
  let deviceType = 'unknown'
  if (typeLetter === "T") deviceType = 'sensor'
  else if (typeLetter === "K") deviceType = 'pump'

  const newDevice = {
    name: form.name,
    code: form.code,
    type: deviceType,
  }

  if (deviceType === 'sensor') {
    newDevice.subtype = form.subtype
    newDevice.unit = form.unit || (form.subtype === 'temperature' ? '°C' : form.subtype === 'humidity' ? '%' : form.subtype === 'pressure' ? 'hPa' : '')
    newDevice.value = 0
  } else if (deviceType === 'pump') {
    newDevice.status = 'off'
  } else {
    alert('Невідомий тип пристрою. Використовуйте Т для датчика, К для насоса.')
    return
  }

  emit('add', newDevice)
  closeModal()
}
</script>