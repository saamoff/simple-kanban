<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { UserGroupIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { useCollaboratorStore } from '../../stores/collaboratorStore'
import { useTimeTrackerStore } from '../../stores/timeTrackerStore'
import TaskInfoModal from '../modals/TaskInfoModal.vue'

const collaboratorStore = useCollaboratorStore()
const timeTrackerStore = useTimeTrackerStore()

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  collaborators: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    required: true,
  },
})

const showTooltip = ref(false)
const isModalOpen = ref(false)
const totalTimeSpent = ref('0h 0m')
const isTracking = ref(false)

let updateInterval = null

onMounted(async () => {
  if (collaboratorStore.collaborators.length === 0) {
    await collaboratorStore.fetchCollaborators()
  }

  await fetchTimeSpent()
  checkActiveTimer()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

const checkActiveTimer = () => {
  isTracking.value = timeTrackerStore.isTracking(props.id)

  if (isTracking.value) {
    startUpdatingTime()
  }
}

const startUpdatingTime = () => {
  updateInterval = setInterval(async () => {
    await fetchTimeSpent()
  }, 1000)
}

const fetchTimeSpent = async () => {
  try {
    const response = await timeTrackerStore.getTimeTrackers(props.id)
    const trackers = response.data

    let totalMs = trackers.reduce((total, tracker) => {
      if (tracker.endDate) {
        return total + (new Date(tracker.endDate) - new Date(tracker.startDate))
      }
      return total
    }, 0)

    if (timeTrackerStore.isTracking(props.id)) {
      const activeTracking = timeTrackerStore.activeTrackings[props.id]
      if (activeTracking) {
        totalMs += Date.now() - new Date(activeTracking.startDate).getTime()
      }
    }

    totalTimeSpent.value = formatTime(totalMs)
  } catch (error) {
    console.error('Error fetching time spent:', error)
    totalTimeSpent.value = '0h 0m'
  }
}

watch(
  () => timeTrackerStore.activeTrackings,
  (newVal) => {
    const isNowTracking = !!newVal[props.id]
    if (isNowTracking && !isTracking.value) {
      isTracking.value = true
      startUpdatingTime()
    } else if (!isNowTracking && isTracking.value) {
      isTracking.value = false
      if (updateInterval) {
        clearInterval(updateInterval)
        updateInterval = null
      }
      fetchTimeSpent()
    }
  },
  { deep: true },
)

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const collaboratorNames = computed(() => {
  if (!props.collaborators || !props.collaborators.length) return []

  return props.collaborators
    .map((collaborator) => {
      const id = collaborator._id || collaborator
      const found = collaboratorStore.collaborators.find((c) => c._id === id)
      return found ? found.name : 'Unknown'
    })
    .filter((name) => name !== 'Unknown')
})

const emit = defineEmits(['dragstart', 'dragend'])

const handleDragStart = (e) => {
  e.dataTransfer.setData('taskId', props.id)
  emit('dragstart', props.id)
}

const handleDragEnd = () => {
  emit('dragend')
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    class="draggable-task"
    :data-task-id="id"
  >
    <div
      class="w-full p-4 mb-5 text-left transition-colors duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm hover:bg-gray-100"
      @click="isModalOpen = true"
    >
      <div class="flex items-center sm:flex-row">
        <h2 class="text-lg font-semibold text-gray-900 truncate">
          {{ title }}
        </h2>
      </div>

      <span class="mt-2 flex justify-between text-sm text-blue-500 whitespace-nowrap">
        <p class="text-sm text-gray-500 truncate pr-4 hidden sm:block">
          {{ description }}
        </p>
        <p class="px-2 py-1 border border-blue-500 rounded-lg font-bold">
          {{ project }}
        </p>
      </span>

      <div class="flex items-center justify-between mt-2">
        <div class="relative">
          <span
            class="inline-flex items-center text-xs text-blue-500 cursor-pointer hover:underline"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
          >
            <UserGroupIcon class="w-4 h-4 mr-1" />
            {{ collaboratorNames.length }}
            <span class="hidden sm:block">&nbsp;Collaborators</span>
          </span>

          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="showTooltip && collaboratorNames.length > 0"
              class="absolute left-0 z-10 p-2 mt-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg w-max"
            >
              <ul>
                <li v-for="(name, index) in collaboratorNames" :key="index" class="py-1">
                  {{ name }}
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <span
          class="inline-flex items-center text-xs text-gray-500"
          :class="isTracking ? 'text-green-500 font-semibold' : ''"
        >
          <ClockIcon class="w-4 h-4 mr-1" />
          <span class="hidden sm:block">Time Spent:&nbsp;</span>{{ totalTimeSpent }}
        </span>
      </div>
    </div>

    <TaskInfoModal
      v-if="isModalOpen"
      :id="id"
      :title="title"
      :description="description"
      :collaborators="collaboratorNames"
      :time-spent="totalTimeSpent"
      :status="status"
      @close="isModalOpen = false"
    />
  </div>
</template>

<style scoped>
.draggable-task {
  cursor: grab;
  touch-action: none;
  transition: all 0.2s ease;
}
.draggable-task:active {
  cursor: grabbing;
}
</style>
