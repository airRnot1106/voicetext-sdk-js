import fetch from 'node-fetch';
import stream from 'stream';

export type SpeakerHasEmotion =
    | 'haruka'
    | 'hikari'
    | 'takeru'
    | 'santa'
    | 'bear';
export type SpeakerWithoutEmotion = 'show';
export type Speaker = SpeakerHasEmotion | SpeakerWithoutEmotion;

export type Format = 'wav' | 'ogg' | 'mp3';

export interface VoiceTextParamsBase {
    text?: string;
    format?: Format;
    pitch?: number;
    speed?: number;
    volume?: number;
}

export type Emotion = 'happiness' | 'anger' | 'sadness';

export type EmotionLevel = 1 | 2 | 3 | 4;

export interface VoiceTextParamsHasEmotion extends VoiceTextParamsBase {
    speaker?: SpeakerHasEmotion;
    emotion?: Emotion;
    emotion_level?: EmotionLevel;
}

export interface VoiceTextParamsWithoutEmotion extends VoiceTextParamsBase {
    speaker?: SpeakerWithoutEmotion;
}

export type VoiceTextParams =
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

    /**
     * Creates an instance of VoiceText. Be sure to set the API key. You can get
     * an API key from https://cloud.voicetext.jp/webapi
     *
     * @memberof VoiceText
     * @param {VoiceTextParams & { apiKey: string }} voiceTextParams Set
     *   VoiceText parameters. Parameters can be set later without having to
     *   specify them in the constructor. However, be sure to specify the API key here.
     */
    constructor(voiceTextParams: VoiceTextParams & { apiKey: string }) {
        const { apiKey: apiKey } = voiceTextParams;
        this._apiKey = apiKey;
        this._initParams(voiceTextParams);
    }

    /**
     * This method is used to initialize VoiceText.
     *
     * @private
     * @memberof VoiceText
     * @param {VoiceTextParams} voiceTextParams Objects of VoiceText parameters.
     * @returns {any}
     */
    private _initParams(voiceTextParams: VoiceTextParams): void {
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

    /**
     * This method is used to determine if a speaker has an emotion.
     *
     * @private
     * @memberof VoiceText
     * @param {VoiceTextParams} params Objects of VoiceText parameters.
     * @returns {any} {params is VoiceTextParamsHasEmotion}
     */
    private _validateParams(
        params: VoiceTextParams
    ): params is VoiceTextParamsHasEmotion {
        if (params.speaker !== 'show' && params.speaker !== undefined)
            return true;
        return false;
    }

    /**
     * Sets the text to be synthesized.
     *
     * @memberof VoiceText
     * @param {string} text Text to be synthesized.
     * @returns {any} {this}
     */
    setText(text: string): this {
        if (text.length < 1 || text.length > 200)
            throw new Error('Text must be between 1 and 200 characters.');
        this._voiceTextParams.text = text;
        return this;
    }

    /**
     * Sets the speaker of the synthesized voice.
     *
     * @memberof VoiceText
     * @param {Speaker} speaker Speaker to be used. Specify among show, haruka,
     *   hikari, takeru, bear, santa. If not specified in the constructor, the
     *   default speaker is show.
     * @returns {any} {this}
     */
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

    /**
     * Sets the audio data format.
     *
     * @memberof VoiceText
     * @param {Format} format Specify among wav, ogg, mp3. If not specified in
     *   the constructor, the default format is wav.
     * @returns {any} {this}
     */
    setFormat(format: Format): this {
        const formats: Format[] = ['wav', 'ogg', 'mp3'];
        if (!formats.includes(format)) {
            throw new Error(`Format must be one of ${formats.join(', ')}.`);
        }
        this._voiceTextParams.format = format;
        return this;
    }

    /**
     * Sets the emotion of the speaker.
     *
     * @memberof VoiceText
     * @param {Emotion} emotion Specify among happiness, anger, and sadness. If
     *   not specified in the constructor, the default emotion is happiness.
     * @returns {any} {this}
     */
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

    /**
     * Sets the emotion level of the speaker.
     *
     * @memberof VoiceText
     * @param {1 | 2 | 3 | 4} level Specify among 1, 2, 3, and 4. If not
     *   specified in the constructor, the default level is 2.
     * @returns {any} {this}
     */
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

    /**
     * Sets the pitch of the synthesized voice.
     *
     * @memberof VoiceText
     * @param {number} pitch Specify between 50 and 200. If not specified in the
     *   constructor, the default pitch is 100.
     * @returns {any} {this}
     */
    setPitch(pitch: number): this {
        if (pitch < 50 || pitch > 200) {
            throw new Error('Pitch must be between 50 and 200.');
        }
        this._voiceTextParams.pitch = pitch;
        return this;
    }

    /**
     * Sets the speed of the synthesized voice.
     *
     * @memberof VoiceText
     * @param {number} speed Specify between 50 and 400. If not specified in the
     *   constructor, the default speed is 100.
     * @returns {any} {this}
     */
    setSpeed(speed: number): this {
        if (speed < 50 || speed > 400) {
            throw new Error('Speed must be between 50 and 400.');
        }
        this._voiceTextParams.speed = speed;
        return this;
    }

    /**
     * Sets the volume percentage of the synthesized voice.
     *
     * @memberof VoiceText
     * @param {number} volume Specify between 50 and 200. If not specified in
     *   the constructor, the default volume is 100.
     * @returns {any} {this}
     */
    setVolume(volume: number): this {
        if (volume < 50 || volume > 200) {
            throw new Error('Volume must be between 50 and 200.');
        }
        this._voiceTextParams.volume = volume;
        return this;
    }

    /**
     * This method is used to fetch the synthesized voice.
     *
     * @private
     * @memberof VoiceText
     * @param {VoiceTextParams} voiceTextParams Objects of VoiceText parameters.
     * @returns {any} {Promise<ApiResponse>}
     */
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

    /**
     * Fetches the buffer of synthesized voice.
     *
     * @memberof VoiceText
     * @returns {any} {Promise<Buffer>}
     */
    async fetchBuffer(): Promise<Buffer> {
        const res = await this._fetch(this._voiceTextParams);
        if (res.status !== 200) {
            throw new Error(res.message);
        }
        return res.buffer;
    }

    /**
     * Return the synthesized voice as a readable stream. For example, if you
     * are using it with a discord bot, use this instead of fetchBuffer.
     *
     * @memberof VoiceText
     * @returns {any}
     */
    async stream(): Promise<stream.Readable> {
        const res = await this._fetch(this._voiceTextParams);
        if (res.status !== 200) {
            throw new Error(res.message);
        }
        return stream.Readable.from(res.buffer);
    }
}
