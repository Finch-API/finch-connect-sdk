import { useEffect, useRef } from 'react';
import { ConnectInitializeArgs, OpenFn, OpenPreviewFn } from './types';
import { createFinchConnectCore } from './core';

export * from './types';

let isUseFinchConnectInitialized = false;

export const useFinchConnect = (
  initializeArgs: ConnectInitializeArgs
): { open: OpenFn; openPreview: OpenPreviewFn } => {
  const isHookMounted = useRef(false);
  const coreRef = useRef<ReturnType<typeof createFinchConnectCore> | null>(
    null
  );
  // The core is created once, so it calls the callbacks through this ref to
  // always reach the ones passed on the latest render, not the first.
  const argsRef = useRef(initializeArgs);
  useEffect(() => {
    argsRef.current = initializeArgs;
  });

  useEffect(() => {
    if (!isHookMounted.current) {
      if (isUseFinchConnectInitialized) {
        console.error(
          'One useFinchConnect hook has already been registered. Please ensure to only call useFinchConnect once to avoid your event callbacks getting called more than once. You can pass in override options to the open function if you so require.'
        );
      } else {
        isUseFinchConnectInitialized = true;
      }

      isHookMounted.current = true;
      coreRef.current = createFinchConnectCore({
        onSuccess: (e) => argsRef.current.onSuccess(e),
        onError: (e) => argsRef.current.onError(e),
        onClose: () => argsRef.current.onClose(),
        apiConfig: initializeArgs.apiConfig,
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (coreRef.current) {
        coreRef.current.destroy();
      }
      isUseFinchConnectInitialized = false;
      isHookMounted.current = false;
    };
  }, []);

  const open: OpenFn = (launchArgs) => {
    if (coreRef.current) {
      coreRef.current.open(launchArgs);
    }
  };

  const openPreview: OpenPreviewFn = (launchArgs) => {
    if (coreRef.current) {
      coreRef.current.openPreview(launchArgs);
    }
  };

  return {
    open,
    openPreview,
  };
};
