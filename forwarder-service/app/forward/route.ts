import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import Collectible from "@/abi/Collectible.json";

export interface IForwardRequest {
  calldata: string;
  sender: `0x${string}`;
  sign: `0x${string}`;
}

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const forwarderWallet = new ethers.Wallet(
  process.env.FORWARDER_WALLET_PRIVATE_KEY as string,
  provider
);

export async function POST(request: NextRequest) {
  // We're going to receive calldata, sender address and a signature
  // of calldata signed by sender.
  const { calldata, sender, sign }: IForwardRequest = await request.json();

  // Recover signer address
  const signerAddress = ethers.verifyMessage(calldata, sign);

  // Verify signature
  if (signerAddress !== sender) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Append sender address (without 0x prefix) to calldata
  const forwardCalldata = calldata.concat(sender.slice(2));

  // Send the transaction
  const tx = await forwarderWallet.sendTransaction({
    to: Collectible.address,
    data: forwardCalldata,
  });

  return NextResponse.json({ txHash: tx.hash });
}
