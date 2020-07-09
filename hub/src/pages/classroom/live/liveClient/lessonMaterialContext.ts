import { createContext } from "react";

export interface LessonMaterial {
    name:string
    url:string
}

export const materialContext = createContext([] as LessonMaterial[]);