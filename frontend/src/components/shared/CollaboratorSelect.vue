<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCollaboratorStore } from '../../stores/collaboratorStore'

const collaboratorStore = useCollaboratorStore()

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const searchQuery = ref('')
const showAll = ref(false)

if (collaboratorStore.collaborators.length === 0) {
  collaboratorStore.fetchCollaborators()
}

const filteredCollaborators = computed(() => {
  return collaboratorStore.collaborators.filter((collaborator) =>
    collaborator.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const displayedCollaborator = computed(() => {
  return showAll.value ? filteredCollaborators.value : filteredCollaborators.value.slice(0, 6)
})

const hasMoreCollaborators = computed(() => {
  return filteredCollaborators.value.length > 6 && !showAll.value
})

function toggleCollaborator(id) {
  const newSelection = [...props.modelValue]
  const stringId = id.toString()
  const index = newSelection.findIndex((collabId) => collabId === stringId)

  if (index === -1) {
    newSelection.push(stringId)
  } else {
    newSelection.splice(index, 1)
  }

  emit('update:modelValue', newSelection)
}
</script>

<template>
  <div class="collaborator-select">
    <h3 class="text-lg font-medium mb-2">Select Collaborators</h3>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search collaborators..."
      class="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div v-if="collaboratorStore.isLoading" class="text-gray-500">Loading collaborators...</div>
    <div v-if="collaboratorStore.error" class="text-red-500 mb-3">
      {{ collaboratorStore.error }}
    </div>
    <div class="space-y-2 max-h-60 overflow-y-auto">
      <div
        v-for="collaborator in displayedCollaborator"
        :key="collaborator._id"
        class="flex items-center"
      >
        <input
          :id="`collaborator-${collaborator._id}`"
          type="checkbox"
          :checked="modelValue.some((id) => id.toString() === collaborator._id.toString())"
          @change="toggleCollaborator(collaborator._id)"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500"
        />
        <label :for="`collaborator-${collaborator._id}`" class="ml-2 text-sm text-gray-700">
          {{ collaborator.name }}
        </label>
      </div>
      <button
        v-if="hasMoreCollaborators || showAll"
        @click="showAll = !showAll"
        type="button"
        class="text-sm text-blue-600 hover:text-blue-800 mt-2 focus:outline-none"
      >
        {{ showAll ? 'Show less' : `Show all (${filteredCollaborators.length})` }}
      </button>
      <p
        v-if="!collaboratorStore.isLoading && filteredCollaborators.length === 0"
        class="text-sm text-gray-500 py-2"
      >
        No collaborators found
      </p>
    </div>
  </div>
</template>
