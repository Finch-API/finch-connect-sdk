import { 
  ConnectInitializeArgs, 
  ConnectLaunchArgs, 
  ConnectPreviewLaunchArgs,
  FinchConnectInterface,
  FinchConnectPostMessage 
} from './types';
import { constructAuthUrl, constructPreviewUrl } from './utils';

export const POST_MESSAGE_NAME = 'finch-auth-message-v2' as const;
export const BASE_FINCH_CONNECT_URI = 'https://connect.tryfinch.com';
export const FINCH_CONNECT_IFRAME_ID = 'finch-connect-iframe';

export const createAndAttachIFrame = ({
  src,
  zIndex = 999,
}: {
  src: string;
  zIndex?: number;
}): HTMLIFrameElement => {
  const existingIframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.frameBorder = '0';
  iframe.id = FINCH_CONNECT_IFRAME_ID;
  iframe.style.position = 'fixed';
  iframe.style.zIndex = zIndex.toString();
  iframe.style.height = '100%';
  iframe.style.width = '100%';
  iframe.style.top = '0';
  iframe.style.backgroundColor = 'none transparent';
  iframe.style.border = 'none';
  iframe.allow = 'clipboard-write; clipboard-read';
  
  document.body.prepend(iframe);
  document.body.style.overflow = 'hidden';
  
  return iframe;
};

export const removeIFrame = (): void => {
  const frameToRemove = document.getElementById(FINCH_CONNECT_IFRAME_ID);
  if (frameToRemove) {
    frameToRemove.remove();
    document.body.style.overflow = 'inherit';
  }
};

export const createMessageHandler = (
  callbacks: ConnectInitializeArgs,
  closeFn: () => void
) => {
  return (event: MessageEvent<any>) => {
    const typedEvent = event as FinchConnectPostMessage;
    
    if (!typedEvent.data) return;
    if (typedEvent.data.name !== POST_MESSAGE_NAME) return;
    
    const CONNECT_URL = callbacks.apiConfig?.connectUrl || BASE_FINCH_CONNECT_URI;
    if (!typedEvent.origin.startsWith(CONNECT_URL)) return;

    if (typedEvent.data.kind !== 'error') closeFn();

    switch (typedEvent.data.kind) {
      case 'closed':
        callbacks.onClose();
        break;
      case 'error':
        if (typedEvent.data.error?.shouldClose) closeFn();
        callbacks.onError({
          errorMessage: typedEvent.data.error?.message || 'Unknown error',
          errorType: typedEvent.data.error?.type,
        });
        break;
      case 'success':
        callbacks.onSuccess({
          code: typedEvent.data.code,
          state: typedEvent.data.state,
          idpRedirectUri: typedEvent.data.idpRedirectUri,
        });
        break;
      default:
        callbacks.onError({
          errorMessage: `Report to developers@tryfinch.com: unable to handle window.postMessage for: ${JSON.stringify(
            typedEvent.data
          )}`,
        });
    }
  };
};

export const createFinchConnectCore = (
  callbacks: ConnectInitializeArgs
): FinchConnectInterface => {
  const close = () => {
    removeIFrame();
  };

  const messageHandler = createMessageHandler(callbacks, close);

  const open = (args: ConnectLaunchArgs) => {
    const url = constructAuthUrl({
      sessionId: args.sessionId,
      state: args.state,
      apiConfig: callbacks.apiConfig,
    });
    
    createAndAttachIFrame({
      src: url,
      zIndex: args.zIndex,
    });
  };

  const openPreview = (args: ConnectPreviewLaunchArgs) => {
    const url = constructPreviewUrl({
      clientId: args.clientId,
      products: args.products,
      apiConfig: callbacks.apiConfig,
    });
    
    createAndAttachIFrame({
      src: url,
    });
  };

  const destroy = () => {
    close();
    window.removeEventListener('message', messageHandler);
  };

  window.addEventListener('message', messageHandler);

  return {
    open,
    openPreview,
    close,
    destroy,
  };
};