# @pipeback/pipeback-js

Official Pipeback JavaScript SDK - Works with React, Vue, Angular, Svelte, and vanilla JavaScript.

## Installation

```bash
npm install @pipeback/pipeback-js
# or
yarn add @pipeback/pipeback-js
# or
pnpm add @pipeback/pipeback-js
```

## Quick Start

### Vanilla JavaScript

```javascript
import { createPipeback } from '@pipeback/pipeback-js';

const pipeback = createPipeback({
  workspaceId: 'YOUR_PIPEBACK_WORKSPACE_ID',
  user: {
    id: '9f7618a2',
    name: 'Paulo Castellano',
    email: 'paulo@pipeback.com',
    company: {
      id: '8f4618a2',
      name: 'Pipeback',
      website: 'pipeback.com'
    },
    attributes: {
      plan: 'pro',
      monthly_spend: 5000,
    }
  },
  callbacks: {
    onLoaded: () => console.log('Widget loaded!'),
    onOpen: () => console.log('Widget opened'),
    onClose: () => console.log('Widget closed'),
  },
  autoHide: true // Optional: hide widget on load
});

// Initialize the widget
await pipeback.init();

// Control the widget
pipeback.open();
pipeback.close();
pipeback.show();
pipeback.hide();
```

### Vue 3 (Composition API)

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { createPipeback } from '@pipeback/pipeback-js';

const userStore = useUserStore();
const workspaceStore = useWorkspaceStore();

const user = computed(() => userStore.user);
const workspace = computed(() => workspaceStore.currentWorkspace);

let pipeback = null;

onMounted(async () => {
  if (user.value && workspace.value) {
    pipeback = createPipeback({
      workspaceId: 'YOUR_WORKSPACE_ID',
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
          plan: workspace.value.plan,
        }
      },
      callbacks: {
        onLoaded: () => console.log('Widget loaded'),
      },
      autoHide: true
    });

    await pipeback.init();
  }
});

onUnmounted(() => {
  pipeback?.shutdown();
});

const openSupport = () => {
  pipeback?.open();
};
</script>

<template>
  <button @click="openSupport">Open Support</button>
</template>
```

### Nuxt 3 Plugin

```typescript
// plugins/pipeback.client.ts
import { createPipeback } from '@pipeback/pipeback-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const workspaceStore = useWorkspaceStore();

  const user = computed(() => userStore.user);
  const workspace = computed(() => workspaceStore.currentWorkspace);

  let pipeback = null;

  watchEffect(async () => {
    if (user.value && workspace.value && !pipeback) {
      pipeback = createPipeback({
        workspaceId: config.public.pipebackId,
        user: {
          id: user.value.id,
          name: user.value.name,
          email: user.value.email,
          signature: user.value.pipeback_messenger_user_hash,
          company: {
            id: workspace.value.id,
            name: workspace.value.name,
            website: workspace.value.domain
          },
          attributes: {
            plan: workspace.value.plan,
          }
        },
        callbacks: {
          onLoaded: () => {
            console.log('Pipeback loaded');
          }
        },
        autoHide: true
      });

      await pipeback.init();
    }
  });

  return {
    provide: {
      pipeback: () => pipeback
    }
  };
});
```

Then use in your components:

```vue
<template>
  <button @click="$pipeback()?.open()">Contact Support</button>
</template>
```

### React

```jsx
import { useEffect, useRef } from 'react';
import { createPipeback } from '@pipeback/pipeback-js';

function App() {
  const pipebackRef = useRef(null);

  useEffect(() => {
    const initPipeback = async () => {
      pipebackRef.current = createPipeback({
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
            plan: 'enterprise',
            role: 'admin'
          }
        },
        callbacks: {
          onLoaded: () => console.log('Loaded'),
          onOpen: () => console.log('Opened')
        },
        autoHide: true
      });

      await pipebackRef.current.init();
    };

    initPipeback();

    return () => {
      pipebackRef.current?.shutdown();
    };
  }, []);

  const handleOpenWidget = () => {
    pipebackRef.current?.open();
  };

  return (
    <button onClick={handleOpenWidget}>
      Contact Support
    </button>
  );
}

