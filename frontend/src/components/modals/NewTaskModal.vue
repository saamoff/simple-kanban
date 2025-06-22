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
const isLoading = ref(false)

const showSuccess = () => {
  modalRef.value?.showToast('New Task Successfully created')
}

const showError = () => {
  modalRef.value?.showToast('Something went wrong!', 'error')
}

async function handleSubmit() {
  try {
    isLoading.value = true
    errorMsg.value = ''

    if (!formData.value.title) throw new Error('Task title is required')
    if (!formData.value.projectId) throw new Error('Please select a project')

    const response = await taskStore.createTask({
      title: formData.value.title,
      description: formData.value.description,
      project: formData.value.projectId,
    })

    const taskId = response?._id || response?.id || response?.data?._id
    if (taskId) {
      formData.value = { title: '', description: '', projectId: '' }
      showSuccess()
    } else {
      throw new Error(`Task creation failed. Response: ${JSON.stringify(response)}`)
    }
  } catch (err) {
    console.error('Task creation error:', err)
    errorMsg.value = err.response?.data?.message || err.message || 'Failed to create task'
    showError()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <ModalContainer
    ref="modalRef"
    title="New Task"
    description="Create a new task for your project. You can add collaborators later!"
    @close="$emit('close')"
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
        />
        <ProjectSelect v-model="formData.projectId" required />
        <div v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </div>
        <AppButton
          title="Create Task"
          btnClass="primary"
          type="submit"
          :disabled="isLoading"
          :isLoading="isLoading"
        />
      </form>
    </div>
  </ModalContainer>
</template>
