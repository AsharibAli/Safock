import { t } from "@lingui/macro";
import TransactionInput, { TransactionInputProps } from "components/transaction-input";
import { useAtomValue } from "jotai";
import { isRTokenDisabledAtom } from "state/atoms";
import { issueAmountAtom, maxIssuableAtom } from "../../atoms";

const IssueInput = (props: Partial<TransactionInputProps>) => {
    const issuableAmount = useAtomValue(maxIssuableAtom);
    const isTokenDisabled = useAtomValue(isRTokenDisabledAtom);

    return (
        <TransactionInput
            placeholder={t`Mint amount`}
            amountAtom={issueAmountAtom}
            maxAmount={issuableAmount}
            disabled={isTokenDisabled}
            {...props}
        />
    );
};

export default IssueInput;
