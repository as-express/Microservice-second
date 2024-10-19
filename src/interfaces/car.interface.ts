export interface CarInterface {
  originId: number;
  title: string;
  image: string;
  likes: number;
  description: string;
  mark: number;
}

export interface CarUpdateInterface {
  title: string;
  image: string;
  likes: number;
  description: string;
}
