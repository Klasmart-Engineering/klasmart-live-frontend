export enum MaterialTypename {
    IFRAME = `Iframe`,
    VIDEO = `Video`,
    AUDIO = `Audio`,
    IMAGE = `Image`,
}

export type LessonMaterial  = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename: MaterialTypename;
    name:string;
    url:string;
} |
{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename: undefined;
    name:string;
    url?:string;
    video?:string;
}
