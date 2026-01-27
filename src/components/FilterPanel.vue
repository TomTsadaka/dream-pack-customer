<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
    
    <!-- Colors Filter -->
    <div v-if="availableColors.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Colors</h4>
      <div class="space-y-2">
        <label
          v-for="color in availableColors"
          :key="color"
          class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            :value="color"
            v-model="selectedColorsLocal"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span class="text-sm font-medium text-gray-700">{{ color }}</span>
        </label>
      </div>
      
      <button
        v-if="selectedColorsLocal.length > 0"
        @click="clearColors"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Colors
      </button>
    </div>

    <!-- Sizes Filter -->
    <div v-if="availableSizes.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Sizes</h4>
      <div class="space-y-2">
        <label
          v-for="size in availableSizes"
          :key="size"
          class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            :value="size"
            v-model="selectedSizesLocal"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span class="text-sm font-medium text-gray-700">{{ size }}</span>
        </label>
      </div>
      
      <button
        v-if="selectedSizesLocal.length > 0"
        @click="clearSizes"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Sizes
      </button>
    </div>

    <!-- Pack Sizes Filter -->
    <div v-if="availablePackSizes.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Pieces Per Pack</h4>
      <div class="space-y-2">
        <label
          v-for="packSize in availablePackSizes"
          :key="packSize"
          class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            :value="packSize"
            v-model="selectedPackSizesLocal"
            class="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
          />
          <span class="text-sm font-medium text-gray-700">{{ packSize }} pcs</span>
        </label>
      </div>
      
      <button
        v-if="selectedPackSizesLocal.length > 0"
        @click="clearPackSizes"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Clear Pack Sizes
      </button>
    </div>

    <!-- Clear All Filters -->
    <div v-if="hasAnyFilters" class="pt-4 border-t border-gray-200">
      <button
        @click="clearAllFilters"
        class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
      >
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  availableColors: string[];
  availableSizes: string[];
  availablePackSizes: number[];
  selectedColors: string[];
  selectedSizes: string[];
  selectedPackSizes: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:colors': [colors: string[]];
  'update:sizes': [sizes: string[]];
  'update:packSizes': [packSizes: number[]];
  'clear-all': [];
}>();

// Local reactive copies
const selectedColorsLocal = ref<string[]>([...props.selectedColors]);
const selectedSizesLocal = ref<string[]>([...props.selectedSizes]);
const selectedPackSizesLocal = ref<number[]>([...props.selectedPackSizes]);

// Computed properties
const hasAnyFilters = computed(() => {
  return selectedColorsLocal.value.length > 0 || 
         selectedSizesLocal.value.length > 0 || 
         selectedPackSizesLocal.value.length > 0;
});

// Watch for changes and emit
watch(selectedColorsLocal, (newColors) => {
  emit('update:colors', newColors);
}, { deep: true });

watch(selectedSizesLocal, (newSizes) => {
  emit('update:sizes', newSizes);
}, { deep: true });

watch(selectedPackSizesLocal, (newPackSizes) => {
  emit('update:packSizes', newPackSizes);
}, { deep: true });

// Methods
const clearColors = () => {
  selectedColorsLocal.value = [];
};

const clearSizes = () => {
  selectedSizesLocal.value = [];
};

const clearPackSizes = () => {
  selectedPackSizesLocal.value = [];
};

const clearAllFilters = () => {
  selectedColorsLocal.value = [];
  selectedSizesLocal.value = [];
  selectedPackSizesLocal.value = [];
  emit('clear-all');
};
</script>