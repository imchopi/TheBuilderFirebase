import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomTranslateService } from './core/services/translate/custom-translate.service';
import { AuthService } from './core/services/auth.service';
import { FirebaseService } from './core/services/auth-firebase/auth-firebase.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  
  constructor(
    private _auth: AuthService,
    private router: Router,
    public translate: CustomTranslateService,
    ) {
    }  
    
}
