import ClassEnded from './components/others/endPage/classEnded';
import Class from './pages/class';
import { classEndedState } from "./states/layoutAtoms";
import React from 'react';
import { useRecoilState } from "recoil";

function Layout () {
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if(classEnded){
        return(<ClassEnded />);
    }

    return (
        <Class />
    );
}

export default Layout;
