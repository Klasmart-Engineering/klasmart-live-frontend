import { fallbackLocale } from '@/localization/localeCodes';
import {
    MockedProvider,
    MockedResponse,
} from '@apollo/client/testing';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material';
import { render as testingLibraryRender } from '@testing-library/react';
import React,
{ ReactNode } from 'react';
import {
    IntlShape,
    RawIntlProvider,
} from 'react-intl';
import { RecoilRoot } from 'recoil';

export interface RenderOptions {
    mocks?: MockedResponse[];
    locale?: IntlShape;
}

const theme = createTheme();

export const render = (component: ReactNode, options: RenderOptions = {}) => {
    const {
        mocks,
        locale = fallbackLocale,
    } = options;
    return testingLibraryRender((
        <MockedProvider
            mocks={mocks}
            defaultOptions={{
                watchQuery: {
                    fetchPolicy: `no-cache`,
                },
                query: {
                    fetchPolicy: `no-cache`,
                },
            }}
            addTypename={false}
        >
            <RecoilRoot>
                <RawIntlProvider value={locale}>
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            {component}
                        </ThemeProvider>
                    </StyledEngineProvider>
                </RawIntlProvider>
            </RecoilRoot>
        </MockedProvider>
    ));
};
