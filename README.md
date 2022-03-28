# voicetext-sdk-nodejs

[![Build Status](https://app.travis-ci.com/airRnot1106/voicetext-sdk-nodejs.svg?branch=main)](https://app.travis-ci.com/airRnot1106/voicetext-sdk-nodejs) ![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/airRnot1106/voicetext-sdk-nodejs) ![Code Climate coverage](https://img.shields.io/codeclimate/coverage/airRnot1106/voicetext-sdk-nodejs) [![npm](https://img.shields.io/badge/-Npm-CB3837.svg?logo=npm&style=popout)](https://www.npmjs.com/package/voicetext-sdk)

## Install

```bash
npm install voicetext-sdk
```

## Usage

```javascript
//js
const { VoiceText } = require('voicetext-sdk');

//ts
import { VoiceText } from 'voicetext-sdk';

const voiceText = new VoiceText({
    apiKey: '<your-api-key>',
});

voiceText
    .setText('こんにちは')
    .setSpeaker('takeru')
    .setEmotion('happiness')
    .setEmotionLevel(4)
    .setFormat('mp3')
    .setPitch(120)
    .setSpeed(80)
    .setVolume(100);

//or

const voiceText = new VoiceText({
    apiKey: '<your-api-key>',
    text: 'こんにちは',
    speaker: 'takeru',
    emotion: 'happiness',
    emotionLevel: 4,
    format: 'mp3',
    pitch: 120,
    speed: 80,
    volume: 100,
});

(async () => {
    const buffer = await voiceText.fetchBuffer();
    const stream = await voiceText.stream();

    //example of discord.js
    const resource = createAudioStream(stream);
})();
```

## Issues

If you find a bug or problem, please open an issue!:bug:

## Author

-   Github: [airRnot1106](https://github.com/airRnot1106)
-   NPM: [airrnot1106](https://www.npmjs.com/~airrnot1106)
-   Twitter: [@airRnot1106](https://twitter.com/airRnot1106)

## LICENSE

This project is licensed under the MIT License - see the [LICENSE](https://github.com/airRnot1106/voicetext-sdk-nodejs/blob/main/LICENSE) file for details.
