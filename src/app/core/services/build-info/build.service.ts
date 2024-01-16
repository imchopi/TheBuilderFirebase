import { Injectable, Type } from '@angular/core';
import { ApiService } from '../api/api.service';
import {
  BehaviorSubject,
  Observable,
  lastValueFrom,
  map,
  mergeMap,
  tap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Build,
  BuildPayload,
  Class,
  Item,
  ItemPayload,
  Qualities,
  Types,
} from '../../interfaces/build'; // Asegúrate de importar BuildInfo, no Build
import { JwtService } from '../jwt/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private _builds: BehaviorSubject<Build[]> = new BehaviorSubject<Build[]>([]);
  public builds$: Observable<Build[]> = this._builds.asObservable();

  constructor(private apiSvc: ApiService, private jwtSvc: JwtService) {
    this.init();
  }

  async init() {
    await this.getAll();
  }

  getAll(): Observable<Build[]> {
    return this.apiSvc
      .get(
        '/build-infos?populate=build,items,items.quality_id,items.type_id,class,class.class_img'
      )
      .pipe(map((response: any) => response.data));
  }

  getAllBuildByUser(id: number | undefined): Observable<Build[]> {
    return this.apiSvc.get(`/extender-users?filters[users]=${id}`).pipe(
      mergeMap((extenderData) => {
        const extenderId = extenderData.data[0].id;
        return this.apiSvc
          .get(
            `/build-infos?filters[extended_user]=${extenderId}&populate=build,items,items.quality_id,items.type_id,class,class.class_img`
          )
          .pipe(map((response) => response.data));
      })
    );
  }

  getBuildById(buildId: number): Observable<Build> {
    return this.apiSvc
      .get(
        `/build-infos/${buildId}?populate=build,items,items.quality_id,items.type_id,class,class.class_img`
      )
      .pipe(map((response: any) => response.data));
  }

  getItems(): Observable<Item[]> {
    return this.apiSvc
      .get('/items?populate=quality_id, type_id')
      .pipe(map((response: any) => response.data));
  }

  getItemById(itemId: number): Observable<Item> {
    return this.apiSvc
      .get(`/items/${itemId}?populate=quality_id,type_id`)
      .pipe(map((response: any) => response.data));
  }

  getTypes(): Observable<Types[]> {
    return this.apiSvc
      .get('/types')
      .pipe(map((response: any) => response.data));
  }

  // Función para obtener la lista de qualities desde el backend
  getQualities(): Observable<Qualities[]> {
    return this.apiSvc
      .get('/qualities')
      .pipe(map((response: any) => response.data));
  }

  // Función para obtener la lista de classes desde el backend
  getClasses(): Observable<Class[]> {
    return this.apiSvc
      .get('/classes')
      .pipe(map((response: any) => response.data));
  }

  addBuild(build: BuildPayload): Observable<Build> {
    return this.apiSvc
      .get(`/extender-users?filters[users]=${build.extended_user}`)
      .pipe(
        mergeMap((extenderData) => {
          const extenderId = extenderData.data[0]?.id || null;
          const _buildPayload: BuildPayload = {
            build_name: build.build_name,
            items: build.items,
            class: build.class,
            extended_user: extenderId,
          };
          return this.apiSvc.post('/build-infos', { data: _buildPayload });
        })
      );
  }

  addItem(item: ItemPayload): Observable<Item> {
    return new Observable<Item>((obs) => {
      const _itemPayload: ItemPayload = {
        item_name: item.item_name,
        quality_id: item.quality_id,
        type_id: item.type_id,
      };
      this.apiSvc.post('/items', { data: _itemPayload }).subscribe({
        next: async (data: any) => {
          obs.next(data);
          obs.complete();
        },
        error: (err) => {
          obs.error(err);
        },
      });
    });
  }

  updateBuild(buildId: number, build: BuildPayload): Observable<Build> {
    return this.apiSvc
      .get(`/extender-users?filters[users]=${build.extended_user}`)
      .pipe(
        mergeMap((extenderData) => {
          const extenderId = extenderData.data[0]?.id || null;
          const _buildPayload: BuildPayload = {
            build_name: build.build_name,
            items: build.items,
            class: build.class,
            extended_user: extenderId,
          };
          return this.apiSvc.put(`/build-infos/${buildId}`, { data: _buildPayload });
        })
      );
  }

  updateItem(itemId: number, item: ItemPayload): Observable<Item> {
    return new Observable<Item>((obs) => {
      const _itemPayload: ItemPayload = {
        item_name: item.item_name,
        quality_id: item.quality_id,
        type_id: item.type_id,
      };
      this.apiSvc.put(`/items/${itemId}`, { data: _itemPayload }).subscribe({
        next: async (data: any) => {
          obs.next(data);
          obs.complete();
        },
        error: (err) => {
          obs.error(err);
        },
      });
    });
  }

  deleteBuild(id: number) {
    return this.apiSvc.delete(`/build-infos/${id}`);
  }

  deleteItem(id: number) {
    return this.apiSvc.delete(`/items/${id}`);
  }
}
