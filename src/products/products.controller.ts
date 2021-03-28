import { Controller, Get, Logger, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe, Body, UseGuards, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilterProductDto } from './dto/filter-product-dto';
import { CreateProductDTO } from './dto/create-product-dto';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
    private logger = new Logger('ProductsController');
    constructor(private productsService:ProductsService) {}

    @Get()
    @UsePipes(new ValidationPipe({transform: true}))
    getProducts(
        @Query() filterProductDto: FilterProductDto,
        @GetUser() user
    ): Promise<Product[]> {
        this.logger.log(`Return all products`);
        return this.productsService.getProducts(filterProductDto, user);
    }

    @Get('/:id')
    getProduct(
        @Param('id', ParseIntPipe) id: Number
    ): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Post()
    createProduct(
        @GetUser() user,
        @Body(ValidationPipe) createProductDto: CreateProductDTO
    ): Promise<Product> {
        return this.productsService.createProduct(createProductDto, user);
    }

    @Delete('/:id')    
    deleteProduct(
        @Param('id', ParseIntPipe) id: Number,
        @GetUser() user
    ): Promise<void> {
        return this.productsService.deleteProduct(id,user);
    }
}
