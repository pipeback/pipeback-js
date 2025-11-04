# Nuxt 3

Create `plugins/pipeback.client.ts`:

```typescript
import { createPipeback } from '@pipeback/pipeback-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const workspaceStore = useWorkspaceStore();

  const user = computed(() => userStore.user);
  const workspace = computed(() => workspaceStore.currentWorkspace);

  let pipeback = null;

  watchEffect(() => {
    if (user.value && workspace.value && !pipeback) {
      pipeback = createPipeback({
        workspaceId: config.public.pipebackId,
        user: {
          id: user.value.id,
          name: user.value.name,
          email: user.value.email,
          company: {
            id: workspace.value.id,
            name: workspace.value.name,
            website: workspace.value.domain
          },
          attributes: {
            plan: workspace.value.plan
          }
        },
        callbacks: {
          onLoaded: () => console.log('Widget loaded')
        }
      });
      // Automatically initializes!
    }
  });

  return {
    provide: {
      pipeback: () => pipeback
    }
  };
});
```

Usage in components:

```vue
<template>
  <button @click="$pipeback()?.open()">Contact Support</button>
</template>
```
