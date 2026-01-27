<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="font-semibold text-lg mb-4">Categories</h3>
    
    <ul class="space-y-2">
      <li>
        <button
          @click="$emit('category-selected', '')"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition-colors',
            selectedCategory === '' 
              ? 'bg-primary-100 text-primary-700 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          All Categories
        </button>
      </li>
      
      <li v-for="category in categories" :key="category.id">
        <button
          @click="$emit('category-selected', category.name)"
          :class="[
            'w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center',
            selectedCategory === category.name 
              ? 'bg-primary-100 text-primary-700 font-medium' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <span>{{ category.name }}</span>
          <span class="text-sm text-gray-500">({{ category.product_count }})</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  selectedCategory: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'category-selected': [category: string];
}>();
</script>