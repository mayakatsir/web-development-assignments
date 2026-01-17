import { Request, Response } from 'express';
import { Types } from 'mongoose';
import commentController from '../controllers/commentController';
import commentRepository from '../repositories/commentRepository';
import postRepository from '../repositories/postRepository';

// Mock the repositories
jest.mock('../repositories/commentRepository');
jest.mock('../repositories/postRepository');

const mockCommentRepository = commentRepository as jest.Mocked<typeof commentRepository>;
const mockPostRepository = postRepository as jest.Mocked<typeof postRepository>;

describe('CommentController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup response mock
    mockJsonFn = jest.fn().mockReturnValue({});
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });

    mockResponse = {
      status: mockStatusFn,
      json: mockJsonFn,
    };

    mockRequest = {};
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const postId = new Types.ObjectId().toString();
      const commentData = {
        sender: 'user1',
        content: 'Great post!',
        postId: postId,
      };

      mockRequest = {
        body: commentData,
      };

      mockPostRepository.getPostById.mockResolvedValue({ _id: postId });
      mockCommentRepository.createComment.mockResolvedValue(undefined);

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalled();
    });

    it('should return 400 if sender is missing', async () => {
      mockRequest = {
        body: {
          content: 'Great post!',
          postId: new Types.ObjectId().toString(),
        },
      };

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Sender or postId is missing from body params',
      });
    });

    it('should return 400 if postId is missing', async () => {
      mockRequest = {
        body: {
          sender: 'user1',
          content: 'Great post!',
        },
      };

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
    });

    it('should return 400 if postId is invalid ObjectId', async () => {
      mockRequest = {
        body: {
          sender: 'user1',
          content: 'Great post!',
          postId: 'invalid-id',
        },
      };

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid postId: invalid-id param',
      });
    });

    it('should return 400 if post does not exist', async () => {
      const postId = new Types.ObjectId().toString();
      mockRequest = {
        body: {
          sender: 'user1',
          content: 'Great post!',
          postId: postId,
        },
      };

      mockPostRepository.getPostById.mockResolvedValue(null);

      await commentController.createComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: `Non existent post with id: ${postId}`,
      });
    });
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const comments = [
        { _id: new Types.ObjectId(), sender: 'user1', content: 'Nice!', postId: new Types.ObjectId() },
        { _id: new Types.ObjectId(), sender: 'user2', content: 'Cool!', postId: new Types.ObjectId() },
      ];

      mockCommentRepository.getAllComments.mockResolvedValue(comments as any);

      await commentController.getAllComments(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({ comments });
    });

    it('should handle errors when fetching comments', async () => {
      mockCommentRepository.getAllComments.mockRejectedValue(new Error('DB error'));

      await commentController.getAllComments(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by id', async () => {
      const commentId = new Types.ObjectId().toString();
      const comment = {
        _id: commentId,
        sender: 'user1',
        content: 'Nice post!',
        postId: new Types.ObjectId(),
      };

      mockRequest = {
        params: { id: commentId },
      };

      mockCommentRepository.getCommentById.mockResolvedValue(comment as any);

      await commentController.getCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(comment);
    });

    it('should return 400 if comment id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await commentController.getCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid id: invalid-id param',
      });
    });

    it('should return 404 if comment not found', async () => {
      const commentId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: commentId },
      };

      mockCommentRepository.getCommentById.mockResolvedValue(null);

      await commentController.getCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: `Comment with id: ${commentId} not found`,
      });
    });
  });

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      const commentId = new Types.ObjectId().toString();
      const updatedComment = {
        _id: commentId,
        sender: 'user1',
        content: 'Updated content',
        postId: new Types.ObjectId(),
      };

      mockRequest = {
        params: { id: commentId },
        body: { content: 'Updated content' },
      };

      mockCommentRepository.updateComment.mockResolvedValue(updatedComment as any);

      await commentController.updateComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith(updatedComment);
    });

    it('should return 400 if comment id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
        body: { content: 'Updated' },
      };

      await commentController.updateComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid comment ID: invalid-id',
      });
    });

    it('should return 404 if comment not found', async () => {
      const commentId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: commentId },
        body: { content: 'Updated' },
      };

      mockCommentRepository.updateComment.mockResolvedValue(null);

      await commentController.updateComment(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(404);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: `Comment with ID: ${commentId} not found`,
      });
    });
  });

  describe('deleteCommentById', () => {
    it('should delete a comment successfully', async () => {
      const commentId = new Types.ObjectId().toString();
      mockRequest = {
        params: { id: commentId },
      };

      mockCommentRepository.deleteCommentById.mockResolvedValue(undefined);

      await commentController.deleteCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: `Successfully deleted comment ${commentId}`,
      });
    });

    it('should return 400 if comment id is invalid', async () => {
      mockRequest = {
        params: { id: 'invalid-id' },
      };

      await commentController.deleteCommentById(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid comment ID: invalid-id',
      });
    });
  });

  describe('getCommentsByPostId', () => {
    it('should return comments for a specific post', async () => {
      const postId = new Types.ObjectId().toString();
      const comments = [
        { _id: new Types.ObjectId(), sender: 'user1', content: 'Nice!', postId },
        { _id: new Types.ObjectId(), sender: 'user2', content: 'Cool!', postId },
      ];

      mockRequest = {
        params: { postId },
      };

      mockCommentRepository.getCommentsByPostId.mockResolvedValue(comments as any);

      await commentController.getCommentsByPostId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(200);
      expect(mockJsonFn).toHaveBeenCalledWith({ comments });
    });

    it('should return 400 if postId is invalid', async () => {
      mockRequest = {
        params: { postId: 'invalid-id' },
      };

      await commentController.getCommentsByPostId(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid postId: invalid-id param',
      });
    });
  });
});
