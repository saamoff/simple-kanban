// timeTrakcerStore.ts
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import api from '../services/api'

export const useTimeTrackerStore = defineStore('timeTracker', () => {
  const activeTrackings = ref<
    Record<
      string,
      {
        startDate: Date
        timeZone: string
        taskId: string
      }
    >
  >({})

  const elapsedTimes = ref<Record<string, string>>({})
  const timerIntervals = ref<Record<string, number>>({})
  const dailyTotal = ref('00:00')
  const monthlyTotal = ref('00:00')

  const initTaskTracking = async (taskId: string) => {
    try {
      const response = await api.timeTracking.getActiveTracking(taskId)
      if (response.data.isActive && response.data.trackingData) {
        activeTrackings.value[taskId] = {
          startDate: new Date(response.data.trackingData.startDate),
          timeZone: response.data.trackingData.timeZone,
          taskId: taskId,
        }
        startTimer(taskId)
      }
    } catch (error) {
      console.error('Error initializing task tracking:', error)
    }
  }

  const startTracking = async (taskId: string) => {
    try {
      if (activeTrackings.value[taskId]) {
        throw new Error('Already tracking time for this task')
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const response = await api.timeTracking.startTracking(taskId, timeZone)

      activeTrackings.value[taskId] = {
        startDate: new Date(response.data.startDate),
        timeZone: response.data.timeZone,
        taskId: taskId,
      }
      startTimer(taskId)
    } catch (error) {
      console.error('Error starting time tracking:', error)
      if (error.response?.data?.error === 'Already tracking time for this task') {
        await initTaskTracking(taskId)
        return
      }
      throw error
    }
  }

  const stopTracking = async (taskId: string) => {
    try {
      await api.timeTracking.stopTracking(taskId)
      clearTimer(taskId)
      delete activeTrackings.value[taskId]
      delete elapsedTimes.value[taskId]
      await fetchSummary()
    } catch (error) {
      console.error('Error stopping time tracking:', error)
      throw error
    }
  }

  const startTimer = (taskId: string) => {
    clearTimer(taskId)

    timerIntervals.value[taskId] = setInterval(() => {
      const tracking = activeTrackings.value[taskId]
      if (tracking) {
        const now = new Date()
        const diff = now.getTime() - tracking.startDate.getTime()
        elapsedTimes.value[taskId] = formatDuration(diff, true)
      }
    }, 1000) as unknown as number
  }

  const clearTimer = (taskId: string) => {
    if (timerIntervals.value[taskId]) {
      clearInterval(timerIntervals.value[taskId])
      delete timerIntervals.value[taskId]
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await api.timeTracking.getSummary()
      dailyTotal.value = response.data.dailyTotal
      monthlyTotal.value = response.data.monthlyTotal
    } catch (error) {
      console.error('Error fetching time summary:', error)
    }
  }

  const formatDuration = (ms: number, includeSeconds = false) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0')

    if (includeSeconds) {
      const seconds = (totalSeconds % 60).toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    }
    return `${hours}:${minutes}`
  }

  const isTracking = (taskId: string) => {
    return !!activeTrackings.value[taskId]
  }

  const getElapsedTime = (taskId: string) => {
    return elapsedTimes.value[taskId] || '00:00:00'
  }

  const getTimeTrackers = async (taskId: string) => {
    try {
      return await api.timeTracking.getTimeTrackers(taskId)
    } catch (error) {
      console.error('Error fetching time trackers:', error)
      throw error
    }
  }

  return {
    activeTrackings,
    dailyTotal,
    monthlyTotal,
    startTracking,
    stopTracking,
    initTaskTracking,
    isTracking,
    getElapsedTime,
    fetchSummary,
    getTimeTrackers,
  }
})
