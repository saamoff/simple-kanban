<template>
  <section
    class="w-full h-full p-5 bg-gray-100 rounded-lg"
    :class="{
      'border-t-4 border-blue-500': type === 'todo',
      'border-t-4 border-yellow-500': type === 'inprogress',
      'border-t-4 border-green-500': type === 'finished',
    }"
    @dragover.prevent="$emit('dragover', $event)"
    @drop="$emit('drop', type)"
  >
    <header class="flex sm:flex-row items-center justify-between mb-4">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
        {{ columnTitle }}
      </h2>
      <button
        v-if="type === 'todo'"
        type="button"
        class="mt-2 sm:mt-0 cursor-pointer px-4 py-1 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        @click="isModalOpen = true"
      >
        + Add Task
      </button>
    </header>

    <div class="space-y-3" :class="{ 'min-h-[150px] sm:min-h-[200px]': !$slots.tasks }">
      <slot name="tasks"></slot>

      <p v-if="!$slots.tasks" class="text-sm text-center text-gray-500">No tasks in this column</p>
    </div>
    <NewTaskModal
      v-if="isModalOpen"
      @close="isModalOpen = false"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import NewTaskModal from './modals/NewTaskModal.vue'
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['todo', 'inprogress', 'finished'].includes(value),
  },
})

const isModalOpen = ref(false)

defineEmits(['dragover', 'drop', 'add-task'])

const columnTitles = {
  todo: 'Backlog',
  inprogress: 'In Progress',
  finished: 'Completed',
}

const columnTitle = computed(() => columnTitles[props.type] || '')
</script>
