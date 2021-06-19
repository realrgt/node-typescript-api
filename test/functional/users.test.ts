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
  });
});
