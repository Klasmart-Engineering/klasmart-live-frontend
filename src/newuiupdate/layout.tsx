
import Class from './pages/class';
import ClassEnded from './pages/classEnded';
import ClassLeft from './pages/classLeft';
import Join from './pages/join';
import ClassProviders from "./providers/classProviders";
import { LocalSessionContext } from './providers/providers';
import { classEndedState, classLeftState } from "./states/layoutAtoms";
import React, { useContext } from 'react';
import { useRecoilState } from "recoil";

function Layout () {
    const [ classLeft, setClassLeft ] = useRecoilState(classLeftState);
    const [ classEnded, setClassEnded ] = useRecoilState(classEndedState);
    const { camera, name } = useContext(LocalSessionContext);

    if (!name || camera === undefined) {
        return <Join />;
    }

    if(classLeft){
        return(<ClassLeft />);
    }

    if(classEnded){
        return(<ClassEnded />);
    }

    return (
        <ClassProviders>
            <Class />
        </ClassProviders>
    );
}

export default Layout;
