import { ReadMembershipDto } from "./readMembershipDto";

export interface ReadUserDto {
    user_id: string;
    username?: string;
    given_name?: string;
    family_name?: string;
    date_of_birth?: string;
    memberships?: ReadMembershipDto[];
}
