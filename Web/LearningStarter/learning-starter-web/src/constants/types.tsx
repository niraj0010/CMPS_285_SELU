//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
};

export type OrderDto = {
  id: number;
  userId: number;
  price: number;
  quantity: number;
};

export type ReviewDto = {
  id: number;
  userId: number;
  productId: number;
  ratings: number;
  comments: string;
};

export type stripeCheckoutResponse={
  sessionId:string,
  sessionUrl:string,
}

export type OrderGetDto={
  userId:number,
  price:number,
  quantity:number,
  date:string,
  status:string,
  orderItems:[
    productId:number,
    quantity:number,
    price:number,
    image:string,
  ]
}
export interface Image {
  data: File | null | string;
}

export interface FormData {
  name: string;
  userId: number;
  productCategories: string|null;
  description: string;
  price: number;
  status: string|null;
  dateAdded: string;
  images: Image[];
}

export interface ProductResponse {
  Id: number;
  UserId: number;
  productCategories: string|null;
  Name: string;
  Description: string;
  Price: number;
  Status: string|null;
  DateAdded: string;
  Images: ImageResponse[];
}

export interface ImageResponse {
  Id: number;
  Data: string | null;
}

export interface GetProduct {
  id: number;
  name: string;
  description: string;
  productCategories: string;
  price: number;
  status:string;
  userId: number;
  userName: string;
  images: Array<{ id: number; data: string }>;
  isCurrentUserOwner?: boolean;
}

export interface updateProduct{
  id: number;
  name: string;
  description: string;
  productCategories: string;
  price: number;
  status:string;

}

export interface orderGetDto{
  id :number,
  userId:number,
  price:number,
  quantity:number,
  date:string,
  status:string,
  orderItems:[
    {
    id:number,
    orderId:number,
    productId:number,
    image:string,
    quantity:number,
    price:number,
  }
  ]
}





