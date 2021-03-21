import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne: jest.fn()
});

describe('jwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository }
            ]
        }).compile();
        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('validateUser', () => {
        it('validates and returns the user based on JWT payload', async () => {
            const user = new User();
            user.username = 'TestUser';

            userRepository.findOne.mockResolvedValue(user);
            const result = await jwtStrategy.validate({ username: 'TestUser' });
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
            expect(result).toEqual(user);
        });

        it('throws an error if it is an unauthorized user', async () => {
            userRepository.findOne.mockResolvedValue(null);
            expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrowError(UnauthorizedException); 
        });
    });
});