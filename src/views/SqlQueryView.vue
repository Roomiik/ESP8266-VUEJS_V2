<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">SQL Query Console</h1>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Секретний ключ</label>
          <input v-model="secret" type="password" class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SQL Запит (тільки SELECT)</label>
          <textarea v-model="sqlQuery" rows="6" class="w-full px-4 py-2 border rounded-lg font-mono text-sm dark:bg-gray-700 dark:border-gray-600" placeholder="SELECT * FROM sensors"></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="executeQuery" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Виконати</button>
          <button @click="clearResults" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">Очистити</button>
        </div>

        <!-- Результати -->
        <div v-if="results.length" class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Результати ({{ results.length }} рядків)</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 dark:border-gray-600">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                  <th v-for="key in Object.keys(results[0])" :key="key" class="border px-4 py-2 text-left">{{ key }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in results" :key="idx" class="border-b">
                  <td v-for="key in Object.keys(row)" :key="key" class="border px-4 py-2">{{ row[key] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'https://esp8266-vuejs-v2-1.onrender.com/api'; // змініть на ваш сервер
const secret = ref('');
const sqlQuery = ref('SELECT * FROM sensors');
const results = ref([]);
const error = ref('');

async function executeQuery() {
  if (!secret.value) {
    error.value = 'Введіть секретний ключ';
    return;
  }
  if (!sqlQuery.value.trim()) {
    error.value = 'Введіть SQL запит';
    return;
  }

  error.value = '';
  try {
    const response = await axios.post(`${API_URL}/admin/sql`, {
      query: sqlQuery.value,
      secret: secret.value
    });
    results.value = response.data;
    if (results.value.length === 0) {
      error.value = 'Запит виконано, але результатів немає.';
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || err.message;
    results.value = [];
  }
}

function clearResults() {
  results.value = [];
  error.value = '';
}
</script>
