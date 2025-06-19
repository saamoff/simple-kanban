<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import { useProjectStore } from '../../stores/projectStore'

const projectStore = useProjectStore()

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
const searchQuery = ref('')
const showAll = ref(false)

if (projectStore.projects.length === 0) {
  projectStore.fetchProjects()
}

const filteredProjects = computed(() => {
  const projects = toRaw(projectStore.projects) || []
  return projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const displayedProjects = computed(() => {
  const projects = filteredProjects.value || []
  return showAll.value ? projects : projects.slice(0, 6)
})

const hasMoreProjects = computed(() => {
  return filteredProjects.value.length > 6 && !showAll.value
})

function selectProject(projectId) {
  emit('update:modelValue', String(projectId))
}
</script>

<template>
  <div class="project-select">
    <h3 class="text-lg font-medium mb-2">Select Project</h3>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search projects..."
      class="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div v-if="projectStore.isLoading" class="text-gray-500">Loading projects...</div>
    <div v-if="projectStore.error" class="text-red-500 mb-3">
      {{ projectStore.error }}
    </div>
    <div class="space-y-2 max-h-60 overflow-y-auto">
      <div v-for="project in displayedProjects" :key="project._id" class="flex items-center">
        <input
          :id="`project-${project._id}`"
          type="radio"
          :checked="modelValue === String(project._id)"
          @change="selectProject(project._id)"
          :value="String(project._id)"
          name="project-selection"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <label :for="`project-${project._id}`" class="ml-2 text-sm text-gray-700">
          {{ project.name }}
        </label>
      </div>
      <button
        v-if="hasMoreProjects || showAll"
        @click="showAll = !showAll"
        type="button"
        class="text-sm text-blue-600 hover:text-blue-800 mt-2 focus:outline-none"
      >
        {{ showAll ? 'Show less' : `Show all (${filteredProjects.length})` }}
      </button>
      <p
        v-if="!projectStore.isLoading && filteredProjects.length === 0"
        class="text-sm text-gray-500 py-2"
      >
        No projects found
      </p>
    </div>
  </div>
</template>

<style scoped>
.project-select {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
}

.project-select h3 {
  color: #1f2937;
}

.project-select input[type='text'] {
  font-size: 0.875rem;
}

.project-select input[type='radio'] {
  border-color: #d1d5db;
  border-radius: 50%;
}
</style>
