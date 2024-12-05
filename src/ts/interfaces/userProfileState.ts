import { RegisterFormValues } from "./RegisterFormValues";

export interface userProfileState {
    loading: boolean;
    authUserInfo: {
        isAuth: boolean;
        userData: RegisterFormValues | {};
    };
    error: string | null
}