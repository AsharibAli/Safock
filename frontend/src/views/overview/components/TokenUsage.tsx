import { t } from "@lingui/macro";
import { InfoHeading } from "components/info-box";
import { Box, BoxProps, Flex, Text } from "theme-ui";
import { TokenStats } from "types";
import { formatCurrency } from "utils";

interface Props extends BoxProps {
    metrics: TokenStats;
}

const TokenUsage = ({ metrics, ...props }: Props) => {
    return (
        <Box {...props}>
            <Text variant="title" sx={{ fontSize: 3 }}>
                Usage stats
            </Text>
            <Flex mt={4} sx={{ flexWrap: "wrap" }}>
                <Box mr={5}>
                    <InfoHeading mb={3} title={t`24h Tx Vol`} subtitle={metrics.dailyVolume} />
                    <InfoHeading
                        title={t`Cumulative Tx Volume`}
                        subtitle={metrics.cumulativeVolumeUsd}
                    />
                </Box>

                <Box>
                    <InfoHeading
                        title={t`24h Txs`}
                        mb={3}
                        subtitle={formatCurrency(metrics.dailyTransferCount)}
                    />
                    <InfoHeading
                        title={t`Cumulative Txs`}
                        subtitle={formatCurrency(metrics.transferCount)}
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default TokenUsage;
