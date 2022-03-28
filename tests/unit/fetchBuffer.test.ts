import dotenv from 'dotenv';

import { VoiceText } from '../../src/index';

dotenv.config();

describe('VoiceText#fetchBuffer', () => {
    test('case valid', async () => {
        const target = new VoiceText({ apiKey: process.env['API_KEY'] ?? '' });
        expect(Buffer.isBuffer(await target.fetchBuffer())).toBe(true);
    });

    test('case invalid', async () => {
        const target = new VoiceText({ apiKey: 'invalid' });
        await expect(() => target.fetchBuffer()).rejects.toThrow();
    });
});
