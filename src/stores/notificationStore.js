import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref([])

  // Додати нове сповіщення
  function addNotification({ message, type = 'info', timeout = 5000 }) {
    const id = crypto.randomUUID()
    const notification = {
      id,
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false,
      icon: getIconForType(type)
    }
    notifications.value.unshift(notification) // нові зверху

    // Автоматично видалити через timeout (якщо не 0)
    if (timeout > 0) {
      // setTimeout(() => removeNotification(id), timeout)
    }
  }

  // Видалити сповіщення за id
  function removeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

  // Позначити як прочитане
  function markAsRead(id) {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  // Позначити всі як прочитані
  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  // Очистити всі сповіщення
  function clearAll() {
  notifications.value.splice(0, notifications.value.length)
}
  // Допоміжна функція для іконок
  function getIconForType(type) {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return 'ℹ️'
    }
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  }
})