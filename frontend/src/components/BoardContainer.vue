<template>
  <div>
    <div class="flex justify-between items center mt-10">
      <h1 class="text-3xl font-bold text-blue-500">All Boards</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
        @click="isModalOpen = true"
      >
        <FunnelIcon class="w-5 h-5" /> Filters
      </button>
      <FiltersModal 
        v-if="isModalOpen"
        :selectedCollaborator="selectedCollaborator"
        :selectedStatus="selectedStatus"
        @close="isModalOpen = false"
        @update:selectedCollaborator="selectedCollaborator = $event"
        @update:selectedStatus="selectedStatus = $event"
      />
    </div>
    <div v-if="filteredProjects.length === 0" class="mt-6 text-center text-gray-500">
      <p>
        No projects found for the selected collaborator. Please select another collaborator or reset
        the filter
      </p>
    </div>
    <div class="flex flex-wrap justify-between mt-15 sm:mt-6">
      <div v-for="project in filteredProjects" :key="project" class="w-full">
        <h2
          class="text-xl font-bold mb-2 text-gray-500 cursor-pointer flex items-center justify-between p-1"
          :class="collapsedProjects.includes(project) ? 'bg-gray-100 rounded' : ''"
          @click="toggleCollapse(project)"
        >
          {{ project }}
          <span v-if="collapsedProjects.includes(project)">
            <ChevronDownIcon class="size-6" />
          </span>
          <span v-else>
            <ChevronUpIcon class="size-6" />
          </span>
        </h2>
        <div v-show="!collapsedProjects.includes(project)" class="mb-6">
          <TaskBoard :tasks="tasksByProject(project)" />
        </div>
      </div>
    </div>
    <CreateEditProjectVue />
  </div>
</template>

<script>
import TaskBoard from './TaskBoard.vue'
import CreateEditProjectVue from './CreateEditProject.vue'
import FiltersModal from './modals/FiltersModal.vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { FunnelIcon } from '@heroicons/vue/24/solid'

export default {
  components: {
    TaskBoard,
    ChevronDownIcon,
    ChevronUpIcon,
    FunnelIcon,
    CreateEditProjectVue,
    FiltersModal,
  },
  data() {
    return {
      tasks: [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description for Task 1',
          project: 'Projeto 1',
          status: 'todo',
          collaborators: ['Wade Cooper', 'Arlene Mccoy'],
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description for Task 2',
          project: 'Projeto 2',
          status: 'inprogress',
          collaborators: ['Devon Webb', 'Wade Cooper'],
        },
        {
          id: 3,
          title: 'Task 3',
          description: 'Description for Task 3',
          project: 'Projeto 3',
          status: 'finished',
          collaborators: ['Tom Cook', 'Tanya Fox'],
        },
        {
          id: 4,
          title: 'Task 4',
          description: 'Description for Task 4',
          project: 'Projeto 1',
          status: 'inprogress',
          collaborators: ['Hellen Schmidt'],
        },
      ],
      selectedProjects: ['Projeto 1', 'Projeto 2', 'Projeto 3'],
      selectedCollaborator: null,
      collapsedProjects: [],
      selectedStatus: null,
      isModalOpen: true,
    }
  },
  computed: {
    projects() {
      return [...new Set(this.tasks.map((t) => t.project))]
    },
    filteredProjects() {
    if (!this.selectedCollaborator) {
      return this.selectedProjects;
    }
    return this.selectedProjects.filter((project) =>
      this.tasks.some(
        (task) =>
          task.project === project && task.collaborators.includes(this.selectedCollaborator.name),
      ),
    );
  },
  },
  created() {
    const cachedProjects = localStorage.getItem('selectedProjects')
    this.selectedProjects = cachedProjects ? JSON.parse(cachedProjects) : []
  },
  watch: {
    selectedProjects: {
      handler(newValue) {
        localStorage.setItem('selectedProjects', JSON.stringify(newValue))
      },
      deep: true,
    },
  },
  methods: {
    tasksByProject(project) {
      return this.tasks.filter((t) => {
        const matchesProject = t.project === project
        const matchesCollaborator =
          !this.selectedCollaborator || t.collaborators.includes(this.selectedCollaborator.name)
        const matchesStatus = this.selectedStatus ? t.status === this.selectedStatus : true
        return matchesProject && matchesCollaborator && matchesStatus
      })
    },
    toggleCollapse(project) {
      if (this.collapsedProjects.includes(project)) {
        this.collapsedProjects = this.collapsedProjects.filter((p) => p !== project)
      } else {
        this.collapsedProjects.push(project)
      }
    },
  },
}
</script>
