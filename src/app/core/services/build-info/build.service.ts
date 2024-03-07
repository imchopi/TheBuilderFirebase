import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, mergeMap } from 'rxjs';
import {
  Build,
  BuildPayload,
  Class,
  FullItem,
  Quality,
  TestItem,
  Type,
} from '../../interfaces/build';
import {
  DocumentReference,
  Firestore,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  UserCredential,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseDocument, UserInfo } from '../../interfaces/user';

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

  mapItems(el: FirebaseDocument): FullItem {
    return {
      idItem: el.data['idItem'],
      itemName: el.data['itemName'],
      quality: {
        idQuality: el.data['quality']?.idQuality,
        qualityName: el.data['quality']?.qualityName,
      },
      type: {
        idType: el.data['type']?.idType,
        typeName: el.data['type']?.typeName,
      },
    };
  }

  mapBuilds(el: FirebaseDocument): Build {
    return {
      userUid: el.data['userUid'],
      idBuild: el.data['idBuild'],
      buildName: el.data['buildName'],
      class: {
        idClass: el.data['class']?.idClass,
        className: el.data['class']?.className,
        classImage: el.data['class']?.classImage,
      },
      fullItem: {
        idItem: el.data['fullItem']?.idItem,
        itemName: el.data['fullItem']?.itemName,
        quality: {
          idQuality: el.data['fullItem']?.quality?.idQuality,
          qualityName: el.data['fullItem']?.quality?.qualityName,
        },
        type: {
          idType: el.data['fullItem']?.type?.idType,
          typeName: el.data['fullItem']?.type?.typeName,
        },
      },
    };
  }

  public subscribeToCollection(
    collectionName: string,
    subject: BehaviorSubject<any[]>,
    mapFunction: (el: FirebaseDocument) => any
  ): Unsubscribe | null {
    if (!this._db) return null;
    return onSnapshot(
      collection(this._db, collectionName),
      (snapshot) => {
        subject.next(
          snapshot.docs
            .map<FirebaseDocument>((doc) => {
              return { id: doc.id, data: doc.data() };
            })
            .map(mapFunction)
        );
      },
      (error) => {}
    );
  }

  async init() {
    await this.getAll();
  }

  async getAll(): Promise<Build[]> {
    const fullBuild = collection(this._db, 'buildRegister');
    const fullBuildSnapshot = await getDocs(fullBuild);
    const builds: Build[] = fullBuildSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log('ESTA ES MI DATA: ', data);

      const buildData: Build = {
        userUid: data['userUid'],
        idBuild: data['idBuild'],
        buildName: data['buildName'],
        class: {
          idClass: data['class']?.idClass,
          className: data['class']?.className,
          classImage: data['class']?.classImage,
        },
        fullItem: {
          idItem: data['fullItem']?.idItem,
          itemName: data['fullItem']?.itemName,
          quality: {
            idQuality: data['fullItem']?.quality?.idQuality,
            qualityName: data['fullItem']?.quality?.qualityName,
          },
          type: {
            idType: data['fullItem']?.type?.idType,
            typeName: data['fullItem']?.type?.typeName,
          },
        },
      };
      console.log('buildData', buildData.class?.className);
      return buildData;
    });
    console.log('builds', builds);
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

  async getItems(): Promise<FullItem[]> {
    const item = collection(this._db, 'items');
    const itemSnapshot = await getDocs(item);
    const items: FullItem[] = itemSnapshot.docs.map((doc) => {
      const data = doc.data();
      const itemData: FullItem = {
        idItem: data['idItem'],
        itemName: data['itemName'],
        quality: {
          idQuality: data['quality']?.idQuality,
          qualityName: data['quality']?.qualityName,
        },
        type: {
          idType: data['type']?.idType,
          typeName: data['type']?.typeName,
        },
      };
      return itemData;
    });
    return items;
  }

  async getBuildById(idBuild: string): Promise<Build | null> {
    const buildRef = doc(this._db, 'buildRegister', idBuild);
    try {
      const buildDoc = await getDoc(buildRef);

      if (buildDoc.exists()) {
        const data = buildDoc.data();
        const buildData: Build = {
          userUid: data['userUid'],
          idBuild: data['idBuild'],
          buildName: data['buildName'],
          class: {
            idClass: data['class']?.idClass,
            className: data['class']?.className,
            classImage: data['class']?.classImage,
          },
          fullItem: {
            idItem: data['fullItem']?.idItem,
            itemName: data['fullItem']?.itemName,
            quality: {
              idQuality: data['fullItem']?.quality?.idQuality,
              qualityName: data['fullItem']?.quality?.qualityName,
            },
            type: {
              idType: data['fullItem']?.type?.idType,
              typeName: data['fullItem']?.type?.typeName,
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
    console.log(itemRef.id);

    try {
      const itemDoc = await getDoc(itemRef);
      console.log(itemDoc.id);

      if (itemDoc.exists()) {
        const data = itemDoc.data();
        const itemData: FullItem = {
          idItem: data['idItem'],
          itemName: data['itemName'],
          quality: {
            idQuality: data['quality'].idQuality,
            qualityName: data['quality'].qualityName,
          },
          type: {
            idType: data['type'].idType,
            typeName: data['type'].typeName,
          },
        };
        console.log('PETO' + itemData);

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

  async addBuild(build: Build) {
    const buildRegisterRef = collection(this._db, 'buildRegister');
    const docBuild = await addDoc(buildRegisterRef, build);
    build.idBuild = docBuild.id;
    await setDoc(docBuild, build);
  }

  async addItem(item: FullItem) {
    const itemsRef = collection(this._db, 'items');
    const docRef = await addDoc(itemsRef, item);
    item.idItem = docRef.id;
    await setDoc(docRef, item);
  }

  async updateBuild(
    itemId: string,
    updatedFields: Partial<Build>
  ): Promise<void> {
    try {
      const itemRef = doc(this._db, 'buildRegister', itemId);
      await updateDoc(itemRef, updatedFields);
      console.log('Documento actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el documento:', error);
      throw error;
    }
  }

  async updateItem(itemId: string, item: FullItem) {
    try {
      const itemRef = doc(this._db, 'items', itemId);
      const updatedItem = {
        ...item,
        idItem: itemId,
        quality: {
          ...item.quality,
          idQuality: item.quality.idQuality,
        },
        type: {
          ...item.type,
          idType: item.type.idType,
        },
      };
      await setDoc(itemRef, updatedItem);
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

  async deleteItem(id: string | undefined) {
    if (id) {
      const item = doc(this._db, 'items', id);
      await deleteDoc(item);
    }
  }
}
