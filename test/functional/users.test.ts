import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Users test functional', () => {
  beforeAll(async () => await User.deleteMany({}));

  describe('When creating a new user', () => {
    test('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@email.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          // ...{ password: response.body.password },
          ...{ password: expect.any(String) },
        })
      );
    });

    test('should return a 422 when there is a validation error', async () => {
      const newUser = {
        // name: 'John Doe', //-- should fail 'cause this is required
        email: 'jane@email.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    test('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@email.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  });

  describe('When authenticating a user', () => {
    test('should generate a token for a valid user', async () => {
      // arrange
      const newUser = {
        name: 'John Wick',
        email: 'wick.john@email.com',
        password: '123456',
      };
      const user = new User(newUser);

      // act
      await user.save();

      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });

      // assert
      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    test('should return UNAUTHORIZED when the user with the provided email is not found', async () => {
      // act
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: 'some-email@mail.com', password: '1234' });

      // assert
      expect(response.status).toBe(401);
    });

    test('should return UNAUTHORIZED when the user is found but the password does not match', async () => {
      // arrange
      const newUser = {
        name: 'Jane Wick',
        email: 'jane@wick@mail.com',
        password: '1234',
      };

      // act
      await new User(newUser).save();

      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: 'different password' });

      // assert
      expect(response.status).toBe(401);
    });
  });
});
