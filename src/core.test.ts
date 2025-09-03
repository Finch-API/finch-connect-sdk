import { createFinchConnectCore, POST_MESSAGE_NAME, FINCH_CONNECT_IFRAME_ID } from './core';
import { ConnectInitializeArgs } from './types';

describe('FinchConnectCore', () => {
  let mockCallbacks: ConnectInitializeArgs;

  beforeEach(() => {
    mockCallbacks = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    document.body.innerHTML = '';
    document.body.style.overflow = 'inherit';
  });

  afterEach(() => {
    const iframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
    if (iframe) {
      iframe.remove();
    }
  });

  it('should create core instance with callbacks', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    expect(core).toHaveProperty('open');
    expect(core).toHaveProperty('openPreview');
    expect(core).toHaveProperty('close');
    expect(core).toHaveProperty('destroy');
  });

  it('should create iframe when opening', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    core.open({ sessionId: 'test-session' });
    
    const iframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toContain('session=test-session');
  });

  it('should create iframe when opening preview', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    core.openPreview({ clientId: 'test-client', products: ['directory'] });
    
    const iframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toContain('client_id=test-client');
    expect(iframe?.getAttribute('src')).toContain('products=directory');
  });

  it('should remove iframe when closing', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    core.open({ sessionId: 'test-session' });
    let iframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
    expect(iframe).toBeTruthy();
    
    core.close();
    iframe = document.getElementById(FINCH_CONNECT_IFRAME_ID);
    expect(iframe).toBeFalsy();
  });

  it('should handle success message', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    const messageEvent = new MessageEvent('message', {
      data: {
        name: POST_MESSAGE_NAME,
        kind: 'success',
        code: 'test-code',
        state: 'test-state',
      },
      origin: 'https://connect.tryfinch.com',
    });

    window.dispatchEvent(messageEvent);
    
    expect(mockCallbacks.onSuccess).toHaveBeenCalledWith({
      code: 'test-code',
      state: 'test-state',
      idpRedirectUri: undefined,
    });
  });

  it('should handle error message', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    const messageEvent = new MessageEvent('message', {
      data: {
        name: POST_MESSAGE_NAME,
        kind: 'error',
        error: {
          shouldClose: true,
          message: 'Test error',
          type: 'validation_error',
        },
      },
      origin: 'https://connect.tryfinch.com',
    });

    window.dispatchEvent(messageEvent);
    
    expect(mockCallbacks.onError).toHaveBeenCalledWith({
      errorMessage: 'Test error',
      errorType: 'validation_error',
    });
  });

  it('should handle close message', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    const messageEvent = new MessageEvent('message', {
      data: {
        name: POST_MESSAGE_NAME,
        kind: 'closed',
      },
      origin: 'https://connect.tryfinch.com',
    });

    window.dispatchEvent(messageEvent);
    
    expect(mockCallbacks.onClose).toHaveBeenCalled();
  });

  it('should ignore messages from wrong origin', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    const messageEvent = new MessageEvent('message', {
      data: {
        name: POST_MESSAGE_NAME,
        kind: 'success',
        code: 'test-code',
      },
      origin: 'https://malicious-site.com',
    });

    window.dispatchEvent(messageEvent);
    
    expect(mockCallbacks.onSuccess).not.toHaveBeenCalled();
  });

  it('should ignore messages with wrong name', () => {
    const core = createFinchConnectCore(mockCallbacks);
    
    const messageEvent = new MessageEvent('message', {
      data: {
        name: 'wrong-message-name',
        kind: 'success',
        code: 'test-code',
      },
      origin: 'https://connect.tryfinch.com',
    });

    window.dispatchEvent(messageEvent);
    
    expect(mockCallbacks.onSuccess).not.toHaveBeenCalled();
  });
});