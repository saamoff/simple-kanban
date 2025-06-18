<script setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { useProjectStore } from '../../stores/projectStore'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskColumns from './TaskColumns.vue'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const expandedProject = ref(null)
const taskError = ref(null)

onMounted(async () => {
  await projectStore.fetchProjects()
})

const toggleProject = async (projectId) => {
  if (expandedProject.value === projectId) {
    expandedProject.value = null
  } else {
    expandedProject.value = projectId
    try {
      taskError.value = null
      await taskStore.fetchTasks(projectId)
    } catch {
      taskError.value = 'Failed to load tasks. Please try again.'
    }
  }
}
</script>

<template>
  <div class="px-4">
    <div v-if="projectStore.isLoading" class="text-center py-8">
      <p>Loading projects...</p>
    </div>
    <div v-else-if="projectStore.error" class="text-red-500">
      {{ projectStore.error }}
    </div>

    <div v-else>
      <div
        v-for="project in projectStore.projects"
        :key="project._id"
        class="bg-gray-100 rounded-lg mb-4"
      >
        <div
          class="text-xl font-bold mb-2 text-gray-500 cursor-pointer flex items-center justify-between p-4"
          @click="toggleProject(project._id)"
        >
          <h3 class="text-lg font-semibold">{{ project.name }}</h3>
          <span class="text-xl font-bold">
            <ChevronUpIcon v-if="expandedProject === project._id" class="h-6 w-6" />
            <ChevronDownIcon v-else class="h-6 w-6" />
          </span>
        </div>

        <div v-if="expandedProject === project._id" class="p-4">
          <div v-if="taskError" class="text-red-500">
            {{ taskError }}
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumns :type="'todo'" />
            <TaskColumns :type="'inprogress'" />
            <TaskColumns :type="'finished'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
