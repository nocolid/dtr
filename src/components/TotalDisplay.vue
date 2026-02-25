<script setup>
defineProps({
  decimalHours: { type: String, required: true },
  hoursMinutes: { type: String, required: true },
})
</script>

<template>
  <div class="total-display">
    <div class="total-label">Total Hours</div>
    <div style="text-align: right">
      <div class="total-decimal">{{ decimalHours }}</div>
      <div class="total-hm">{{ hoursMinutes }}</div>
    </div>
  </div>
</template>
