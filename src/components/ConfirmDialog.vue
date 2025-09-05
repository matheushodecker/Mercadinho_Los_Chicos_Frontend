<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="cancel"
      >
        <div
          class="bg-background rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
          @click.stop
        >
          <div class="flex items-center mb-4">
            <ExclamationTriangleIcon class="h-6 w-6 text-yellow-500 mr-3" />
            <h3 class="text-lg font-semibold text-foreground">{{ title }}</h3>
          </div>
          
          <p class="text-muted-foreground mb-6">{{ message }}</p>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="cancel"
              class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="confirm"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirmar ação'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  confirmButtonClass: {
    type: String,
    default: 'bg-red-600 hover:bg-red-700'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const visible = ref(false)

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const confirm = () => {
  emit('confirm')
  hide()
}

const cancel = () => {
  emit('cancel')
  hide()
}

defineExpose({
  show,
  hide
})
</script>
