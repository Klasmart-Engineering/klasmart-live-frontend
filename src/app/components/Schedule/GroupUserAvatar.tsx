import { THEME_COLOR_BACKGROUND_MORE_AVATAR } from "@/config";
import { ForeignIdName } from "@kl-engineering/cms-api-client/dist/api/shared";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    avatar: {
      marginRight: theme.spacing(0.5),
    },
    moreUsers: {
      borderRadius: `50%`,
      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
      backgroundColor: THEME_COLOR_BACKGROUND_MORE_AVATAR,
      color: theme.palette.background.paper,
    }
}));

export interface Props {
    names: string[];
    maxDisplay: number;
    size?: `small`|`medium`|`large`;
}

export default function GroupUserAvatar (props: Props) {
    const classes = useStyles();
    const {
      names, 
      maxDisplay, 
      size = `medium`
    } = props;

    const getSize = () => {
      switch(size) {
        case `small`:
          return 24;
        case `medium`: 
          return 40;
        case `large`:
          return 80;
        default:
          return 40;
      }
    }

    return (
        <Grid
            container
            direction="row"
            wrap="nowrap"
        >
          {names.slice(0, maxDisplay).map((item, index, _) => (
            <Grid 
              key={index}
              item
              className={classes.avatar}
            >
              <UserAvatar
                name={item}
                size={size}
              />
            </Grid>
          ))}
          {names.length > maxDisplay && <Grid 
            item 
            className={classes.moreUsers}
            style={{
              width: getSize(),
              height: getSize(),
            }}
          >
              <Typography variant={`subtitle1`}>
                +{names.length - maxDisplay}
              </Typography>
          </Grid>}
        </Grid>
    );
}
