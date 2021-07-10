import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let userService: UsersService;
  const findOne = jest.fn();
  const create = jest.fn();
  const save = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne, create, save },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when getting a user by email', () => {
    let user: User;

    describe(' the user is matched', () => {
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchUser = await userService.getByEmail('test@test.com');
        expect(fetchUser).toEqual(user);
      });
    });

    describe('the user is not matched', () => {
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(userService.getByEmail('test@test.com')).rejects.toThrow();
      });
    });
  });

  describe('when getting a user by id', () => {
    let user: User;
    describe('the user is match', () => {
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });

      it('should return the user', async () => {
        const fetchUser = await userService.getById(1);
        expect(fetchUser).toEqual(user);
      });
    });

    describe('the user id is not match', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });

      it('should throw an error', async () => {
        const errorExpected = new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
        await expect(userService.getById(1)).rejects.toThrow(errorExpected);
      });
    });
  });

  describe('when creating user ...', () => {
    const user = new User();
    create.mockReturnValue(Promise.resolve(user));
    save.mockImplementation(() => Promise.resolve(user));
    it('should be return user', async () => {
      const userDTO = new CreateUserDTO();
      const newUser = await userService.createUser(userDTO);

      expect(create).toBeCalled();
      expect(newUser).toEqual(user);
      expect(save).toReturnWith(Promise.resolve(user));
    });
  });
});
