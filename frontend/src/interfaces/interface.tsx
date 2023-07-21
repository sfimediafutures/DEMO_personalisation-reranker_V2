export interface IDraggableElement {
  identifier: string;
  content?: string;
}

// Service Types
interface ServiceInit {
  status: "init";
}
interface ServiceLoading {
  status: "loading";
}
interface ServiceLoaded<T> {
  status: "loaded";
  payload: T;
}
interface ServiceError {
  status: "error";
  error: Error;
}
export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;





export interface IMovie {
    rank: number;
    tmdbId: number;
    title: string;
    genre: string[];
    links: number[];
    cached_img_url: string;
    cached_background_img_url?: string;
    // description: string;
}

export interface IMovieList {
    id: string;
    recommendationModel: string;
    order: number;
    active: boolean;
    movies: IMovie[];
}

export interface IContent {
    id: string;
    description?: string;
    userImageUrl?: string;
    userDescriptionLong?: string;
    userDescriptionShort?: string;
    movieLists: IMovieList[];
}

export interface IElement {
  id: string;
  content?: IContent | string;
  column: string;
}

export interface IColumn {
  heading: string;
  elements: IElement[];
}