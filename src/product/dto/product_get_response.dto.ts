import { Product } from "../product.entity";
export class ProductGetResponseDTO{
    status: Boolean;
    message: String;
    data: Product[];
}