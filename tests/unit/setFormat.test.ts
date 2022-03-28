import { VoiceText } from '../../src/index';

describe('VoiceText#setFormat', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setFormat('mp3')).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', format: 'ogg' })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(() => target.setFormat('')).toThrow('Format must be one of');
    });

    test('case invalid in constructor', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(() => new VoiceText({ apiKey: 'test', format: '' })).toThrow(
            'Format must be one of'
        );
    });
});
