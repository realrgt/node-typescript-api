import AuthService from '@src/services/auth';
import { authMiddleware } from '../auth';

describe('Auth Middleware', () => {
  test('should verify a JWT and call the next middleware', () => {
    // arrange
    const jwtToken = AuthService.generateToken({ data: 'fake-token' });
    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };
    const resFake = {};
    const nextFake = jest.fn();
    // act
    authMiddleware(reqFake, resFake, nextFake);
    // assert
    expect(nextFake).toHaveBeenCalled();
  });

  test('should return UNAUTHORIZED when there is a problem on the token verification', () => {
    // arrange
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    // act
    authMiddleware(reqFake, resFake as Record<string, unknown>, nextFake);
    // expect
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  test('should return UNAUTHORIZED when there is no token', () => {
    // arrange
    const reqFake = {
      headers: {},
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    // act
    authMiddleware(reqFake, resFake as Record<string, unknown>, nextFake);
    // expect
    expect(resFake.status).toHaveBeenCalledWith(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
