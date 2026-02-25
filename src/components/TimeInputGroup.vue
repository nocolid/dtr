<script setup>
defineProps({
  label: { type: String, required: true },
  value: {
    type: Object,
    default: () => ({ timeIn: '', timeOut: '' }),
  },
})

const emit = defineEmits(['update:timeIn', 'update:timeOut'])
</script>

<template>
  <span class="section-title">{{ label }}</span>
  <div class="input-group">
    <div>
      <div class="label">In</div>
      <input
        type="time"
        :value="value.timeIn"
        @change="emit('update:timeIn', $event.target.value)"
      />
    </div>
    <div>
      <div class="label">Out</div>
      <input
        type="time"
        :value="value.timeOut"
        @change="emit('update:timeOut', $event.target.value)"
      />
    </div>
  </div>
</template>
