import { VoiceText } from '../../src/index';

describe('VoiceText#setText', () => {
    test('case valid', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setText('test')).not.toThrow();
        expect(
            () => new VoiceText({ apiKey: 'test', text: 'example' })
        ).not.toThrow();
    });

    test('case invalid in method', () => {
        const target = new VoiceText({ apiKey: 'test' });
        expect(() => target.setText('')).toThrow(
            'Text must be between 1 and 200 characters.'
        );
    });

    test('case invalid in constructor', () => {
        expect(() => new VoiceText({ apiKey: 'test', text: '' })).toThrow(
            'Text must be between 1 and 200 characters.'
        );
    });
});
