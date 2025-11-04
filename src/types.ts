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
  autoHide?: boolean;
  cdnUrl?: string;
}

export interface PipebackWidgetApi {
  open: () => void;
  close: () => void;
  show: () => void;
  hide: () => void;
  update: (data: { user: PipebackUser }) => void;
  shutdown: () => void;
}

export interface PipebackInstance extends PipebackWidgetApi {
  init: () => Promise<void>;
  isReady: () => boolean;
}

declare global {
  interface Window {
    $pipeback?: any;
    PIPEBACK_ID?: string;
  }
}
