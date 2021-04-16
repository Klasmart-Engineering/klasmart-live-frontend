import React from 'react';

import { classEndedState } from "./states/layoutAtoms";
import { useRecoilState } from "recoil";
import ClassEnded from './components/others/endPage/classEnded';
import Class from './pages/class';

function Layout () {
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if(classEnded){
        return(<ClassEnded />)
    }

    return (
        <Class />
    );
}

export default Layout;