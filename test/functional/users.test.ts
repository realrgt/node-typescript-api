import { comparePasswords, User } from '@src/models/user';

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
        comparePasswords(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: response.body.password },
          // ...{ password: expect.any(String) },
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
});
