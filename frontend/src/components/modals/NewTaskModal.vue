<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'
import ModalContainer from './ModalContainer.vue'

const taskStore = useTaskStore()

const formData = ref({
  title: '',
  description: '',
  projectId: '',
})

const errorMsg = ref('')
const modalRef = ref(null)

const showSuccess = () => {
  modalRef.value?.showToast('New Task Successfully created')
}

const showError = () => {
  modalRef.value?.showToast('Something went wrong!', 'error')
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
    }

    const response = await taskStore.createTask(taskPayload)

    if (response && response._id) {
      formData.value = {
        title: '',
        description: '',
        projectId: '',
      }
      showSuccess()
    } else {
      throw new Error('Task creation failed')
    }
  } catch (err) {
    console.error('Task creation error:', err)
    showError()
    errorMsg.value = err.response?.data?.message || err.message || 'Failed to create task'
  }
}
</script>

<template>
  <ModalContainer
    ref="modalRef"
    title="New Task"
    description="Create a new task for your project. You can add collaborators later!"
  >
    <div class="space-y-4">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput
          label="Task Title"
          inputType="input"
          placeHolder="Insert Task Title"
          required
          v-model="formData.title"
        />
        <AppInput
          label="Task Description"
          inputType="textarea"
          placeHolder="Insert Task Description"
          rows="3"
          v-model="formData.description"
          required
        />
        <ProjectSelect v-model="formData.projectId" />
        <div v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </div>
        <AppButton title="Create Task" btnClass="primary" type="submit" />
      </form>
    </div>
  </ModalContainer>
</template>
