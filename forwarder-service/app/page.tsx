"use client";

import ConnectWallet from "@/components/ConnectWallet";
import axios from "axios";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { Address, useAccount, useContractRead } from "wagmi";
import { signMessage } from "wagmi/actions";
import Collectible from "../abi/Collectible.json";
import { type IForwardRequest } from "./forward/route";

const contract = new ethers.Contract(Collectible.address, Collectible.abi);

export default function Home() {
  const { address, isConnected } = useAccount();
  let [isSubmitting, setSubmitting] = useState(false);

  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useContractRead({
    abi: Collectible.abi,
    address: Collectible.address as Address,
    functionName: "balanceOf",
    args: [address],
  });

  const handleMint = useCallback(async () => {
    const tx = await contract["mintNFT"].populateTransaction();
    const calldata = tx.data;

    let signature;
    try {
      signature = await signMessage({
        message: calldata,
      });
    } catch (er) {
      alert(er);
      return;
    }
    const body: IForwardRequest = {
      calldata: calldata,
      sender: address!,
      sign: signature,
    };
    try {
      setSubmitting(true);
      await axios.post("/forward", body);
      refetch();
      alert("NFT Minted! Refresh to fetch new balance");
    } catch (er) {
      console.warn(er);
      alert("Something went wrong. Check console logs");
    } finally {
      setSubmitting(false);
    }
  }, [address, refetch]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <h1 className="font-bold text-xl">
        Free minting exclusive for our community
      </h1>
      {isConnected && (
        <>
          <button
            onClick={handleMint}
            disabled={isSubmitting}
            className="bg-black text-white px-3 py-2 rounded-md transition-all hover:scale-110"
          >
            {isSubmitting ? "Minting..." : "Mint For Free"}
          </button>
          {!isLoading && !isError && (
            <p>Your NFT balance is {(balance as BigInt).toString()}</p>
          )}
        </>
      )}
      {<ConnectWallet />}
    </main>
  );
}
