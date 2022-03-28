import { VoiceText } from '../../src/index';

describe('VoiceText#setEmotionLevel', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'takeru' });
        expect(() => target.setEmotionLevel(2)).not.toThrow();
        expect(
            () =>
                new VoiceText({
                    apiKey: 'test',
                    speaker: 'takeru',
                    emotion_level: 2,
                })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'takeru' });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        expect(() => target.setEmotionLevel(0)).toThrow(
            'Emotion level must be between 1 and 4.'
        );
    });

    test('case invalid in constructor', () => {
        expect(
            () =>
                new VoiceText({
                    apiKey: 'test',
                    speaker: 'takeru',
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    emotion_level: 0,
                })
        ).toThrow('Emotion level must be between 1 and 4.');
    });

    test('case show', () => {
        const target = new VoiceText({ apiKey: 'test', speaker: 'show' });
        expect(() => target.setEmotionLevel(2)).toThrow(
            'Speaker "show" cannot set emote or the speaker is not set.'
        );
    });
});
