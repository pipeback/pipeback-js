# Angular

```typescript
import { Component, OnInit } from '@angular/core';
import { createPipeback, PipebackInstance } from '@pipeback/pipeback-js';

@Component({
  selector: 'app-root',
  template: '<button (click)="openWidget()">Contact Support</button>'
})
export class AppComponent implements OnInit {
  private pipeback: PipebackInstance | null = null;

  ngOnInit() {
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
      }
    });
    // Automatically initializes!
  }

  openWidget() {
    this.pipeback?.open();
  }
}
```
