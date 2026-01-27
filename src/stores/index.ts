import { createPinia } from 'pinia';

const pinia = createPinia();

export default pinia;

export * from './auth';
export * from './products';
export * from './cart';
export * from './orders';