import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import Button from "components/button";
import CopyValue from "components/button/CopyValue";
import GoTo from "components/button/GoTo";
import WalletIcon from "components/icons/WalletIcon";
import { useUpdateAtom } from "jotai/utils";
import { useCallback } from "react";
import { ChevronDown, X } from "react-feather";
import { isWalletModalVisibleAtom } from "state/atoms";
import { Box, Flex, Text } from "theme-ui";
import { shortenAddress } from "utils";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";
import { txSidebarToggleAtom } from "./atoms";

const TransactionHeader = () => {
    const setSidebar = useUpdateAtom(txSidebarToggleAtom);
    const setWalletModal = useUpdateAtom(isWalletModalVisibleAtom);
    const { ENSName, account } = useWeb3React();

    const handleChangeWallet = useCallback(() => {
        setSidebar(false);
        setWalletModal(true);
    }, [setSidebar, setWalletModal]);

    return (
        <Flex
            sx={{
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "darkBorder",
                height: "56px",
                flexShrink: 0,
            }}
            px={5}
            mb={5}
        >
            <Text variant="title" sx={{ fontSize: 2 }} mr={3}>
                <Trans>Your account</Trans>
            </Text>
            <CopyValue sx={{ display: ["none", "flex"] }} mr={2} value={account || ""} />
            <GoTo
                sx={{ display: ["none", "flex"] }}
                href={getExplorerLink(account || "", ExplorerDataType.ADDRESS)}
            />
            <Box
                ml="auto"
                variant="layout.verticalAlign"
                mr={4}
                sx={{ cursor: "pointer" }}
                onClick={handleChangeWallet}
            >
                <WalletIcon />
                <Text ml={2} mr={2}>
                    {ENSName || shortenAddress(account ?? "")}
                </Text>
                <ChevronDown size={18} />
            </Box>
            <Button variant="circle" onClick={() => setSidebar(false)}>
                <X />
            </Button>
        </Flex>
    );
};

export default TransactionHeader;
