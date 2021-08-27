
export interface IAuthenticationService {
    transfer(token: string): Promise<boolean>;
    refresh(): Promise<boolean>;
    signout(): Promise<void>;
    switchUser(userId: string): Promise<boolean>;
}
