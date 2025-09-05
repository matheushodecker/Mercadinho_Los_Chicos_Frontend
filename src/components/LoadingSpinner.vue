<template>
  <div class="flex items-center justify-center p-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span v-if="message" class="ml-2 text-muted-foreground">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>
