import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './product.schema';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { ProductQueryMiddleware } from 'src/middleware/product_query.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: Product.name, schema: ProductSchema}
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements NestModule {
  configure(consumer : MiddlewareConsumer){
    consumer.apply(LoggerMiddleware,ProductQueryMiddleware).forRoutes('product');
  }
}
