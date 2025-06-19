<script setup>
import { ref } from 'vue'
import FiltersModal from '../modals/FiltersModal.vue'
import NewTaskModal from '../modals/NewTaskModal.vue'
import AppButton from './AppButton.vue'
import { FunnelIcon } from '@heroicons/vue/24/solid'

const isFilterModalOpen = ref(false)
const isNewTaskModalOpen = ref(false)
</script>

<template>
  <header class="flex justify-between px-4 py-4">
    <img src="../../assets/logo.svg" alt="Simple Kanban" />
    <div class="flex gap-2">
      <span class="w-30 h-11">
        <AppButton title="+ Add Task" btnClass="primary" @click="isNewTaskModalOpen = true" />
      </span>
      <span class="w-25">
        <AppButton
          title="Filters"
          btnClass="primary"
          :icon="FunnelIcon"
          @click="isFilterModalOpen = true"
        />
      </span>
    </div>
    <FiltersModal v-if="isFilterModalOpen" @close="isFilterModalOpen = false" />
    <NewTaskModal v-if="isNewTaskModalOpen" @close="isNewTaskModalOpen = false" />
  </header>
</template>
