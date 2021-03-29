import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterProductDto } from './dto/filter-product-dto';
import { CreateProductDTO } from './dto/create-product-dto';
import { Product } from './product.entity';
import { User } from '../auth/user.entity';
import { ProductType } from './product-type.enum';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository
    ) {}

    async getProducts(
        filterProductDto: FilterProductDto,
        user: User
    ) {
        return await this.productRepository.getAllProducts(filterProductDto, user);
    }

    async getProductById(id: Number) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['users']
        });
        if(!product) {
            throw new NotFoundException(`The product with id "${id}" does not exist`);
        }
        product.users.forEach(user => {
            delete user.salt;
            delete user.password;
        });
        return product;
    }

    async createProduct(createProductDto: CreateProductDTO, user: User): Promise<Product> {
        return this.productRepository.createProduct(createProductDto, user);
    }

    async deleteProduct(id: Number, user: User): Promise<void> {
        return this.productRepository.deleteProduct(id,user);
    }

    async updateProductType(id: Number, type: ProductType, user: User): Promise<Product> {
        return this.productRepository.updateProductType(id,type,user);
    }
}
