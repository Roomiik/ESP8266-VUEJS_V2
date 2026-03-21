import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useNotificationStore } from '@/stores/notificationStore'

// const API_URL = 'https://esp8266-serve-v2.onrender.com/api' // адреса вашого сервера
const API_URL = 'https://esp8266-serve-v2.onrender.com/api' // адреса вашого сервера
let LastFetch = 0;

// function someAction() {
//   // Просте сповіщення
//   notificationStore.addNotification({
//     message: 'Дані успішно збережено',
//     type: 'success'
// });
// }

export const useDeviceStore = defineStore('devices', () => {
  const devices = ref([]);
  const notificationStore = useNotificationStore()

  // Завантажити всі пристрої з сервера
  async function fetchDevices() {
  const url = `${API_URL}/devices`;

  try {
    const response = await axios.get(url);

    if (!Array.isArray(response.data)) return;

    response.data.forEach(d => {
      const existing = devices.value.find(dev => dev.code === d.code);

      if (existing) {
        // оновлюємо існуючий
        Object.assign(existing, d);
      } else {
        // додаємо новий
        devices.value.push({
          ...d,
          id: d.code,
          value: d.type === 'sensor' ? null : d.value
        });
      }
    });

    // видаляємо ті, яких більше нема
    devices.value = devices.value.filter(dev =>
      response.data.some(d => d.code === dev.code)
    );

    await fetchLatestSensorData();

  } catch (error) {
    console.error('❌ fetchDevices error:', error);
  }
}

  // Завантажити останні дані датчиків
  async function fetchLatestSensorData() {
  try {
    const response = await axios.get(`${API_URL}/sensors/latest`);

    if (!Array.isArray(response.data)) return;

    response.data.forEach(sensorData => {
      const device = devices.value.find(d => d.code.replace('Т', 'T') === sensorData.sensor_code);

      if (device) {
        LastFetch = Date.now();
        device.value = sensorData.value;
        console.log(device);
        
        if(device.subtype == "temperature" && device.value > 20) 
          {
        //     notificationStore.addNotification({
        //     message: `Високі показники у датчки[${device.code}]: ${device.value}`,
        //     type: 'warning'
        // })
        }
      }
    });

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

  setInterval(() => {
    let LastTimeOut = secondsDifference(Date.now(), LastFetch);
    if(LastTimeOut > 15) {
      notificationStore.addNotification({
        message: `Втрата звязку зі сервером [Останій запит: ${LastTimeOut} сек. тому]`,
        type: 'error'
    });
  }
  }, 5000);


  function secondsDifference(date1, date2) {
  // Перетворюємо вхідні значення на об'єкти Date, якщо це рядки
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Різниця в мілісекундах, потім переводимо в секунди
  const diffMs = Math.abs(d2 - d1);
  const diffSec = Math.floor(diffMs / 1000); // або / 1000 без округлення, якщо потрібні дробові секунди

  return diffSec;
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
