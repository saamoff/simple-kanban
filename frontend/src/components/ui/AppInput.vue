<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    required: true,
    validator: (value) => ['input', 'textarea'].includes(value),
  },
  placeHolder: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <label>{{ label }}</label>
    <input v-if="inputType === 'input'" v-bind="$attrs" />
    <textarea v-if="inputType === 'textarea'" />
  </div>
</template>
