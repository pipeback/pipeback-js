import type {
  PipebackConfig,
  PipebackInstance
} from './types';

export type {
  PipebackConfig,
  PipebackInstance
};

class PipebackClass implements PipebackInstance {
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
      init: true, // Default to auto-init
      ...config
    };

    // Auto-initialize if init is not explicitly set to false
    if (this.config.init !== false) {
      this.init();
    }
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
      if (this.scriptLoaded && this.scriptElement) {
        resolve();
        return;
      }

      // Remove any existing script with the same src
      const existingScripts = document.querySelectorAll(`script[src="${this.config.cdnUrl}"]`);
      existingScripts.forEach(s => s.remove());

      const script = document.createElement('script');
      script.src = `${this.config.cdnUrl}?t=${Date.now()}`; // Cache buster
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
   * Navigate to a specific section of the messenger
   * @param section - The section to navigate to
   * @param param - Optional parameter (for newMessage, helpArticle, newsPost)
   */
  public navigate(section: string, param?: string): void {
    if (this.isReady()) {
      window.$pipeback.navigate(section, param);
    } else {
      console.warn('Pipeback widget is not ready yet. Call init() first.');
    }
  }

}

/**
 * Create and initialize a new Pipeback instance
 *
 * @example
 * Auto-initialize (default):
 * ```typescript
 * import Pipeback from '@pipeback/pipeback-js';
 * // or
 * import { Pipeback } from '@pipeback/pipeback-js';
 *
 * const pipeback = Pipeback({
 *   workspaceId: 'your-workspace-id',
 *   user: {
 *     id: 'user-123',
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   }
 * });
 * // Widget automatically initializes
 * pipeback.open();
 * ```
 *
 * Manual initialization:
 * ```typescript
 * const pipeback = Pipeback({
 *   workspaceId: 'your-workspace-id',
 *   init: false,
 *   user: {
 *     id: 'user-123',
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   }
 * });
 *
 * // Later, when ready:
 * await pipeback.init();
 * pipeback.open();
 * ```
 */
function Pipeback(config: PipebackConfig): PipebackInstance {
  return new PipebackClass(config);
}

// Export as both default and named export
export default Pipeback;
export { Pipeback };

