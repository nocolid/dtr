<script setup>
defineProps({
  visible: { type: Boolean, required: true },
  pdfUrl: { type: String, default: '' },
})

const emit = defineEmits(['close', 'download'])
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <iframe
      :src="pdfUrl"
      style="width: 80%; height: 70%; background: white; border: 5px solid white"
    />
    <div class="modal-btns">
      <button style="background: white; color: black" @click="emit('close')">
        Back to Edit
      </button>
      <button @click="emit('download')">Download PDF</button>
    </div>
  </div>
</template>
