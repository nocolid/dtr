<script setup>
defineProps({
  visible: { type: Boolean, required: true },
  message: { type: String, default: '' },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="alert-overlay" @click.self="emit('close')">
      <div class="alert-box">
        <p class="alert-message">{{ message }}</p>
        <button class="btn-alert-ok" @click="emit('close')">OK</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.alert-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-box {
  background: #fff;
  border: 4px solid #000;
  box-shadow: 12px 12px 0 #000;
  padding: 3rem 3.5rem;
  width: 400px;
  max-width: 90vw;
}

.alert-message {
  font-size: 1.1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

.btn-alert-ok {
  width: 100%;
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

.btn-alert-ok:hover {
  background: #333;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #888;
}
</style>
