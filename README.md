# TTS Extension For Quarto

The tts Quarto extension provides text to speech functionality for Quarto RevealJS presentations. This extension uses the Web Speech API to provide text to speech functionality. It is a port of the [jamjolu/tts_basics_for_revealjs](https://github.com/jamjolu/tts_basics_for_revealjs) RevealJS plugin over to Quarto. Credit goes to him for creating the original plugin.

## Installing


```bash
quarto add parmsam/tts
```

This will install the extension under the `_extensions` subdirectory.
If you're using version control, you will want to check in this directory.

## Using

Simply add the extension to the list of revealjs plugins like:

```yaml
title: My Presentation
format:
    revealjs: default
revealjs-plugins:
  - tts
```

By default, the extension will read the slide content on each slide change. You can cancel the reading by pressing the `q` key or toggle the reading on and off by pressing the `t` key. 

You can change the default options by adding the following to the YAML header instead. You can choose which type of content to read using the readFrags and readNotes parameters in the YAML header. Ignore the comments in the YAML header below, they are just for explanations. 

```yaml
title: My Presentation
format:
  revealjs:
    tts: 
      cancelKey: "q" # Set to true if you want reading to stop with a slide change. Otherwise, all readable text is queued for speech output
      onOffKey: "t" # Set to false to prevent tts production
      dvIndex: 0 # Set the default tts voice for Chrome or FF on the user's platform
      dvRate: 0.85 # Set speech rate between 0 and 2, 1 = 'normal'- there are other seemingly optional parameters like pitch, language, volume
      ttsOn: true # Set to false to prevent tts production.
      cancel: true # Set to true if you want reading to stop with a slide change; otherwise, all readable text is queued for speech output
      readVisElmts: true # Set to true to read visible elements on a slide
      readFrags: false # Set to true to read fragment text content as it appears
      readNotes: false # Set to true to read text content of any <aside class="notes">text content</aside> tag in a slide section
revealjs-plugins:
  - tts
```

## Example

Here is the source code for a minimal example: [example.qmd](example.qmd).

## Disclaimer

Please note that the specific modifications from the third-party repository were not explicitly licensed. Use of this code is under the assumption that it adheres to the MIT License, since Reveal.js is licensed under the MIT License.