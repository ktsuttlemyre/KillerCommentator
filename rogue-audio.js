let RogueAudio = function(audio){
	let instance = {}
	
	
    //https://mdn.github.io/webaudio-examples/voice-change-o-matic/
    const heading = document.querySelector("h1");
    document.body.addEventListener("click", init);

    function init() {
      heading.textContent = "";
      document.body.removeEventListener("click", init);

      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // Some browsers partially implement mediaDevices. We can't assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Add the getUserMedia property if it's missing.
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // First get ahold of the legacy getUserMedia, if present
          const getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }

          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }

      // Set up forked web audio context, for multiple browsers
      // window. is needed otherwise Safari explodes
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const voiceSelect = document.getElementById("voice");
      let source;
      let stream;

      // Grab the mute button to use below
      const mute = document.querySelector(".mute");

      // Set up the different audio nodes we will use for the app
      const analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      const distortion = audioCtx.createWaveShaper();
      const gainNode = audioCtx.createGain();
      const biquadFilter = audioCtx.createBiquadFilter();
      const convolver = audioCtx.createConvolver();

      const echoDelay = createEchoDelayEffect(audioCtx);

      // Distortion curve for the waveshaper, thanks to Kevin Ennis
      // http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
      function makeDistortionCurve(amount) {
        let k = typeof amount === "number" ? amount : 50,
          n_samples = 44100,
          curve = new Float32Array(n_samples),
          deg = Math.PI / 180,
          i = 0,
          x;
        for (; i < n_samples; ++i) {
          x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }

      // Grab audio track via XHR for convolver node
      let soundSource;
      ajaxRequest = new XMLHttpRequest();

          ajaxRequest.open(
            "GET",
            'https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg',
            true
          );

          ajaxRequest.responseType = "arraybuffer";

          ajaxRequest.onload = function () {
            const audioData = ajaxRequest.response;

            audioCtx.decodeAudioData(
              audioData,
              function (buffer) {
                soundSource = audioCtx.createBufferSource();
                convolver.buffer = buffer;
              },
              function (e) {
                console.log("Error with decoding audio data" + e.err);
              }
            );
          };

          ajaxRequest.send();


      // DOM
      maxDB.oninput = e => {
        const max = +maxDB.value;
        if (+minDB.value >= max) minDB.value = analyser.minDecibels = max - 1;
        analyser.maxDecibels = max;
      }
      minDB.oninput = e => {
        const min = +minDB.value;
        if (+maxDB.value <= min) maxDB.value = analyser.maxDecibels = min + 1;
        analyser.minDecibels = min;
      }


      // Set up canvas context for visualizer
      const canvas = document.querySelector(".visualizer");
      const canvasCtx = canvas.getContext("2d");


      const visualSelect = document.getElementById("visual");
      let drawVisual;

      // Main block for doing the audio recording
      if (navigator.mediaDevices.getUserMedia) {
        console.log("getUserMedia supported.");
        const constraints = { audio: true };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(distortion);
            distortion.connect(biquadFilter);
            biquadFilter.connect(gainNode);
            convolver.connect(gainNode);
            echoDelay.placeBetween(gainNode, analyser);
            analyser.connect(audioCtx.destination);

            visualize();
            voiceChange();
          })
          .catch(function (err) {
            console.log("The following gUM error occured: " + err);
          });
      } else {
        console.log("getUserMedia not supported on your browser!");
      }

      function visualize() {
        WIDTH = canvas.width;
        HEIGHT = canvas.height;

        const visualSetting = visualSelect.value;
        console.log(visualSetting);

        if (visualSetting === "sinewave") {
          analyser.fftSize = 2048;
          const bufferLength = analyser.fftSize;
          console.log(bufferLength);

          // We can use Float32Array instead of Uint8Array if we want higher precision
          // const dataArray = new Float32Array(bufferLength);
          const dataArray = new Uint8Array(bufferLength);

          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

          const draw = function () {
            drawVisual = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = "rgb(200, 200, 200)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0, 0, 0)";

            canvasCtx.beginPath();

            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              let v = dataArray[i] / 128.0;
              let y = (v * HEIGHT) / 2;

              if (i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }

              x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
          };

          draw();
        } else if (visualSetting == "frequencybars") {
          analyser.fftSize = 256;
          const bufferLengthAlt = analyser.frequencyBinCount;
          console.log(bufferLengthAlt);

          // See comment above for Float32Array()
          const dataArrayAlt = new Uint8Array(bufferLengthAlt);

          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

          const drawAlt = function () {
            drawVisual = requestAnimationFrame(drawAlt);

            analyser.getByteFrequencyData(dataArrayAlt);

            canvasCtx.fillStyle = "rgb(0, 0, 0)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLengthAlt; i++) {
              barHeight = dataArrayAlt[i];

              canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
              canvasCtx.fillRect(
                x,
                HEIGHT - barHeight / 2,
                barWidth,
                barHeight / 2
              );

              x += barWidth + 1;
            }
          };

          drawAlt();
        } else if (visualSetting == "off") {
          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
          canvasCtx.fillStyle = "red";
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        }
      }

      function voiceChange() {
        distortion.oversample = "4x";
        biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0);

        const voiceSetting = voiceSelect.value;
        console.log(voiceSetting);

        if (echoDelay.isApplied()) {
          echoDelay.discard();
        }

        // When convolver is selected it is connected back into the audio path
        if (voiceSetting == "convolver") {
          biquadFilter.disconnect(0);
          biquadFilter.connect(convolver);
        } else {
          biquadFilter.disconnect(0);
          biquadFilter.connect(gainNode);

          if (voiceSetting == "distortion") {
            distortion.curve = makeDistortionCurve(400);
          } else if (voiceSetting == "biquad") {
            biquadFilter.type = "lowshelf";
            biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0);
            biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0);
          } else if (voiceSetting == "delay") {
            echoDelay.apply();
          } else if (voiceSetting == "off") {
            console.log("Voice settings turned off");
          }
        }
      }

      function createEchoDelayEffect(audioContext) {
        const delay = audioContext.createDelay(1);
        const dryNode = audioContext.createGain();
        const wetNode = audioContext.createGain();
        const mixer = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        delay.delayTime.value = 0.75;
        dryNode.gain.value = 1;
        wetNode.gain.value = 0;
        filter.frequency.value = 1100;
        filter.type = "highpass";

        return {
          apply: function () {
            wetNode.gain.setValueAtTime(0.75, audioContext.currentTime);
          },
          discard: function () {
            wetNode.gain.setValueAtTime(0, audioContext.currentTime);
          },
          isApplied: function () {
            return wetNode.gain.value > 0;
          },
          placeBetween: function (inputNode, outputNode) {
            inputNode.connect(delay);
            delay.connect(wetNode);
            wetNode.connect(filter);
            filter.connect(delay);

            inputNode.connect(dryNode);
            dryNode.connect(mixer);
            wetNode.connect(mixer);
            mixer.connect(outputNode);
          },
        };
      }

      // Event listeners to change visualize and voice settings
      visualSelect.onchange = function () {
        window.cancelAnimationFrame(drawVisual);
        visualize();
      };

      voiceSelect.onchange = function () {
        voiceChange();
      };
      source_select.onchange = function () {
        sourceSelect();
      };

      function sourceSelect() {
        const sourceSetting = source_select.value;
        console.log(sourceSetting);

        if (sourceSetting === "Off") {
          gainNode.gain.value = 0;
        } else if(sourceSetting == "Mic") {
          gainNode.gain.value = 1;
        } else if(sourceSelect == "URL"){
          let url = prompt('Enter url','')
          if(url=='demo.ogg'){
            url = 'https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg'
          }else if(url == 'demo.mp3'){
            url = 'https://dl.dropboxusercontent.com/s/8c9m92u1euqnkaz/GershwinWhiteman-RhapsodyInBluePart1.mp3'
          }
          ajaxRequest = new XMLHttpRequest();

          ajaxRequest.open(
            "GET",
            url,
            true
          );

          ajaxRequest.responseType = "arraybuffer";

          ajaxRequest.onload = function () {
            const audioData = ajaxRequest.response;

            audioCtx.decodeAudioData(
              audioData,
              function (buffer) {
                soundSource = audioCtx.createBufferSource();
                convolver.buffer = buffer;
              },
              function (e) {
                console.log("Error with decoding audio data" + e.err);
              }
            );
          };

          ajaxRequest.send();

        }else{
          const constraints = { audio: { deviceId: { exact:  sourceSetting } } };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
          source.disconnect(distortion);
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(distortion);
          })
          .catch(function (err) {
            console.log("The following gUM error occured: " + err);
        })
      }}
      out.onchange = function () {
        outSelect();
      };

      function outSelect() {
        const outselection = outselection.value;
        console.log(outselection);

        if (outselection === "Off") {
          analyser.disconnect(audioCtx.destination);
        }else if (outselection == 'Speakers'){
          analyser.connect(audioCtx.destination);
        }else{
          const constraints = { audio: { deviceId: { exact:  outselection } } };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            console.log('not implemented')
            //analyser.disconnect(audioCtx.destination);
            //await audio.setSinkId(steam.deviceId);
            //analyser.connect(audioCtx.destination);
          })
          .catch(function (err) {
            console.log("The following gUM error occured: " + err);
        })
        }
      }
    }



    //https://stackoverflow.com/questions/66048083/enumeratedevices-after-getusermedia-how-to-find-the-active-devices
     async function populateSources(query,kind,id,defaults){
       let devices = await navigator.mediaDevices.enumerateDevices(query)
       console.log(devices)
       debugger

        var select = document.getElementById(id);
    // var options = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    // const el = document.querySelector("video")
    // el.srcObject = stream

    //console.log(stream.getTracks())


       devices = defaults.concat(devices)
    select.innerHTML=''
    for(var i = 0; i < devices.length; i++) {
        var device = devices[i];
        if(device.kind!=kind){continue}
        var el = document.createElement("option");
        el.textContent = device.label||device.deviceId||device.groupId;
        el.value = device.deviceId;
        select.appendChild(el);
    }
     }

    populateSources({ audio: true, video: false },'audioinput','source_select', [{deviceId:'Mic',label:'Mic', kind:'audioinput'},
    {deviceId:'URL',label:'URL', kind:'audioinput'},
    {deviceId:'Off',label:'Off', kind:'audioinput'}])

    populateSources({ audio: true, video: false },'audiooutput','out', [{deviceId:'Speakers',label:'Speakers', kind:'audiooutput'},
    {deviceId:'Off',label:'Off', kind:'audiooutput'}])

	
	return instance
}
