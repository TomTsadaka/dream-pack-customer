<template>
  <div class="flex justify-center items-center space-x-2 mt-8">
    <!-- Previous Button -->
    <button
      @click="handlePageChange(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <!-- Page Numbers -->
    <div class="flex space-x-1">
      <!-- First page -->
      <button
        v-if="showFirstPage"
        @click="handlePageChange(1)"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        1
      </button>

      <!-- Dots -->
      <span v-if="showStartDots" class="px-3 py-2 text-sm font-medium text-gray-500">
        ...
      </span>

      <!-- Page range -->
      <button
        v-for="page in pageRange"
        :key="page"
        @click="handlePageChange(page)"
        :class="[
          'px-3 py-2 text-sm font-medium border rounded-md',
          page === currentPage
            ? 'bg-primary-600 text-white border-primary-600'
            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
        ]"
      >
        {{ page }}
      </button>

      <!-- Dots -->
      <span v-if="showEndDots" class="px-3 py-2 text-sm font-medium text-gray-500">
        ...
      </span>

      <!-- Last page -->
      <button
        v-if="showLastPage"
        @click="handlePageChange(lastPage)"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        {{ lastPage }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="handlePageChange(currentPage + 1)"
      :disabled="currentPage >= lastPage"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number;
  lastPage: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'page-changed': [page: number];
}>();

const maxVisiblePages = 5;

const pageRange = computed(() => {
  const range = [];
  const start = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
  const end = Math.min(props.lastPage, start + maxVisiblePages - 1);
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
});

const showFirstPage = computed(() => {
  return pageRange.value[0] > 2;
});

const showLastPage = computed(() => {
  return pageRange.value[pageRange.value.length - 1] < props.lastPage - 1;
});

const showStartDots = computed(() => {
  return pageRange.value[0] > 1 && !showFirstPage.value;
});

const showEndDots = computed(() => {
  return pageRange.value[pageRange.value.length - 1] < props.lastPage && !showLastPage.value;
});

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= props.lastPage && page !== props.currentPage) {
    emit('page-changed', page);
  }
};
</script>