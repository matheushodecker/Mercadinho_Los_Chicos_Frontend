<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 max-w-sm w-full bg-background border rounded-lg shadow-lg p-4"
        :class="typeClasses"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5 text-green-500" />
            <XCircleIcon v-else-if="type === 'error'" class="h-5 w-5 text-red-500" />
            <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-5 w-5 text-yellow-500" />
            <InformationCircleIcon v-else class="h-5 w-5 text-blue-500" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-foreground">{{ title }}</p>
            <p v-if="message" class="mt-1 text-sm text-muted-foreground">{{ message }}</p>
          </div>
          <button
            @click="close"
            class="ml-4 flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

const typeClasses = computed(() => {
  const classes = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  }
  return classes[props.type] || classes.info
})

const close = () => {
  visible.value = false
  emit('close')
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>
