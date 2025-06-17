<template>
  <div class="absolute right-0 top-14 w-full p-4 sm:right-110 h-10 sm:top-2 sm:w-56 z-1">
    <Combobox v-model="selected">
      <div class="relative mt-1">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg text-left focus:outline-none sm:text-sm"
        >
          <ComboboxInput
            class="w-full border-1 border-blue-500 h-10 rounded-lg px-4 py-2 text-sm leading-5 text-gray-900 focus:ring-0"
            :displayValue="(person) => person?.name || ''"
            :placeholder="props.placeholder"
            @input="query = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
          <button
            v-if="selected"
            class="absolute inset-y-0 right-8 flex items-center px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="clearSelection"
          >
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2 text-gray-700"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="person in filteredPeople"
              as="template"
              :key="person.id"
              :value="person"
              :disabled="props.existingCollaborators.includes(person.name)"
              v-slot="{ selected, active, disabled }"
            >
              <li
                class="relative cursor-pointer select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-blue-500 text-white': active && !disabled,
                  'text-gray-900': !active && !disabled,
                  'text-gray-400 cursor-not-allowed': disabled,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ person.name }}
                </span>
                <span
                  v-if="selected && !disabled"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-green-500': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Select a collaborator',
  },
  existingCollaborators: {
    type: Array,
    default: () => [],
  },
})

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

const emit = defineEmits(['update:selectedCollaborator'])

let selected = ref(null)
let query = ref('')

let filteredPeople = computed(() => {
  const normalizedQuery = query.value.toLowerCase().replace(/\s+/g, '')
  return normalizedQuery === ''
    ? people
    : people.filter((person) =>
        person.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery),
      )
})

function clearSelection() {
  selected.value = null
  query.value = ''
}

watch(selected, (newValue) => {
  if (newValue && !props.existingCollaborators.includes(newValue.name)) {
    emit('addCollaborator', newValue.name)
    emit('update:selectedCollaborator', newValue)
    clearSelection()
  }
})
</script>
