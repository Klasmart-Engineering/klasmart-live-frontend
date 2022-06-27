import { THEME_COLOR_BACKGROUND_PAPER } from '@/config';
import {
    IconButton,
    makeStyles,
    Tooltip,
    Typography,
    useTheme,
} from '@material-ui/core';
import {
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@material-ui/icons';
import clsx from "clsx";
import React, {
    useEffect,
    useState,
} from 'react';
import { useIntl } from 'react-intl';

export interface SidebarPaginationProps {
    handlePageChange: (e: React.ChangeEvent<unknown>, direction: string) => void;
    pagesTotal: number;
    currentPage: number;
}

const useStyles = makeStyles((theme) => ({
    page: {
        padding: theme.spacing(1.5, 4),
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: `1em`,
    },
    paginationCaret: {
        margin: theme.spacing(0, 2),
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        borderRadius: `2em`,
    },
    paginationCaretDisabled: {
        opacity: `0.5`,
    },
}));

const SidebarPagination = (props: SidebarPaginationProps) => {
    const {
        pagesTotal,
        currentPage,
        handlePageChange,
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const intl = useIntl();
    const [ hasPreviousPage, setHasPreviousPage ] = useState(false);
    const [ hasNextPage, setHasNextPage ] = useState(false);

    useEffect(() => {
        setHasNextPage(currentPage === pagesTotal ? false : pagesTotal > 1);
        setHasPreviousPage(currentPage > 1);
    }, [ pagesTotal, currentPage ]);

    return (
        <>
            <Tooltip title={intl.formatMessage({
                id: `live.tooltip.previousPage`,
                defaultMessage: `Previous page`,
            })}
            >
                <span className={clsx(classes.paginationCaret, {
                    [classes.paginationCaretDisabled]: !hasPreviousPage,
                })}
                >
                    <IconButton
                        disabled={!hasPreviousPage}
                        aria-label="previous page"
                        size="medium"
                        onClick={(e) => handlePageChange(e, `prev`)}
                    >
                        {theme.direction === `rtl` ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    </IconButton>
                </span>
            </Tooltip>
            <div className={classes.page}>
                <Typography>
                    {theme.direction === `rtl` ? `${pagesTotal.toString()} / ${currentPage.toString()}` : `${currentPage.toString()} / ${pagesTotal.toString()}`}
                </Typography>
            </div>
            <Tooltip title={intl.formatMessage({
                id: `live.tooltip.nextPage`,
                defaultMessage: `Next page`,
            })}
            >
                <span className={clsx(classes.paginationCaret, {
                    [classes.paginationCaretDisabled]: !hasNextPage,
                })}
                >
                    <IconButton
                        disabled={!hasNextPage}
                        aria-label="next page"
                        size="medium"
                        onClick={(e) => handlePageChange(e, `next`)}
                    >
                        {theme.direction === `rtl` ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
                    </IconButton>
                </span>
            </Tooltip>
        </>
    );
};

export default SidebarPagination;
