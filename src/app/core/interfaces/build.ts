export interface Build {
  id: number;
  attributes: {
    build_name: string;
    items: {
      data: Item[];
    };
    class: {
      data: Class;
    };
  };
}

export interface BuildPayload {
  build_name: string,
  items: number
  class: number
  extended_user: number | undefined
}

export interface ItemPayload {
  item_name: string,
  quality_id: number
  type_id: number
}

export interface Item {
  id: number;
  attributes: {
    item_name: string;
    item_detail: string;
    type_id: {
      data: {
        id: number;
        attributes: {
          type_name: string;
        };
      };
    };
    quality_id: {
      data: {
        id: number;
        attributes: {
          quality_name: string;
        };
      };
    };
  };
}
export interface Types {
  id: number;
  attributes: {
    type_name: string;
    items: number;
  }
}

export interface Qualities {
  id: number;
  attributes: {
    quality_name: string;
    items: number;
  }
}

export interface Class {
  id: number;
  attributes: {
    name: string;
    class_img: {
      data: Image;
    };
  };
}

export interface Image {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      large: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      thumbnail: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: {
      public_id: string;
      resource_type: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}
