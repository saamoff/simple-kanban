<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <HeadlessDialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>
      <div class="fixed inset-0 right-0 min-h-full w-full overflow-y-auto">
        <div class="flex min-h-full justify-end text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out transform"
            enter-from="translate-x-full opacity-0 scale-95"
            enter-to="translate-x-0 opacity-100 scale-100"
            leave="duration-200 ease-in transform"
            leave-from="translate-x-0 opacity-100 scale-100"
            leave-to="translate-x-full opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <div class="text-sm text-gray-400 mb-4 flex justify-end items-center">
                <button @click="closeModal">
                  <XMarkIcon
                    class="h-5 w-5 cursor-pointer rounded-lg hover:bg-gray-100"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div>
                <DialogTitle as="h3" class="text-4xl font-bold leading-6 text-gray-900">
                  {{ title }}
                </DialogTitle>
              </div>
              <div class="mt-5 mb-5">
                <p class="text-gray-500">
                  {{ description }}
                </p>
              </div>
              <slot></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    TransitionRoot,
    TransitionChild,
    HeadlessDialog,
    DialogPanel,
    DialogTitle,
    XMarkIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  setup(_, { emit }) {
    const isOpen = ref(true)

    const closeModal = () => {
      isOpen.value = false
      emit('close')
    }

    watch(isOpen, (newVal) => {
      if (!newVal) emit('close')
    })

    return {
      isOpen,
      closeModal,
    }
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
