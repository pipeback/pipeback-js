# React

```tsx
import { useEffect, useRef } from 'react';
import Pipeback from '@pipeback/pipeback-js';

function App() {
  const pipebackRef = useRef(null);

  useEffect(() => {
    pipebackRef.current = Pipeback({
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
          plan: 'enterprise'
        }
      },
      callbacks: {
        onLoaded: () => console.log('Widget loaded')
      }
    });
    // Automatically initializes!
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
```
