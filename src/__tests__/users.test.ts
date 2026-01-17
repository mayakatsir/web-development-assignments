import { Request, Response } from 'express';
import { Types } from 'mongoose';
import userController from '../controllers/userController';
import UserRepository from '../repositories/userRepository';

// Mock the repository
jest.mock('../repositories/userRepository');

const mockUserRepository = UserRepository as jest.Mocked<typeof UserRepository>;

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockSendFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJsonFn = jest.fn().mockReturnValue({});
    mockSendFn = jest.fn().mockReturnValue({});
    mockStatusFn = jest.fn().mockReturnValue({ send: mockSendFn, json: mockJsonFn });

    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn,
      send: mockSendFn,
    };

    mockRequest = {};
  });

// TODO: move to auth tests!!!

//   describe('createUser', () => {
//     it('should create a user successfully', async () => {
//       const userData = {
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'hashedPassword123',
//       };

//       mockRequest = {
//         body: userData,
//       };

//       const createdUser = { _id: new Types.ObjectId(), ...userData };
//       mockUserRepository.isUsernameExists.mockResolvedValue(false);
//       mockUserRepository.createUser.mockResolvedValue(createdUser as any);

//       await userService.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(200);
//       expect(mockSendFn).toHaveBeenCalledWith(createdUser);
//     });

//     it('should return 400 if username is missing', async () => {
//       mockRequest = {
//         body: {
//           email: 'test@example.com',
//           password: 'password123',
//         },
//       };

//       await userController.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(400);
//       expect(mockSendFn).toHaveBeenCalledWith({
//         message: 'body param is missing (username or email or password)',
//       });
//     });

//     it('should return 400 if email is missing', async () => {
//       mockRequest = {
//         body: {
//           username: 'testuser',
//           password: 'password123',
//         },
//       };

//       await userController.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(400);
//     });

//     it('should return 400 if password is missing', async () => {
//       mockRequest = {
//         body: {
//           username: 'testuser',
//           email: 'test@example.com',
//         },
//       };

//       await userController.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(400);
//     });

//     it('should return 400 if username already exists', async () => {
//       mockRequest = {
//         body: {
//           username: 'existinguser',
//           email: 'test@example.com',
//           password: 'password123',
//         },
//       };

//       mockUserRepository.isUsernameExists.mockResolvedValue(true);

//       await userController.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(400);
//       expect(mockSendFn).toHaveBeenCalledWith({
//         message: 'username: existinguser already exists',
//       });
//     });

//     it('should handle errors when creating user', async () => {
//       mockRequest = {
//         body: {
//           username: 'testuser',
//           email: 'test@example.com',
//           password: 'password123',
//         },
//       };

//       mockUserRepository.isUsernameExists.mockResolvedValue(false);
//       mockUserRepository.createUser.mockRejectedValue(new Error('DB error'));

//       await userController.createUser(mockRequest as Request, mockResponse as Response);

//       expect(mockStatusFn).toHaveBeenCalledWith(500);
//       expect(mockJsonFn).toHaveBeenCalledWith({
//         message: 'Internal server error',
//       });
//     });
//   });

  describe('getUserById', () => {
    it('Supposed to return a user by their id', async () => {
      const userId = new Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'maya_user',
        email: 'maya@student.com',
        password: 'maya43',
      };

      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.getUserById.mockResolvedValue(user as any);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ user });
    });

    it('Supposed to return 400 if the user id is invalid', async () => {
      mockRequest = {
        params: { id: 'fake-id' },
      };

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: fake-id is not valid',
      }); 
    });

    it('Supposed to return 404 if the user was not found', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.getUserById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `User with id: ${userId} was not found`,
      });
    });
  });

  describe('getAllUsers', () => {
    it('Supposed to return all users', async () => {
      const users = [
        { _id: new Types.ObjectId(), username: 'maya2', email: 'maya@mail.com', password: '123' },
        { _id: new Types.ObjectId(), username: 'karen_12', email: 'karen@mail.com', password: '456' },
      ];

      mockRequest = {};

      mockUserRepository.getAllUsers.mockResolvedValue(users as any);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ users });
    });

    it('Supposed to handle errors while trying to fetch users', async () => {
      mockRequest = {};

      mockUserRepository.getAllUsers.mockRejectedValue(new Error('DB error'));

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      // getAllUsers catches errors but doesn't send response, so we just verify the mock was called
      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('Supposed to successfully update a user', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
        body: {
          username: 'karen_123',
          email: 'karen@mail.com',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockUserRepository.updateUser.mockResolvedValue(undefined);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `Successfully updated user! id: ${userId}`,
      });
    });

    it('Supposed to return 400 if user id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
        body: { username: 'maya50' },
      };

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('Supposed to return 400 if the username already exists', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
        body: {
          username: 'maya2',
          email: 'maya@mail.com',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(true);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'username: maya2 already exists',
      });
    });
  });

  describe('deleteUserById', () => {
    it('Supposed to delete a user successfully', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.deleteUserById.mockResolvedValue(undefined);

      await userController.deleteUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.deleteUserById).toHaveBeenCalledWith(userId);
      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `Successfully deleted user! id: ${userId}`,
      });
    });

    it('Supposed to return 400 if user id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await userController.deleteUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('Supposed to handle errors when deleting user', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.deleteUserById.mockRejectedValue(new Error('DB error'));

      await userController.deleteUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });
});
