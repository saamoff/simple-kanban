<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { useProjectStore } from '../../stores/projectStore'
import NewTaskModal from '../modals/NewTaskModal.vue'
import TaskCard from './TaskCard.vue'
import AppButton from '../ui/AppButton.vue'

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const isModalOpen = ref(false)

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['todo', 'inprogress', 'finished'].includes(value),
  },
})

const tasksByStatus = (status) => {
  return taskStore.tasks
    .filter((task) => task.status === status)
    .map((task) => {
      const project = projectStore.projects.find((p) => p._id === task.project)
      return {
        ...task,
        projectName: project ? project.name : 'Unknown Project',
      }
    })
}

const columnTitles = {
  todo: 'Backlog',
  inprogress: 'In Progress',
  finished: 'Completed',
}

const columnTitle = computed(() => columnTitles[props.type] || '')
</script>
<template>
  <section
    class="w-full h-full p-5 bg-white rounded-lg shadow-md"
    :class="{
      'border-t-4 border-blue-500': type === 'todo',
      'border-t-4 border-yellow-500': type === 'inprogress',
      'border-t-4 border-green-500': type === 'finished',
    }"
  >
    <header class="flex sm:flex-row items-center justify-between mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        {{ columnTitle }}
      </h2>
      <span v-if="type === 'todo'">
        <AppButton title="+ Add Task" btnClass="primary" @click="isModalOpen = true" />
      </span>
    </header>

    <div v-if="tasksByStatus(type).length > 0" class="space-y-3">
      <TaskCard
        v-for="task in tasksByStatus(type)"
        :key="task.id"
        :title="task.title"
        :description="task.description"
        :status="task.status"
        :project="task.projectName"
      />
    </div>
    <p v-else class="text-sm text-center text-gray-500">No tasks in this column</p>

    <NewTaskModal v-if="isModalOpen" @close="isModalOpen = false" />
  </section>
</template>
