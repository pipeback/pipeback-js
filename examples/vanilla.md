# Vanilla JavaScript

```javascript
import { createPipeback } from '@pipeback/pipeback-js';

const pipeback = createPipeback({
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
      plan: 'pro',
      monthly_spend: 5000
    }
  },
  callbacks: {
    onLoaded: () => console.log('Widget loaded'),
    onOpen: () => console.log('Widget opened'),
    onClose: () => console.log('Widget closed')
  }
});

// Widget automatically initializes!
// Use it right away:
pipeback.open();
pipeback.close();
pipeback.show();
pipeback.hide();
```
