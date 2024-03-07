import { Inject, Injectable, OnInit } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  DocumentSnapshot,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserCredentials } from '../../interfaces/user-credentials';
import { UserRegisterInfo, UserRegisterInfoWithoutPassword } from '../../interfaces/user-register-info';
import { FirebaseDocument, UserInfo } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService{
  private _app!: FirebaseApp;
  private _db!: Firestore;
  private _auth!: Auth;

  constructor(@Inject('firebase-config') config: any, private authSvc: AuthService) {
    this._app = initializeApp(config);
    this._db = getFirestore(this._app);
    this._auth = getAuth(this._app);
    this._auth.onAuthStateChanged(user => {
        const isLogged = !!user
        this.authSvc.updateAuthState(isLogged)
      })
  }
  

  currentUserId(): string {
    const currentUser = this._auth.currentUser;
    if (currentUser) {
      return currentUser.uid
    }
    return ''
  }

  async login(userCredential: UserCredentials) {
    await signInWithEmailAndPassword(
      this._auth,
      userCredential.email,
      userCredential.password
    );
  }

  async register(userInfo: UserRegisterInfo) {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      this._auth,
      userInfo.email,
      userInfo.password
    );
    const user: UserRegisterInfoWithoutPassword = {
      uid: userCredential.user.uid,
      username: userInfo['username'],
      email: userInfo['email'],
      name: userInfo['name'],
      surname: userInfo['surname'],
    };
    const usersCollection = collection(this._db, 'user');
    const userDocRef = doc(usersCollection, user.uid);
    await setDoc(userDocRef, user);
    console.log('User created with ID: ', user.uid);
  }

  async me(): Promise<UserInfo> {
    return new Promise<UserInfo>((resolve, reject) => {
      const currentUser = this._auth.currentUser;
      
      if (currentUser) {
        console.log("Current user en función me, uid: " + currentUser.uid);
        this.getDocument('user', currentUser.uid)
          .then((data) => {
            const userData: UserInfo = {
              name: data.data['name'],
              surname: data.data['surname'],
              nickname: data.data['username'],
              uid: data.id,
            };
            console.log(userData);
            resolve(userData);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('User is not connected'));
      }
    });
  }

  async getDocument(collectionName:string, document:string):Promise<FirebaseDocument>{
    return new Promise(async (resolve, reject)=>{
        if(!this._db)
            reject({
                msg:"Database is not connected"
                });
        const docRef = doc(this._db!, collectionName, document);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          console.log();
          
            resolve({id:docSnap.id, data:docSnap.data()});
        } else {
            // doc.data() will be undefined in this case
            reject('document does not exists');
        }
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
