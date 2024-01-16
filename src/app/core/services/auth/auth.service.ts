import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export abstract class AuthService {

  constructor(){
  }


  protected _logged = new BehaviorSubject<boolean>(false);
  public isLogged$ = this._logged.asObservable();
  protected _user = new BehaviorSubject<User|null>(null);
  public user$ = this._user.asObservable();

  public abstract login(credentials: Object): Observable<User>;

  public abstract register(info: Object): Observable<User>;

  public abstract logout(): Observable<void>;

  public abstract me(): Observable<any>;

}
