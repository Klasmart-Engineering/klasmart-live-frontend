import React, {useState, createContext, ReactNode, ReactNodeArray, useReducer, DispatchWithoutAction } from "react";

const ScreenShareContext = createContext<ScreenShare>(undefined as any);

export class ScreenShare {
    public static provider(props: {children: ReactNode | ReactNodeArray}) {
        const [state,rerender] = useReducer(({value}:{value:ScreenShare})=>({value}), {value: new ScreenShare()});
        state.value._rerender = rerender;
        return <ScreenShareContext.Provider value={state.value}>
            {props.children}
        </ScreenShareContext.Provider>;
    }

    private _rerender?: DispatchWithoutAction
    private constructor() {}

    private rerender() {
        if(this._rerender) {this._rerender();}
    }

}
