import { EntityRepository, Repository, Column } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        
        const user = new User();
        user.salt = await bcrypt.genSalt(); 
        user.username = username;
        user.password = await this.hashPassword(password,user.salt);
        
        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('The user already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password,salt);
    }
}