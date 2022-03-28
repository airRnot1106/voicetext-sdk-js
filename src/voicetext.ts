import fetch from 'node-fetch';
import stream from 'stream';

type SpeakerHasEmotion = 'haruka' | 'hikari' | 'takeru' | 'santa' | 'bear';
type SpeakerWithoutEmotion = 'show';
type Speaker = SpeakerHasEmotion | SpeakerWithoutEmotion;

type Format = 'wav' | 'ogg' | 'mp3';

interface VoiceTextParamsBase {
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
    emotion_level?: EmotionLevel;
}

interface VoiceTextParamsWithoutEmotion extends VoiceTextParamsBase {
    speaker?: SpeakerWithoutEmotion;
}

type VoiceTextParams =
    | VoiceTextParamsHasEmotion
    | VoiceTextParamsWithoutEmotion;

type SuccessfulStatus = 200;
type ErrorStatus = 400 | 401 | 403 | 404 | 405 | 500 | 503;

interface ApiSuccessfulResponse {
    status: SuccessfulStatus;
    message: 'OK';
    buffer: Buffer;
}

interface ApiErrorResponse {
    status: ErrorStatus;
    message: string;
    buffer: undefined;
}

type ApiResponse = ApiSuccessfulResponse | ApiErrorResponse;

export class VoiceText {
    private _URL = 'https://api.voicetext.jp/v1/tts' as const;
    private _apiKey: string;
    private _voiceTextParams: VoiceTextParams = {};

    constructor(voiceTextParams: VoiceTextParams & { apiKey: string }) {
        const { apiKey: apiKey } = voiceTextParams;
        this._apiKey = apiKey;
        this._initParams(voiceTextParams);
    }

    private _initParams(voiceTextParams: VoiceTextParams) {
        const { text, speaker, format, pitch, speed, volume } = voiceTextParams;
        this.setText(text ?? 'こんにちは');
        this.setSpeaker(speaker ?? 'show');
        this.setFormat(format ?? 'wav');
        this.setPitch(pitch ?? 100);
        this.setSpeed(speed ?? 100);
        this.setVolume(volume ?? 100);
        if (!this._validateParams(voiceTextParams)) return;
        const { emotion, emotion_level: emotionLevel } = voiceTextParams;
        this.setEmotion(emotion ?? 'happiness');
        this.setEmotionLevel(emotionLevel ?? 2);
    }

    private _validateParams(
        params: VoiceTextParams
    ): params is VoiceTextParamsHasEmotion {
        if (params.speaker !== 'show' && params.speaker !== undefined)
            return true;
        return false;
    }

    setText(text: string): this {
        if (text.length < 1 || text.length > 200)
            throw new Error('Text must be between 1 and 200 characters.');
        this._voiceTextParams.text = text;
        return this;
    }

    setSpeaker(speaker: Speaker): this {
        const speakers: Speaker[] = [
            'show',
            'haruka',
            'hikari',
            'takeru',
            'santa',
            'bear',
        ];
        if (!speakers.includes(speaker)) {
            throw new Error(`Speaker must be one of ${speakers.join(', ')}.`);
        }
        this._voiceTextParams.speaker = speaker;
        return this;
    }

    setFormat(format: Format): this {
        const formats: Format[] = ['wav', 'ogg', 'mp3'];
        if (!formats.includes(format)) {
            throw new Error(`Format must be one of ${formats.join(', ')}.`);
        }
        this._voiceTextParams.format = format;
        return this;
    }

    setEmotion(emotion: Emotion): this {
        if (!this._validateParams(this._voiceTextParams)) {
            throw new Error(
                'Speaker "show" cannot set emote or the speaker is not set.'
            );
        }
        const emotions: Emotion[] = ['happiness', 'anger', 'sadness'];
        if (!emotions.includes(emotion)) {
            throw new Error(`Emotion must be one of ${emotions.join(', ')}.`);
        }
        this._voiceTextParams.emotion = emotion;
        return this;
    }

    setEmotionLevel(level: 1 | 2 | 3 | 4): this {
        if (!this._validateParams(this._voiceTextParams)) {
            throw new Error(
                'Speaker "show" cannot set emote or the speaker is not set.'
            );
        }
        const levels: EmotionLevel[] = [1, 2, 3, 4];
        if (!levels.includes(level)) {
            throw new Error(`Emotion level must be between 1 and 4.`);
        }
        this._voiceTextParams.emotion_level = level;
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

    private async _fetch(
        voiceTextParams: VoiceTextParams
    ): Promise<ApiResponse> {
        const query = Object.entries(voiceTextParams)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        const postData = {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(
                    this._apiKey + ':'
                ).toString('base64')}`,
            },
        };
        const response: ApiResponse = await fetch(
            `${this._URL}?${query}`,
            postData
        ).then(async (res) => {
            if (res.ok) {
                return {
                    status: <SuccessfulStatus>res.status,
                    message: 'OK',
                    buffer: await res.buffer(),
                };
            }
            return {
                status: <ErrorStatus>res.status,
                message: res.statusText,
                buffer: undefined,
            };
        });
        return response;
    }

    async fetchBuffer(): Promise<Buffer> {
        const res = await this._fetch(this._voiceTextParams);
        if (res.status !== 200) {
            throw new Error(res.message);
        }
        return res.buffer;
    }

    async stream() {
        const res = await this._fetch(this._voiceTextParams);
        if (res.status !== 200) {
            throw new Error(res.message);
        }
        return stream.Readable.from(res.buffer);
    }
}
