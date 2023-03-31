import { formatEther } from "@ethersproject/units";
import { t } from "@lingui/macro";
import { RToken } from "abis/types";
import AreaChart from "components/charts/area/AreaChart";
import dayjs from "dayjs";
import { gql } from "graphql-request";
import { useRTokenContract } from "hooks/useContract";
import useQuery from "hooks/useQuery";
import useRToken from "hooks/useRToken";
import useTimeFrom from "hooks/useTimeFrom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BoxProps } from "theme-ui";
import { formatCurrency } from "utils";
import { TIME_RANGES } from "utils/constants";

const hourlyPriceQuery = gql`
    query getTokenHourlyPrice($id: String!, $fromTime: Int!) {
        token(id: $id) {
            snapshots: hourlyTokenSnapshot(where: { timestamp_gte: $fromTime }) {
                timestamp
                supply: hourlyTotalSupply
            }
        }
    }
`;

const dailyPriceQuery = gql`
    query getTokenDailyPrice($id: String!, $fromTime: Int!) {
        token(id: $id) {
            snapshots: dailyTokenSnapshot(where: { timestamp_gte: $fromTime }) {
                timestamp
                supply: dailyTotalSupply
            }
        }
    }
`;

const SupplyChart = (props: BoxProps) => {
    const rToken = useRToken();
    const [supply, setSupply] = useState(0);
    const [current, setCurrent] = useState(TIME_RANGES.MONTH);
    const fromTime = useTimeFrom(current);
    const query = current === TIME_RANGES.DAY ? hourlyPriceQuery : dailyPriceQuery;
    const { data } = useQuery(rToken ? query : null, {
        id: rToken?.address.toLowerCase(),
        fromTime,
    });
    const contract = useRTokenContract(rToken?.address);

    const getSupply = useCallback(async (contract: RToken) => {
        const supply = await contract.totalSupply();

        setSupply(+formatEther(supply));
    }, []);

    useEffect(() => {
        if (contract) {
            getSupply(contract);
        }
    }, [contract]);

    const rows = useMemo(() => {
        if (data) {
            return (
                data.token?.snapshots.map(
                    ({ timestamp, supply }: { timestamp: string; supply: string }) => ({
                        value: +formatEther(supply),
                        label: dayjs.unix(+timestamp).format("YYYY-M-d HH:mm:ss"),
                        display: `${formatCurrency(+formatEther(supply))} ${rToken?.symbol}`,
                    })
                ) || []
            );
        }
    }, [data]);

    const handleChange = (range: string) => {
        setCurrent(range);
    };

    return (
        <AreaChart
            heading={t`Supply`}
            title={`${formatCurrency(supply || 0)} ${rToken?.symbol}`}
            data={rows}
            timeRange={TIME_RANGES}
            currentRange={current}
            onRangeChange={handleChange}
            {...props}
        />
    );
};

export default SupplyChart;
