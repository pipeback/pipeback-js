# Next.js

## App Router (Next.js 13+)

Create a client component:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Pipeback from '@pipeback/pipeback-js';

export default function PipebackWidget() {
  const pipebackRef = useRef(null);

  useEffect(() => {
    pipebackRef.current = Pipeback({
      workspaceId: process.env.NEXT_PUBLIC_PIPEBACK_WORKSPACE_ID,
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

## Pages Router (Next.js 12 and below)

```tsx
import { useEffect, useRef } from 'react';
import Pipeback from '@pipeback/pipeback-js';

export default function Home() {
  const pipebackRef = useRef(null);

  useEffect(() => {
    pipebackRef.current = Pipeback({
      workspaceId: process.env.NEXT_PUBLIC_PIPEBACK_WORKSPACE_ID,
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
      }
    });
    // Automatically initializes!
  }, []);

  return (
    <button onClick={() => pipebackRef.current?.open()}>
      Contact Support
    </button>
  );
}
```

Add to `.env.local`:

```env
NEXT_PUBLIC_PIPEBACK_WORKSPACE_ID=your-workspace-id
```
