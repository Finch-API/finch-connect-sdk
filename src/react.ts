import { useEffect, useRef } from 'react';
import { ConnectInitializeArgs, OpenFn, OpenPreviewFn } from './types';
import { createFinchConnectCore } from './core';

export * from './types';

let isUseFinchConnectInitialized = false;

export const useFinchConnect = (
  initializeArgs: ConnectInitializeArgs
): { open: OpenFn; openPreview: OpenPreviewFn } => {
  const isHookMounted = useRef(false);
  const coreRef = useRef<ReturnType<typeof createFinchConnectCore> | null>(null);

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
      coreRef.current = createFinchConnectCore(initializeArgs);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (coreRef.current) {
        coreRef.current.destroy();
      }
      isUseFinchConnectInitialized = false;
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