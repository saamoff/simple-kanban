<template>
  <div class="flex gap-4 relative flex-col sm:flex-row">
    <TaskColumns
      v-for="type in columnTypes"
      :key="type"
      :type="type"
      @dragover.prevent="onDragOver"
      @drop="onDrop(type)"
    >
      <template #tasks>
        <TaskCard
          v-for="task in filteredTasksByType(type)"
          :key="task.id"
          :title="task.title"
          :description="task.description"
          :project="task.project"
          :collaborators="task.collaborators"
          :status="type"
          @dragstart="onDragStart(task)"
          @update:collaborators="updateCollaborators(task.id, $event)"
        />
      </template>
    </TaskColumns>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TaskColumns from './TaskColumns.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const columnTypes = ref(['todo', 'inprogress', 'finished'])
const draggedTask = ref(null)

const filteredTasksByType = (type) => {
  return props.tasks.filter((task) => task.status === type)
}

const updateCollaborators = (taskId, newCollaborators) => {
  const task = props.tasks.find((t) => t.id === taskId)
  if (task) {
    task.collaborators = newCollaborators
  }
}

const onDragStart = (task) => {
  draggedTask.value = task
}

const onDragOver = (event) => {
  event.preventDefault()
}

const onDrop = (newStatus) => {
  if (draggedTask.value) {
    const taskIndex = props.tasks.findIndex((t) => t.id === draggedTask.value.id)
    if (taskIndex !== -1) {
      props.tasks[taskIndex].status = newStatus
    }
    draggedTask.value = null
  }
}
</script>
