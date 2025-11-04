import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Pipeback from '../src/index';
import type { PipebackConfig } from '../src/types';

describe('Pipeback SDK', () => {
  beforeEach(() => {
    // Clear any previous instances
    delete (window as any).$pipeback;
    delete (window as any).PIPEBACK_ID;

    // Clear scripts
    document.querySelectorAll('script[src*="pipeback"]').forEach(el => el.remove());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Pipeback', () => {
    it('should create a Pipeback instance', () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      expect(pipeback).toBeDefined();
      expect(pipeback.init).toBeDefined();
      expect(pipeback.open).toBeDefined();
      expect(pipeback.close).toBeDefined();
      expect(pipeback.show).toBeDefined();
      expect(pipeback.hide).toBeDefined();
      expect(pipeback.isReady).toBeDefined();
    });

    it('should throw error if workspaceId is missing', () => {
      expect(() => {
        Pipeback({} as PipebackConfig);
      }).toThrow('workspaceId is required');
    });
  });

  describe('init', () => {
    it('should set PIPEBACK_ID on window', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace-123'
      });

      // Mock script loading
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();

      expect(window.PIPEBACK_ID).toBe('test-workspace-123');
    });

    it('should set user data on window.$pipeback', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace',
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

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();

      expect((window as any).$pipeback).toBeDefined();
      expect((window as any).$pipeback.user).toEqual({
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
      });
    });

    it('should set callbacks on window.$pipeback', async () => {
      const onLoaded = vi.fn();
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const onShow = vi.fn();
      const onHide = vi.fn();

      const pipeback = Pipeback({
        workspaceId: 'test-workspace',
        callbacks: {
          onLoaded,
          onOpen,
          onClose,
          onShow,
          onHide
        }
      });

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();

      expect((window as any).$pipeback.callbacks).toBeDefined();
      expect((window as any).$pipeback.callbacks.onLoaded).toBeDefined();
      expect((window as any).$pipeback.callbacks.onOpen).toBeDefined();
      expect((window as any).$pipeback.callbacks.onClose).toBeDefined();
      expect((window as any).$pipeback.callbacks.onShow).toBeDefined();
      expect((window as any).$pipeback.callbacks.onHide).toBeDefined();
    });

    it('should only initialize once', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const createElementSpy = vi.spyOn(document, 'createElement');

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      const firstCallCount = createElementSpy.mock.calls.filter(call => call[0] === 'script').length;

      await pipeback.init();
      const secondCallCount = createElementSpy.mock.calls.filter(call => call[0] === 'script').length;

      expect(firstCallCount).toBe(secondCallCount);
    });

    it('should load script from CDN', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();

      expect(appendChildSpy).toHaveBeenCalled();
      const scriptElement = appendChildSpy.mock.calls[0][0] as HTMLScriptElement;
      expect(scriptElement.src).toContain('widget.pipeback.com/l.js');
    });
  });

  describe('isReady', () => {
    it('should return false before initialization', () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      expect(pipeback.isReady()).toBe(false);
    });

    it('should return true after widget is loaded', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            // Simulate widget loading and adding methods AFTER onload
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.close = vi.fn();
            (window as any).$pipeback.show = vi.fn();
            (window as any).$pipeback.hide = vi.fn();
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      // Wait for next tick to ensure methods are added
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(pipeback.isReady()).toBe(true);
    });
  });

  describe('Widget methods', () => {
    it('should call window.$pipeback.open when open is called', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockOpen = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = mockOpen;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.open();

      expect(mockOpen).toHaveBeenCalled();
    });

    it('should call window.$pipeback.close when close is called', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockClose = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.close = mockClose;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.close();

      expect(mockClose).toHaveBeenCalled();
    });

    it('should call window.$pipeback.show when show is called', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockShow = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.show = mockShow;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.show();

      expect(mockShow).toHaveBeenCalled();
    });

    it('should call window.$pipeback.hide when hide is called', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockHide = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.hide = mockHide;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.hide();

      expect(mockHide).toHaveBeenCalled();
    });

    it('should warn when calling methods before ready', () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const consoleSpy = vi.spyOn(console, 'warn');
      pipeback.open();

      expect(consoleSpy).toHaveBeenCalledWith('Pipeback widget is not ready yet. Call init() first.');
    });
  });

  describe('navigate method', () => {
    it('should call window.$pipeback.navigate with section only', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockNavigate = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.navigate = mockNavigate;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.navigate('home');

      expect(mockNavigate).toHaveBeenCalledWith('home', undefined);
    });

    it('should call window.$pipeback.navigate with section and param', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockNavigate = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.navigate = mockNavigate;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.navigate('newMessage', 'Hello, I need help!');

      expect(mockNavigate).toHaveBeenCalledWith('newMessage', 'Hello, I need help!');
    });

    it('should navigate to helpArticle with article ID', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockNavigate = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.navigate = mockNavigate;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.navigate('helpArticle', 'article-uuid-123');

      expect(mockNavigate).toHaveBeenCalledWith('helpArticle', 'article-uuid-123');
    });

    it('should navigate to newsPost with post ID', async () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const mockNavigate = vi.fn();

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
            (window as any).$pipeback.open = vi.fn();
            (window as any).$pipeback.navigate = mockNavigate;
          }, 0);
        }
        return element;
      });

      await pipeback.init();
      await new Promise(resolve => setTimeout(resolve, 10));
      pipeback.navigate('newsPost', 'post-uuid-456');

      expect(mockNavigate).toHaveBeenCalledWith('newsPost', 'post-uuid-456');
    });

    it('should warn when calling navigate before ready', () => {
      const pipeback = Pipeback({
        workspaceId: 'test-workspace'
      });

      const consoleSpy = vi.spyOn(console, 'warn');
      pipeback.navigate('home');

      expect(consoleSpy).toHaveBeenCalledWith('Pipeback widget is not ready yet. Call init() first.');
    });
  });

  describe('Custom CDN URL', () => {
    it('should use custom CDN URL if provided', async () => {
      const customCdn = 'https://custom-cdn.example.com/widget.js';
      const pipeback = Pipeback({
        workspaceId: 'test-workspace',
        cdnUrl: customCdn
      });

      const appendChildSpy = vi.spyOn(document.head, 'appendChild');

      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement.call(document, tagName);
        if (tagName === 'script') {
          setTimeout(() => {
            if (element.onload) {
              element.onload(new Event('load'));
            }
          }, 0);
        }
        return element;
      });

      await pipeback.init();

      const scriptElement = appendChildSpy.mock.calls[0][0] as HTMLScriptElement;
      expect(scriptElement.src).toContain(customCdn);
    });
  });
});
