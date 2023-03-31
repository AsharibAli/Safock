import Portal from "@reach/portal";
import { useUpdateAtom } from "jotai/utils";
import { Box, Flex } from "theme-ui";
import { txSidebarToggleAtom } from "./atoms";
import TransactionHeader from "./TransactionHeader";
import TransactionList from "./TransactionList";

const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const setSidebar = useUpdateAtom(txSidebarToggleAtom);

    return (
        <Portal>
            <Box
                onClick={() => setSidebar(false)}
                sx={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    zIndex: 100000,
                    opacity: "50%",
                    width: "100vw",
                    height: "100%",
                    backgroundColor: "black",
                }}
            />
            <Flex
                sx={{
                    flexDirection: "column",
                    zIndex: 100001,
                    position: "absolute",
                    maxWidth: ["100vw", "768px"],
                    width: ["100vw", "100vw", "60vw"],
                    backgroundColor: "background",
                    right: 0,
                    top: 0,
                    height: "100%",
                }}
            >
                {children}
            </Flex>
        </Portal>
    );
};

const TransactionSidebar = () => {
    return (
        <Container>
            <TransactionHeader />
            <TransactionList />
        </Container>
    );
};

export default TransactionSidebar;
