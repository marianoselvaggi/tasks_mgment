import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';
import { Product } from "src/products/product.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    @ManyToMany(type => Product, product => product.users)
    products: Product[]

    async validatePassword(password: string):Promise<boolean> {
        const hash = await bcrypt.hash(password,this.salt);
        return hash === this.password;
    }
}