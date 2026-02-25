<script setup>
import { ref, computed } from 'vue'
import TimeInputGroup from './components/TimeInputGroup.vue'
import TotalDisplay from './components/TotalDisplay.vue'
import PreviewModal from './components/PreviewModal.vue'
import ProgressBar from './components/ProgressBar.vue'
import RecordsList from './components/RecordsList.vue'
import { usePDF } from './composables/usePDF.js'
import { useRecords } from './composables/useRecords.js'

// --- Records state ---
const {
  sortedRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  totalAccumulatedHours,
  progressPercent,
  remainingHours,
  estimatedEndDate,
  TARGET_HOURS,
  START_DATE,
} = useRecords()

// --- Form state ---
const selectedDate  = ref('')
const morningIn     = ref('')
const morningOut    = ref('')
const afternoonIn   = ref('')
const afternoonOut  = ref('')
const editingId     = ref(null)

// --- PDF state ---
const showModal = ref(false)
const pdfUrl    = ref('')
const { getPreviewURL, downloadPDF } = usePDF()

// --- Helper ---
function getDiff(start, end) {
  const s = start.split(':')
  const e = end.split(':')
  const diff = new Date(0, 0, 0, +e[0], +e[1]) - new Date(0, 0, 0, +s[0], +s[1])
  return diff > 0 ? diff / 1000 / 60 : 0
}

// --- Computed (live form) ---
const totalMinutes = computed(() => {
  let mins = 0
  if (morningIn.value && morningOut.value)
    mins += getDiff(morningIn.value, morningOut.value)
  if (afternoonIn.value && afternoonOut.value)
    mins += getDiff(afternoonIn.value, afternoonOut.value)
  return mins
})

const decimalHours = computed(() => (totalMinutes.value / 60).toFixed(2))

const hoursMinutes = computed(() => {
  const h = Math.floor(totalMinutes.value / 60)
  const m = Math.round(totalMinutes.value % 60)
  return `${h}h ${m}m`
})

const isEditing = computed(() => editingId.value !== null)

// --- Form actions ---
function saveRecord() {
  if (!selectedDate.value) {
    alert('Please select a date before saving.')
    return
  }

  const entry = {
    date:         selectedDate.value,
    morningIn:    morningIn.value,
    morningOut:   morningOut.value,
    afternoonIn:  afternoonIn.value,
    afternoonOut: afternoonOut.value,
    totalMinutes: totalMinutes.value,
  }

  if (isEditing.value) {
    updateRecord(editingId.value, entry)
  } else {
    addRecord(entry)
  }

  resetForm()
}

function startEdit(record) {
  editingId.value    = record.id
  selectedDate.value = record.date
  morningIn.value    = record.morningIn
  morningOut.value   = record.morningOut
  afternoonIn.value  = record.afternoonIn
  afternoonOut.value = record.afternoonOut
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetForm()
}

function resetForm() {
  editingId.value    = null
  selectedDate.value = ''
  morningIn.value    = ''
  morningOut.value   = ''
  afternoonIn.value  = ''
  afternoonOut.value = ''
}

// --- PDF ---
function showPreview() {
  pdfUrl.value = getPreviewURL(
    {
      morningIn:    morningIn.value,
      morningOut:   morningOut.value,
      afternoonIn:  afternoonIn.value,
      afternoonOut: afternoonOut.value,
    },
    decimalHours.value
  )
  showModal.value = true
}
</script>

<template>
  <ProgressBar
    :percent="progressPercent"
    :accumulated="totalAccumulatedHours"
    :target="TARGET_HOURS"
    :startDate="START_DATE"
    :remainingHours="remainingHours"
    :estimatedEndDate="estimatedEndDate"
  />

  <div class="container">
    <h2>{{ isEditing ? 'Edit Record' : 'Daily Log' }}</h2>

    <div class="field-group">
      <div class="label">Date</div>
      <input type="date" v-model="selectedDate" />
    </div>

    <TimeInputGroup
      label="Morning"
      :value="{ timeIn: morningIn, timeOut: morningOut }"
      @update:timeIn="morningIn = $event"
      @update:timeOut="morningOut = $event"
    />

    <TimeInputGroup
      label="Afternoon"
      :value="{ timeIn: afternoonIn, timeOut: afternoonOut }"
      @update:timeIn="afternoonIn = $event"
      @update:timeOut="afternoonOut = $event"
    />

    <TotalDisplay
      :decimalHours="decimalHours"
      :hoursMinutes="hoursMinutes"
    />

    <div class="actions">
      <button @click="saveRecord">
        {{ isEditing ? 'Update Record' : 'Save Record' }}
      </button>
      <button v-if="isEditing" class="btn-cancel" @click="cancelEdit">
        Cancel
      </button>
      <button @click="showPreview">Preview PDF</button>
    </div>
  </div>

  <RecordsList
    :records="sortedRecords"
    @edit="startEdit"
    @delete="deleteRecord"
  />

  <PreviewModal
    :visible="showModal"
    :pdfUrl="pdfUrl"
    @close="showModal = false"
    @download="downloadPDF"
  />
</template>
