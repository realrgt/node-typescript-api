import { Beach } from '../../src/models/beach';
describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}));

  describe('When creating a beach', () => {
    test('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    test('should return 422 when there is a validation error', async () => {
      // arrange
      const newBeach = {
        lat: 'invalid string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };
      // act
      const response = await global.testRequest.post('/beaches').send(newBeach);
      // assert
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid string" (type string) at path "lat"',
      });
    });

    test.todo(
      'should return 500 when there is any error other than validation error'
    );
  });
});
