import { User } from '@src/models/user';

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
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    test('should return a 422 when there is a validation error', async () => {
      const newUser = {
        // name: 'John Doe', //-- should fail 'cause this is required
        email: 'john@email.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });
  });
});
