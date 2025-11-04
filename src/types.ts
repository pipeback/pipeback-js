export interface PipebackUserCompany {
  id: string;
  name: string;
  website?: string;
}

export interface PipebackUserAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

export interface PipebackUser {
  id: string;
  name: string;
  email: string;
  signature?: string;
  company?: PipebackUserCompany;
  attributes?: PipebackUserAttributes;
}

export interface PipebackCallbacks {
  onLoaded?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onShow?: () => void;
  onHide?: () => void;
}

export interface PipebackConfig {
  workspaceId: string;
  user?: PipebackUser;
  callbacks?: PipebackCallbacks;
  cdnUrl?: string;
  init?: boolean; // Auto-initialize on creation (default: true)
}

export type NavigateSection = 'home' | 'messages' | 'help' | 'news';
export type NavigateWithParam = 'newMessage' | 'helpArticle' | 'newsPost';

export interface PipebackInstance {
  init: () => Promise<void>;
  isReady: () => boolean;
  open: () => void;
  close: () => void;
  show: () => void;
  hide: () => void;
  navigate: (section: NavigateSection | NavigateWithParam, param?: string) => void;
}

declare global {
  interface Window {
    $pipeback?: any;
    PIPEBACK_ID?: string;
  }
}
