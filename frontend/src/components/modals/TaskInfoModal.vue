<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import AppDialog from '../ui/AppDialog.vue'
import ModalContainer from './ModalContainer.vue'
import AppButton from '../ui/AppButton.vue'
import AppInput from '../ui/AppInput.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'

const taskStore = useTaskStore()
const isEditMode = ref(false)
const isDialogOpen = ref(false)
const modalRef = ref(null)

const formData = ref({
  title: '',
  description: '',
  projectId: '',
  collaborators: [],
})

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
  },
})

const emit = defineEmits(['saveChanges', 'removeTask'])

const showSuccess = () => {
  modalRef.value?.showToast('New Task Successfully created')
}

const showError = () => {
  modalRef.value?.showToast('Something went wrong!', 'error')
}

const clearFields = () => {
  formData.value = {
    title: '',
    description: '',
    projectId: '',
    collaborators: [],
  }
  isEditMode.value = false
}

async function handleSubmit() {
  try {
    if (!formData.value.title) {
      throw new Error('Task title is required')
    }

    if (!formData.value.projectId) {
      throw new Error('Please select a project')
    }

    const taskPayload = {
      title: formData.value.title,
      description: formData.value.description,
      project: formData.value.projectId,
      collaboratorIds: formData.value.collaborators,
    }

    await taskStore.updateTask(props.id, taskPayload)

    formData.value = {
      title: '',
      description: '',
      projectId: '',
      collaborators: [],
    }
    showSuccess()
    isEditMode.value = false
  } catch (err) {
    showError()
    return err.response?.data?.message || err.message || 'Failed to create task'
  }
}

async function confirmRemoveTask() {
  try {
    await taskStore.deleteTask(props.id)
    emit('removeProject')
  } catch (error) {
    console.error('Failed to remove task:', error)
  }
  isDialogOpen.value = false
}

function removeTask() {
  isDialogOpen.value = true
}
</script>
<template>
  <ModalContainer
    ref="modalRef"
    :title="isEditMode ? '' : title"
    :description="isEditMode ? '' : description"
  >
    <form v-if="isEditMode" @submit.prevent="handleSubmit">
      <AppInput
        label="Task Title"
        inputType="input"
        placeHolder="Insert New Task Title"
        required
        v-model="formData.title"
      />
      <AppInput
        label="Task Description"
        inputType="textarea"
        placeHolder="Insert New Task Description"
        required
        v-model="formData.description"
      />
      <ProjectSelect v-model="formData.projectId" />
      <div class="w-full flex gap-2">
        <AppButton
          v-if="isEditMode"
          title="Cancel Changes"
          btnClass="secondary"
          @click="clearFields"
        />
        <AppButton v-if="isEditMode" title="Save Changes" btnClass="primary" type="submit" />
      </div>
    </form>
    <div class="w-full flex gap-2">
      <AppButton
        v-if="!isEditMode"
        title="Edit Task"
        btnClass="primary"
        @click="isEditMode = true"
      />
      <AppButton v-if="!isEditMode" title="Remove Task" btnClass="tertiary" @click="removeTask" />
    </div>
    <AppDialog
      v-if="isDialogOpen"
      title="Delete Task"
      description="Are you sure you want to delete this task? This action cannot be undone."
      btnText="Delete"
      btnSubText="Cancel"
      :multipleBtn="true"
      @confirm="confirmRemoveTask"
      @cancel="isDialogOpen = false"
    />
  </ModalContainer>
</template>
