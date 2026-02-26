import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase.js'

const TARGET_HOURS = 486
const START_DATE   = '2026-02-06'

// DB row (snake_case) → JS object (camelCase)
function toJS(row) {
  return {
    id:           row.id,
    date:         row.date,
    morningIn:    row.morning_in,
    morningOut:   row.morning_out,
    afternoonIn:  row.afternoon_in,
    afternoonOut: row.afternoon_out,
    totalMinutes: row.total_minutes,
  }
}

// JS object (camelCase) → DB row (snake_case)
function toDB(entry) {
  return {
    date:          entry.date,
    morning_in:    entry.morningIn,
    morning_out:   entry.morningOut,
    afternoon_in:  entry.afternoonIn,
    afternoon_out: entry.afternoonOut,
    total_minutes: entry.totalMinutes,
  }
}

export function useRecords() {
  const records = ref([])
  const loading = ref(false)
  const error   = ref(null)

  // ── LOAD ────────────────────────────────────────────────────────────────
  async function loadRecords() {
    loading.value = true
    error.value   = null
    try {
      const { data, error: sbError } = await supabase
        .from('records')
        .select('*')
        .order('date', { ascending: false })

      if (sbError) throw sbError
      records.value = data.map(toJS)
    } catch (err) {
      error.value   = err.message
      records.value = []
    } finally {
      loading.value = false
    }
  }

  loadRecords()

  // ── ADD ─────────────────────────────────────────────────────────────────
  async function addRecord(entry) {
    loading.value = true
    error.value   = null
    try {
      const { data, error: sbError } = await supabase
        .from('records')
        .insert({ id: crypto.randomUUID(), ...toDB(entry) })
        .select()
        .single()

      if (sbError) throw sbError
      records.value.push(toJS(data))
      return toJS(data)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── UPDATE ───────────────────────────────────────────────────────────────
  async function updateRecord(id, patch) {
    loading.value = true
    error.value   = null
    try {
      const { data, error: sbError } = await supabase
        .from('records')
        .update(toDB(patch))
        .eq('id', id)
        .select()
        .single()

      if (sbError) throw sbError
      const index = records.value.findIndex(r => r.id === id)
      if (index !== -1) records.value[index] = toJS(data)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── DELETE ───────────────────────────────────────────────────────────────
  async function deleteRecord(id) {
    loading.value = true
    error.value   = null
    try {
      const { error: sbError } = await supabase
        .from('records')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      records.value = records.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
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
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    loadRecords,
    totalAccumulatedMinutes,
    totalAccumulatedHours,
    progressPercent,
    remainingHours,
    estimatedEndDate,
    TARGET_HOURS,
    START_DATE,
  }
}
