<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="font-semibold text-lg mb-4">Sizes</h3>
    <div class="space-y-2">
      <label
        v-for="size in availableSizes"
        :key="size"
        class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
      >
        <input
          type="checkbox"
          :value="size"
          v-model="selectedSizes"
          class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <span class="text-sm font-medium text-gray-700">{{ size }}</span>
      </label>
    </div>

    <div class="mt-4 pt-4 border-t">
      <button
        v-if="selectedSizes.length > 0"
        @click="clearSizes"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Sizes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  availableSizes: string[];
  modelValue?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const selectedSizes = computed<string[]>({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
});

const clearSizes = () => {
  emit('update:modelValue', []);
};
</script>