export type Recordable<T = any> = Record<string, T>;

export interface UserInfo {
    username: string;
    realName?: string;
    avatar?: string;
    desc?: string;
    homePath?: string;
    roles?: {
        roleName: string;
        value: string;
    }[];
    [key: string]: any;
}
