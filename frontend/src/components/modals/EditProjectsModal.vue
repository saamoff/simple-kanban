<script setup>
import { ref } from 'vue'
import AppInput from '../ui/AppInput.vue'
import AppDialog from '../ui/AppDialog.vue'
import AppButton from '../ui/AppButton.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'
import ModalContainer from './ModalContainer.vue'
import { useProjectStore } from '../../stores/projectStore'
import { useTaskStore } from '../../stores/taskStore'

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const isEditMode = ref(false)
const isDialogOpen = ref(false)
const modalRef = ref(null)

const formData = ref({
  title: '',
  projectId: '',
})

const emit = defineEmits(['saveChanges', 'removeProject'])

const showSuccess = () => {
  modalRef.value?.showToast('Operation completed successfully!')
}

const showError = () => {
  modalRef.value?.showToast('Something went wrong!', 'error')
}

async function saveChanges() {
  try {
    await projectStore.updateProject(formData.value.projectId, { name: formData.value.title })
    await projectStore.fetchProjects()
    showSuccess()
    isEditMode.value = false
    emit('saveChanges')
  } catch (error) {
    console.error(error)
    showError()
  }
}

async function confirmRemoveProject() {
  try {
    await projectStore.deleteProject(formData.value.projectId)
    await taskStore.fetchTasks()
    showSuccess()
    emit('removeProject')
  } catch (error) {
    console.error(error)
    showError()
  }
  isDialogOpen.value = false
}

function removeProject() {
  isDialogOpen.value = true
}
</script>

<template>
  <ModalContainer ref="modalRef" title="Edit Projects" description="Edit existing Projects">
    <ProjectSelect v-model="formData.projectId" />
    <div v-if="isEditMode">
      <AppInput
        label="Project Title"
        inputType="input"
        placeHolder="Insert New Project Title"
        required
        v-model="formData.title"
      />
    </div>
    <div class="w-full flex gap-2 mt-4">
      <AppButton
        v-if="!isEditMode"
        title="Edit Project"
        btnClass="primary"
        :disabled="!formData.projectId"
        @click="isEditMode = true"
      />
      <AppButton
        v-if="!isEditMode"
        title="Remove Project"
        btnClass="tertiary"
        :disabled="!formData.projectId"
        @click="removeProject"
      />
      <AppButton
        v-if="isEditMode"
        title="Save Changes"
        btnClass="primary"
        :disabled="!formData.projectId"
        @click="saveChanges"
      />
      <AppButton
        v-if="isEditMode"
        title="Cancel Changes"
        btnClass="secondary"
        :disabled="!formData.projectId"
        @click="isEditMode = false"
      />
    </div>
    <AppDialog
      v-if="isDialogOpen"
      title="Delete Project"
      description="Are you sure you want to delete this project and all tasks associated with it? This action cannot be undone."
      btnText="Delete"
      btnSubText="Cancel"
      :multipleBtn="true"
      @confirm="confirmRemoveProject"
      @cancel="isDialogOpen = false"
    />
  </ModalContainer>
</template>
