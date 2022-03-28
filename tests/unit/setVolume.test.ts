import { VoiceText } from '../../src/index';

describe('VoiceText#setVolume', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setVolume(50)).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', volume: 150 })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setVolume(-1)).toThrow(
            'Volume must be between 50 and 200.'
        );
        expect(() => target.setVolume(500)).toThrow(
            'Volume must be between 50 and 200.'
        );
    });

    test('case invalid in constructor', () => {
        expect(() => new VoiceText({ apiKey: 'test', volume: -1 })).toThrow(
            'Volume must be between 50 and 200.'
        );
        expect(() => new VoiceText({ apiKey: 'test', volume: 500 })).toThrow(
            'Volume must be between 50 and 200.'
        );
    });
});
