import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockedcredentialsDTO = { username: 'TestUser', password: 'TestPassword' };

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile();
        
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('succesfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signup(mockedcredentialsDTO)).resolves.not.toThrow();
        });

        it('it throws an error if the user already exists', () => {
            save.mockRejectedValue({ code: '23505' });
            expect(userRepository.signup(mockedcredentialsDTO)).rejects.toThrow(ConflictException);
        });

        it('it throws an error if the user already exists', () => {
            save.mockRejectedValue({ code: '1111' }); // unhandled error code
            expect(userRepository.signup(mockedcredentialsDTO)).rejects.toThrow(InternalServerErrorException);
        })
    });

    describe('validateUserPassword', () => {
        let user;
        beforeEach(() => {
            userRepository.findOne = jest.fn();

            user = new User();
            user.username = 'TestUser';
            user.validatePassword = jest.fn();

        });
        it('returns a username as a validation is successfull', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result = await userRepository.validatePassword(mockedcredentialsDTO);
            expect(result).toEqual('TestUser');

        });
        it('returns null as user can not be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validatePassword(mockedcredentialsDTO);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });
        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validatePassword(mockedcredentialsDTO);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });
    
    describe('hashPassword', () => {
        it('calls bcrypt.hash to generate  a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword','testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');
        });
    });
});