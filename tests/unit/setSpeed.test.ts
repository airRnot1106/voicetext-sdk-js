import { VoiceText } from '../../src/index';

describe('VoiceText#setSpeed', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setSpeed(50)).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', speed: 150 })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setSpeed(-1)).toThrow(
            'Speed must be between 50 and 400.'
        );
        expect(() => target.setSpeed(500)).toThrow(
            'Speed must be between 50 and 400.'
        );
    });

    test('case invalid in constructor', () => {
        expect(() => new VoiceText({ apiKey: 'test', speed: -1 })).toThrow(
            'Speed must be between 50 and 400.'
        );
        expect(() => new VoiceText({ apiKey: 'test', speed: 500 })).toThrow(
            'Speed must be between 50 and 400.'
        );
    });
});
