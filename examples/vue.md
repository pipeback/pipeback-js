# Vue 3

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import Pipeback from '@pipeback/pipeback-js';

let pipeback = null;

onMounted(() => {
  pipeback = Pipeback({
    workspaceId: 'YOUR_WORKSPACE_ID',
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      company: {
        id: 'company-123',
        name: 'Acme Inc',
        website: 'acme.com'
      },
      attributes: {
        plan: 'pro'
      }
    },
    callbacks: {
      onLoaded: () => console.log('Widget loaded')
    }
  });
  // Automatically initializes!
});

const openSupport = () => {
  pipeback?.open();
};
</script>

<template>
  <button @click="openSupport">Open Support</button>
</template>
```
