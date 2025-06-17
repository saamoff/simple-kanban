<template>
  <ModalContainer
    title="Filters"
  >
    <div class="space-y-4">
      <ProjectFilter />
      <CollaboratorFilter />
    </div>
  </ModalContainer>
</template>

<script>
import ModalContainer from './ModalContainer.vue';

export default {
  components: {
    ModalContainer,
  },
}
</script>