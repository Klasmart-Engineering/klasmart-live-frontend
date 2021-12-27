
import { CaptchaLogic } from "./captchaLogic";
import {
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { Admin as ParentIcon } from "@styled-icons/remix-line/Admin";
import React,
{ useState } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    dialogIcon:{
        display: `inline-block`,
        background: theme.palette.grey[200],
        borderRadius: 40,
        padding: 20,
        marginBottom: 20,
    },
    error: {
        color: red[500],
    },
}));

function ParentCaptcha (props:any){
    const classes = useStyles();
    const {  setShowParentCaptcha } = props;
    const [ error, setError ] = useState(false);

    return(
        <div>
            <div className={classes.dialogIcon}>
                <ParentIcon size="2rem"  />
            </div>
            <Typography variant="h5"><FormattedMessage id="parents_captcha_title" /></Typography>
            <Typography><FormattedMessage id="parents_captcha_description" /></Typography>
            <CaptchaLogic
                isUsedForEndClass
                setShowParentCaptcha={setShowParentCaptcha}
                setError={setError}
            />
            {error && <Typography className={classes.error}><FormattedMessage id="parents_captcha_error" /></Typography>}
        </div>
    );
}
export { ParentCaptcha };
