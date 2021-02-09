import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'postgres',
    database: 'nextjs_task_mangement',
    autoLoadEntities: true,
    synchronize: true
};