import { TEXT_COLOR_CONSTRAST_DEFAULT, THEME_COLOR_ORG_MENU_DRAWER } from "@/config";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

interface Props {
  visible: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string[];
  closeLabel?: string;
  confirmLabel?: string;
  showCloseIcon?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  cancelButton: {
    width: '100%',
    backgroundColor: TEXT_COLOR_CONSTRAST_DEFAULT,
    color: THEME_COLOR_ORG_MENU_DRAWER,
    border: `1px solid ${THEME_COLOR_ORG_MENU_DRAWER}`,
    borderRadius: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontFamily: 'rooney-sans',
    fontWeight: theme.typography.fontWeightBold as number,
    fontSize: "1.15rem",
    [theme.breakpoints.up('sm')]: {
      height: '5vh',
      fontSize: "1.3rem",
    }
  },
  confirmButton: {
    width: '100%',
    backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
    color: TEXT_COLOR_CONSTRAST_DEFAULT,
    borderRadius: theme.spacing(2),
    fontFamily: 'rooney-sans',
    fontWeight: theme.typography.fontWeightBold as number,
    fontSize: "1.15rem",
    [theme.breakpoints.up('sm')]: {
      height: '5vh',
      fontSize: "1.3rem",
    }
  },
  wrapperDialog: {
    width: '33vh',
    height: '29vh',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      width: "42vh",
      height: "28vh",
      padding: theme.spacing(0, 3),
      borderRadius: theme.spacing(4),
    },
  },
  wrapperButtons: {
    padding: theme.spacing(2, 2),
    marginTop: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(2)
    }
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6, 0),
      fontSize: "1.5rem",
    }
  }
}))

export const ConfirmSignOutDialog = (props: Props) => {
  const { visible, onClose, onConfirm, title, closeLabel, confirmLabel } = props;
  const classes = useStyles();
  return (
    <Dialog open={visible} PaperProps={{
      className: classes.wrapperDialog,
    }}>
      <DialogTitle>
        <Typography className={classes.title}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogActions className={classes.wrapperButtons}>
        <Grid container direction="column">
          <Grid item>
            <Button onClick={onClose} className={classes.cancelButton}>
              {closeLabel}
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={onConfirm} className={classes.confirmButton}>
              {confirmLabel}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};
