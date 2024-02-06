import { Inject, Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, User, UserCredential, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { Firestore, addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
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

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this._auth, email, password);
  }

  async register(name: string, username: string, surname: string, email: string, password: string) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      this._auth,
      email,
      password
    );
    const user: UserRegisterInfo = {
      uid: userCredential.user.uid,
      username: username,
      email: email,
      name: name,
      surname: surname,
      password: password
    };
    try {
      const docUser = await addDoc(collection(this._db, 'user'), user);
      console.log('User created with ID: ', docUser.id);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async me(): Promise<UserInfo | null> {
    return new Promise<UserInfo | null>((resolve, reject) => {
      const online = onAuthStateChanged(this._auth, async (user: User | null) => {
        if (user) {
          const userDocRef = doc(this._db, 'user', user.uid);

          try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const data = userDoc.data();
              const userData: UserInfo = {
                uid: data['uid'],
                name: data['name'],
                surname: data['surname'],
                nickname: data['nickname'],
              };
              resolve(userData);
            } else {
              reject(new Error('No se encontraron datos del usuario.'));
            }
          } catch (error) {
            reject(error);
          } finally {
            online();
          }
        } else {
          resolve(null); // Usuario no autenticado
        }
      });
    });
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
