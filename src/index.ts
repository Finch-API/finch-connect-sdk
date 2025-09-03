import { ConnectInitializeArgs, ConnectLaunchArgs, ConnectPreviewLaunchArgs, FinchConnectInterface } from './types';
import { createFinchConnectCore } from './core';

export * from './types';

let isInitialized = false;

export default class FinchConnect implements FinchConnectInterface {
  private core: FinchConnectInterface;

  private constructor(args: ConnectInitializeArgs) {
    if (isInitialized) {
      console.error(
        'FinchConnect.initialize has already been called. Please ensure to only call FinchConnect.initialize once to avoid your event callbacks being triggered multiple times.'
      );
    } else {
      isInitialized = true;
    }

    this.core = createFinchConnectCore(args);
  }

  static initialize(args: ConnectInitializeArgs): FinchConnect {
    return new FinchConnect(args);
  }

  open = (args: ConnectLaunchArgs) => {
    this.core.open(args);
  };

  openPreview = (args: ConnectPreviewLaunchArgs) => {
    this.core.openPreview(args);
  };

  close = () => {
    this.core.close();
  };

  destroy = () => {
    this.core.destroy();
    isInitialized = false;
  };
}

export { FinchConnect };