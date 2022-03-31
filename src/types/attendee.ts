export type AttendeeType = {
    type: `Teacher` | `Student`;
    id: string;
    name: string;
};

export type UserNode = {
    node: {
        familyName: string;
        givenName: string;
        id: string;
    };
};
