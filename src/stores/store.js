import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Contract } from 'ethers';

export const useMirror = defineStore('mirror', () => {
  let _addr = ref('');
  let _abi = ref([]);

  return {
    setMirror: (addr, abi) => {
      _addr.value = addr;
      _abi.value = abi;
    },
    getMirror: (provider) => {
      return new Contract(_addr.value, _abi.value, provider);
    },
    getAddr: () => _addr.value,
  };
});

export const useDecoder = defineStore('decoder', () => {
  let _addr = ref('');
  let _abi = ref([]);

  return {
    setDecoder: (addr, abi) => {
      _addr.value = addr;
      _abi.value = abi;
    },
    getDecoder: (provider) => {
      return new Contract(_addr.value, _abi.value, provider);
    },
    getAddr: () => _addr.value,
  };
});
