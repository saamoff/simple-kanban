<template>
  <div draggable="true" @dragstart="onDragStart">
    <button
      type="button"
      class="w-full p-4 mb-5 text-left transition-colors duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm hover:bg-gray-100"
      @click="isModalOpen = true"
    >
      <div class="flex items-center justify-between sm:flex-row">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h2>

        <span class="px-2 py-1 text-sm font-bold text-blue-500 border border-blue-500 rounded-lg">
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
            {{ collaborators.length }}
            <span class="hidden sm:block">
              &nbsp;Collaborators
            </span>
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
              v-if="showTooltip && collaborators.length > 0"
              class="absolute left-0 z-10 p-2 mt-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg w-max"
            >
              <ul>
                <li v-for="collaborator in collaborators" :key="collaborator" class="py-1">
                  {{ collaborator }}
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
      :title="title"
      :project="project"
      :description="description"
      :collaborators="collaborators"
      :time-spent="timeSpent"
      :status="status"
      @close="isModalOpen = false"
      @addCollaborator="addCollaborator"
      @removeCollaborator="removeCollaborator"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserGroupIcon, ClockIcon } from '@heroicons/vue/24/outline'
import TaskInfoModal from './modals/TaskInfoModal.vue'

const props = defineProps({
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

const emit = defineEmits(['update:collaborators', 'dragstart'])

const onDragStart = () => {
  emit('dragstart', props.task)
}

const showTooltip = ref(false)
const isModalOpen = ref(false)

const addCollaborator = (collaborator) => {
  const updated = [...props.collaborators, collaborator]
  emit('update:collaborators', updated)
}

const removeCollaborator = (collaborator) => {
  const updated = props.collaborators.filter((c) => c !== collaborator)
  emit('update:collaborators', updated)
}
</script>