<script setup>
import { ref } from 'vue'
import { useProjectStore } from '../../stores/projectStore'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'
import ModalContainer from './ModalContainer.vue'

const projectStore = useProjectStore()
const modalRef = ref(null)

const formData = ref({
  name: '',
})

const errorMsg = ref('')

const showSuccess = () => {
  modalRef.value?.showToast('Created new Project')
}

const showError = () => {
  modalRef.value?.showToast('Something went wrong!', errorMsg)
}

async function handleSubmit() {
  try {
    if (!formData.value.name) {
      throw new Error('Project name is required')
    }
    const projectPayload = {
      name: formData.value.name,
    }
    await projectStore.createProject(projectPayload)
    formData.value = {
      name: '',
    }
    showSuccess()
  } catch (err) {
    showError()
    errorMsg.value = err.response?.data?.message || err.message || 'Failed to create project'
  }
}
</script>

<template>
  <ModalContainer
    ref="modalRef"
    title="New Project"
    description="Create a new Project for your tasks."
  >
    <div class="space-y-4">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <AppInput
          label="Project Name"
          inputType="input"
          placeHolder="Insert Project Name"
          required
          v-model="formData.name"
        />
        <div v-if="errorMsg" class="text-red-500 text-sm">
          {{ errorMsg }}
        </div>
        <AppButton title="Create Project" btnClass="primary" type="submit" />
      </form>
    </div>
  </ModalContainer>
</template>
