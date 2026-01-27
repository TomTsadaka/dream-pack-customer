<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="font-semibold text-lg mb-4">Pack Sizes</h3>
    <div class="space-y-2">
      <label
        v-for="packSize in availablePackSizes"
        :key="packSize"
        class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
      >
        <input
          type="checkbox"
          :value="packSize"
          v-model="selectedPackSizes"
          class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <span class="text-sm font-medium text-gray-700">{{ packSize }} pcs</span>
      </label>
    </div>

    <div class="mt-4 pt-4 border-t">
      <button
        v-if="selectedPackSizes.length > 0"
        @click="clearPackSizes"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Pack Sizes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  availablePackSizes: number[];
  modelValue?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: number[]];
}>();

const selectedPackSizes = computed<number[]>({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
});

const clearPackSizes = () => {
  emit('update:modelValue', []);
};
</script>