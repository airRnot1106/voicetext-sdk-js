import dotenv from 'dotenv';
import { Readable } from 'stream';

import { VoiceText } from '../../src/index';

dotenv.config();

describe('VoiceText#stream', () => {
    test('case valid', async () => {
        const target = new VoiceText({ apiKey: process.env['API_KEY'] ?? '' });
        const result = await target.stream();
        expect(result).toBeInstanceOf(Readable);
    });

    test('case invalid', async () => {
        const target = new VoiceText({ apiKey: 'invalid' });
        await expect(() => target.stream()).rejects.toThrow();
    });
});
