import { Trans } from "@lingui/macro";
import { useAtomValue } from "jotai";
import { rTokenAtom } from "state/atoms";
import { Box, BoxProps, Link, Text } from "theme-ui";

// TODO: Pull this info from listing
const About = (props: BoxProps) => {
    const rToken = useAtomValue(rTokenAtom);

    if (rToken?.isRSV) {
        return (
            <Box {...props}>
                <Text variant="title" mb={3}>
                    <Trans>About</Trans>
                </Text>
                <Text variant="legend" as="p">
                    RSV is backed by a basket of on-chain collateral assets, held by the Reserve
                    Vault smart contract. This basket is compromised of equal parts BUSD and USDC —
                    so each RSV is initially redeemable with the Reserve smart contracts for 1/2
                    BUSD + 1/2 USDC. Since each RSV token is redeemable directly for this basket,
                    value of the RSV token is economically linked to the value of the basket. This
                    anchors RSV at $1.00, as each of the current collateral tokens is redeemable
                    for USD 1:1.
                </Text>
                <Text variant="legend" as="p" mt={2}>
                    RSV is not integrated with the Reserve protocol at this time and is a separate
                    discrete set of smart contracts.{" "}
                    <Link
                        href="https://reserve.org/protocol/how_rsv_works/index.html"
                        target="_blank"
                        sx={{ textDecoration: "underline" }}
                    >
                        Learn more here.
                    </Link>
                </Text>
            </Box>
        );
    }

    return (
        <Box {...props}>
            {rToken?.mandate && (
                <>
                    <Text mb={3} variant="title">
                        {rToken?.symbol} <Trans>Mandate</Trans>
                    </Text>
                    <Text as="p" variant="legend">
                        {rToken?.mandate}
                    </Text>
                </>
            )}
            {rToken?.meta?.about && (
                <>
                    <Text mt={4} mb={3} variant="title">
                        <Trans>About</Trans>
                    </Text>
                    <Text as="p" variant="legend">
                        {rToken?.meta?.about}
                    </Text>
                </>
            )}
            {!rToken?.meta?.about && !rToken?.mandate && (
                <>
                    <Text mb={3} variant="title">
                        <Trans>About</Trans>
                    </Text>
                    <Text as="p" variant="legend">
                        <Trans>There is no information about this token.</Trans>
                    </Text>
                </>
            )}
        </Box>
    );
};

export default About;
