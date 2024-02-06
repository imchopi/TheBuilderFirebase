import { Inject, Injectable } from '@angular/core';
import { Observable, from, map, mergeMap } from 'rxjs';
import {
  Build,
  BuildPayload,
  Class,
  FullItem,
  Quality,
  Type,
} from '../../interfaces/build';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, signInWithEmailAndPassword, UserCredential, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserInfo } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class BuildService {
  private _app!: FirebaseApp;
  private _db!: Firestore;
  private _auth!: Auth;

  constructor(@Inject('firebase-config') config: any) {
    this._app = initializeApp(config);
    this._db = getFirestore(this._app);
    this._auth = getAuth(this._app);
  }

  async init() {
    await this.getAll();
  }

  async getAll(): Promise<Build[]> {
    const fullBuild = collection(this._db, 'build');
    const fullBuildSnapshot = await getDocs(fullBuild);
    const builds: Build[] = fullBuildSnapshot.docs.map((doc) => {
      const data = doc.data();
      const buildData: Build = {
        userUid: data['userUid'],
        idBuild: data['idBuild'],
        buildName: data['buildName'],
        class: {
          idClass: data['idClass'],
          className: data['className'],
          classImage: data['classImage'],
        },
        fullItem: {
          idItem: data['idItem'],
          itemName: data['itemName'],
          quality: {
            idQuality: data['idQuality'],
            qualityName: data['qualityName'],
          },
          type: {
            idType: data['idType'],
            typeName: data['typeName'],
          },
        },
      };
      return buildData;
    });

    return builds;
  }

  async getAllBuildByUser(userId: string | undefined): Promise<Build[]> {
    return new Promise<Build[]>((resolve, reject) => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const buildCollection = collection(this._db, 'buildRegister');
          const buildQuery = query(
            buildCollection,
            where('userUid', '==', userId)
          );
          const querySnapshot = await getDocs(buildQuery);
          const builds: Build[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            builds.push({
              idBuild: doc.id,
              userUid: data['userUid'],
              buildName: data['buildName'],
              class: data['class'],
              fullItem: data['fullItem'],
            });
          });
          resolve(builds); // Resuelve la promesa con las construcciones obtenidas
        } else {
          reject(new Error('El usuario no está autenticado')); // Rechaza la promesa si el usuario no está autenticado
        }
      });
    });
  }

  /*getBuildById(buildId: number): Observable<Build> {
    return this.apiSvc
      .get(
        `/build-infos/${buildId}?populate=build,items,items.quality_id,items.type_id,class,class.class_img`
      )
      .pipe(map((response: any) => response.data));
  }*/
  async getItems(): Promise<FullItem[]> {
    const fullItem = collection(this._db, 'items');
    const fullItemSnapshot = await getDocs(fullItem);
    const items: FullItem[] = fullItemSnapshot.docs.map((doc) => {
      const data = doc.data();
      const itemData: FullItem = {
        idItem: data['idItem'],
        itemName: data['itemName'],
        quality: {
          idQuality: data['idQuality'],
          qualityName: data['qualityName'],
        },
        type: {
          idType: data['idType'],
          typeName: data['typeName'],
        },
      };
      return itemData;
    });
    return items;
  }

  async getBuildById(buildId: number): Promise<Build | null> {
    const buildRef = doc(this._db, 'buildRegister')
    try {
      const buildDoc = await getDoc(buildRef);

      if (buildDoc.exists()) {
        const data = buildDoc.data();
        const buildData: Build = {
          userUid: data['userUid'],
          idBuild: data['idBuild'],
          buildName: data['buildName'],
          class: {
            idClass: data['idClass'],
            className: data['className'],
            classImage: data['classImage'],
          },
          fullItem: {
            idItem: data['idItem'],
            itemName: data['itemName'],
            quality: {
              idQuality: data['idQuality'],
              qualityName: data['qualityName'],
            },
            type: {
              idType: data['idType'],
              typeName: data['typeName'],
            },
          },
        };
        return buildData;
      } else {
        console.log('No se encontró un elemento con el ID proporcionado.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el elemento por ID:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<FullItem | null> {
    const itemRef = doc(this._db, 'items', id);

    try {
      const itemDoc = await getDoc(itemRef);

      if (itemDoc.exists()) {
        const data = itemDoc.data();
        const itemData: FullItem = {
          idItem: data['idItem'],
          itemName: data['itemName'],
          quality: {
            idQuality: data['idQuality'],
            qualityName: data['qualityName'],
          },
          type: {
            idType: data['idType'],
            typeName: data['typeName'],
          },
        };
        return itemData;
      } else {
        console.log('No se encontró un elemento con el ID proporcionado.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el elemento por ID:', error);
      throw error;
    }
  }

  async getClass(): Promise<Class[]> {
    const classInfo = collection(this._db, 'classes');
    const classSnapshot = await getDocs(classInfo);
    const classes: Class[] = classSnapshot.docs.map((doc) => {
      const data = doc.data();
      const classData: Class = {
        idClass: data['idClass'],
        className: data['className'],
        classImage: data['classImage'],
      };
      return classData;
    });
    return classes;
  }

  async getTypes(): Promise<Type[]> {
    const type = collection(this._db, 'type');
    const typeSnapshot = await getDocs(type);
    const types: Type[] = typeSnapshot.docs.map((doc) => {
      const data = doc.data();
      const typeData: Type = {
        idType: data['idType'],
        typeName: data['typeName'],
      };
      return typeData;
    });
    return types;
  }

  async getQualities(): Promise<Quality[]> {
    const quality = collection(this._db, 'quality');
    const qualitySnapshot = await getDocs(quality);
    const qualities: Quality[] = qualitySnapshot.docs.map((doc) => {
      const data = doc.data();
      const qualityData: Quality = {
        idQuality: data['idQuality'],
        qualityName: data['qualityName'],
      };
      return qualityData;
    });
    return qualities;
  }

  async createBuild(build: BuildPayload) {
    const auth = getAuth()
    const user = auth.currentUser
    const buildWithUserUid = { ...build, userUid: user?.uid };
    const docBuild = await addDoc(collection(this._db, 'buildRegister'), buildWithUserUid);
  }

  async addItem(item: FullItem) {
    const auth = getAuth()
    const user = auth.currentUser
    const itemWithUserUid = { ...item, userUid: user?.uid };
    const docItem = await addDoc(collection(this._db, 'items'), itemWithUserUid);
  }

  async updateBuild(
    itemId: string,
    updatedFields: Partial<Build>
  ): Promise<void> {
    try {
      const itemRef = doc(this._db, 'buildRegister', itemId);

      // Actualiza el documento con los nuevos datos
      await updateDoc(itemRef, updatedFields);

      console.log('Documento actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw error;
    }
  }

  async updateItem(
    itemId: string,
    updatedFields: Partial<FullItem>
  ): Promise<void> {
    try {
      const itemRef = doc(this._db, 'items', itemId);

      // Actualiza el documento con los nuevos datos
      await updateDoc(itemRef, updatedFields);

      console.log('Documento actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw error;
    }
  }

  async deleteBuild(id: string) {
    const build = doc(this._db, 'buildRegister', id);
    await deleteDoc(build);
  }

  async deleteItem(id: string) {
    const item = doc(this._db, 'items', id);
    await deleteDoc(item);
  }
}
