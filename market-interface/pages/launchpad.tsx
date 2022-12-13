import { Types } from 'aptos';
import { useWallet } from '@manahippo/aptos-wallet-adapter';


export default function LaunchPad() {

    const init_launchpad = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::init_nft";
    const public_mint = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::public_mint";
    const private_mint = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::launchpad::private_mint";

    const source = "0xc2e13d24dbdfe8cbf9f28467c5befdfc47bdfdcb31a5c674fb0ded6a9f198ce4";

    const {
        autoConnect,
        connect,
        disconnect,
        account,
        wallets,
        signAndSubmitTransaction,
        connected,
        wallet: currentWallet
    } = useWallet();

    /* 
    collection_name: String,
    collection_description: String,
    baseuri: String,
    royalty_payee_address: address,
    royalty_points_denominator: u64,
    royalty_points_numerator: u64,
    presale_mint_time: u64,
    public_sale_mint_time: u64,
    presale_mint_price: u64,
    public_sale_mint_price: u64,
    presale_mint_amount: u64,
    public_mint_amount: u64,
    total_supply: u64,
    collection_mutate_setting: vector<bool>,
    token_mutate_setting: vector<bool>,
    merkle_root: vector<u8>,
    seeds: vector<u8>, 
    */
    const proof = [
        "0xcaf1fbec4d4a122e2b2c1916259c81d9dee07b02a081aae1137a4fece01a6970",
        "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa",
    ];

    const init_nft = async () => {
        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: init_launchpad,
            type_arguments: [],
            arguments: [
                'Test Nft',
                'Test Nft',
                'https://static.bluemove.net/aptos-cerise-metadata/',
                '0x7f3d4f0094a49421bdfca03366fa02add69d9091c76a4a0fe498caa163886fc0',
                "10000",
                "5000",
                "1670511905",
                "1670511905",
                "100000000",
                "100000000",
                "5",
                "5",
                "1670745982",
                "1670745982",
                false,
                "55",
                false,
                "200",
                [true, true, true, true, true],
                [true, true, true, true, true],
                "0xc2b409be19d32163a27fadd2a8f1754ab7b0f84fc247c8971e5e04d294f0e043",
                '123asdfasfsadf',
            ]
        };

        const transactionRes = await signAndSubmitTransaction(payload, txOptions);
        console.log(transactionRes);

        //await aptosClient.waitForTransaction(transactionRes?.hash || '');
    }


    const mint = async () => {
        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        /*         const payload: Types.TransactionPayload = {
                    type: 'entry_function_payload',
                    function: public_mint,
                    type_arguments: [],
                    arguments: [
                        source,
                        "1",
                    ]
                };
         */
        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: private_mint,
            type_arguments: [],
            arguments: [
                source,
                proof,
                "1",
            ]
        };

        const transactionRes = await signAndSubmitTransaction(payload, txOptions);
        console.log(transactionRes);
    }

    return (
        <div className="justify-center w-full items-connect">
            <button className="mx-auto center btn btn-primary" onClick={() => mint()}>MINT</button>

            <button className="mx-auto center btn btn-primary" onClick={() => init_nft()}>INIT</button>
        </div>
    )
}

