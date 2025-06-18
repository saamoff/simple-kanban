<script setup>
import { ref } from 'vue'
import FiltersModal from '../modals/FiltersModal.vue'
import AppButton from './AppButton.vue'
import { FunnelIcon } from '@heroicons/vue/24/solid'

const isModalOpen = ref(false)
</script>

<template>
  <header class="flex justify-between px-4 py-4">
    <img src="../../assets/logo.svg" alt="Simple Kanban" />
    <div class="flex gap-2">
      <span class="w-25 h-11">
        <AppButton
          title="Filters"
          btnClass="primary"
          :icon="FunnelIcon"
          @click="isModalOpen = true"
        />
      </span>
      <span class="w-25">
        <AppButton title="Logout" btnClass="secondary" />
      </span>
    </div>
    <FiltersModal v-if="isModalOpen" @close="isModalOpen = false" />
  </header>
</template>
