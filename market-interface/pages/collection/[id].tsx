import { Types } from 'aptos';
import { Box, Button } from "@chakra-ui/react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function collection() {
    const router = useRouter()
    const { id } = router.query

    console.log(id);

    const [nfts, setNfts] = useState([]);


    const buy_token = "0x5e3536e53bd83844f8a2d3f5f93278c0c8f1114596e5e6e1d4a138de4566a9fa::marketplace::buy_token";

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

        let res = await fetch("http://localhost:8081/api/collection/" + id);
        let res_json = await res.status === 200 ? await res.json() : [];
        console.log(res_json);

        setNfts(await res_json);
    };

    useEffect(() => {
        if (!connected) {
            return;
        }
        refetch_nfts()
    }, [connected]);

    const BuyNft = async (nft: any) => {
        console.log(nft);

        const txOptions = {
            max_gas_amount: '100000',
            gas_unit_price: '100'
        };

        const payload: Types.TransactionPayload = {
            type: 'entry_function_payload',
            function: buy_token,
            type_arguments: [],
            arguments: [
                [nft.creator_address],
                [nft.collection_name],
                [nft.name]
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
                            <Button onClick={() => BuyNft(item)}>BuyNft</Button>
                        </Box>)
                })
            }

        </Box>
    )
}

