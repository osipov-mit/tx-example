import './assets/main.css';
import { Buffer } from 'buffer';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { ethers } from 'ethers';

import App from './App.vue';
import router from './router';

const app = createApp(App, { ethers });

app.use(createPinia());
app.use(router);

app.mount('#app');
