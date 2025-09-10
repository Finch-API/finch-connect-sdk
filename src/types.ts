export type SuccessEvent = {
  code: string;
  state?: string;
  idpRedirectUri?: string;
};

export type ErrorType = 'validation_error' | 'employer_connection_error';

export type ErrorEvent = {
  errorMessage: string;
  errorType?: ErrorType;
};

export type ApiConfig = {
  connectUrl: string;
};

export type ConnectInitializeArgs = {
  onSuccess: (e: SuccessEvent) => void;
  onError: (e: ErrorEvent) => void;
  onClose: () => void;
  apiConfig?: ApiConfig;
};

export type ConnectLaunchArgs = {
  sessionId: string;
  state?: string;
  zIndex?: number;
};

export type ConnectPreviewLaunchArgs = {
  clientId: string;
  products: string[];
};

export type OpenFn = (args: ConnectLaunchArgs) => void;
export type OpenPreviewFn = (args: ConnectPreviewLaunchArgs) => void;

export type FinchConnectInterface = {
  open: OpenFn;
  openPreview: OpenPreviewFn;
  close: () => void;
  destroy: () => void;
};

export type FinchConnectAuthMessage = {
  name: 'finch-auth-message-v2';
} & (
  | {
      kind: 'closed';
    }
  | {
      kind: 'success';
      code: string;
      state?: string;
      idpRedirectUri?: string;
    }
  | {
      kind: 'error';
      error: { shouldClose: boolean; message: string; type?: ErrorType };
    }
);

export interface FinchConnectPostMessage {
  data: FinchConnectAuthMessage;
  origin: string;
}
