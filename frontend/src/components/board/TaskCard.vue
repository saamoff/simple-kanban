<script setup>
import { ref, computed, onMounted } from 'vue'
import { UserGroupIcon, ClockIcon } from '@heroicons/vue/24/outline'
import TaskInfoModal from '../modals/TaskInfoModal.vue'
import { useCollaboratorStore } from '../../stores/collaboratorStore'

const collaboratorStore = useCollaboratorStore()
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
  timeSpent: {
    type: String,
    default: '0h 0m',
  },
  status: {
    type: String,
    required: true,
  },
})

// Fetch collaborators when component mounts
onMounted(async () => {
  if (collaboratorStore.collaborators.length === 0) {
    await collaboratorStore.fetchCollaborators()
  }
})

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

const showTooltip = ref(false)
const isModalOpen = ref(false)
</script>

<template>
  <div draggable="true">
    <button
      type="button"
      class="w-full p-4 mb-5 text-left transition-colors duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm hover:bg-gray-100"
      @click="isModalOpen = true"
    >
      <div class="flex items-center justify-between sm:flex-row">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h2>
        <span
          class="px-2 py-1 text-sm font-bold text-blue-500 border border-blue-500 rounded-lg hidden sm:block"
        >
          {{ project }}
        </span>
      </div>

      <p class="mt-1 text-sm text-gray-400 hidden sm:block">
        {{ description }}
      </p>

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

        <span class="inline-flex items-center text-xs text-gray-500">
          <ClockIcon class="w-4 h-4 mr-1" />
          <span class="hidden sm:block">Time Spent:&nbsp;</span>{{ timeSpent }}
        </span>
      </div>
    </button>

    <TaskInfoModal
      v-if="isModalOpen"
      :id="id"
      :title="title"
      :description="description"
      :collaborators="collaboratorNames"
      :time-spent="timeSpent"
      :status="status"
      @close="isModalOpen = false"
    />
  </div>
</template>
