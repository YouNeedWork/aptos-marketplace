import { Types } from 'aptos';
import { Box, Button } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";

export default function MyProfile() {
    const [nfts, setNfts] = useState([]);
    const list_token = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::marketplace::list_token";

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

    let refetch_nfts = async () => {
        let addr = Array.isArray(account?.address)
            ? JSON.stringify(account?.address, null, 2)
            : account?.address?.toString() || account?.address?.toString() || "";

        if (addr == "") {
            return
        }

        let res = await fetch("http://localhost:8081/api/profile/" + addr);
        let res_json = await res.status === 200 ? await res.json() : [];
        console.log(res_json);

        setNfts(await res_json);
    };

    useEffect(() => {
        refetch_nfts()
    }, [connected]);

    const ListNft = async (nft: any) => {
        console.log(nft);
        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: list_token,
            type_arguments: [],
            arguments: [
                [nft.creator_address],
                [nft.collection_name],
                [nft.name],
                ["10000000"]
            ]
        };

        console.log(payload);
        const transactionRes = await signAndSubmitTransaction(payload, txOptions);
        console.log(transactionRes);
        await refetch_nfts();
    };


    return (
        <Box>
            {
                nfts.map((item, index) => {
                    return (
                        <Box boxSize={200} key={index}>
                            <Button onClick={() => ListNft(item)}>LIST</Button>
                        </Box>)
                })
            }
        </Box>
    )
}

