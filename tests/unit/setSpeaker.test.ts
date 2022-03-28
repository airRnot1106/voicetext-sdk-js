import { VoiceText } from '../../src/index';

describe('VoiceText#setSpeaker', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setSpeaker('takeru')).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', speaker: 'santa' })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(() => target.setSpeaker('')).toThrow();
    });

    test('case invalid in constructor', () => {
        expect(
            () =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                new VoiceText({ apiKey: 'test', speaker: '' })
        ).toThrow();
    });
});
