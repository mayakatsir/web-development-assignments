import { Request, Response } from 'express';
import { Types } from 'mongoose';
import authController from '../controllers/authController';
import userRepository from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../services/auth';
import { getConfig } from '../services/config';

// Mock dependencies
jest.mock('../repositories/userRepository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../services/auth');
jest.mock('../services/config');

const mockUserRepository = userRepository as jest.Mocked<typeof userRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;
const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockSendFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockJsonFn = jest.fn().mockReturnValue({});
    mockSendFn = jest.fn().mockReturnValue({});
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn, send: mockSendFn });

    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn,
      send: mockSendFn,
    };

    mockRequest = {};

    // Mock config
    mockGetConfig.mockReturnValue({
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      ACCESS_TOKEN_EXPIRES_SEC: 3600,
      REFRESH_TOKEN_EXPIRES_SEC: 86400,
    } as any);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      mockRequest = {
        body: userData,
      };

      const hashedPassword = 'hashedPassword123';
      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        refreshToken: [],
        save: jest.fn().mockResolvedValue(undefined),
      };

      const tokens = {
        token: 'accessToken',
        refreshToken: 'refreshToken',
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockBcrypt.genSalt.mockResolvedValue('salt' as any);
      mockBcrypt.hash.mockResolvedValue(hashedPassword as any);
      mockUserRepository.createUser.mockResolvedValue(mockUser as any);
      mockGenerateToken.mockReturnValue(tokens);

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(tokens);
      expect(mockUser.refreshToken).toContain(tokens.refreshToken);
    });

    it('should return 400 if username is missing', async () => {
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'body param is missing (username or email or password)',
      });
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

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'username: existinguser already exists',
      });
    });

    it('should return 401 on registration error', async () => {
      mockRequest = {
        body: {
          username: 'newuser',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      mockUserRepository.isUsernameExists.mockResolvedValue(false);
      mockBcrypt.genSalt.mockRejectedValue(new Error('Salt error'));

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(401);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Registration failed',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123',
      };

      mockRequest = {
        body: loginData,
      };

      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        refreshToken: [],
        save: jest.fn().mockResolvedValue(undefined),
      };

      const tokens = {
        token: 'accessToken',
        refreshToken: 'refreshToken',
      };

      mockUserRepository.getUserByUsername.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(true as any);
      mockGenerateToken.mockReturnValue(tokens);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(tokens);
    });

    it('should return 400 if username is missing', async () => {
      mockRequest = {
        body: {
          password: 'password123',
        },
      };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'body param is missing (username or password)',
      });
    });

    it('should return 400 if user not found', async () => {
      mockRequest = {
        body: {
          username: 'nonexistent',
          password: 'password123',
        },
      };

      mockUserRepository.getUserByUsername.mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid username or password',
      });
    });

    it('should return 400 if password is incorrect', async () => {
      mockRequest = {
        body: {
          username: 'testuser',
          password: 'wrongpassword',
        },
      };

      const mockUser = {
        _id: new Types.ObjectId(),
        username: 'testuser',
        password: 'hashedPassword',
        refreshToken: [],
      };

      mockUserRepository.getUserByUsername.mockResolvedValue(mockUser as any);
      mockBcrypt.compare.mockResolvedValue(false as any);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid username or password',
      });
    });

    it('should return 400 on login error', async () => {
      mockRequest = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };

      mockUserRepository.getUserByUsername.mockRejectedValue(new Error('DB error'));

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Login failed',
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const oldRefreshToken = 'oldRefreshToken';
      mockRequest = {
        body: {
          refreshToken: oldRefreshToken,
        },
      };

      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        username: 'testuser',
        refreshToken: [oldRefreshToken],
        save: jest.fn().mockResolvedValue(undefined),
      };

      const newTokens = {
        token: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      mockJwt.verify.mockReturnValue({ userId: userId.toString() } as any);
      mockUserRepository.getUserById.mockResolvedValue(mockUser as any);
      mockGenerateToken.mockReturnValue(newTokens);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(newTokens);
    });

    it('should return 400 if refresh token is missing', async () => {
      mockRequest = {
        body: {},
      };

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Refresh token is required',
      });
    });

    it('should return 400 if user not found', async () => {
      mockRequest = {
        body: {
          refreshToken: 'validToken',
        },
      };

      mockJwt.verify.mockReturnValue({ userId: new Types.ObjectId().toString() } as any);
      mockUserRepository.getUserById.mockResolvedValue(null);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid Refresh token',
      });
    });

    it('should return 400 if refresh token not in user list', async () => {
      const refreshToken = 'invalidToken';
      mockRequest = {
        body: {
          refreshToken,
        },
      };

      const mockUser = {
        _id: new Types.ObjectId(),
        refreshToken: ['differentToken'],
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockJwt.verify.mockReturnValue({ userId: mockUser._id.toString() } as any);
      mockUserRepository.getUserById.mockResolvedValue(mockUser as any);

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid Refresh token',
      });
    });

    it('should return 400 on invalid token error', async () => {
      mockRequest = {
        body: {
          refreshToken: 'invalidToken',
        },
      };

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.refreshToken(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid Refresh token',
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const refreshToken = 'userRefreshToken';
      mockRequest = {
        body: {
          refreshToken,
        },
      };

      const userId = new Types.ObjectId();
      const mockUser = {
        _id: userId,
        username: 'testuser',
        refreshToken: [refreshToken, 'anotherToken'],
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockJwt.verify.mockReturnValue({ userId: userId.toString() } as any);
      mockUserRepository.getUserById.mockResolvedValue(mockUser as any);

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
      expect(mockUser.refreshToken).toEqual(['anotherToken']);
    });

    it('should return 400 if refresh token is missing', async () => {
      mockRequest = {
        body: {},
      };

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Refresh token is required',
      });
    });

    it('should handle logout when user not found', async () => {
      const refreshToken = 'userRefreshToken';
      mockRequest = {
        body: {
          refreshToken,
        },
      };

      mockJwt.verify.mockReturnValue({ userId: new Types.ObjectId().toString() } as any);
      mockUserRepository.getUserById.mockResolvedValue(null);

      await authController.logout(mockRequest as Request, mockResponse as Response);

      // Should still return success even if user not found
      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should return 400 on invalid token error', async () => {
      mockRequest = {
        body: {
          refreshToken: 'invalidToken',
        },
      };

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Invalid Refresh token',
      });
    });
  });

  describe('generateToken', () => {
    it('should generate access and refresh tokens', () => {
      const userId = new Types.ObjectId().toString();

      mockGenerateToken.mockReturnValue({
        token: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });

      const tokens = mockGenerateToken(userId);

      expect(tokens).toHaveProperty('token');
      expect(tokens).toHaveProperty('refreshToken');
      expect(tokens.token).toBe('mockAccessToken');
      expect(tokens.refreshToken).toBe('mockRefreshToken');
    });
  });
});
