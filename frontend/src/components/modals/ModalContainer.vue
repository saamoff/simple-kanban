<script setup>
import { ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog as HeadlessDialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['close'])

const isOpen = ref(true)
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  timeout: 2000,
})

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type,
    timeout: type === 'success' ? 2000 : 3000,
  }

  setTimeout(() => {
    toast.value.show = false
  }, toast.value.timeout)
}

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

defineExpose({
  showToast,
})

watch(isOpen, (newVal) => {
  if (!newVal) emit('close')
})
</script>

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
      <Transition
        enter-active-class="transition ease-out duration-300 transform"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div v-if="toast.show" class="fixed top-4 right-4 z-50">
          <div
            :class="{
              'bg-green-50 text-green-800': toast.type === 'success',
              'bg-red-50 text-red-800': toast.type === 'error',
            }"
            class="rounded-md p-4 shadow-lg border"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="toast.type === 'success'"
                  class="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
                <ExclamationCircleIcon v-else class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium">{{ toast.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

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
              class="w-full sm:w-[40%] transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all"
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
                <DialogTitle as="h3" class="text-4xl font-bold text-gray-900">
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
