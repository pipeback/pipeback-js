# @pipeback/pipeback-js

Official Pipeback JavaScript SDK - Works with React, Vue, Angular, Svelte, Next.js, Nuxt, and vanilla JavaScript.

## Installation

```bash
npm install @pipeback/pipeback-js
# or
yarn add @pipeback/pipeback-js
# or
pnpm add @pipeback/pipeback-js
```

## Quick Start

### Auto-initialization (default)

```javascript
import { createPipeback } from '@pipeback/pipeback-js';

const pipeback = createPipeback({
  workspaceId: 'YOUR_PIPEBACK_WORKSPACE_ID',
  init: true, // Optional: default is true
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
  }
});
// Automatically initializes!

// Control the widget
pipeback.open();
pipeback.close();
pipeback.show();
pipeback.hide();
```

### Manual initialization

```javascript
import { createPipeback } from '@pipeback/pipeback-js';

const pipeback = createPipeback({
  workspaceId: 'YOUR_PIPEBACK_WORKSPACE_ID',
  init: false, // Disable auto-initialization
  user: {
    id: '9f7618a2',
    name: 'Paulo Castellano',
    email: 'paulo@pipeback.com'
  }
});

// Initialize manually when ready
await pipeback.init();

// Now you can control the widget
pipeback.open();
```

## Framework Examples

For framework-specific integration examples, see the [`examples/`](./examples/) directory:

- [Vanilla JavaScript](./examples/vanilla.md)
- [React](./examples/react.md)
- [Next.js](./examples/nextjs.md)
- [Vue 3](./examples/vue.md)
- [Nuxt 3](./examples/nuxt.md)
- [Angular](./examples/angular.md)
- [Svelte](./examples/svelte.md)

## API Reference

### Configuration Options

```typescript
interface PipebackConfig {
  workspaceId: string;           // Required: Your Pipeback workspace ID
  init?: boolean;                // Optional: Auto-initialize on creation (default: true)
  user?: PipebackUser;           // Optional: User information
  callbacks?: PipebackCallbacks; // Optional: Event callbacks
  cdnUrl?: string;               // Optional: Custom CDN URL (default: https://widget.pipeback.com/l.js)
}

interface PipebackUser {
  id: string;                    // Required: User ID
  name: string;                  // Required: User name
  email: string;                 // Required: User email
  signature?: string;            // Optional: User verification hash (HMAC-SHA256)
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
Initialize and load the Pipeback widget. By default, this is called automatically when you create the instance. You only need to call this manually if you set `init: false` in the config.

```typescript
// Auto-initialization (default)
const pipeback = createPipeback({ workspaceId: 'xxx' });
// Widget is ready to use!

// Manual initialization (opt-in)
const pipeback = createPipeback({
  workspaceId: 'xxx',
  init: false
});
await pipeback.init();
```

#### `isReady(): boolean`
Check if the widget is ready to use.

```typescript
if (pipeback.isReady()) {
  pipeback.open();
}
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

#### `navigate(section: string, param?: string): void`
Navigate to a specific section of the messenger.

**Available sections:**
- `'home'` - Navigate to home
- `'messages'` - Navigate to messages
- `'help'` - Navigate to help center
- `'news'` - Navigate to product updates
- `'newMessage'` - Start a new conversation (optional: prefill text)
- `'helpArticle'` - Open help article (requires article UUID)
- `'newsPost'` - Open news post (requires post UUID)

```typescript
// Navigate to home
pipeback.navigate('home');

// Navigate to messages
pipeback.navigate('messages');

// Navigate to help center
pipeback.navigate('help');

// Navigate to product updates
pipeback.navigate('news');

// Start new message with prefilled text
pipeback.navigate('newMessage', 'I need help with billing');

// Open specific help article
pipeback.navigate('helpArticle', 'article-uuid');

// Open specific news post
pipeback.navigate('newsPost', 'post-uuid');
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
```

## License

MIT

## Support

- Documentation: https://docs.pipeback.com
- Email: support@pipeback.com
- Website: https://pipeback.com
