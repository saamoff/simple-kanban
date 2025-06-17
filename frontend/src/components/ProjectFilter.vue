<template>
  <HeadlessMenu>
    <MenuButton
      class="absolute z-1 right-4 top-7 sm:right-50 sm:top-7 sm:w-56 justify-center rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-400 cursor-pointer"
    >
      Filter Projects
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-4 top-16 sm:right-50 sm:top-16 mt-2 sm:w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-1"
      >
        <div class="px-1 py-1">
          <MenuItem v-for="project in projects" :key="project" v-slot="{ active }">
            <button
              class="menu-item-btn"
              :class="[
                active ? 'bg-blue-500 text-white' : 'text-gray-900',
                selectedProjects.includes(project) ? 'font-semibold' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
              ]"
              @click="toggleProject(project)"
            >
              <span
                class="fake-checkbox"
                :class="selectedProjects.includes(project) ? 'checked' : ''"
              ></span>
              {{ project }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </HeadlessMenu>
</template>

<script>
import { Menu as HeadlessMenu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
export default {
  data() {
    return {
      active: true,
    }
  },
  components: {
    HeadlessMenu,
    MenuButton,
    MenuItems,
    MenuItem,
  },
  props: {
    projects: Array,
    modelValue: Array,
  },
  emits: ['update:modelValue'],
  computed: {
    selectedProjects: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
  methods: {
    toggleProject(project) {
      const idx = this.selectedProjects.indexOf(project)
      if (idx > -1) {
        this.selectedProjects = this.selectedProjects.filter((p) => p !== project)
      } else {
        this.selectedProjects = [...this.selectedProjects, project]
      }
    },
  },
}
</script>

<style scoped>
.menu-item-btn {
  cursor: pointer;
}

.fake-checkbox {
  width: 1rem;
  height: 1rem;
  border: 0.125rem solid #ccc;
  border-radius: 1rem;
  margin-right: 0.5rem;
  display: inline-block;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.fake-checkbox.checked {
  background-color: #4a90e2;
  border-color: #4a90e2;
}
</style>
