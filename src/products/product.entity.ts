import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductType } from './product-type.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    title: String;

    @Column()
    type: ProductType;

    @Column()
    price: Number;

    @ManyToMany(type => User, user => user.products)
    @JoinTable()
    users: User[];
};