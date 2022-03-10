
export interface IAuthenticationService {
    transfer(token: string): Promise<boolean>;
    refresh(): Promise<boolean>;
    redirectToLogin(returnToThisPage?: URL|Location): void;
    signout(): Promise<void>;
    switchUser(userId: string): Promise<boolean>;
}
