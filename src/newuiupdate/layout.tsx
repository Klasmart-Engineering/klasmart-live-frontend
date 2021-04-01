import React from 'react'
import { useRecoilState} from 'recoil';

import { themeState } from "./states/layoutAtoms"

function Layout() {
    const [theme, setTheme] = useRecoilState(themeState);

    return (
        <div>
            {theme}
        </div>
    )
}

export default Layout
