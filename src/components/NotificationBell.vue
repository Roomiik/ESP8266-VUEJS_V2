<template>
  <div ref="wrapper" class="relative">
    <button 
      @click="toggleNotifications" 
      class="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      :class="{ 'after:absolute after:top-1 after:right-1 after:w-2 after:h-2 after:bg-red-500 after:rounded-full': unreadCount > 0 }"
    >
      <BellIcon class="w-5 h-5" />
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {{ unreadCount }}
      </span>
    </button>

    <Transition
      enter="transition duration-200 ease-out"
      enter-from="opacity-0 scale-95"
      enter-to="opacity-100 scale-100"
      leave="transition duration-150 ease-in"
      leave-from="opacity-100 scale-100"
      leave-to="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="font-semibold text-gray-900 dark:text-white">Сповіщення</h3>
          <div class="flex gap-2">
            <button v-if="notifications.length > 0" @click="markAllAsRead" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Прочитати всі
            </button>
            <button v-if="notifications.length > 0" @click="clearAll" class="text-xs text-red-600 dark:text-red-400 hover:underline">
              Очистити
            </button>
          </div>
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            Немає сповіщень
          </div>
          <div v-for="notification in notifications" :key="notification.id" 
            class="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 text-xl">
                {{ notification.icon }}
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-900 dark:text-white">{{ notification.message }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ notification.time }}</p>
              </div>
              <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
const isOpen = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleNotifications() {
  isOpen.value = !isOpen.value
}

function markAsRead(id) {
  notificationStore.markAsRead(id)
}

function markAllAsRead() {
  notificationStore.markAllAsRead()
}

function clearAll() {
  notificationStore.clearAll()
}

// Закриваємо при кліку поза компонентом
// function handleClickOutside(e) {
//   if (!e.target.closest('.relative')) {
//     isOpen.value = false
//   }
// }

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const wrapper = ref(null)

function handleClickOutside(e) {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    isOpen.value = false
  }
}
</script>