import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ProductType } from './product-type.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    title: String;

    @Column()
    type: ProductType;

    @Column()
    price: Number;

    @ManyToMany(type => User)
    @JoinTable()
    users: User[]
};