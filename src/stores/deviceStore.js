import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = 'https://esp8266-serve-v2.onrender.com/api' // адреса вашого сервера

export const useDeviceStore = defineStore('devices', () => {
  const devices = ref([])

  // Завантажити всі пристрої з сервера
  async function fetchDevices() {
  const url = `${API_URL}/devices`;
  
  try {
    const response = await axios.get(url);
    
    if (Array.isArray(response.data)) {
      devices.value = response.data.map(d => {
        if (d.type === 'sensor') {
          return { ...d, id: d.code, value: null };
        } else {
          return { ...d, id: d.code };
        }
      });
      await fetchLatestSensorData();
    } else {
      console.warn('Expected array, got:', response.data);
    }
  } catch (error) {
    console.error('❌ fetchDevices error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

  // Завантажити останні дані датчиків
  async function fetchLatestSensorData() {
  try {
    const response = await axios.get(`${API_URL}/sensors/latest`);

    if (Array.isArray(response.data)) {
      response.data.forEach(sensorData => {
        // Шукаємо пристрій за кодом
        const device = devices.value.find(d => d.code.replace('Т', 'T') === sensorData.sensor_code);
        if (device) {
          device.value = sensorData.value;
        } else {
          console.warn(`❌ Device with code ${sensorData.sensor_code} not found in store. Available codes:`, devices.value.map(d => d.sensor_code));
        }
      });
    } else {
      console.warn('⚠️ Response is not an array:', response.data);
    }

  } catch (error) {
    console.error('❌ Error in fetchLatestSensorData:', error);
  }
}

  // Додати новий пристрій
  async function addDevice(device) {
    try {
      await axios.post(`${API_URL}/devices`, device)
      await fetchDevices() // перезавантажити список
    } catch (error) {
      console.error('Failed to add device', error)
    }
  }

  // Перемкнути насос
  async function togglePump(code) {
    try {
      const response = await axios.post(`${API_URL}/pumps/${code}/toggle`)
      const pump = devices.value.find(d => d.code === code)
      if (pump) pump.status = response.data.status
    } catch (error) {
      console.error('Failed to toggle pump', error)
    }
  }

  // Оновити значення датчика (якщо використовуєте WebSocket або періодичне опитування)
  function updateSensorValue(code, newValue) {
    const device = devices.value.find(d => d.code === code)
    if (device) device.value = newValue
  }

  // Видалити пристрій
  async function removeDevice(code) {
    // console.log('Attempting to remove device with code:', code);
    const response = await axios.post(`${API_URL}/devices/del`, {
      code: code,
    });
    
    devices.value = devices.value.filter(d => d.code !== code)
  }

  return { devices, fetchDevices, fetchLatestSensorData, addDevice, togglePump, updateSensorValue, removeDevice }
})
