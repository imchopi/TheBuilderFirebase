import { DocumentData } from "firebase/firestore";

export interface UserInfo {
  uid: string;
  name: string;
  surname: string;
  nickname: string;
  picture?: string;
}

export interface FirebaseDocument{
  id:string;
  data:DocumentData;
}