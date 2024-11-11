import { defineStore } from 'pinia';
import { ethers } from 'ethers';

export const useProvider = defineStore('exe', () => {
  let provider = null;
  const ethUrl = 'https://ethereum-holesky-rpc.publicnode.com';
  const gearexeUrl = 'http://127.0.0.1:9999';

  /** @returns {ethers.JsonRpcProvider} */
  function getProvider() {
    if (!provider) {
      provider = new ethers.JsonRpcProvider(ethUrl);
    }

    return provider;
  }

  const getGearexeProvider = () => {
    return {
      send: async (method, params) => {
        const response = await fetch(gearexeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method,
            params,
            id: 1,
          }),
        });

        const json = await response.json();

        if (json.error) {
          throw new Error(json.error.message);
        }

        return json.result;
      },
    };
  };

  return { getProvider, getGearexeProvider };
});