export default App;
```

### Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { createPipeback, PipebackInstance } from '@pipeback/pipeback-js';

@Component({
  selector: 'app-root',
  template: '<button (click)="openWidget()">Contact Support</button>'
})
export class AppComponent implements OnInit, OnDestroy {
  private pipeback: PipebackInstance | null = null;

  async ngOnInit() {
    this.pipeback = createPipeback({
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
          department: 'engineering'
        }
      },
      callbacks: {
        onLoaded: () => console.log('Widget ready')
      },
      autoHide: true
    });

    await this.pipeback.init();
  }

  ngOnDestroy() {
    this.pipeback?.shutdown();
  }

  openWidget() {
    this.pipeback?.open();
  }
}
```

## API Reference

### Configuration Options

```typescript
interface PipebackConfig {
  workspaceId: string;           // Required: Your Pipeback workspace ID
  user?: PipebackUser;           // Optional: User information
  callbacks?: PipebackCallbacks; // Optional: Event callbacks
  autoHide?: boolean;            // Optional: Auto-hide widget on load (default: false)
  cdnUrl?: string;               // Optional: Custom CDN URL (default: https://widget.pipeback.com/l.js)
}

interface PipebackUser {
  id: string;                    // Required: User ID
  name: string;                  // Required: User name
  email: string;                 // Required: User email
  signature?: string;            // Optional: User verification hash
  company?: {
    id: string;                  // Required: Company ID
    name: string;                // Required: Company name
    website?: string;            // Optional: Company website
  };
  attributes?: {                 // Optional: Custom user attributes
    [key: string]: string | number | boolean | null | undefined;
  };
}

interface PipebackCallbacks {
  onLoaded?: () => void;         // Called when widget is loaded
  onOpen?: () => void;           // Called when widget is opened
  onClose?: () => void;          // Called when widget is closed
  onShow?: () => void;           // Called when widget is shown
  onHide?: () => void;           // Called when widget is hidden
}
```

### Methods

#### `init(): Promise<void>`
Initialize and load the Pipeback widget. Must be called before using other methods.

```typescript
await pipeback.init();
```

#### `open(): void`
Open the widget.

```typescript
pipeback.open();
```

#### `close(): void`
Close the widget.

```typescript
pipeback.close();
```

#### `show(): void`
Show the widget (makes it visible).

```typescript
pipeback.show();
```

#### `hide(): void`
Hide the widget (makes it invisible but keeps it loaded).

```typescript
pipeback.hide();
```

#### `update(data: { user: PipebackUser }): void`
Update user information dynamically.

```typescript
pipeback.update({
  user: {
    id: 'new-user-id',
    name: 'New Name',
    email: 'new@email.com',
    attributes: {
      plan: 'enterprise'
    }
  }
});
```

#### `isReady(): boolean`
Check if the widget is ready to use.

```typescript
if (pipeback.isReady()) {
  pipeback.open();
}
```

#### `shutdown(): void`
Cleanup and remove the widget completely.

```typescript
pipeback.shutdown();
```

## User Attributes

You can pass any custom attributes to track user information:

```javascript
const pipeback = createPipeback({
  workspaceId: 'YOUR_WORKSPACE_ID',
  user: {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    attributes: {
      plan: 'pro',
      monthly_spend: 5000,
      role: 'admin',
      department: 'engineering',
      signup_date: '2024-01-01',
      is_premium: true
    }
  }
});
```

## Security: User Identity Verification

For production environments, you should use the `signature` field to verify user identity:

```javascript
const pipeback = createPipeback({
  workspaceId: 'YOUR_WORKSPACE_ID',
  user: {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    signature: 'USER_HASH_FROM_BACKEND' // Generate this on your backend
  }
});
```

The signature should be generated on your backend using HMAC-SHA256 with your Pipeback secret key.

## TypeScript Support

This package is written in TypeScript and includes full type definitions.

```typescript
import {
  createPipeback,
  PipebackConfig,
  PipebackUser,
  PipebackInstance
} from '@pipeback/pipeback-js';

const config: PipebackConfig = {
  workspaceId: 'YOUR_WORKSPACE_ID',
  user: {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com'
  }
};

const pipeback: PipebackInstance = createPipeback(config);
await pipeback.init();
```

## License

MIT

## Support

- Documentation: https://docs.pipeback.com
- Email: support@pipeback.com
- Website: https://pipeback.com
