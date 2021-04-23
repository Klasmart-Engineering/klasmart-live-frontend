
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import { classEndedState, classLeftState } from "./states/layoutAtoms";
import React from 'react';
import { useRecoilState } from "recoil";

function Layout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);

    if(classLeft){
        return(<ClassLeft />);
    }

    if(classEnded){
        return(<ClassEnded />);
    }

    return (
        <Class />
    );
}

export default Layout;
