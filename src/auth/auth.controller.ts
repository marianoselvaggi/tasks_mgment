import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return await this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    async signIn(
        @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
    ): Promise<{ accessToken: string }> {
        this.logger.debug(`User ${JSON.stringify(authCredentialsDto)} logged in`);
        return await this.authService.signIn(authCredentialsDto);
    }
}
