<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  description: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  icon: {
    type: String,
    default: ''
  },
  confirmLabel: {
    type: String,
    default: 'Confirm'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  color: {
    type: String as PropType<"error" | "neutral" | "primary" | "secondary" | "success" | "info" | "warning">,
    default: 'primary'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

function onConfirm() {
  emit('confirm')
  emit('close')
}

function onCancel() {
  emit('cancel')
  emit('close')
}

const displayIcon = computed(() => {
  if (props.icon) return props.icon
  if (props.color === 'error') return 'i-lucide-trash'
  if (props.color === 'warning') return 'i-lucide-triangle-alert'
  return 'i-heroicons-information-circle'
})
</script>

<template>
  <UModal @update:open="(val: boolean) => !val && onCancel()">
    <!-- let's add icon beside title and description -->
    <template #header>
      <div class="flex items-start gap-4 w-full">
        <div :class="[
          'p-3 rounded-xl squircle',
          `bg-${color}-500/10`,
          `text-${color}-500`
        ]">
          <UIcon :name="displayIcon" class="text-2xl flex" />
        </div>
        <div class="flex flex-col w-full">
          <div class="text-highlighted font-semibold">
            {{ title }}
          </div>
          <div class="mt-1 text-muted text-sm">
            {{ description }}
          </div>
        </div>
        <UButton square variant="ghost" icon="i-lucide-x" color="neutral" @click="onCancel" />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="soft" @click="onCancel">{{ cancelLabel }}</UButton>
        <UButton :color="color" @click="onConfirm">{{ confirmLabel }}</UButton>
      </div>
    </template>
  </UModal>
</template>