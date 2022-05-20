import StyledIcon from "@/components/styled/icon";
import { Fade, Grid, Paper, Popper, Theme, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { grey } from "@mui/material/colors";
import { ExclamationCircleFill as WarningIcon } from '@styled-icons/bootstrap/ExclamationCircleFill';
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    popperRoot: {
        zIndex: 1200,
    },
    popperPapper: {
        borderRadius: 12,
        overflow: `hidden`,
        maxHeight: `calc(100vh - 150px)`,
        overflowY: `auto`,
        boxShadow: `0 1px 2px 0 rgba(0, 0, 0, 0.075), 0 2px 12px 0px rgba(0, 0, 0, 0.065)`,
    },
    alertPopper: {
        backgroundColor: grey[100],
        color: grey[700],
        padding: theme.spacing(1),
    },
}));

interface Props {
	title?: React.ReactNode;
	open?: boolean;
	anchorEl?: HTMLDivElement | HTMLButtonElement | null;
    width?: number;
}

export default function AlertPopper (props: Props) {
    const classes = useStyles();
    const {
        title,
        open = false,
        anchorEl,
        width,
    } = props;

    const boundaryElement = document.querySelector(`#main-content`);

    return (
        <Popper
            transition
            open={open}
            anchorEl={anchorEl}
            disablePortal={false}
            placement="top"
            modifiers={[
                { 
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        boundary: boundaryElement
                    }
                },
                {
                    name: 'offset',
                    enabled: true,
                    options: {
                        offset: [10, 20],
                    },
                },
            ]}
            className={classes.popperRoot}
        >
            <Fade in={open}>
                <Paper className={classes.popperPapper}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-around"
                        style={{
                            width,
                        }}
                        className={classes.alertPopper}
                    >
                        <Grid item>
                            <StyledIcon
                                icon={<WarningIcon />}
                                size={`medium`}
                                color={grey[400]}
                            />
                        </Grid>
                        <Grid item>
                            <Typography>{title}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
        </Popper>
    );
}
