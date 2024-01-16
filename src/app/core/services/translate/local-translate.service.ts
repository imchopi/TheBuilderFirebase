import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LocalTranslateService {
  localLanguage: string = '';

  constructor(private _lang: TranslateService) {
    const defaultLanguage = this._lang.getDefaultLang();
    const whatLanguage = this._lang.getBrowserLang() || defaultLanguage;
    this._lang.use(whatLanguage);
  }
}
