import { scrollToPage } from "@/utils/pdfUtils";
import {
    Box,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import React,
{
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    pageIndicator: {
        background: `rgb(0 0 0 / 65%)`,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(1, 1.25),
        color: theme.palette.common.white,
    },
    input: {
        border: 0,
        borderRadius: theme.spacing(0.5),
        padding: theme.spacing(0.5),
    },
}));

interface Props {
    current: number;
    total: number;
    searchPage: number;
    setSearchPage: React.Dispatch<React.SetStateAction<number>>;
}

function PdfPagesIndicator (props: Props) {
    const classes = useStyles();
    const {
        current,
        total,
        searchPage,
        setSearchPage,
    } = props;
    const [ isHover, setIsHover ] = useState(false);

    const handleInputEvent = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.currentTarget.value) > total ? total : Number(event.currentTarget.value);
        setSearchPage(value);
        scrollToPage(value);
    };

    const handleInputKeyPress = (event: any) => {
        if (event.key === `Enter`) {
            setIsHover(false);
        }
    };

    useEffect(() => {
        setSearchPage(current);
    }, [ current ]);

    const editableCurrentPage = () => (
        <Box
            display="inline-block"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {isHover ? (
                <input
                    type="number"
                    min="1"
                    max={total}
                    value={searchPage}
                    className={classes.input}
                    onInput={handleInputEvent}
                    onKeyPress={handleInputKeyPress}
                />
            ) : current}
        </Box>
    );

    return (
        <Box
            position="fixed"
            zIndex="9"
            width="100%"
            textAlign="center"
        >
            <Box
                display="inline-block"
                mt={2}
            >
                <Typography
                    className={classes.pageIndicator}
                    component="div"
                >
                    <FormattedMessage
                        id="content.pdf.page"
                        values={{
                            current: editableCurrentPage(),
                            total,
                        }}
                    />
                </Typography>
            </Box>
        </Box>
    );
}

export default PdfPagesIndicator;
