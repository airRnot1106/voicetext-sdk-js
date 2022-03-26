import dotenv from 'dotenv';

import { VoiceText } from '../../src/index';

dotenv.config();

describe('authorization', () => {
    test('case valid', async () => {
        const target = new VoiceText({ apiKey: process.env['API_KEY'] ?? '' });
        await expect(target.fetchBuffer()).resolves.not.toThrow();
    });
});
