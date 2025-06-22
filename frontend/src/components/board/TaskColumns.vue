<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { useProjectStore } from '../../stores/projectStore'
import TaskCard from './TaskCard.vue'

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const refetchTasks = () => {
  taskStore.fetchTasks()
}

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['todo', 'inprogress', 'finished'].includes(value),
  },
})

const tasksByStatus = computed(() => {
  return taskStore.filteredTasks
    .filter((task) => task.status === props.type)
    .map((task) => {
      const project = projectStore.projects.find((p) => p._id === task.project)
      return {
        ...task,
        projectName: project ? project.name : 'Unknown Project',
      }
    })
})

const columnTitles = {
  todo: 'Backlog',
  inprogress: 'In Progress',
  finished: 'Completed',
}

const columnTitle = computed(() => columnTitles[props.type] || '')

const emit = defineEmits(['task-dropped'])

const handleDragOver = (e) => {
  e.preventDefault()
  e.currentTarget.classList.add('drag-over')
}

const handleDragLeave = (e) => {
  e.preventDefault()
  e.currentTarget.classList.remove('drag-over')
}

const handleDrop = async (e) => {
  e.preventDefault()
  e.currentTarget.classList.remove('drag-over')

  const taskId =
    e.dataTransfer?.getData('taskId') ||
    (e.dataTransfer?.getData && e.dataTransfer.getData()) ||
    e.target.closest('.draggable-task')?.dataset.taskId

  if (taskId) {
    try {
      await taskStore.updateTaskStatus(taskId, props.type)
      emit('task-dropped')
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }
}
</script>

<template>
  <section
    class="w-full h-full p-5 bg-white rounded-lg shadow-md flex flex-col dropzone"
    :class="{
      'border-t-4 border-blue-500': type === 'todo',
      'border-t-4 border-yellow-500': type === 'inprogress',
      'border-t-4 border-green-500': type === 'finished',
    }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <header class="flex sm:flex-row items-center justify-between mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        {{ columnTitle }}
      </h2>
    </header>

    <div
      v-if="tasksByStatus.length > 0"
      class="space-y-3 overflow-y-auto flex-1"
      style="max-height: calc(80vh - 200px); min-height: 100px"
    >
      <TaskCard
        v-for="task in tasksByStatus"
        :key="task._id"
        :id="task._id"
        :title="task.title"
        :description="task.description"
        :collaborators="task.collaborators"
        :status="task.status"
        :project="task.projectName"
        @removeTask="refetchTasks"
      />
    </div>
    <p v-else class="text-sm text-center text-gray-500 flex-1 flex items-center justify-center">
      No tasks in this column
    </p>
  </section>
</template>
