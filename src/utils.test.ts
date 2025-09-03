import { constructAuthUrl, constructPreviewUrl } from './utils';

const NOOP_CALLBACKS = {
  onSuccess: jest.fn(),
  onError: jest.fn(),
  onClose: jest.fn(),
};

describe('utils', () => {
  describe('constructAuthUrl', () => {
    it('adds the session parameter', () => {
      const authUrl = constructAuthUrl({
        sessionId: 'test-session-id',
      });
      expect(authUrl).toContain('session=test-session-id');
    });

    it('adds all the expected base parameters to the auth URL', () => {
      const expectedParameters = {
        app_type: 'spa',
        sdk_host_url: encodeURIComponent('http://localhost'),
        mode: 'employer',
        sdk_version: 'SDK_VERSION',
      };

      const authUrl = constructAuthUrl({
        sessionId: 'test-session-id',
      });

      Object.entries(expectedParameters).forEach(([key, value]) => {
        expect(authUrl).toContain(`${key}=${value}`);
      });
    });

    it('adds the state parameter if it is provided', () => {
      const testOptions = {
        sessionId: 'test-session-id',
        state: 'test-state',
        ...NOOP_CALLBACKS,
      };
      const authUrl = constructAuthUrl(testOptions);

      expect(authUrl).toContain('state=test-state');
    });

    it('uses the provided connectUrl if provided', () => {
      const authUrl = constructAuthUrl({
        sessionId: '123',
        apiConfig: {
          connectUrl: 'https://cool.site',
        },
        ...NOOP_CALLBACKS,
      });
      expect(authUrl.startsWith('https://cool.site/authorize?')).toBe(true);
    });
  });

  describe('constructPreviewUrl', () => {
    it('sets the preview parameter to true', () => {
      const previewUrl = constructPreviewUrl({
        clientId: 'test-client-id',
        products: ['test-product'],
      });

      expect(previewUrl).toContain('preview=true');
    });

    it('sets the client ID parameter', () => {
      const previewUrl = constructPreviewUrl({
        clientId: 'test-client-id',
        products: ['test-product'],
      });

      expect(previewUrl).toContain('client_id=test-client-id');
    });

    it('sets the products parameter', () => {
      const previewUrl = constructPreviewUrl({
        clientId: 'test-client-id',
        products: ['test-product', 'test-product-2'],
      });

      expect(previewUrl).toContain('products=test-product+test-product-2');
    });

    it('sets a default redirect URI', () => {
      const expectedRedirectUri = encodeURIComponent(
        'https://www.tryfinch.com'
      );
      const previewUrl = constructPreviewUrl({
        clientId: 'test-client-id',
        products: ['test-product'],
      });

      expect(previewUrl).toContain(`redirect_uri=${expectedRedirectUri}`);
    });

    it('adds all the expected base parameters to the auth URL', () => {
      const expectedParameters = {
        app_type: 'spa',
        sdk_host_url: encodeURIComponent('http://localhost'),
        mode: 'employer',
        sdk_version: 'SDK_VERSION',
      };

      const authUrl = constructPreviewUrl({
        clientId: 'test-client-id',
        products: ['test-product'],
      });

      Object.entries(expectedParameters).forEach(([key, value]) => {
        expect(authUrl).toContain(`${key}=${value}`);
      });
    });
  });
});
