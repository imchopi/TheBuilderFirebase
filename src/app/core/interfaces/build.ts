export interface BuildPayload {
  idBuild?: string;
  userUid: string;
  buildName: string;
  class: string;
  fullItem: string;
}

export interface Build {
  idBuild?: string;
  userUid?: string;
  buildName: string;
  class: Class;
  fullItem: FullItem;
}

export interface FullItem {
  userUid?: string,
  idItem?: string,
  itemName: string,
  type: Type,
  quality: Quality,
}

export interface TestItem {
  idQuality?: string;
  idType?: string;
  itemName: string,
  typeName: string,
  qualityName: string
}

export interface Type {
  idType?: string;
  typeName: string;
}

export interface Quality {
  idQuality?: string;
  qualityName: string;
}

export interface Class {
  idClass?: string;
  className: string;
  classImage?: string;
}