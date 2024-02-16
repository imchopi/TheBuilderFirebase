export interface UserRegisterInfo {
  uid: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  password: string;
}

export interface UserRegisterInfoWithoutPassword {
  uid: string;
  username: string;
  email: string;
  name: string;
  surname: string;
}
