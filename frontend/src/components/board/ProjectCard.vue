<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import { useTaskStore } from '../../stores/taskStore'
import { useCollaboratorStore } from '../../stores/collaboratorStore'
import { FunnelIcon } from '@heroicons/vue/24/solid'
import TaskColumns from './TaskColumns.vue'
import FiltersModal from '../modals/FiltersModal.vue'
import NewTaskModal from '../modals/NewTaskModal.vue'
import AppButton from '../ui/AppButton.vue'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const collaboratorStore = useCollaboratorStore()
const isFilterModalOpen = ref(false)
const isNewTaskModalOpen = ref(false)
const taskError = ref(null)

onMounted(async () => {
  await projectStore.fetchProjects()
  await taskStore.fetchTasks()
  await collaboratorStore.fetchCollaborators()
})

watch(
  () => taskStore.filters,
  (newFilters) => {
    console.log('Filters changed:', newFilters)
    console.log('Filtered tasks:', taskStore.filteredTasks)
  },
  { deep: true },
)

const refetchTasks = async () => {
  isNewTaskModalOpen.value = false
  await nextTick()
  await taskStore.fetchTasks()
}

const handleApplyFilters = (filters) => {
  taskStore.setFilters({
    project: filters.project,
    collaborator: filters.collaborator,
  })
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
          <div class="hidden items-center gap-4 cursor-default sm:flex">
            <div
              v-if="taskStore.filters.project || taskStore.filters.collaborator"
              class="flex gap-2 text-sm"
            >
              <span
                v-if="taskStore.filters.project"
                class="px-2 py-1 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-lg"
              >
                Project:
                {{ projectStore.getProjectById(taskStore.filters.project)?.name || 'Unknown' }}
              </span>
              <span
                v-if="taskStore.filters.collaborator"
                class="px-2 py-1 bg-white border border-green-600 text-green-600 rounded-lg shadow-lg"
              >
                Collaborator:
                {{
                  collaboratorStore.getCollaboratorById(taskStore.filters.collaborator)?.name ||
                  'Unknown'
                }}
              </span>
            </div>
          </div>
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
          <FiltersModal
            v-if="isFilterModalOpen"
            @close="isFilterModalOpen = false"
            @apply-filters="handleApplyFilters"
          />
          <NewTaskModal v-if="isNewTaskModalOpen" @close="isNewTaskModalOpen = false" />
        </div>
        <div class="flex items-center justify-center gap-4 cursor-default sm:hidden font-bold">
          <div
            v-if="taskStore.filters.project || taskStore.filters.collaborator"
            class="flex gap-2 text-sm"
          >
            <span
              v-if="taskStore.filters.project"
              class="px-2 py-1 bg-white border border-blue-500 text-blue-500 rounded-lg shadow-lg"
            >
              Project:
              {{ projectStore.getProjectById(taskStore.filters.project)?.name || 'Unknown' }}
            </span>
            <span
              v-if="taskStore.filters.collaborator"
              class="px-2 py-1 bg-white border border-green-600 text-green-600 rounded-lg shadow-lg"
            >
              Collaborator:
              {{
                collaboratorStore.getCollaboratorById(taskStore.filters.collaborator)?.name ||
                'Unknown'
              }}
            </span>
          </div>
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
