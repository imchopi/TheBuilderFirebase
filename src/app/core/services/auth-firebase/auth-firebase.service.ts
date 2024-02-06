import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, UserCredential, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { DocumentSnapshot, Firestore, addDoc, collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { Observable, from } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserCredentials } from '../../interfaces/user-credentials';
import { UserRegisterInfo } from '../../interfaces/user-register-info';
import { UserInfo } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService{

  private _app!: FirebaseApp;
  private _db!: Firestore;
  private _auth!: Auth;
  
  constructor(
    @Inject('firebase-config') config: any
  ) { 
    this._app = initializeApp(config);
    this._db = getFirestore(this._app);
    this._auth = getAuth(this._app);
  }

  async login(userCredential: UserCredentials) {
    console.log(userCredential);
    
    await signInWithEmailAndPassword(this._auth, userCredential.email, userCredential.password);
  }

  async register(userInfo: UserRegisterInfo) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      this._auth,
      userInfo.email,
      userInfo.password
    );
    const user: UserRegisterInfo = {
      uid: userCredential.user.uid,
      username: userInfo.username,
      email: userInfo.email,
      name: userInfo.name,
      surname: userInfo.surname,
      password: userInfo.password
    };
    try {
      const docUser = await addDoc(collection(this._db, 'user'), user);
      console.log('User created with ID: ', docUser.id);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

    async me(): Promise<UserInfo | undefined> {
      const auth = getAuth();
      const user: User | null = auth.currentUser;

      if (user) {
          const uid = user.uid;
          const userDocRef = doc(this._db, 'users', uid);
          const userDocSnapshot: DocumentSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
              return userDocSnapshot.data() as UserInfo;
          } else {
              throw new Error('No se encontró ningún usuario con la ID proporcionada');
          }
      } else {
          throw new Error('No hay un usuario autenticado');
      }
  }

  async logout(): Promise<void> {
    try {
      await this._auth.signOut();
      console.log('Usuario cerró sesión exitosamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
