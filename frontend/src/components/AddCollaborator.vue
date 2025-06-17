<template>
  <div>
    <p class="text-gray-500 font-bold">Collaborators</p>
    <div class="bg-gray-100 p-2 rounded-lg pt-15">
      <div>
        <CollaboratorFilter
          @addCollaborator="$emit('addCollaborator', $event)"
          :existingCollaborators="collaborators"
          placeholder="Add a collaborator"
          class="z-1 !right-4 !top-40 sm:!w-103 !w-95"
        />
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          @click="$emit('removeCollaborator', collaborator)"
          v-for="collaborator in collaborators"
          :key="collaborator"
          class="relative bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center cursor-pointer hover:bg-blue-600 transition duration-200"
        >
          <span>{{ collaborator }}</span>
          <span class="bg-blue-300 rounded ml-1"
            ><XMarkIcon class="h-4 w-4" aria-hidden="true"
          /></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CollaboratorFilter from './CollaboratorFilter.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
export default {
  components: {
    CollaboratorFilter,
    XMarkIcon,
  },
  props: {
    collaborators: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style>

</style>