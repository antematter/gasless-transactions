"use client";

import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  if (isConnected)
    return (
      <div className="mt-auto text-slate-500">
        Connected to {ensName ?? address}
      </div>
    );
  return (
    <button
      onClick={() => connect()}
      className="px-3 py-2 border-2 border-black rounded-sm font-semibold"
    >
      Connect Wallet
    </button>
  );
}
