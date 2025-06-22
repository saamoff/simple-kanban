<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTimeTrackerStore } from '../../stores/timeTrakcerStore'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { PlayIcon, StopIcon } from '@heroicons/vue/24/solid'
import AppButton from '../ui/AppButton.vue'

const props = defineProps({
  taskId: String,
})

const timeTrackerStore = useTimeTrackerStore()

onMounted(async () => {
  await timeTrackerStore.initTaskTracking(props.taskId)
  await timeTrackerStore.fetchSummary()
})

onUnmounted(() => {
  if (timeTrackerStore.timerInterval) {
    clearInterval(timeTrackerStore.timerInterval)
  }
})
</script>

<template>
  <div class="bg-gray-100 shadow-lg rounded-lg p-4">
    <div class="flex items-center gap-4 bg-white rounded-lg p-4 border border-blue-500">
      <div class="text-3xl font-bold">
        <span>{{ timeTrackerStore.getElapsedTime(taskId) }}</span>
      </div>
      <div v-if="timeTrackerStore.isTracking(taskId)" class="grow-1">
        <AppButton
          @click="timeTrackerStore.stopTracking(taskId)"
          :icon="StopIcon"
          btnClass="red-full"
          title="Stop Timer"
        />
      </div>
      <div v-else class="grow-1">
        <AppButton
          title="Start Timer"
          :icon="PlayIcon"
          @click="timeTrackerStore.startTracking(taskId)"
          :disabled="!taskId"
          btnClass="green-full"
        />
      </div>
    </div>
    <div class="mt-4">
      <h2 class="text-gray-500 font-bold text-xl">Time Statistics</h2>
      <div class="flex flex-col text-gray-500">
        <span class="flex items-center"
          ><ClockIcon class="w-4 h-4 mr-1" /><strong>Today:&nbsp;</strong>
          {{ timeTrackerStore.dailyTotal }}</span
        >
        <span class="flex items-center"
          ><ClockIcon class="w-4 h-4 mr-1" /><strong>This Month:&nbsp;</strong>
          {{ timeTrackerStore.monthlyTotal }}
        </span>
      </div>
    </div>
  </div>
</template>
