import type {
  PipebackConfig,
  PipebackUser,
  PipebackInstance,
  PipebackCallbacks,
  PipebackUserCompany,
  PipebackUserAttributes
} from './types';

export type {
  PipebackConfig,
  PipebackUser,
  PipebackInstance,
  PipebackCallbacks,
  PipebackUserCompany,
  PipebackUserAttributes
};

class Pipeback implements PipebackInstance {
  private config: PipebackConfig;
  private scriptLoaded: boolean = false;
  private initialized: boolean = false;
  private scriptElement: HTMLScriptElement | null = null;

  constructor(config: PipebackConfig) {
    if (!config.workspaceId) {
      throw new Error('workspaceId is required');
    }

    this.config = {
      cdnUrl: 'https://widget.pipeback.com/l.js',
      autoHide: false,
      ...config
    };
  }

  /**
   * Initialize Pipeback widget
   */
  public async init(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Pipeback can only be initialized in a browser environment');
    }

    if (this.initialized) {
      return;
    }

    // Set workspace ID
    window.PIPEBACK_ID = this.config.workspaceId;

    // Prepare configuration object
    const pipebackConfig: any = {};

    // Add callbacks if provided
    if (this.config.callbacks) {
      pipebackConfig.callbacks = { ...this.config.callbacks };
    }

    // Add auto-hide functionality if enabled
    if (this.config.autoHide) {
      if (!pipebackConfig.callbacks) {
        pipebackConfig.callbacks = {};
      }

      const originalOnLoaded = pipebackConfig.callbacks.onLoaded;
      pipebackConfig.callbacks.onLoaded = () => {
        if (originalOnLoaded) {
          originalOnLoaded();
        }
        setTimeout(() => this.hide(), 100);
      };
    }

    // Add user data if provided
    if (this.config.user) {
      pipebackConfig.user = { ...this.config.user };
    }

    // Set configuration object BEFORE loading script
    window.$pipeback = pipebackConfig;

    // Load script
    await this.loadScript();
    this.initialized = true;
  }

  /**
   * Load Pipeback widget script from CDN
   */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.config.cdnUrl!;
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptElement = script;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Pipeback widget script'));
      };

      const head = document.getElementsByTagName('head')[0];
      if (head) {
        head.appendChild(script);
      } else {
        reject(new Error('Document head not found'));
      }
    });
  }

  /**
   * Check if widget is ready
   */
  public isReady(): boolean {
    return this.initialized &&
           typeof window !== 'undefined' &&
           window.$pipeback &&
           typeof window.$pipeback.open === 'function';
  }

  /**
   * Open the widget
   */
  public open(): void {
    if (this.isReady()) {
      window.$pipeback.open();
    } else {
      console.warn('Pipeback widget is not ready yet. Call init() first.');
    }
  }

  /**
   * Close the widget
   */
  public close(): void {
    if (this.isReady()) {
      window.$pipeback.close();
    }
  }

  /**
   * Show the widget
   */
  public show(): void {
    if (this.isReady()) {
      window.$pipeback.show();
    }
  }

  /**
   * Hide the widget
   */
  public hide(): void {
    if (this.isReady()) {
      window.$pipeback.hide();
    }
  }

  /**
   * Update user information
   */
  public update(data: { user: PipebackUser }): void {
    this.config.user = data.user;

    if (this.isReady() && typeof window.$pipeback.update === 'function') {
      window.$pipeback.update(data);
    } else if (window.$pipeback) {
      // If update method doesn't exist, update the user object directly
      window.$pipeback.user = data.user;
    }
  }

  /**
   * Shutdown and cleanup
   */
  public shutdown(): void {
    if (typeof window !== 'undefined') {
      if (this.isReady()) {
        this.hide();
      }

      // Remove script element
      if (this.scriptElement && this.scriptElement.parentNode) {
        this.scriptElement.parentNode.removeChild(this.scriptElement);
        this.scriptElement = null;
      }

      delete window.$pipeback;
      delete window.PIPEBACK_ID;
    }

    this.initialized = false;
    this.scriptLoaded = false;
  }
}

/**
 * Create and initialize a new Pipeback instance
 *
 * @example
 * ```typescript
 * const pipeback = createPipeback({
 *   workspaceId: 'your-workspace-id',
 *   user: {
 *     id: 'user-123',
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     company: {
 *       id: 'company-123',
 *       name: 'Acme Inc',
 *       website: 'acme.com'
 *     },
 *     attributes: {
 *       plan: 'pro',
 *       monthly_spend: 5000
 *     }
 *   },
 *   callbacks: {
 *     onLoaded: () => console.log('Widget loaded'),
 *     onOpen: () => console.log('Widget opened')
 *   },
 *   autoHide: true
 * });
 *
 * await pipeback.init();
 * pipeback.open();
 * ```
 */
export function createPipeback(config: PipebackConfig): Pipeback {
  return new Pipeback(config);
}

export default Pipeback;
