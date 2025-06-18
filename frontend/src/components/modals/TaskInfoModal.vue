<script setup>
import { ref } from 'vue'
import ModalContainer from './ModalContainer.vue'
import AppButton from '../ui/AppButton.vue'
import api from "@/services/api.js"

const isEditMode = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  }
})

const emit = defineEmits(['saveChanges', 'removeTask'])

const saveChanges = async () => {
  try {
    await api.tasks.updateTask(props.id)
    emit('saveChanges')
  } catch (error) {
    console.error("Failed to save changes:", error)
  }
}

const removeTask = async () => {
  try {
    await api.tasks.deleteTask(props.id)
    emit('removeTask')
  } catch (error) {
    console.error("Failed to remove task:", error)
  }
}
</script>
<template>
  <ModalContainer
    :title="title"
    :description="description"
  >
    <div>
      <AddCollaborator
        :collaborators="collaborators"
        @addCollaborator="addCollaboratorEmit"
        @removeCollaborator="removeCollaboratorEmit"
      />
      <TimeRegister />
    </div>
    <div class="w-full flex gap-2">
      <AppButton
        v-if="!isEditMode"
        title="Edit Task"
        btnClass="primary"
        @click="isEditMode = true"
      />
      <AppButton
        v-if="!isEditMode"
        title="Remove Task"
        btnClass="tertiary"
        @click="removeTask"
      />
      <AppButton
        v-if="isEditMode"
        title="Save Changes"
        btnClass="primary"
        @click="saveChanges"
      />
      <AppButton
        v-if="isEditMode"
        title="Cancel Changes"
        btnClass="secondary"
        @click="isEditMode = false"
      />
    </div>
  </ModalContainer>
</template>
