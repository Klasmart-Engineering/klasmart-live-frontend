import Error1 from "../../../assets/img/error/1.png";
import Error2 from "../../../assets/img/error/2.png";
import Error3 from "../../../assets/img/error/3.png";
import Error4 from "../../../assets/img/error/4.png";
import KidsloopIcon from "../../../assets/img/klasmart/klasmart-logo.svg";
import StyledButton from "../../../components/styled/button";
import { useAuthenticationContext } from "../../context-provider/authentication-context";
import { useServices } from "@/app/context-provider/services-provider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React,
{
    useEffect,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";

const ERROR_IMAGES = [
    Error1,
    Error2,
    Error3,
    Error4,
];
export const DESCRIPTION_403 = `Please check if your organization is not created or selected.`;

const useStyles = makeStyles(() => createStyles({
    pageWrapper: {
        display: `flex`,
        flexGrow: 1,
        height: `100vh`,
    },
    card: {
        alignItems: `center`,
        display: `flex`,
        padding: `48px 40px !important`,
    },
    link: {
        textAlign: `center`,
    },
}));

type ErrorCode = "400" | "401" | "403" | "404" | "500" | string;

interface FallbackProps {
    titleMsgId: string;
    subtitleMsgId?: string;
    descriptionMsgId?: string;
    errCode?: ErrorCode;
}

// TODO: Mapping description by errCode
export function Fallback ({
    titleMsgId, subtitleMsgId, descriptionMsgId, errCode,
}: FallbackProps) {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            className={classes.pageWrapper}
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={4}>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    textAlign: `center`,
                                }}>
                                <img
                                    alt="KidsLoop Logo"
                                    src={KidsloopIcon}
                                    height="50px" />
                            </Grid>
                            <Grid
                                item
                                xs={12}>
                                <Typography
                                    variant="h4"
                                    align="center">
                                    {errCode && !/^(\d{3}x\d{2})$/.test(errCode) ? errCode + ` ` : ``}<FormattedMessage id={titleMsgId} />
                                </Typography>
                                {subtitleMsgId ? (
                                    <Typography
                                        variant="h6"
                                        align="center">
                                        <FormattedMessage id={subtitleMsgId} />
                                    </Typography>
                                ) : null}
                                <br />
                                {descriptionMsgId ? (
                                    <Typography
                                        variant="body2"
                                        align="center">
                                        <FormattedMessage id={descriptionMsgId} />
                                    </Typography>) : null}
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    textAlign: `center`,
                                }}>
                                <img
                                    src={ERROR_IMAGES[((Math.floor(Math.random() * 10)) % ERROR_IMAGES.length)]}
                                    width={250}
                                    height={250} />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                className={classes.link}>
                                <NextStepButton errCode={errCode ? errCode : `500`} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    );
}

function NextStepButton ({ errCode }: { errCode: string }) {
    const { actions } = useAuthenticationContext();
    const { authenticationService } = useServices();
    const [ shouldSignOut, setShouldSignOut ] = useState<boolean>(false);
    const [ btnTitle, setBtnTitle ] = useState<JSX.Element>(<FormattedMessage id="err_button_home" />);

    const handleClick = () => {
        if (shouldSignOut) {
            authenticationService?.signout();
        } else {
            actions?.refreshAuthenticationToken(); // TODO (Isu): It's temporary and needs to be implemented more detail
        }
    };

    useEffect(() => {
        if (errCode === `401`) {
            setBtnTitle(<FormattedMessage id="err_button_signin" />);
        } else if (/^((403)|(403x\d{2}))$/.test(errCode)) {
            setShouldSignOut(true);
            setBtnTitle(<FormattedMessage id="err_button_signin" />);
        } else {
            setBtnTitle(<FormattedMessage id="err_button_confirm" />);
        }
    }, []);

    return (
        <StyledButton
            extendedOnly
            size="medium"
            type="submit"
            onClick={handleClick}
        >
            <Typography variant="button">{btnTitle}</Typography>
        </StyledButton>
    );
}
