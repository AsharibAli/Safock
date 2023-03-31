import useRToken from "hooks/useRToken";
import { Navigate } from "react-router-dom";
import StakingPage from "./Staking";

export default () => {
    const rToken = useRToken();

    if (rToken?.isRSV) {
        return <Navigate to="/" />;
    }

    return <StakingPage />;
};
