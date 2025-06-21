<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: Function,
    required: false,
  },
  btnClass: {
    type: String,
    required: true,
    validator: (value) =>
      ['primary', 'secondary', 'red-outline', 'red-full', 'green-full'].includes(value),
  },
  size: {
    type: String,
    required: false,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    @click="emit('click')"
    v-bind="$attrs"
    :disabled="disabled"
    class="w-full justify-center items-center mt-2 sm:mt-0 cursor-pointer px-4 py-1 transition-colors duration-200 rounded-md flex gap-2 font-semibold"
    :class="[
      {
        'text-white bg-blue-500 h-11 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2':
          btnClass === 'primary',
        'text-blue-500 bg-white hover:bg-blue-50 border-2 border-offset-0':
          btnClass === 'secondary',
        'text-red-500 bg-transparent hover:bg-red-50 border-2': btnClass === 'red-outline',
        'text-white bg-red-500 h-11 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2':
          btnClass === 'red-full',
        'text-white bg-green-500 h-11 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2':
          btnClass === 'green-full',
        'opacity-50 cursor-not-allowed': disabled,
      },
      {
        'px-2 py-1 text-sm': size === 'small',
        'px-4 py-2 text-base': !size || size === 'normal',
        'px-6 py-3 text-lg': size === 'large',
      },
    ]"
  >
    <span v-if="icon" class="h-5 w-5">
      <component :is="icon" />
    </span>
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    {{ isLoading ? '' : title }}
  </button>
</template>
