import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FormattedMessage, useIntl } from "react-intl";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import {
  BG_COLOR_CAROUSEL_DOT_INACTIVE,
  TEXT_COLOR_CONSTRAST_DEFAULT,
  THEME_BACKGROUND_SELECT_DIALOG,
  THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { dialogsState } from "@/app/model/appModel";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import StudentImage from "@/assets/img/select-type/student-illustration-mobile.svg";
import ParentImage from "@/assets/img/select-type/parent-illustration-mobile.svg";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { ConfirmSignOutDialog } from "../../dialogs/confirmSignOutDialog";

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
    borderBottomLeftRadius: theme.spacing(3),
    height: "3rem",
    [theme.breakpoints.up('sm')]: {
      height: "6rem",
    }
  },
  content: {
    backgroundColor: THEME_BACKGROUND_SELECT_DIALOG,
    width: '100%',
    height: '100%'
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: theme.typography.fontWeightMedium as number,
    color: TEXT_COLOR_CONSTRAST_DEFAULT,
    fontSize: theme.spacing(2.5),
    width: "100",
    height: "100%",
    fontFamily: "rooney-sans",
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(3.5),
    }
  },
  wrapper: {
    height: "85%",
    marginTop: theme.spacing(11),
    flex: 1,
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
      marginTop: '10vh',
    }
  },
  wrapperSelectItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: TEXT_COLOR_CONSTRAST_DEFAULT,
    height: "30vh",
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(0, 10, 2, 10),
      borderRadius: theme.spacing(2.5)
    }
  },
  selectionTitle: {
    fontFamily: "rooney-sans",
    fontWeight: theme.typography.fontWeightMedium as number,
    fontSize: "1.15rem",
    [theme.breakpoints.up('sm')]: {
      fontSize: "2rem",
    }
  },
  image: {
    width: "22vh",
    height: "20vh",
  },
  signOutButton: {
    borderRadius: theme.spacing(3),
    borderTopRightRadius: theme.spacing(1),
    fontFamily: "rooney-sans",
    color: TEXT_COLOR_CONSTRAST_DEFAULT,
    backgroundColor: BG_COLOR_CAROUSEL_DOT_INACTIVE,
    fontSize: "1.15rem",
    marginTop: "auto",
    height: "7vh",
    fontWeight: theme.typography.fontWeightBold as number,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(3.5),
    }
  },
  container: {
    width: '100%',
    height: '100%'
  }
}));

export function SelectTypePage(): JSX.Element {
  const intl = useIntl();
  const dialogs = useRecoilValue(dialogsState);
  const classes = useStyles();
  const [openConfirmationPopup, setOpenConfirmationPopup] = useState<boolean>(false);

  const statusBar = (window as any).StatusBar;
  statusBar.backgroundColorByHexString(THEME_COLOR_ORG_MENU_DRAWER);
  statusBar.overlaysWebView(true);

  const selections = [
    {
      type: "Student",
      image: StudentImage,
    },
    {
      type: "Parent",
      image: ParentImage,
    },
  ];

  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item>
        <AppBar className={classes.appbar} elevation={0}>
          <Typography className={classes.title}>Choose your role</Typography>
        </AppBar>
      </Grid>
      <Grid item className={classes.content}>
        <Grid container direction="column" className={classes.wrapper}>
          {selections.map((selection) => (
            <Grid item>
              <Box className={classes.wrapperSelectItem} onClick={() => { }}>
                <img src={selection.image} className={classes.image} />

                <Typography className={classes.selectionTitle}>
                  {selection.type}
                </Typography>
              </Box>
            </Grid>
          ))}
          <Button
            className={classes.signOutButton}
            onClick={() => setOpenConfirmationPopup(true)}
          >
            Sign Out
          </Button>
        </Grid>
      </Grid>
      <ConfirmSignOutDialog
        visible={openConfirmationPopup}
        onClose={() => setOpenConfirmationPopup(false)}
        closeLabel={intl.formatMessage({
          id: `button_cancel`,
        })}
        confirmLabel={'Sign Out'}
        title={intl.formatMessage({
          id: `hamburger.signOut.confirm`,
        })}
      />
    </Grid>
  );
}
