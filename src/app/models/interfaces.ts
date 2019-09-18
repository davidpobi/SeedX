export interface ISEO {
    title: string;
    description: string;
    image: string;
    slug: any;
    site? : string; // handle(@here) or url (here.io)
    summary: string;
    type?: string;
    site_name? : string;
    url?: string;
    
}




export interface IUser {
    id ?: string;
    email: string;
    firstname ?: string;
    lastname ?: string;
    username ?: string;
    contact?: string;
    birthday?:string;
    gender?: Gender;
    photoUrl ?: string;
   // roles ?: Roles;
}



export interface Roles {
    user: boolean;
    client?: boolean;
}


export class User {
    email: string;
    firstName ?: string;
    lastName ?: string;
    username ?: string;
    photoUrl ?: string;
    gender?: Gender;
    roles ?: Roles;

    constructor(authData) {
    this.email = authData.email;    
    this.photoUrl = authData.photoUrl;
    this.roles = {user: true};
    }
}




export enum Gender {
    Man,
    Woman
}