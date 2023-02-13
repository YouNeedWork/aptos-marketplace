import { useEffect, useState } from "react";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import Link from "next/link";

import { Box, Image, Button, Container, HStack, Stack, useColorMode, IconButton, Wrap, WrapItem, Avatar, Flex } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faWallet } from '@fortawesome/free-solid-svg-icons'


const Header = () => {
    const { connect, disconnect, connected, account, wallets, network, ...rest } =
        useWallet();
    const [isShowWalletModal, ShowWalletModal] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode()

    const renderWalletConnectorGroup = () => {
        let walletButtons = wallets.map((wallet) => {
            const option = wallet.adapter;
            const Img = (<Image boxSize="20px" src={option.icon} />);

            return (
                <Button
                    w="200px"
                    leftIcon={Img}
                    colorScheme='teal'
                    variant='ghost'
                    onClick={async () => {
                        await disconnect();
                        connect(option.name)
                            .then((e) => {
                                ShowWalletModal(false);
                            })
                            .catch((e) => { });
                    }}
                    id={option.name.split(" ").join("_")}
                    key={option.name}
                >
                    {option.name}
                </Button>
            );
        });

        return (
            <Stack direction='column' spacing={2}>{walletButtons}</Stack>
        );
    };



    const walletConnect = () => {
        if (connected || account) {
            let addr = Array.isArray(account?.address)
                ? JSON.stringify(account?.address, null, 2)
                : account?.address?.toString() || account?.address?.toString() || "";

            let end = addr.substring(0, 4) + "..." + addr.slice(-4);
            //let newAddr = addr.replace(/^(*{4})\d+(*{4})$/, '$1...$2')

            return (
                <Avatar name='Avatar' src='https://bit.ly/dan-abramov' />
            );
        } else {
            return (
                <IconButton
                    onClick={() => {
                        ShowWalletModal(!isShowWalletModal);
                    }}
                    aria-label="Search database"
                    icon={<FontAwesomeIcon icon={faWallet} />}
                />
            );
        }
    };

    const onClose = () => ShowWalletModal(false);
    const ShowWalletModalUi = () => {
        return (
            <Modal isOpen={isShowWalletModal} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Connect a wallet</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {renderWalletConnectorGroup()}
                    </ModalBody>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <Container maxW="100%" m="0" p="0">
            <HStack px="10" py="6">
                <Flex>
                    <Wrap>
                        <WrapItem><Image src="https://bit.ly/dan-abramov" boxSize={10} /></WrapItem>
                        <WrapItem w="20"><Button variant='ghost' ><Link href="raffle">Raffle</Link></Button></WrapItem>
                        <WrapItem w="20"><Button variant='ghost' ><Link href="launchpad">LaunchPad</Link></Button></WrapItem>

                        <WrapItem flex="1"><Box ml="auto">Scan</Box></WrapItem>

                        <WrapItem>
                            <IconButton onClick={toggleColorMode} aria-label='' icon={<FontAwesomeIcon icon={faMoon} />} />
                        </WrapItem>
                        <WrapItem flex="1">
                            {walletConnect()}
                        </WrapItem>
                    </Wrap>
                </Flex>
                {ShowWalletModalUi()}
            </HStack>

        </Container >
    );
};

export default Header;
