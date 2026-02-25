<script setup>
defineProps({
  percent:          { type: [Number, String], required: true },
  accumulated:      { type: String,           required: true },
  target:           { type: Number,           required: true },
  startDate:        { type: String,           required: true },
  remainingHours:   { type: String,           required: true },
  estimatedEndDate: { type: String,           default: null  },
})

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}
</script>

<template>
  <div class="progress-wrapper">
    <div class="progress-header">
      <span class="progress-label">OJT Progress</span>
      <span class="progress-stat">{{ accumulated }} / {{ target }} HRS</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="progress-pct">{{ percent }}%</div>

    <div class="progress-meta">
      <div class="progress-meta-item">
        <span class="progress-meta-label">Started</span>
        <span class="progress-meta-value">{{ formatDate(startDate) }}</span>
      </div>
      <div class="progress-meta-item">
        <span class="progress-meta-label">Remaining</span>
        <span class="progress-meta-value">{{ remainingHours }} hrs</span>
      </div>
      <div class="progress-meta-item">
        <span class="progress-meta-label">Est. End</span>
        <span class="progress-meta-value">{{ estimatedEndDate ?? '—' }}</span>
      </div>
    </div>
  </div>
</template>
