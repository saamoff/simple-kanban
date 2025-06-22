<template>
  <div class="p-5 max-w-7xl m-auto">
    <h2 class="text-2xl font-bold mb-5">Time Tracking Statistics</h2>
    <div class="flex gap-5 mb-7.5">
      <div class="flex-1 bg-white rounded-lg p-5 shadow-md text-center">
        <h3 class="text-lg font-medium mb-2">Today</h3>
        <p class="text-2xl font-bold">{{ timeTrackerStore.dailyTotal || '00:00' }}</p>
      </div>
      <div class="flex-1 bg-white rounded-lg p-5 shadow-md text-center">
        <h3 class="text-lg font-medium mb-2">This Month</h3>
        <p class="text-2xl font-bold">{{ timeTrackerStore.monthlyTotal || '00:00' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTimeTrackerStore } from '../stores/timeTrackerStore'

const timeTrackerStore = useTimeTrackerStore()
const timeRange = ref('7')

const updateChart = async () => {
  try {
    await timeTrackerStore.fetchDailyStats(parseInt(timeRange.value))
  } catch (error) {
    console.error('Failed to load chart data:', error)
  }
}

onMounted(async () => {
  try {
    await timeTrackerStore.fetchSummary()
    await updateChart()
  } catch (error) {
    console.error('Initialization error:', error)
  }
})
</script>
