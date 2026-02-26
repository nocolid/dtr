<script setup>
defineProps({
  visible: { type: Boolean, required: true },
  message: { type: String, default: 'Are you sure?' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="confirm-overlay">
      <div class="confirm-box">
        <p class="confirm-message">{{ message }}</p>
        <div class="confirm-actions">
          <button class="btn-confirm-cancel" @click="emit('cancel')">Cancel</button>
          <button class="btn-confirm-delete" @click="emit('confirm')">Delete</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-box {
  background: #fff;
  border: 4px solid #000;
  box-shadow: 12px 12px 0 #000;
  padding: 3rem 3.5rem;
  width: 400px;
  max-width: 90vw;
}

.confirm-message {
  font-size: 1.1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 2.5rem 0;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 16px;
}

.btn-confirm-cancel {
  flex: 1;
  background: #fff;
  color: #000;
  border: 3px solid #000;
  padding: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-confirm-cancel:hover {
  background: #f0f0f0;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #888;
}

.btn-confirm-delete {
  flex: 1;
  background: #000;
  color: #fff;
  border: 3px solid #000;
  padding: 14px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-confirm-delete:hover {
  background: #333;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #888;
}
</style>
