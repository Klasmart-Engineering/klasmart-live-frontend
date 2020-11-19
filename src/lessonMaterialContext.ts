export enum MaterialTypename {
    "Iframe",
    "Video",
    "Audio",
    "Image",
}

export type LessonMaterial  = {
    __typename: MaterialTypename
    name:string
    url:string
} |
{
    __typename: undefined
    name:string
    url?:string
    video?:string
}