import { Request, Response } from 'express';
import { Types } from 'mongoose';
import postController from '../controllers/postController';
import PostRepository from '../repositories/postRepository';

// Mock the repository
jest.mock('../repositories/postRepository');

const mockPostRepository = PostRepository as jest.Mocked<typeof PostRepository>;

describe('PostController', () => {
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

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const postData = {
        sender: 'user1',
        title: 'My First Post',
        content: 'This is the content',
      };

      mockRequest = {
        body: postData,
      };

      const createdPost = { _id: new Types.ObjectId(), ...postData };
      mockPostRepository.createPost.mockResolvedValue(createdPost as any);

      await postController.createPost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith(createdPost);
    });

    it('should return 400 if sender is missing', async () => {
      mockRequest = {
        body: {
          title: 'My First Post',
          content: 'Content here',
        },
      };

      await postController.createPost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'body param is missing (sender or title)',
      });
    });

    it('should return 400 if title is missing', async () => {
      mockRequest = {
        body: {
          sender: 'user1',
          content: 'Content here',
        },
      };

      await postController.createPost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
    });

    it('should handle errors when creating post', async () => {
      mockRequest = {
        body: {
          sender: 'user1',
          title: 'My First Post',
          content: 'Content',
        },
      };

      mockPostRepository.createPost.mockRejectedValue(new Error('DB error'));

      await postController.createPost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const postId = new Types.ObjectId().toString();
      const post = {
        _id: postId,
        sender: 'user1',
        title: 'My Post',
        content: 'Content',
      };

      mockRequest = {
        params: { id: postId },
      };

      mockPostRepository.getPostById.mockResolvedValue(post as any);

      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ post });
    });

    it('should return 400 if post id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should return 404 if post not found', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: postId },
      };

      mockPostRepository.getPostById.mockResolvedValue(null);

      await postController.getPostById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `didn't find post with id: ${postId}`,
      });
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const posts = [
        { _id: new Types.ObjectId(), sender: 'user1', title: 'Post 1', content: 'Content 1' },
        { _id: new Types.ObjectId(), sender: 'user2', title: 'Post 2', content: 'Content 2' },
      ];

      mockRequest = {
        query: {},
      };

      mockPostRepository.getAllPosts.mockResolvedValue(posts as any);

      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ posts });
    });

    it('should filter posts by sender', async () => {
      const posts = [
        { _id: new Types.ObjectId(), sender: 'user1', title: 'Post 1', content: 'Content 1' },
      ];

      mockRequest = {
        query: { sender: 'user1' },
      };

      mockPostRepository.getAllPosts.mockResolvedValue(posts as any);

      await postController.getAllPosts(mockRequest as Request, mockResponse as Response);

      expect(mockPostRepository.getAllPosts).toHaveBeenCalledWith({ sender: 'user1' });
      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({ posts });
    });
  });

  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: postId },
        body: {
          title: 'Updated Title',
          content: 'Updated Content',
          sender: 'user1',
        },
      };

      const existingPost = {
        _id: postId,
        sender: 'user1',
        title: 'Old Title',
        content: 'Old Content',
      };

      mockPostRepository.getPostById.mockResolvedValue(existingPost as any);
      mockPostRepository.updatePost.mockResolvedValue(undefined);

      await postController.updatePost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Post updated successfully',
      });
    });

    it('should return 400 if post id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
        body: { title: 'Updated' },
      };

      await postController.updatePost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should return 404 if post not found', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: postId },
        body: { title: 'Updated' },
      };

      mockPostRepository.getPostById.mockResolvedValue(null);

      await postController.updatePost(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `didn't find post with id: ${postId}`,
      });
    });
  });

  describe('deletePostById', () => {
    it('should delete a post successfully', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: postId },
      };

      const existingPost = {
        _id: postId,
        sender: 'user1',
        title: 'Post to Delete',
        content: 'Content',
      };

      mockPostRepository.getPostById.mockResolvedValue(existingPost as any);
      mockPostRepository.deletePostById.mockResolvedValue(undefined);

      await postController.deletePostById(mockRequest as Request, mockResponse as Response);

      expect(mockPostRepository.deletePostById).toHaveBeenCalledWith(postId);
      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'Post deleted successfully',
      });
    });

    it('should return 400 if post id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await postController.deletePostById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: 'id: invalid-id is not valid',
      });
    });

    it('should return 404 if post not found', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: postId },
      };

      mockPostRepository.getPostById.mockResolvedValue(null);

      await postController.deletePostById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockSendFn).toHaveBeenCalledWith({
        message: `didn't find post with id: ${postId}`,
      });
    });
  });
});
