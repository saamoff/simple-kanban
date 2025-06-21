<script setup>
import { ref } from 'vue'
import { useCollaboratorStore } from '../../stores/collaboratorStore'
import AppButton from '../ui/AppButton.vue'
import ModalContainer from './ModalContainer.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'

const collaboratorStore = useCollaboratorStore()

const emit = defineEmits(['close', 'apply-filters'])

const selectedProject = ref('')
const selectedCollaborator = ref('')

const applyFilters = () => {
  emit('apply-filters', {
    project: selectedProject.value,
    collaborator: selectedCollaborator.value,
  })
  emit('close')
}

const resetFilters = () => {
  selectedProject.value = ''
  selectedCollaborator.value = ''
  emit('apply-filters', {
    project: '',
    collaborator: '',
  })
  emit('close')
}
</script>

<template>
  <ModalContainer
    title="Filters"
    description="Filter existing Tasks by Project or Collaborator"
    @close="$emit('close')"
  >
    <div>
      <div class="w-full">
        <div class="mb-4">
          <ProjectSelect v-model="selectedProject" />
        </div>
        <div class="mb-4">
          <label for="collaborator-filter" class="block text-sm font-medium text-gray-700 mb-1"
            >Collaborator</label
          >
          <select
            id="collaborator-filter"
            v-model="selectedCollaborator"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            <option value="">All Collaborators</option>
            <option
              v-for="collaborator in collaboratorStore.collaborators"
              :key="collaborator._id"
              :value="collaborator._id"
            >
              {{ collaborator.name }}
            </option>
          </select>
        </div>
        <div class="flex-col-reverse flex sm:gap-2 sm:flex-row-reverse">
          <AppButton btnClass="primary" title="Apply Filters" @click="applyFilters" />
          <AppButton btnClass="secondary" title="Reset Filters" @click="resetFilters" />
        </div>
      </div>
    </div>
  </ModalContainer>
</template>
