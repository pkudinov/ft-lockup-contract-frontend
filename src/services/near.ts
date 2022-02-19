import * as nearAPI from 'near-api-js';
import { createContext } from 'react';
import { config, INearConfig } from '../config';
import NearApi from './api';

export interface INearProps {
  connected: boolean;
  config: INearConfig;
  api: NearApi;
  signedIn: boolean;
  signedAccountId: string | null;
}

export const NearContext = createContext<any>(null);

export const connectNear = async (): Promise<INearProps> => {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
  const near = await nearAPI.connect({ headers: {}, keyStore, ...config });
  const walletConnection = new nearAPI.WalletConnection(near, config.contractName);
  const api = new NearApi(near);
  const signedAccountId = walletConnection.getAccountId();

  return {
    connected: true,
    config,
    api,
    signedIn: !!signedAccountId,
    signedAccountId,
  };
};
