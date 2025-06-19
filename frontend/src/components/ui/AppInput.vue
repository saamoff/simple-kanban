<script setup>
const props = defineProps({
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
  modelValue: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700" v-bind="$attrs">
      {{ props.label }}
    </label>
    <input
      v-if="props.inputType === 'input'"
      v-bind="$attrs"
      :value="props.modelValue"
      @input="(e) => emit('update:modelValue', e.target.value)"
      :placeholder="props.placeHolder"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
    />
    <textarea
      v-if="props.inputType === 'textarea'"
      v-bind="$attrs"
      :value="props.modelValue"
      @input="(e) => emit('update:modelValue', e.target.value)"
      :placeholder="props.placeHolder"
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
    />
  </div>
</template>
