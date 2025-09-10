import { ApiConfig } from './types';

const appendBaseParams = (url: URL) => {
  url.searchParams.append('app_type', 'spa');
  url.searchParams.append('sdk_host_url', window.location.origin);
  url.searchParams.append('mode', 'employer');
  url.searchParams.append('sdk_version', 'SDK_VERSION');
};

export const constructAuthUrl = ({
  sessionId,
  state,
  apiConfig,
}: {
  sessionId: string;
  state?: string;
  apiConfig?: ApiConfig;
}): string => {
  const BASE_FINCH_CONNECT_URI = 'https://connect.tryfinch.com';
  const CONNECT_URL = apiConfig?.connectUrl || BASE_FINCH_CONNECT_URI;

  const authUrl = new URL(`${CONNECT_URL}/authorize`);
  authUrl.searchParams.append('session', sessionId);
  if (state) authUrl.searchParams.append('state', state);

  appendBaseParams(authUrl);
  return authUrl.href;
};

export const constructPreviewUrl = ({
  clientId,
  products,
  apiConfig,
}: {
  clientId: string;
  products: string[];
  apiConfig?: ApiConfig;
}): string => {
  const BASE_FINCH_CONNECT_URI = 'https://connect.tryfinch.com';
  const CONNECT_URL = apiConfig?.connectUrl || BASE_FINCH_CONNECT_URI;

  const previewUrl = new URL(`${CONNECT_URL}/authorize`);
  previewUrl.searchParams.append('preview', 'true');
  previewUrl.searchParams.append('client_id', clientId);
  previewUrl.searchParams.append('products', products.join(' '));
  previewUrl.searchParams.append('redirect_uri', 'https://www.tryfinch.com');

  appendBaseParams(previewUrl);
  return previewUrl.href;
};
