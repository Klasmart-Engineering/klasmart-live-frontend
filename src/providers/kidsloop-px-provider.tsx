import { SnackbarProvider } from "@kl-engineering/kidsloop-px";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
    children: React.ReactNode;
}

export function KidsloopPxProvider ({ children }: Props) {
    const intl = useIntl();
    return (

        <SnackbarProvider
            anchorOrigin={{
                vertical: `top`,
                horizontal: `center`,
            }}
            closeButtonLabel={intl.formatMessage({
                id: `common_dismiss`,
            })}
        >
            {children}
        </SnackbarProvider>

    );
}
