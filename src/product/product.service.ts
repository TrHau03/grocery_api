//service: xử lí logic, tương tác với database

import{ Get, Injectable} from '@nestjs/common';
import{ InjectModel} from '@nestjs/mongoose';
import { ProductInsertResponseDTO } from './dto/product_insert_response.dto';
import { ProductGetResponseDTO as ProductGetResponseDTO } from './dto/product_get_response.dto';
import { ProductInsertRequestDTO } from './dto/product_insert_request.dto';

import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { ProductGetRequestDTO } from './dto/product_get_request.dto';
import { ProductUpdateRequestDTO } from './dto/product_update_request.dto';
import { ProductUpdateResponseDTO } from './dto/product_update_response.dto';


@Injectable()
export class ProductService{
    constructor(@InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>){
    }
    //Hàm insert vào database
    async insert(requestDTO :ProductInsertRequestDTO): Promise<ProductInsertResponseDTO>{
        try {
            const product = new this.productModel(requestDTO);
        await product.save();
        const responseDTO: ProductInsertResponseDTO = {
            status: true,
            message: 'Insert completed'
        }
        return responseDTO;
        } catch (error :any) {
            console.log(error);
        }
    }
    //Get data from database
    async get({name, price} : ProductGetRequestDTO) : Promise<ProductGetResponseDTO>{
        try {
            let query = {};
        if( name) {
            query = {...query, name: name}
        }
        if(price){
            query = {...query, price: price}
        }
        const products =  await this.productModel.find(query).exec();
        const responseDTO:  ProductGetResponseDTO = {
            status: true,
            message: "Get Product Successfully",
            data: products
        };
        return responseDTO;
        } catch (error :any) {
            console.log(error);
        }
    }
    async update(id : string, body : ProductUpdateRequestDTO ): Promise<ProductUpdateResponseDTO>{
        try {
            const product = await this.productModel.findById(id);
            if(!product){
                throw new Error('Product not Found');
            }
            const {name, price , quantity, description} = body;
             product.name = name ? name : product.name;
             product.price = price ? price : product.price;
             product.quantity = quantity ? quantity : product.quantity;
             product.description = description ? description : product.description;
             await product.save();
             const responseDTO : ProductUpdateResponseDTO = {
                status : true,
                message: 'Update Successfully'
             }
             return responseDTO;

        } catch (error :any) {
            console.log(error);
            const responseDTO : ProductUpdateResponseDTO = {
                status : false,
                message: error.message,
             }
             return responseDTO;
        }
    }
    
}