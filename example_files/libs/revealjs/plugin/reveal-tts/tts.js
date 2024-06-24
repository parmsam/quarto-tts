/*
 * This file includes code derived from the Reveal.js library, which is licensed under the MIT License.
 * Portions of this code are also derived from a third-party repository built on top of Reveal.js.
 * The original author did not specify a license for these modifications, so it is assumed to fall under
 * the MIT License.
 */

window.RevealTTS = function () {
  var keyCodes = {
    backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17, alt: 18, pausebreak: 19, capslock: 20,
    esc: 27, space: 32, pageup: 33, pagedown: 34, end: 35, home: 36, leftarrow: 37, uparrow: 38,
    rightarrow: 39, downarrow: 40, insert: 45, delete: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52,
    5: 53, 6: 54, 7: 55, 8: 56, 9: 57, a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72,
    i: 73, j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82, s: 83, t: 84, u: 85,
    v: 86, w: 87, x: 88, y: 89, z: 90, leftwindowkey: 91, rightwindowkey: 92, selectkey: 93,
    numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99, numpad4: 100, numpad5: 101, numpad6: 102,
    numpad7: 103, numpad8: 104, numpad9: 105, multiply: 106, add: 107, subtract: 109, decimalpoint: 110,
    divide: 111, f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117, f7: 118, f8: 119, f9: 120,
    f10: 121, f11: 122, f12: 123, numlock: 144, scrolllock: 145, semicolon: 186, equalsign: 187,
    comma: 188, dash: 189, period: 190, forwardslash: 191, graveaccent: 192, openbracket: 219,
    backslash: 220, closebracket: 221, singlequote: 222
  };

  return {
    id: "RevealTTS",
    init: function (deck) {
      // Learn more at https://revealjs.com/creating-plugins/

      // set default settings
      const config = deck.getConfig();
      const options = config.tts || {};
      var settings = {};

      settings.cancelKey = options.cancelKey ? options.cancelKey.toLowerCase() : "q";
      settings.cancelKeyCode = keyCodes[settings.cancelKey] || 81;

      settings.onOffKey = options.onOffKey ? options.onOffKey.toLowerCase() : "t";
      settings.onOffKeyCode = keyCodes[settings.onOffKey] || 84;

      settings.playPauseKey = options.playPauseKey ? options.playPauseKey.toLowerCase() : "p";
      settings.playPauseKeyCode = keyCodes[settings.playPauseKey] || 80;

      var tts = {};
      tts.Synth = window.speechSynthesis;
      tts.Voices = [];
      tts.Voices = tts.Synth.getVoices(); // get a list of available voices.
      tts.DvIndex = options.dvIndex || 0; //Used to set the default voice index for Chrome or FF on the users platform. 
      tts.DvRate = options.dvRate || 0.85; // used to set speech rate between 0 and 2, 1 = 'normal'- there are other seemingly optional parameters like pitch, language, volume.
      tts.On = options.ttsOn ? options.ttsOn : false; //Set to false to prevent tts production.
      tts.Cancel = options.cancel ? options.cancel : false; // Set to true if you want reading to stop with a slide change. Otherwise, all readable text is queued for speech output.
      tts.readVisElmts = options.readVisElmts ? options.readVisElmts : false; //Set to true to read visible text content of slide elements.
      tts.readFrags = options.readFrags ? options.readFrags : false; //Set to true to read fragment text content as it appears.
      tts.readNotes = options.readNotes ? options.readNotes : false; //set to true to read text content of any <aside class="notes">text content</aside> tag in a slide section

      tts.ReadText = function (txt) {
        // Use tts to read text. A new speech synthesis utterance instance is required for each tts output for FF.
        // Chrome lets you redefine the SpeechSynthesizerUtterance.txt property-
        // as needed without having to create a new object every time you want speech.
        let ttsSpeechChunk = new SpeechSynthesisUtterance(txt);
        ttsSpeechChunk.voice = tts.Voices[tts.DvIndex]; //use default voice -- some voice must be assigned for FF to work.
        ttsSpeechChunk.rate = tts.DvRate;
        tts.Synth.speak(ttsSpeechChunk);
      };

      tts.ReadVisElmts = function () {
        // Uses arguments[0] to denote a DOM element . Then read the innerText of the rest of the list of selectors that are contained in the arguments[0] element.
        // works in Chrome, Opera and FF.
        let focusElmt = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
          let xElmts = focusElmt.querySelectorAll(arguments[i]);
          for (let k = 0; k < xElmts.length; k++) {
            tts.ReadText(xElmts[k].innerText);
          }
        }

      };

      tts.ReadAnyElmts = function () {
        // Uses arguments[0] to denote a DOM element . Then read the textContent of the rest of the list of selectors, even hidden ones, that are contained in the arguments[0] element.
        // works in Chrome, Opera and FF.
        let focusElmt = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
          let xElmts = focusElmt.querySelectorAll(arguments[i]);
          for (let k = 0; k < xElmts.length; k++) {
            tts.ReadText(xElmts[k].textContent);
          }
        }

      };

      tts.ToggleSpeech = function () {
        // turn tts on/off with status announced
        tts.On = !(tts.On);
        if (tts.On) {
          tts.ReadText("speech On!")
        } else {
          tts.Synth.cancel();
          tts.ReadText("speech Off!")
        };
      };


      // for (var ix = 0; ix < tts.Voices.length; ix++) {
      //   //find the default voice-- needed for FF, in Chrome voices[0] works as the default.
      //   if (tts.Voices[ix].default) {
      //     tts.DvIndex = ix;
      //   }
      // };

      deck.on('slidechanged', function (event) {
        var thisSlide = deck.getCurrentSlide();
        if (tts.Cancel) tts.Synth.cancel(); //Stop reading anything still in the speech queue, if tts.Cancel.
        // Read the innerText for the listed elements of current slide after waiting 1 second to allow transitions to conclude.
        // The list of elements is read in the order shown. You can use other selectors like a ".readMe" class to simplify things.
        if (tts.On) {
          if (tts.readVisElmts) {
            setTimeout(
              function () {
                tts.ReadVisElmts(thisSlide, "h1", "h2", "h3", "li", "p:not(aside p):not(.footer)", "footer p");
              }, 1000
            );
          }
          if (tts.readNotes) {
            setTimeout(
              function () {
                tts.ReadAnyElmts(thisSlide, ".notes p");
              }, 1000); 
          }
        }
      });

      deck.on('fragmentshown', function (event) {
        // This reads the text content of fragments as they are shown.
        // event.fragment = the fragment element
        if (tts.readFrags && tts.On) {
          let txt = event.fragment.textContent;
          tts.ReadText(txt);
        }
      });

      // This toggles speech on/off the deck when the 'T' key is pressed
      deck.addKeyBinding(
        {
          keyCode: settings.onOffKeyCode,
          key: settings.onOffKey
      }, () => {
        tts.ToggleSpeech() 
      });
      // This cancels speech when the 'Q' key is pressed
      deck.addKeyBinding(
        {
          keyCode: settings.cancelKeyCode,
          key: settings.cancelKey
        }, () => {
        tts.Synth.cancel() 
      });
      // This pauses/resumes speech when the 'P' key is pressed
      deck.addKeyBinding(
        {
          keyCode: settings.playPauseKeyCode,
          key: settings.playPauseKey
        }, () => {
        if (tts.On) {
          if (tts.Synth.paused) {
            tts.Synth.resume();
          } else {
            tts.Synth.pause();
          }
        }
      });

    },
  };
};

