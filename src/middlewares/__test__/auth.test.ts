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
});
