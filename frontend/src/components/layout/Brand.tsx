import { SmallLogo } from "components/icons/Logo";
import { useUpdateAtom } from "jotai/utils";
import { useNavigate } from "react-router-dom";
import { selectedRTokenAtom } from "state/atoms";
import { Box, BoxProps, Flex } from "theme-ui";

const Brand = (props: BoxProps) => {
    const navigate = useNavigate();
    const updateToken = useUpdateAtom(selectedRTokenAtom);

    const handleClick = () => {
        updateToken("");
        navigate("/");
    };

    return (
        <Flex onClick={handleClick} sx={{ cursor: "pointer", alignItems: "center" }}>
            <Box
                sx={{
                    marginTop: "6px",
                    display: ["none", "none", "flex"],
                    alignItems: "center",
                }}
                {...props}
            >
                Safock
            </Box>
            <Box
                sx={{
                    display: ["flex", "flex", "none"],
                    alignItems: "center",
                    justifyContent: "center",
                }}
                {...props}
            >
                <SmallLogo />
            </Box>
        </Flex>
    );
};

export default Brand;
