<script setup>
import { useProjectStore } from '../../stores/projectStore'
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { FunnelIcon } from '@heroicons/vue/24/solid'
import TaskColumns from './TaskColumns.vue'
import FiltersModal from '../modals/FiltersModal.vue'
import NewTaskModal from '../modals/NewTaskModal.vue'
import AppButton from '../ui/AppButton.vue'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const taskError = ref(null)
const isFilterModalOpen = ref(false)
const isNewTaskModalOpen = ref(false)

onMounted(async () => {
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()
})

const refetchTasks = () => {
  taskStore.fetchTasks()
}
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
      <div class="mb-4">
        <div class="text-xl font-bold mb-2 text-gray-500 flex items-center justify-between p-4">
          <h3 class="text-lg font-semibold">All Tasks</h3>
          <div class="flex gap-2">
            <span class="w-30 h-11">
              <AppButton title="+ Add Task" btnClass="primary" @click="isNewTaskModalOpen = true" />
            </span>
            <span class="w-25">
              <AppButton
                title="Filters"
                btnClass="primary"
                :icon="FunnelIcon"
                @click="isFilterModalOpen = true"
              />
            </span>
          </div>
          <FiltersModal v-if="isFilterModalOpen" @close="isFilterModalOpen = false" />
          <NewTaskModal v-if="isNewTaskModalOpen" @close="isNewTaskModalOpen = false" />
        </div>
        <div class="p-4">
          <div v-if="taskError" class="text-red-500">
            {{ taskError }}
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumns :type="'todo'" @task-dropped="refetchTasks" />
            <TaskColumns :type="'inprogress'" @task-dropped="refetchTasks" />
            <TaskColumns :type="'finished'" @task-dropped="refetchTasks" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
