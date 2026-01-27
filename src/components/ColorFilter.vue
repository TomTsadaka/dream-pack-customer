<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="font-semibold text-lg mb-4">Colors</h3>
    <div class="space-y-2">
      <label
        v-for="color in availableColors"
        :key="color"
        class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
      >
        <input
          type="checkbox"
          :value="color"
          v-model="selectedColors"
          class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
        />
        <span class="text-sm font-medium text-gray-700">{{ color }}</span>
      </label>
    </div>

    <div class="mt-4 pt-4 border-t">
      <button
        v-if="selectedColors.length > 0"
        @click="clearColors"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Colors
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

interface Props {
  availableColors: string[];
  modelValue?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const selectedColors = computed<string[]>({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
});

const clearColors = () => {
  emit('update:modelValue', []);
};
</script>