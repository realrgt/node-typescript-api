import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';

import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('Should return normalized forecast from the stormGlass service', async () => {
    const lat = 1;
    const lng = 2;

    axios.get = jest
      .fn()
      .mockReturnValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });
});
