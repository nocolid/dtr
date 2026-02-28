import { ref, computed, watch } from 'vue'
import HOLIDAYS from '../lib/holidays.js'

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

// Returns true if the given Date falls on a weekend or a Philippine holiday.
function isNonWorkingDay(date) {
  const day = date.getDay()
  if (day === 0 || day === 6) return true // Sunday or Saturday
  const dateStr = date.toISOString().split('T')[0]
  return HOLIDAYS.has(dateStr)
}

// Advance startDate by exactly `workingDays` working days, skipping weekends + holidays.
function addWorkingDays(startDate, workingDays) {
  const date = new Date(startDate)
  let added = 0
  while (added < workingDays) {
    date.setDate(date.getDate() + 1)
    if (!isNonWorkingDay(date)) added++
  }
  return date
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
    const workingDaysNeeded = Math.ceil(remainingMinutes / avgMinutesPerDay)
    const end = addWorkingDays(new Date(), workingDaysNeeded)
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
