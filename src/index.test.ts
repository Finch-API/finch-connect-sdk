import FinchConnect from './index';
import { ConnectInitializeArgs } from './types';

describe('FinchConnect', () => {
  let mockCallbacks: ConnectInitializeArgs;

  beforeEach(() => {
    mockCallbacks = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      onClose: jest.fn(),
    };

    document.body.innerHTML = '';
    document.body.style.overflow = 'inherit';

    // Reset the initialization state
    jest.resetModules();
  });

  afterEach(() => {
    const iframe = document.getElementById('finch-connect-iframe');
    if (iframe) {
      iframe.remove();
    }
  });

  it('should create instance via initialize method', () => {
    const finchConnect = FinchConnect.initialize(mockCallbacks);

    expect(finchConnect).toBeInstanceOf(FinchConnect);
    expect(finchConnect.open).toBeDefined();
    expect(finchConnect.openPreview).toBeDefined();
    expect(finchConnect.close).toBeDefined();
    expect(finchConnect.destroy).toBeDefined();
  });

  it('should warn when initializing multiple times', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    FinchConnect.initialize(mockCallbacks);
    FinchConnect.initialize(mockCallbacks);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('FinchConnect.initialize has already been called')
    );

    consoleSpy.mockRestore();
  });

  it('should open with session ID', () => {
    const finchConnect = FinchConnect.initialize(mockCallbacks);

    finchConnect.open({ sessionId: 'test-session' });

    const iframe = document.getElementById('finch-connect-iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toContain('session=test-session');
  });

  it('should open preview with client ID and products', () => {
    const finchConnect = FinchConnect.initialize(mockCallbacks);

    finchConnect.openPreview({
      clientId: 'test-client',
      products: ['directory', 'individual'],
    });

    const iframe = document.getElementById('finch-connect-iframe');
    expect(iframe).toBeTruthy();
    expect(iframe?.getAttribute('src')).toContain('client_id=test-client');
    expect(iframe?.getAttribute('src')).toContain(
      'products=directory+individual'
    );
  });

  it('should close iframe', () => {
    const finchConnect = FinchConnect.initialize(mockCallbacks);

    finchConnect.open({ sessionId: 'test-session' });
    let iframe = document.getElementById('finch-connect-iframe');
    expect(iframe).toBeTruthy();

    finchConnect.close();
    iframe = document.getElementById('finch-connect-iframe');
    expect(iframe).toBeFalsy();
  });

  it('should destroy and cleanup event listeners', () => {
    const finchConnect = FinchConnect.initialize(mockCallbacks);

    finchConnect.open({ sessionId: 'test-session' });
    finchConnect.destroy();

    const iframe = document.getElementById('finch-connect-iframe');
    expect(iframe).toBeFalsy();
  });

  it('should support custom API config', () => {
    const customCallbacks = {
      ...mockCallbacks,
      apiConfig: {
        connectUrl: 'https://custom.example.com',
      },
    };

    const finchConnect = FinchConnect.initialize(customCallbacks);
    finchConnect.open({ sessionId: 'test-session' });

    const iframe = document.getElementById('finch-connect-iframe');
    expect(iframe?.getAttribute('src')).toContain('custom.example.com');
  });
});
