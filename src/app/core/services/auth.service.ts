import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '../interfaces/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseService } from './auth-firebase/auth-firebase.service';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthService {
  protected _logged = new BehaviorSubject<boolean | null>(null);
  public isLogged$ = this._logged.asObservable();
  protected _user = new BehaviorSubject<UserInfo | null>(null);
  public user$ = this._user.asObservable();

  public abstract login(credentials: Object): Promise<UserInfo>;

  public abstract register(info: Object): Promise<UserInfo>;

  public abstract logout(): Promise<void>;

  public abstract me(): Promise<any>;

  public updateAuthState(isLogged: boolean | null) {
    this._logged.next(isLogged);
  }
}
