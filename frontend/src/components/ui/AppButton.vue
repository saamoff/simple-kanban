<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: Object,
    required: false,
  },
  btnClass: {
    type: String,
    required: true,
    validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value),
  },
  size: {
    type: String,
    required: false,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value),
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    @click="emit('click')"
    class="w-full justify-center items-center mt-2 sm:mt-0 cursor-pointer px-4 py-1 transition-colors duration-200 rounded-md flex gap-2 font-semibold"
    :class="[
      {
        'text-white bg-blue-500 h-11 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2':
          btnClass === 'primary',
        'text-blue-500 bg-white hover:bg-blue-50 border-2 border-offset-0':
          btnClass === 'secondary',
        'text-red-500 bg-transparent hover:bg-red-50 border-2': btnClass === 'tertiary',
      },
      {
        'px-2 py-1 text-sm': size === 'small',
        'px-4 py-2 text-base': !size || size === 'normal',
        'px-6 py-3 text-lg': size === 'large',
      },
    ]"
    v-bind="$attrs"
  >
    <span v-if="icon" class="h-5 w-5">
      <component :is="icon" />
    </span>
    {{ title }}
  </button>
</template>
