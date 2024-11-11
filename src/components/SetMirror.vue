<script>
import { useDecoder, useMirror } from "@/stores/store.js";
import { useWallet } from "@/stores/wallet.js";
import { useProvider } from "@/stores/provider.js";
import { useSailsCounter } from "@/stores/sails.js";
import { ethers } from "ethers";

export default {
    data() {
        return {
            mirrorAddress: "",
            decoderAddress: "tet",
            mirrorAbi: ["function decoder() external view returns (address)"],
            decoderAbi: [
                "function fnCounterIncrement(uint128 _value) external payable",
            ],
            isMirrorSet: false,
        };
    },
    methods: {
        async getDecoder() {
            const { getProvider } = useProvider();
            const { setMirror, getMirror } = useMirror();
            const { setDecoder } = useDecoder();

            const provider = getProvider();

            setMirror(this.mirrorAddress.toLowerCase(), this.mirrorAbi);
            setDecoder(await getMirror(provider).decoder(), this.decoderAbi);

            this.decoderAddress = useDecoder().getAddr();

            console.log("mirror address:", useMirror().getAddr());
            console.log("decoder address:", this.decoderAddress);
            this.isMirrorSet = true;
        },

        async callIncrement() {
            const { getDecoder } = useDecoder();
            const { getSigner } = useWallet();

            const signer = await getSigner();

            const decoder = getDecoder(signer);

            try {
                const tx = await decoder.fnCounterIncrement(1);
                const receipt = await tx.wait();

                console.log("tx hash:", receipt.transactionHash);
            } catch (error) {
                console.error("Error:", error);
            }
        },

        async callIncrementBypass() {
            const { getSigner } = useWallet();
            const { getInterface } = useSailsCounter();
            const { getGearexeProvider, getProvider } = useProvider();

            const signer = await getSigner();

            const counter = await getInterface();

            const payload =
                counter.services.Counter.functions.Increment.encodePayload(1);

            const addr = useMirror().getAddr();

            const coder = new ethers.AbiCoder();

            const unsignedTx = {
                type: "sendMessage",
                payload,
                program_id: addr,
                block_number: await getProvider().getBlockNumber(),
                mortality: 64,
                from: signer.address,
            };

            const dataToSign = coder.encode(
                ["string", "bytes", "address", "uint64", "uint64"],
                [
                    unsignedTx.type,
                    unsignedTx.payload,
                    unsignedTx.program_id,
                    unsignedTx.block_number,
                    unsignedTx.mortality,
                ],
            );

            console.log("To sign:", dataToSign);
            const signature = await signer.signMessage(dataToSign);

            await getGearexeProvider().send("tx_submit", [
                unsignedTx,
                signature,
            ]);
        },
    },
};
</script>

<template>
    <div v-if="!isMirrorSet">
        <label for="mirrorAddress">Mirror Address: </label>
        <input type="text" id="mirrorAddress" v-model="mirrorAddress" />
        <button @click="getDecoder">Get decoder</button>
    </div>

    <div v-if="isMirrorSet">
        <p :value="mirrorAddress">Mirror: {{ mirrorAddress }}</p>
        <p :value="decoderAddress">Decoder: {{ decoderAddress }}</p>
    </div>

    <br />

    <div v-if="isMirrorSet">
        <button @click="callIncrement">Call Increment fn</button>
    </div>

    <div v-if="isMirrorSet">
        <button @click="callIncrementBypass">
            Call Increment fn bypassing Eth
        </button>
    </div>
</template>

<style scoped>
p {
    color: white;
}
button {
    background-color: #1f2937;
    color: gray;
    border: 1px solid #4b5563;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition:
        background-color 0.3s ease,
        color 0.3s ease;
}

button:hover {
    background-color: #374151;
    color: #ffffff;
}

button:active {
    background-color: #111827;
}

body {
    font-family: "Inter", Arial, sans-serif;
    color: #e5e7eb;
    margin: 0;
    padding: 0;
}

h1,
h2 {
    color: #10b981;
    font-weight: bold;
}

p {
    font-size: 14px;
    color: #9ca3af;
}

label {
    font-size: 16px;
    color: #f3f4f6;
    font-weight: 500;
}

div {
    margin-top: 40px;
}

input {
    background-color: #1f2937; /* Тёмный фон */
    color: #f3f4f6; /* Светлый текст */
    border: 1px solid #4b5563; /* Граница */
    border-radius: 8px; /* Сглаженные углы */
    padding: 10px; /* Внутренние отступы */
    font-size: 16px; /* Размер текста */
    width: 100%; /* Ширина 100%, можно изменить под нужды */
    max-width: 1000px; /* Максимальная ширина */
    box-sizing: border-box; /* Учитываем padding и border */
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease; /* Анимация при фокусе */
}

input:focus {
    border-color: #10b981; /* Акцентный зелёный цвет при фокусе */
    box-shadow: 0 0 5px #10b981; /* Лёгкое свечение */
    outline: none; /* Убираем стандартный фокус */
}
</style>
