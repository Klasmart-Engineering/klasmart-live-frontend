import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { ExpandMore as ExpandMoreIcon } from "@styled-icons/material/ExpandMore";
import { Translate as LanguageIcon } from "@styled-icons/material/Translate";
import { useState, useContext } from "react";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { ThemeContext } from "../entry";

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

// tslint:disable:object-literal-sort-keys
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        language: {
            margin: theme.spacing(0, 0.5, 0, 1),
            display: "block",
        },
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
    const { languageCode, setLanguageCode } = useContext(ThemeContext);

    const locale = languageCode;
    const langText = LANGUAGES_LABEL.find((element) => element.code === languageCode);
    const [languageText, setLanguageText] = useState<string>(langText ? langText.text : "");
    const [languageMenuElement, setLanguageMenuElement] = useState<null | HTMLElement>(null);

    function languageSelect(language: { code: string, text: string }) {
        setLanguageCode(language.code);
        setLanguageText(language.text);
        setLanguageMenuElement(null);
    }

    return (
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
                    {props.noIcon ? null : <LanguageIcon fontSize="inherit" />}
                    <span className={classes.language}>
                        {locale === "" ?
                            <FormattedMessage id="locale_select" /> :
                            languageText
                        }
                    </span>
                    <ExpandMoreIcon size="1em" />
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
