import { Controller, Get, Post, HttpCode, HttpStatus, Body, Param, Query, Res, Req } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductInsertRequestDTO } from "./dto/product_insert_request.dto";
import { Response, Request } from "express";
import { ProductGetRequestDTO } from "./dto/product_get_request.dto";
//localhost:3000/product
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('insert')
    async insert(@Body() body: ProductInsertRequestDTO, @Res() res: Response) {
        try {
            const responseDTO = await this.productService.insert(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

    @Get('get')
    async get(@Res() res: Response, @Query() query: ProductGetRequestDTO) {
        try {
            const responseDTO = await this.productService.get(query);
            return res.status(HttpStatus.OK).json(responseDTO)
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Post('update/:id')
    async update(@Param('id') id: string, @Body() body: ProductInsertRequestDTO, @Res() res: Response) {
        try {
            const responseDTO = await this.productService.update(id, body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);

        }
    }
}
