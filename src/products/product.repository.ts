import { EntityRepository, Repository } from 'typeorm';
import { Product } from './product.entity';
import { FilterProductDto } from './dto/filter-product-dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product-dto';
import { User } from '../auth/user.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    private logger = new Logger('ProductRepository');
    
    async getAllProducts(
        filterProductDto: FilterProductDto,
        user: User
    ): Promise<Product[]> {
        const { search, price, type } = filterProductDto;

        const query = this.createQueryBuilder('product');
        query.innerJoinAndSelect('product.users', 'user');
        query.andWhere('user.id = :userId', { userId: user.id })
        
        if(price) {
            query.andWhere('product.price >= :price', { price });
        }
        if(search) {
            query.andWhere('product.title LIKE :title', {
                title: `%${search}%`
            })
        }
        if(type) {
            query.andWhere('product.type = :type', { type });
        }
        query.select(['product.id','product.type','product.title','product.price','user.id','user.username']);
        try {            
            const products = await query.getMany();
            
            return products;
        } catch(err) {
            this.logger.error(`Error to retrieve products. Filters: ${JSON.stringify(filterProductDto)}`, err.stack)
            
        }
    }

    async createProduct(createProductDto: CreateProductDTO, user: User): Promise<Product> {
        const newProduct = new Product();
        Object.assign(newProduct,createProductDto);
        newProduct.users = [];
        newProduct.users.push(user);
        await newProduct.save();
        this.logger.log(`New product created: ${newProduct.id}`);
        return newProduct;
    }

    async deleteProduct(id: Number, user: User) {
        const userId = user.id;
        const query = this.createQueryBuilder('product');
        query.innerJoinAndSelect('product.users','user');
        query.andWhere('product.id = :id', { id });
        query.andWhere('user.id = :userId', { userId });
        query.select('product.id');
        const product = await query.getOne(); 
        if (!product) {
            throw new NotFoundException(`The product with id "${id}" does not exist.`);
        }
        await product.remove();
    }
};