# Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import Pipeback from '@pipeback/pipeback-js';

  let pipeback = null;

  onMount(() => {
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

  function openSupport() {
    pipeback?.open();
  }
</script>

<button on:click={openSupport}>
  Contact Support
</button>
```
