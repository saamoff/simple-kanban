<template>
  <ModalContainer
    title="New Task"
    description="Create a new task for your project"
  >
    <div class="space-y-4">
      <form class="space-y-4">
        <div>
          <label for="task-title" class="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            id="task-title"
            type="text"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label for="task-description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="task-description"
            rows="3"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="Enter task description"
          ></textarea>
        </div>
        <div>
          <label for="task-project" class="block text-sm font-medium text-gray-700">Project</label>
          <select
            id="task-project"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          >
            <option value="">Select a project</option>
            <!-- Add project options here -->
          </select>
        </div>
        <div>
          <label for="task-collaborators" class="block text-sm font-medium text-gray-700">Collaborators</label>
          <select
            id="task-collaborators"
            multiple
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <!-- Add collaborator options here -->
          </select>
        </div>
      </form>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Task
      </button>
    </div>
  </ModalContainer>
</template>

<script>
import ModalContainer from './ModalContainer.vue'
export default {
  components: {
    ModalContainer,
  },
}
</script>

<style>

</style>