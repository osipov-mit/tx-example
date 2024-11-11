import { defineStore } from 'pinia';
import { BrowserProvider, ethers } from 'ethers';

export const useWallet = defineStore('wallet', () => {
  async function getSigner() {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    console.log('Connected accounts:', accounts);
    const signer = await provider.getSigner();
    console.log('Signer address:', signer);

    return signer;
  }

  return { getSigner };
});
