<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const props = defineProps({
  title: String,
  data: {
    type: Array,
    required: true,
    // кожен елемент: { value, timestamp }
  }
});

const chartCanvas = ref(null);
let chart = null;

function createChart() {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: props.title,
        data: props.data.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          labels: props.data.map(d => new Date(d.timestamp).toLocaleString()),
          title: { display: true, text: 'Час' }
        },
        y: {
          title: { display: true, text: 'Значення' }
        }
      }
    }
  });
}

onMounted(() => {
  if (props.data.length) createChart();
});

watch(() => props.data, () => {
  if (props.data.length) createChart();
}, { deep: true });
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>