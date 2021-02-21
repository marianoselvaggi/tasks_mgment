import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCrendialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signup(authCrendialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validatePassword(authCredentialsDto);

        if(!username) {
            throw new UnauthorizedException();
        }

        const payload: JwtPayload =  { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
