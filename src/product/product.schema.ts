import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop()
    key: number;
    @Prop()
    img: string;
    @Prop()
    name: string;
    @Prop()
    quantity: number;
    @Prop()
    category: string;
    @Prop()
    price: number;
    @Prop()
    description: string;
}
export const ProductSchema =  SchemaFactory.createForClass(Product)