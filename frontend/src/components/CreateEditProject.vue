<template>
  <div class="fixed bottom-0 bg-white sm:relative sm:mt-8 sm:mb-8 flex sm:justify-center h-20 sm:h-auto w-full sm:w-auto py-2 shadow-lg sm:shadow-none">
    <button
      class="h-15 sm:h-auto sm:w-56 px-4 items-center bg-blue-500 text-white sm:bg-transparent rounded-md sm:border-2 sm:px-4 sm:py-2 font-semibold sm:text-blue-500 cursor-pointer sm:hover:bg-blue-50 sm:hover:text-blue-600 transition-colors duration-200"
    >
      + Create New Project
    </button>
    <button
      class="h-15 sm:h-auto px-4 flex gap-1 ml-2 sm:w-56 items-center justify-center rounded-md border-2 sm:px-4 py-2 font-semibold text-blue-500 cursor-pointer sm:ml-4 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
    >
      <PencilSquareIcon class="size-5" />
      Manage Projects
    </button>
  </div>
</template>

<script>
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
export default {
  components: { PencilSquareIcon },
}
</script>

<style></style>
