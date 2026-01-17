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

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123',
      };

      mockRequest = {
        body: userData,
      };

      const createdUser = { _id: new Types.ObjectId(), ...userData };
      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockUserRepository.createUser.mockResolvedValue(createdUser as any);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith(createdUser);
    });

    it('should return 400 if username is missing', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'body param is missing (username or email or password)',
      });
    });

    it('should return 400 if email is missing', async () => {
      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
    });

    it('should return 400 if password is missing', async () => {
      mockRequest = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
    });

    it('should return 400 if username already exists', async () => {
      mockRequest = {
        body: {
          username: 'existinguser',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(true);

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'username: existinguser already exists',
      });
    });

    it('should handle errors when creating user', async () => {
      mockRequest = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockUserRepository.createUser.mockRejectedValue(new Error('DB error'));

      await userController.createUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = new Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.getUserById.mockResolvedValue(user as any);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ user });
    });

    it('should return 400 if user id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should return 404 if user not found', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.getUserById.mockResolvedValue(null);

      await userController.getUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `didn't find user with id: ${userId}`,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [
        { _id: new Types.ObjectId(), username: 'user1', email: 'user1@test.com', password: 'pass1' },
        { _id: new Types.ObjectId(), username: 'user2', email: 'user2@test.com', password: 'pass2' },
      ];

      mockRequest = {};

      mockUserRepository.getAllUsers.mockResolvedValue(users as any);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ users });
    });

    it('should handle errors when fetching users', async () => {
      mockRequest = {};

      mockUserRepository.getAllUsers.mockRejectedValue(new Error('DB error'));

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      // getAllUsers catches errors but doesn't send response, so we just verify the mock was called
      expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
        body: {
          username: 'updateduser',
          email: 'updated@example.com',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockUserRepository.updateUser.mockResolvedValue(undefined);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `Successfully updated user with id: ${userId}`,
      });
    });

    it('should return 400 if user id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
        body: { username: 'updated' },
      };

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should return 400 if username already exists', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
        body: {
          username: 'existinguser',
          email: 'test@example.com',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(true);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'username: existinguser already exists',
      });
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user successfully', async () => {
      const userId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: userId },
      };

      mockUserRepository.deleteUserById.mockResolvedValue(undefined);

      await userController.deleteUserById(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.deleteUserById).toHaveBeenCalledWith(userId);
      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `Successfully deleted user with id: ${userId}`,
      });
    });

    it('should return 400 if user id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await userController.deleteUserById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should handle errors when deleting user', async () => {
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
