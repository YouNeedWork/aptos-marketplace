import { useEffect, useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Link from "next/link";
import { Modal } from 'antd';


const Header = () => {
    const { connect, disconnect, connected, account, wallets, network, ...rest } = useWallet();
    const [isShowWalletModal, ShowWalletModal] = useState(false);

    useEffect(() => {
        console.log(wallets);
    }, []);

    const renderWalletConnectorGroup = () => {
        return wallets.map((wallet) => {
            const option = wallet.adapter;

            return (
                <button
                    onClick={async () => {
                        await disconnect();
                        connect(option.name)
                            .then((e) => {
                                ShowWalletModal(false);
                            })
                            .catch((e) => { });
                    }}
                    id={option.name.split(' ').join('_')}
                    key={option.name}
                    className="connect-btn">
                    {option.name}
                </button>
            );
        });
    };

    const walletConnect = () => {
        if (connected || account) {
            let addr = Array.isArray(account?.address)
                ? JSON.stringify(account?.address, null, 2)
                : account?.address?.toString() || account?.address?.toString() || '';

            let end = addr.substring(0, 4) + '...' + addr.slice(-4);
            //let newAddr = addr.replace(/^(*{4})\d+(*{4})$/, '$1...$2')

            return (
                <button className="connect-wallet" onClick={() => { ShowWalletModal(!isShowWalletModal) }}>
                    {end}
                </button>
            );
        } else {
            return (
                <button onClick={() => { ShowWalletModal(!isShowWalletModal) }} className="connect-wallet">
                    Connect Wallet
                </button>
            );
        }
    };

    const mintNft = async () => {
        console.log("Mint nft");
        try {
            const data = {
                packageObjectId: '0x2',
                module: 'devnet_nft',
                function: 'mint',
                typeArguments: [],
                arguments: [
                    'name',
                    'capy',
                    'https://cdn.britannica.com/94/194294-138-B2CF7780/overview-capybara.jpg?w=800&h=450&c=crop',
                ],
                gasBudget: 10000,
            };
            /*   const resData = await wallet.signAndExecuteTransaction({
                  transaction: {
                      kind: 'moveCall',
                      data
                  }
              }); */
            // const resData = await executeMoveCall(data);
            //console.log('executeMoveCall success', resData);
            //alert('executeMoveCall succeeded (see response in the console)');
        } catch (e) {
            console.error('executeMoveCall failed', e);
            alert('executeMoveCall failed (see response in the console)');
        }
    }

    return (
        <header className="flex items-center justify-between w-screen px-6 py-5 bg-primary">
            <div className="flex items-center">
                <div className="flex">
                    <div>Logo Here</div>
                    <Link href="raffle">Raffle</Link>
                    <Link href="launchpad">LaunchPad</Link>
                </div>

                <div className="flex">
                    <label className="swap swap-rotate">
                        <input type="checkbox" />
                        <svg className="w-10 h-10 fill-current swap-on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                        <svg className="w-10 h-10 fill-current swap-off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                    </label>

                    {/*                     <button className="btn btn-primary" onClick={async () => {
                        //await connect(wallets[2].adapter.name);
                        console.log(1);
                    }}>Connect Wallet</button> */}

                    {walletConnect()}
                </div>
            </div>

            <Modal
                title="SELECT A WALLET"
                centered
                closable={false}
                open={isShowWalletModal}
                width="auto"
                onCancel={() => { ShowWalletModal(false) }}
                footer={[]}>
                {renderWalletConnectorGroup()}
            </Modal>
        </header >
    )
}


export default Header;