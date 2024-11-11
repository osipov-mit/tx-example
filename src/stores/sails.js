import { defineStore } from 'pinia';
import { SailsIdlParser } from 'sails-js-parser';
import { Sails } from 'sails-js';

export const useSailsCounter = defineStore('counterSails', () => {
  let sails = null;

  const idl = `
    constructor {
      New : ();
    };

    service Counter {
      Decrement : () -> u32;
      Increment : () -> u32;
      query GetValue : () -> u32;
    };`;

  return {
    /** @returns {Sails} */
    getInterface: async () => {
      if (!sails) {
        sails = new Sails(await SailsIdlParser.new());
      }
      console.log(sails);

      return sails.parseIdl(idl);
    },
  };
});
