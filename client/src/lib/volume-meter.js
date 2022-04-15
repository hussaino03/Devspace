const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = AudioContext ? new AudioContext() : null;

const createVolumeMeter = async (track) => {
  if (!audioContext) {
    return;
  }

  await audioContext.resume();

  // Create an analyser to access the raw audio samples from the microphone.
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.5;

  // Connect the LocalAudioTrack's media source to the analyser.
  const stream = new MediaStream([track.mediaStreamTrack]);
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  const sampleArray = new Uint8Array(analyser.frequencyBinCount);

  const shutdown = () => {
    source.disconnect(analyser);
  };

  const samples = () => {
    analyser.getByteFrequencyData(sampleArray);
    return sampleArray;
  };

  return { shutdown, analyser, samples };
};

const getVolume = async (track, callback) => {
  const { shutdown, analyser, samples } = await createVolumeMeter(track);
  requestAnimationFrame(function checkVolume() {
    callback(analyser.frequencyBinCount, samples());
    if (track.mediaStreamTrack.readyState === "live") {
      requestAnimationFrame(checkVolume);
    } else {
      requestAnimationFrame(() => {
        shutdown();
        callback(0);
      });
    }
  });
  return shutdown;
};

const mapRange = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const pollAudio = async (audioTrack, canvas) => {
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  return await getVolume(audioTrack, (bufferLength, samples) => {
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(0, 0, width, height);

    var barWidth = (width / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      barHeight = mapRange(samples[i], 0, 255, 0, height * 2);

      context.fillStyle = "rgb(" + (barHeight + 100) + ",51,153)";
      context.fillRect(
        x,
        (height - barHeight / 2) / 2,
        barWidth,
        barHeight / 4
      );
      context.fillRect(x, height / 2, barWidth, barHeight / 4);
      x += barWidth + 1;
    }
  });
};

module.exports = { pollAudio };
