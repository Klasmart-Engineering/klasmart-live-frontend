export enum MaterialTypename {
    Iframe = `Iframe`,
    Video = `Video`,
    Audio = `Audio`,
    Image = `Image`,
}

export type LessonMaterial  = {
    __typename: undefined;
    name:string;
    url?:string;
    video?:string;
}

// export type LessonMaterial  = {
//     __typename: undefined;
//     name:string;
//     url?:string;
//     video?:string;
// } | {
//     __typename: MaterialTypename;
//     name:string;
//     url:string;
// }
