import { ref, computed, watch } from 'vue'

const TARGET_HOURS = 486
const START_DATE   = '2026-02-06'
const STORAGE_KEY  = 'dtr-records'

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function useRecords() {
  const records = ref(loadFromStorage())

  watch(records, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  function addRecord(entry) {
    records.value.push({ id: crypto.randomUUID(), ...entry })
  }

  function updateRecord(id, patch) {
    const index = records.value.findIndex(r => r.id === id)
    if (index !== -1) records.value[index] = { id, ...patch }
  }

  function deleteRecord(id) {
    records.value = records.value.filter(r => r.id !== id)
  }

  // ── COMPUTED ─────────────────────────────────────────────────────────────
  const sortedRecords = computed(() =>
    [...records.value].sort((a, b) => (a.date < b.date ? 1 : -1))
  )

  const totalAccumulatedMinutes = computed(() =>
    records.value.reduce((sum, r) => sum + (r.totalMinutes || 0), 0)
  )

  const totalAccumulatedHours = computed(() =>
    (totalAccumulatedMinutes.value / 60).toFixed(2)
  )

  const progressPercent = computed(() => {
    const pct = (totalAccumulatedMinutes.value / (TARGET_HOURS * 60)) * 100
    return Math.min(pct, 100).toFixed(1)
  })

  const remainingHours = computed(() =>
    Math.max(TARGET_HOURS - totalAccumulatedMinutes.value / 60, 0).toFixed(2)
  )

  const estimatedEndDate = computed(() => {
    if (records.value.length === 0) return null
    const avgMinutesPerDay = totalAccumulatedMinutes.value / records.value.length
    if (avgMinutesPerDay === 0) return null
    const remainingMinutes = Math.max(TARGET_HOURS * 60 - totalAccumulatedMinutes.value, 0)
    const daysNeeded = Math.ceil(remainingMinutes / avgMinutesPerDay)
    const end = new Date()
    end.setDate(end.getDate() + daysNeeded)
    return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  })

  return {
    records,
    sortedRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    totalAccumulatedMinutes,
    totalAccumulatedHours,
    progressPercent,
    remainingHours,
    estimatedEndDate,
    TARGET_HOURS,
    START_DATE,
  }
}
