import { VoiceText } from '../../src/index';

describe('params', () => {
    test('case valid constructor', () => {
        expect(
            () =>
                new VoiceText({
                    apiKey: 'test',
                    text: 'test',
                    speaker: 'takeru',
                    format: 'mp3',
                    pitch: 100,
                    speed: 100,
                    volume: 100,
                    emotion: 'happiness',
                    emotion_level: 2,
                })
        ).not.toThrow();
    });
});
