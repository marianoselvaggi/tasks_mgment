import { Controller, Get, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    private logger = new Logger('ProductsController');
    constructor(private productsService:ProductsService) {}

    @Get()
    getProducts(): Promise<Product[]> {
        this.logger.log(`Return all products`);
        return this.productsService.getProducts();
    }
}
