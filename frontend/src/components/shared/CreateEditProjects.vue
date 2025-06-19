<script setup>
import { ref } from 'vue'
import AppButton from '../ui/AppButton.vue'
import NewProjectModal from '../modals/NewProjectModal.vue'
import EditProjectsModal from '../modals/EditProjectsModal.vue'

const isNewProjectModalOpen = ref(false)
const isEditProjectModalOpen = ref(false)
</script>
<template>
  <div class="p-4 flex gap-2">
    <AppButton
      title="Create New Project"
      btnClass="primary"
      @click="isNewProjectModalOpen = true"
    />
    <AppButton title="Edit Projects" btnClass="secondary" @click="isEditProjectModalOpen = true" />
  </div>
  <NewProjectModal v-if="isNewProjectModalOpen" @close="isNewProjectModalOpen = false" />
  <EditProjectsModal v-if="isEditProjectModalOpen" @close="isEditProjectModalOpen = false" />
</template>
