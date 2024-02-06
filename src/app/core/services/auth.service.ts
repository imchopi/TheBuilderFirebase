import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInfo } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  protected _logged = new BehaviorSubject<boolean|null>(null);
  public isLogged$ = this._logged.asObservable();
  protected _user = new BehaviorSubject<UserInfo|null>(null);
  public user$ = this._user.asObservable();
  
  public abstract login(credentials:Object):Observable<UserInfo>;

  public abstract register(info:Object):Observable<UserInfo>;

  public abstract logout():Observable<void>;

  public abstract me():Promise<any>;
}
