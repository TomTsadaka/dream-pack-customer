<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" @click="closeModal">
    <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">Product Gallery</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Image -->
      <div class="relative bg-gray-100" style="height: 500px;">
        <img
          :src="images[currentIndex]"
          :alt="`Product image ${currentIndex + 1}`"
          class="w-full h-full object-contain"
        />
        
        <!-- Navigation Buttons -->
        <button
          v-if="images.length > 1"
          @click="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          v-if="images.length > 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-colors"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Thumbnails -->
      <div v-if="images.length > 1" class="p-4 border-t bg-gray-50">
        <div class="flex gap-2 overflow-x-auto">
          <button
            v-for="(image, index) in images"
            :key="index"
            @click="selectImage(index)"
            :class="[
              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
              currentIndex === index
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            ]"
          >
            <img
              :src="image"
              :alt="`Thumbnail ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  images: string[];
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'close': [];
}>();

const currentIndex = ref(0);

const closeModal = () => {
  emit('close');
};

const selectImage = (index: number) => {
  currentIndex.value = index;
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // Loop back to first image
  }
};

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.images.length - 1; // Loop to last image
  }
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;
  
  switch (event.key) {
    case 'ArrowLeft':
      previousImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case 'Escape':
      closeModal();
      break;
  }
};

// Reset current index when images change
watch(() => props.images, () => {
  currentIndex.value = 0;
});

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>