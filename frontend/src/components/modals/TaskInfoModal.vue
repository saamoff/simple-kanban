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
    <div class="w-full mt-10">
      <button
        v-if="!isEditMode"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer w-[48%] sm:w-[49%]"
        @click="isEditMode = true"
      >
        Edit Task
      </button>
      <button
        v-if="!isEditMode"
        class="text-red-500 border-1 px-4 py-2 rounded hover:bg-red-50 ml-2 cursor-pointer w-[48%] sm:w-[49%]"
        @click="$emit('removeTask')"
      >
        Remove Task
      </button>
      <button
        v-if="isEditMode"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer w-[48%] sm:w-[49%]"
        @click="$emit('saveChanges')"
      >
        Save Changes
      </button>
      <button
        v-if="isEditMode"
        class="text-gray-500 border-1 px-4 py-2 rounded hover:bg-gray-50 ml-2 cursor-pointer w-[48%] sm:w-[49%]"
        @click="isEditMode = false"
      >
        Cancel
      </button>
    </div>
  </ModalContainer>
</template>

<script>
import AddCollaborator from '../AddCollaborator.vue'
import TimeRegister from '../TimeRegister.vue'
import ModalContainer from './ModalContainer.vue'
export default {
  data() {
    return {
      isEditMode: false,
    }
  },
  components: {
    AddCollaborator,
    TimeRegister,
    ModalContainer,
  },
  props: {
    title: String,
    description: String,
    collaborators: Array,
  },
  setup(_, { emit }) {
    const addCollaboratorEmit = (collaborator) => {
      emit('addCollaborator', collaborator)
    }

    const removeCollaboratorEmit = (collaborator) => {
      emit('removeCollaborator', collaborator)
    }

    return {
      addCollaboratorEmit,
      removeCollaboratorEmit,
    }
  },
}
</script>
