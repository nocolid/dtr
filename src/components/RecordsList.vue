<script setup>
import { ref } from 'vue'
import ConfirmModal from './ConfirmModal.vue'

defineProps({
  records: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const showConfirm  = ref(false)
const pendingId    = ref(null)

function requestDelete(id) {
  pendingId.value   = id
  showConfirm.value = true
}

function onConfirm() {
  emit('delete', pendingId.value)
  showConfirm.value = false
  pendingId.value   = null
}

function onCancel() {
  showConfirm.value = false
  pendingId.value   = null
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="records-wrapper">
    <h2>Saved Records</h2>

    <p v-if="records.length === 0" class="records-empty">
      No records yet.
    </p>

    <table v-else class="records-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>AM In</th>
          <th>AM Out</th>
          <th>PM In</th>
          <th>PM Out</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ formatDate(record.date) }}</td>
          <td>{{ record.morningIn   || '—' }}</td>
          <td>{{ record.morningOut  || '—' }}</td>
          <td>{{ record.afternoonIn  || '—' }}</td>
          <td>{{ record.afternoonOut || '—' }}</td>
          <td class="record-total">{{ (record.totalMinutes / 60).toFixed(2) }}</td>
          <td class="record-actions">
            <button class="btn-edit"   @click="emit('edit', record)">Edit</button>
            <button class="btn-delete" @click="requestDelete(record.id)">Del</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ConfirmModal
    :visible="showConfirm"
    message="Are you sure you want to delete this record?"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
