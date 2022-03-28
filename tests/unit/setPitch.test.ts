import { VoiceText } from '../../src/index';

describe('VoiceText#setPitch', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setPitch(50)).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', pitch: 150 })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setPitch(-1)).toThrow(
            'Pitch must be between 50 and 200.'
        );
        expect(() => target.setPitch(500)).toThrow(
            'Pitch must be between 50 and 200.'
        );
    });

    test('case invalid in constructor', () => {
        expect(() => new VoiceText({ apiKey: 'test', pitch: -1 })).toThrow(
            'Pitch must be between 50 and 200.'
        );
        expect(() => new VoiceText({ apiKey: 'test', pitch: 500 })).toThrow(
            'Pitch must be between 50 and 200.'
        );
    });
});
