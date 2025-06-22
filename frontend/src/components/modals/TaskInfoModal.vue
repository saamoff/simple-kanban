<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { PencilSquareIcon, TrashIcon, BookmarkIcon, UserIcon } from '@heroicons/vue/24/solid'
import { ArchiveBoxXMarkIcon } from '@heroicons/vue/24/outline'
import AppDialog from '../ui/AppDialog.vue'
import AppButton from '../ui/AppButton.vue'
import AppInput from '../ui/AppInput.vue'
import ModalContainer from './ModalContainer.vue'
import ProjectSelect from '../shared/ProjectSelect.vue'
import CollaboratorSelect from '../shared/CollaboratorSelect.vue'
import TimeTracker from '../shared/TimeTracker.vue'

const taskStore = useTaskStore()
const isEditMode = ref(false)
const isDialogOpen = ref(false)
const isLoading = ref(false)
const modalRef = ref(null)
const initialFormData = ref(null)
const isMobile = ref(window.innerWidth < 768)

const statusOptions = [
  { text: 'Backlog', value: 'todo' },
  { text: 'In Progress', value: 'inprogress' },
  { text: 'Completed', value: 'finished' },
]

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
  collaborators: {
    type: [String, Number],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  id: {
    type: [String, Number],
    required: true,
  },
})

const hasChanges = computed(() => {
  if (!initialFormData.value) return false

  return (
    formData.value.title !== initialFormData.value.title ||
    formData.value.description !== initialFormData.value.description ||
    formData.value.projectId !== initialFormData.value.projectId ||
    JSON.stringify(formData.value.collaborators) !==
      JSON.stringify(initialFormData.value.collaborators)
  )
})

watch(isEditMode, (newVal) => {
  if (newVal) {
    const currentTask = taskStore.tasks.find((t) => t._id === props.id)
    formData.value = {
      title: props.title,
      description: props.description,
      projectId: currentTask?.project?._id,
      collaborators: currentTask?.collaborators?.map((c) => c._id) || [],
    }
    console.log('Initial projectId:', formData.value.projectId)
    initialFormData.value = JSON.parse(JSON.stringify(formData.value))
  } else {
    initialFormData.value = null
  }
})
onMounted(() => window.addEventListener('resize', updateMobileStatus))
onUnmounted(() => window.removeEventListener('resize', updateMobileStatus))
const emit = defineEmits(['saveChanges', 'removeTask', 'statusChanged'])
const updateMobileStatus = () => (isMobile.value = window.innerWidth < 768)

const showSuccess = () => {
  modalRef.value?.showToast('Task successfully updated')
}

const showError = (message = 'Something went wrong!') => {
  modalRef.value?.showToast(message, 'error')
}

const clearFields = () => {
  isEditMode.value = false
}

function handleCollaboratorUpdate(newCollaborators) {
  formData.value.collaborators = newCollaborators.map((id) => id.toString())
}

const handleStatusChange = async (newStatus) => {
  if (newStatus === props.status) return

  isLoading.value = true
  try {
    await taskStore.updateTask(props.id, { status: newStatus })
    emit('statusChanged', newStatus)
    modalRef.value?.showToast('Status updated successfully')
  } catch (error) {
    console.error('Error updating status:', error)
    modalRef.value?.showToast('Failed to update status', 'error')
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit() {
  if (isLoading.value || !hasChanges.value) return

  isLoading.value = true
  try {
    if (!formData.value.title.trim() || !formData.value.description.trim()) {
      showError('Title and description are required')
      return
    }

    const currentTask = taskStore.tasks.find((t) => t._id === props.id)
    const currentCollaborators = currentTask?.collaborators?.map((c) => c._id.toString()) || []
    const newCollaborators = formData.value.collaborators.map((id) => id.toString())

    await taskStore.updateTask(props.id, {
      title: formData.value.title,
      description: formData.value.description,
      project: formData.value.projectId,
    })

    const collaboratorsToAdd = newCollaborators.filter((id) => !currentCollaborators.includes(id))
    const collaboratorsToRemove = currentCollaborators.filter(
      (id) => !newCollaborators.includes(id),
    )

    for (const collaboratorId of collaboratorsToRemove) {
      await taskStore.removeCollaborator(props.id, collaboratorId)
    }

    if (collaboratorsToAdd.length > 0) {
      await taskStore.addCollaborator(props.id, collaboratorsToAdd)
    }

    await taskStore.fetchTasks()

    showSuccess()
    clearFields()
    emit('saveChanges')
  } catch (err) {
    console.error('Full error details:', err)
    console.error('Error response data:', err.response?.data)

    const errorMessage =
      err.response?.data?.message || err.message || 'Failed to update task. Please try again.'
    showError(errorMessage)
  } finally {
    isLoading.value = false
  }
}

async function confirmRemoveTask() {
  try {
    await taskStore.deleteTask(props.id)
    await taskStore.fetchTasks()
    emit('removeTask')
  } catch (error) {
    console.error('Failed to remove task:', error)
    showError(error.response?.data?.message || 'Failed to delete task')
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
    <div class="mb-4" v-if="isMobile && !isEditMode">
      <label class="block text-sm font-medium text-gray-700 mb-1">Task Status</label>
      <select
        :value="status"
        @change="handleStatusChange($event.target.value)"
        :disabled="isLoading"
        class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        :class="{ 'opacity-50': isLoading }"
      >
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div v-if="!isEditMode">
      <h3 class="text-2xl font-bold mb-1">Collaborators</h3>
      <div class="mb-4 bg-gray-100 rounded-lg p-4 shadow-md flex gap-2">
        <p v-if="!collaborators || collaborators.length === 0" class="text-gray-500">
          There are no Collaborators associated with this Task.
        </p>
        <span
          v-for="(name, index) in collaborators"
          :key="index"
          class="bg-blue-500 text-white flex items-center gap-1 p-2 rounded-md cursor-default"
        >
          <UserIcon class="h-4 w-4" />
          {{ name }}
        </span>
      </div>
    </div>
    <div v-if="!isEditMode" class="mb-6">
      <h3 class="text-2xl font-bold mb-1">Time Tracker</h3>
      <TimeTracker :taskId="props.id" />
    </div>
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
          title="Cancel Changes"
          :icon="ArchiveBoxXMarkIcon"
          btnClass="secondary"
          @click="clearFields"
        />
        <AppButton
          title="Save Changes"
          btnClass="primary"
          :icon="BookmarkIcon"
          @click="handleSubmit"
          :loading="isLoading"
          :disabled="!hasChanges"
        />
      </div>
    </div>
    <div v-if="!isEditMode" class="w-full flex gap-2">
      <AppButton
        title="Edit Task"
        :icon="PencilSquareIcon"
        btnClass="primary"
        @click="isEditMode = true"
      />
      <AppButton title="Remove Task" :icon="TrashIcon" btnClass="red-outline" @click="removeTask" />
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
