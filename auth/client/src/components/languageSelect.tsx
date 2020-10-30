import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LanguageIcon from "@material-ui/icons/Translate";
import { useState } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import Cookies from "js-cookie";
import { getDefaultLanguageCode } from "../locale/locale";
import clsx from "clsx";

const LANGUAGES_LABEL: Language[] = [
    {
        code: "en",
        text: "English",
    },
    {
        code: "ko",
        text: "한국어",
    },
    {
        code: "zh-CN",
        text: "汉语 (简体)",
    },
];

interface Props {
    noIcon?: boolean;
}

export interface Language {
    code: string;
    text: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        expand: {
            transform: 'rotate(0deg)',
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: "rotate(180deg)",
        },
        language: {
            margin: theme.spacing(0, 0.5, 0, 1),
            display: "block",
        }
    }),
);

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

export default function LanguageSelect(props: Props) {
    const classes = useStyles();

    const url = new URL(window.location.href);
    const localeParam = url.searchParams.get("iso");
    const locale = localeParam || Cookies.get("locale") || getDefaultLanguageCode();
    if (!Cookies.get("locale")) {
        Cookies.set("locale", locale, { path: "/", domain: ".kidsloop.net" });
    }
    const langText = LANGUAGES_LABEL.find((element) => element.code === locale);
    const [languageText, setLanguageText] = useState<string>(langText ? langText.text : "");
    const [languageMenuElement, setLanguageMenuElement] = useState<null | HTMLElement>(null);

    function languageSelect(language: { code: string, text: string }) {
        Cookies.set('locale', language.code, { path: "/", domain: "kidsloop.net" });
        setLanguageText(language.text);
        setLanguageMenuElement(null);
    }

    return(
        <React.Fragment>
            <Tooltip title={<FormattedMessage id="locale_tooltip" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={languageMenuElement ? "language-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="language"
                    onClick={(e) => setLanguageMenuElement(e.currentTarget)}
                    size="small"
                >
                    { props.noIcon ? null : <LanguageIcon fontSize="inherit" />}
                    <span className={classes.language}>
                        { locale === "" ?
                            <FormattedMessage id="locale_select" /> :
                            languageText
                        }
                    </span>
                    <ExpandMoreIcon
                        fontSize="small"
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: languageMenuElement !== null,
                        })}
                    />
                </Button>
            </Tooltip>
            <StyledMenu
                id="language-menu"
                anchorEl={languageMenuElement}
                keepMounted
                open={Boolean(languageMenuElement)}
                onClose={() => setLanguageMenuElement(null)}
            >
                {
                    LANGUAGES_LABEL.map((language) => (
                        <MenuItem
                            key={language.code}
                            selected={locale === language.code}
                            onClick={() => languageSelect(language)}
                        >
                            {language.text}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </React.Fragment>
    );
}
