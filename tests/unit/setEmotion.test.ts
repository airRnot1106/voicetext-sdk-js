import { VoiceText } from '../../src/index';

describe('VoiceText#setEmotion', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'takeru' });
        expect(() => target.setEmotion('happiness')).not.toThrow();
        expect(
            () =>
                new VoiceText({
                    apiKey: 'test',
                    speaker: 'takeru',
                    emotion: 'happiness',
                })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'takeru' });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(() => target.setEmotion('')).toThrow('Emotion must be one of');
    });

    test('case invalid in constructor', () => {
        expect(
            () =>
                new VoiceText({
                    apiKey: 'test',
                    speaker: 'takeru',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    emotion: '',
                })
        ).toThrow('Emotion must be one of');
    });

    test('case show', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'show' });
        expect(() => target.setEmotion('happiness')).toThrow(
            'Speaker "show" cannot set emote or the speaker is not set.'
        );
    });
});
