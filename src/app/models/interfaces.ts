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
    firstName ?: string;
    lastName ?: string;
    username ?: string;
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



export interface IClient {
    id ?: string;
    firstname: string;
    lastname: string;
    email ?: string;
    contact ?: string;
    age?: number;
    birthday?: string;
    gender: Gender;
    photoUrl?: string;
    twitter?: string;
    instagram?: string;
    snapchat?: string;
    visits?: number;
    bounces?: number;

}


export enum Gender {
    Man,
    Woman,
    Other
}




export interface INight {
    id?: string;
    date?: string;
    title?: string;
    guestCount?: number;
    bounceCount?: number;
    menCount?: number;
    womenCount?: number;
}



export interface IDrink {
    id?: string;
    name: string;
    description: string;
    price?: number;
    ratings?: IDrinkData;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}



export interface IDrinkData {
    star1?: number;
    star2?: number;
    star3?: number;
    star4?: number;
    star5?: number;
    ratersCount?: number;
}


export interface IEvent {
    id?: string;
    name: string;
    description?:string;
    startAt?: string; // opening at
    endAt?: string; //closing at
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}