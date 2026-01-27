<template>
  <div class="bg-white rounded-lg shadow-md p-4" v-if="product?.options">
    <h3 class="font-semibold text-lg mb-4">Colors</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="color in product.options.colors"
        :key="typeof color === 'string' ? color : color.name"
        @click="selectColor(color)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          selectedColor === (typeof color === 'string' ? color : color.name)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ typeof color === 'string' ? color : color.name }}
      </button>
    </div>

    <h3 class="font-semibold text-lg mb-4">Sizes</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="size in product.options.sizes"
        :key="typeof size === 'string' ? size : size.name"
        @click="selectSize(size)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedSize === (typeof size === 'string' ? size : size.name)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ typeof size === 'string' ? size : size.name }}
      </button>
    </div>

    <h3 class="font-semibold text-lg mb-4">Pack Size</h3>
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="packSize in product.options.pcsPerPack"
        :key="typeof packSize === 'number' ? packSize : packSize.value"
        @click="selectPackSize(packSize)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedPackSize === (typeof packSize === 'number' ? packSize : packSize.value)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ typeof packSize === 'number' ? packSize : packSize.label || packSize.value }}
      </button>
    </div>

    <div class="border-t pt-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-600">Selected Variant:</span>
        <span class="font-semibold">{{ selectedVariantName }}</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-600">Price:</span>
        <span class="font-semibold text-lg">${{ currentVariant?.price || '0.00' }}</span>
      </div>
      <div v-if="currentVariant?.salePrice" class="flex justify-between items-center mb-2">
        <span class="text-gray-600">Sale Price:</span>
        <span class="font-semibold text-lg text-red-600">${{ currentVariant.salePrice }}</span>
      </div>
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600">Stock:</span>
        <span :class="[
          'font-semibold',
          (currentVariant?.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
        ]">
          {{ currentVariant?.stock || 0 }} in stock
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product, ProductVariant } from '@/types';

interface Props {
  product: Product;
  modelValue?: ProductVariant | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [variant: ProductVariant | null];
  variantSelected: [variant: ProductVariant];
}>();

const selectedColor = ref<string>('');
const selectedSize = ref<string>('');
const selectedPackSize = ref<number>(1);

const currentVariant = computed(() => {
  if (!props.product) return null;
  
  return props.product.variants.find(variant => {
    const colorMatch = variant.color.toLowerCase() === selectedColor.value.toLowerCase();
    const sizeMatch = variant.size.toLowerCase() === selectedSize.value.toLowerCase();
    const packMatch = variant.packSize === selectedPackSize.value;
    return colorMatch && sizeMatch && packMatch;
  }) || null;
});

const selectedVariantName = computed(() => {
  if (!currentVariant.value) return 'None';
  return `${selectedColor.value} ${selectedSize.value} (${selectedPackSize.value} pack)`;
});

const selectColor = (color: string | any) => {
  selectedColor.value = typeof color === 'string' ? color : color.name;
  emitVariantUpdate();
};

const selectSize = (size: string | any) => {
  selectedSize.value = typeof size === 'string' ? size : size.name;
  emitVariantUpdate();
};

const selectPackSize = (packSize: number | any) => {
  selectedPackSize.value = typeof packSize === 'number' ? packSize : packSize.value;
  emitVariantUpdate();
};

const emitVariantUpdate = () => {
  if (currentVariant.value) {
    emit('update:modelValue', currentVariant.value);
    emit('variantSelected', currentVariant.value);
  }
};

// Initialize with first available variant
if (props.product?.variants?.length > 0) {
  const firstVariant = props.product.variants[0];
  selectedColor.value = firstVariant.color;
  selectedSize.value = firstVariant.size;
  selectedPackSize.value = firstVariant.packSize;
  emitVariantUpdate();
}
</script>