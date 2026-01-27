<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="font-semibold text-lg mb-4">Colors</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="color in product.options.colors"
        :key="color"
        @click="selectColor(color)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedColor === color
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ color }}
      </button>
    </div>

    <h3 class="font-semibold text-lg mb-4">Size</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="size in product.options.sizes"
        :key="size"
        @click="selectSize(size)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedSize === size
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ size }}
      </button>
    </div>

    <h3 class="font-semibold text-lg mb-4">Pack Size</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="packSize in product.options.packSizes"
        :key="packSize"
        @click="selectPackSize(packSize)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedPackSize === packSize
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ packSize }} pcs
      </button>
    </div>

    <div v-if="selectedVariant" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm">
        <strong>Selected:</strong> {{ selectedVariant.color }} / {{ selectedVariant.size }} / {{ selectedVariant.packSize }} pcs
      </p>
      <p class="text-sm">
        <strong>SKU:</strong> {{ selectedVariant.sku }}
      </p>
      <p class="text-sm">
        <strong>Stock:</strong> {{ selectedVariant.stock }} available
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product: Product;
  initialVariant?: ProductVariant;
}

const props = withDefaults(defineProps<Props>(), {
  initialVariant: undefined
});

const emit = defineEmits<{
  'variant-changed': [variant: ProductVariant];
}>();

const selectedColor = ref<string>('');
const selectedSize = ref<string>('');
const selectedPackSize = ref<number>(0);

// Find matching variant based on selections
const selectedVariant = computed(() => {
  return props.product.variants.find(variant => 
    variant.color === selectedColor.value &&
    variant.size === selectedSize.value &&
    variant.packSize === selectedPackSize.value &&
    variant.stock > 0
  ) || props.product.variants.find(v => v.stock > 0) || props.product.variants[0];
});

// Initialize with initial variant if provided
if (props.initialVariant) {
  selectedColor.value = props.initialVariant.color;
  selectedSize.value = props.initialVariant.size;
  selectedPackSize.value = props.initialVariant.packSize;
} else {
  // Default to first available variant
  const firstAvailable = props.product.variants.find(v => v.stock > 0);
  if (firstAvailable) {
    selectedColor.value = firstAvailable.color;
    selectedSize.value = firstAvailable.size;
    selectedPackSize.value = firstAvailable.packSize;
  }
}

const selectColor = (color: string) => {
  selectedColor.value = color;
};

const selectSize = (size: string) => {
  selectedSize.value = size;
};

const selectPackSize = (packSize: number) => {
  selectedPackSize.value = packSize;
};

// Emit variant changes
watch(selectedVariant, (newVariant) => {
  if (newVariant) {
    emit('variant-changed', newVariant);
  }
}, { immediate: true });
</script>