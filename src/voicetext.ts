import fetch from 'node-fetch';

type SpeakerHasEmotion = 'haruka' | 'hikari' | 'takeru' | 'santa' | 'bear';
type SpeakerWithoutEmotion = 'show';
type Speaker = SpeakerHasEmotion | SpeakerWithoutEmotion;

type Format = 'wav' | 'ogg' | 'mp3';

interface VoiceTextParamsBase {
    readonly apiKey: string;
    text?: string;
    format?: Format;
    pitch?: number;
    speed?: number;
    volume?: number;
}

type Emotion = 'happiness' | 'anger' | 'sadness';

type EmotionLevel = 1 | 2 | 3 | 4;

interface VoiceTextParamsHasEmotion extends VoiceTextParamsBase {
    speaker?: SpeakerHasEmotion;
    emotion?: Emotion;
    emotionLevel?: EmotionLevel;
}

interface VoiceTextParamsWithoutEmotion extends VoiceTextParamsBase {
    speaker?: SpeakerWithoutEmotion;
}

type VoiceTextParams =
    | VoiceTextParamsHasEmotion
    | VoiceTextParamsWithoutEmotion;

export class VoiceText {
    private _voiceTextParams: VoiceTextParams;

    constructor(voiceTextParams: VoiceTextParams) {
        const params: VoiceTextParams = {
            text: '',
            speaker: 'show',
            format: 'wav',
            pitch: 100,
            speed: 100,
            volume: 100,
            ...voiceTextParams,
        };
        if (this._validateParams(params)) {
            params.emotion = params.emotion ?? 'happiness';
            params.emotionLevel = params.emotionLevel ?? 2;
            this._voiceTextParams = params;
        } else {
            this._voiceTextParams = params;
        }
    }

    private _validateParams(
        params: VoiceTextParams
    ): params is VoiceTextParamsHasEmotion {
        if (params.speaker !== 'show') return true;
        return false;
    }

    setText(text: string): this {
        this._voiceTextParams.text = text;
        return this;
    }

    setSpeaker(speaker: Speaker): this {
        this._voiceTextParams.speaker = speaker;
        return this;
    }

    setFormat(format: Format): this {
        this._voiceTextParams.format = format;
        return this;
    }

    setEmotion(emotion: Emotion): this {
        if (!this._validateParams(this._voiceTextParams)) {
            throw new Error('Speaker "show" cannot be set to emote.');
        }
        this._voiceTextParams.emotion = emotion;
        return this;
    }

    setEmotionLevel(level: 1 | 2 | 3 | 4): this {
        if (!this._validateParams(this._voiceTextParams)) {
            throw new Error('Speaker "show" cannot be set to emote.');
        }
        this._voiceTextParams.emotionLevel = level;
        return this;
    }

    setPitch(pitch: number): this {
        if (pitch < 50 || pitch > 200) {
            throw new Error('Pitch must be between 50 and 200.');
        }
        this._voiceTextParams.pitch = pitch;
        return this;
    }

    setSpeed(speed: number): this {
        if (speed < 50 || speed > 400) {
            throw new Error('Speed must be between 50 and 400.');
        }
        this._voiceTextParams.speed = speed;
        return this;
    }

    setVolume(volume: number): this {
        if (volume < 50 || volume > 200) {
            throw new Error('Volume must be between 50 and 200.');
        }
        this._voiceTextParams.volume = volume;
        return this;
    }
}
