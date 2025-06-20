<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import AppDialog from '../ui/AppDialog.vue'
import ModalContainer from './ModalContainer.vue'
import AppButton from '../ui/AppButton.vue'
import AppInput from '../ui/AppInput.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'
import CollaboratorSelect from '../shared/CollaboratorSelect.vue'

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

watch(isEditMode, (newVal) => {
  if (newVal) {
    const currentTask = taskStore.tasks.find((t) => t._id === props.id)
    formData.value = {
      title: props.title,
      description: props.description,
      collaborators: currentTask?.collaborators?.map((c) => c._id) || [],
    }
  }
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

function handleCollaboratorUpdate(newCollaborators) {
  formData.value.collaborators = newCollaborators.map((id) => id.toString())
}

async function handleSubmit() {
  try {
    const taskPayload = {
      title: formData.value.title,
      description: formData.value.description,
      project: formData.value.projectId,
    }
    await taskStore.updateTask(props.id, taskPayload)

    if (formData.value.collaborators.length > 0) {
      await taskStore.addCollaborator(props.id, formData.value.collaborators)
    }

    clearFields()
    showSuccess()
    emit('saveChanges')
  } catch (err) {
    showError()
    console.error('Task update failed:', err)
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
    :title="isEditMode ? 'Editing Task' : title"
    :description="isEditMode ? '' : description"
  >
    <div v-if="isEditMode">
      <AppInput
        label="Task Title"
        inputType="input"
        placeHolder="Insert New Task Title"
        class="mb-4"
        required
        v-model="formData.title"
      />
      <AppInput
        label="Task Description"
        inputType="textarea"
        placeHolder="Insert New Task Description"
        class="mb-4"
        required
        v-model="formData.description"
      />
      <ProjectSelect v-model="formData.projectId" />
      <CollaboratorSelect
        v-model="formData.collaborators"
        @update:modelValue="handleCollaboratorUpdate"
      />
      <div class="w-full flex gap-2 mt-4">
        <AppButton
          v-if="isEditMode"
          title="Cancel Changes"
          btnClass="secondary"
          @click="clearFields"
        />
        <AppButton
          v-if="isEditMode"
          title="Save Changes"
          btnClass="primary"
          @click="handleSubmit"
        />
      </div>
    </div>
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
