<script setup>
import { useProjectStore } from '../../stores/projectStore'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskColumns from './TaskColumns.vue'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const taskError = ref(null)

onMounted(async () => {
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()
})
</script>

<template>
  <div class="px-4">
    <div v-if="taskStore.isLoading" class="text-center py-8">
      <p>Loading Tasks...</p>
    </div>
    <div v-else-if="taskStore.error" class="text-red-500">
      {{ taskStore.error }}
    </div>

    <div v-else>
      <div class="bg-gray-100 rounded-lg mb-4">
        <div class="text-xl font-bold mb-2 text-gray-500 flex items-center justify-between p-4">
          <h3 class="text-lg font-semibold">All Tasks</h3>
        </div>

        <div class="p-4">
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
