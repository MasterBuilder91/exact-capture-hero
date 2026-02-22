// Audio analysis using Web Audio API — extracts real acoustic measurements

export interface AudioFeatures {
  fundamentalFrequency: number;
  pitchMean: number;
  pitchMin: number;
  pitchMax: number;
  pitchRange: number;
  pitchVariability: number;
  spectralCentroid: number;
  zeroCrossingRate: number;
  formantF1Estimate: number;
  formantF2Estimate: number;
  rmsEnergy: number;
  peakAmplitude: number;
  dynamicRange: number;
  duration: number;
  sampleRate: number;
}

/**
 * Analyze an audio data URL using the Web Audio API.
 * Extracts real acoustic measurements client-side.
 */
export async function analyzeAudioDataUrl(dataUrl: string): Promise<AudioFeatures> {
  // Convert data URL to ArrayBuffer
  const response = await fetch(dataUrl);
  const arrayBuffer = await response.arrayBuffer();

  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;

  const fundamentalFrequency = extractF0(channelData, sampleRate);
  const pitchStats = extractPitchStatistics(channelData, sampleRate);
  const spectralCentroid = extractSpectralCentroid(channelData, sampleRate);
  const zeroCrossingRate = extractZeroCrossingRate(channelData);
  const energyStats = extractEnergyStats(channelData);
  const formantEstimates = estimateFormants(channelData, sampleRate);

  await audioContext.close();

  return {
    fundamentalFrequency,
    pitchMean: pitchStats.mean,
    pitchMin: pitchStats.min,
    pitchMax: pitchStats.max,
    pitchRange: pitchStats.range,
    pitchVariability: pitchStats.stdDev,
    spectralCentroid,
    zeroCrossingRate,
    formantF1Estimate: formantEstimates.f1,
    formantF2Estimate: formantEstimates.f2,
    rmsEnergy: energyStats.rms,
    peakAmplitude: energyStats.peak,
    dynamicRange: energyStats.dynamicRange,
    duration: audioBuffer.duration,
    sampleRate,
  };
}

function extractF0(channelData: Float32Array, sampleRate: number): number {
  const bufferSize = Math.min(2048, channelData.length);
  const buffer = channelData.slice(0, bufferSize);

  let maxCorrelation = 0;
  let bestPeriod = 0;

  // Search for periods corresponding to 60Hz - 400Hz
  const minPeriod = Math.floor(sampleRate / 400);
  const maxPeriod = Math.floor(sampleRate / 60);

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let correlation = 0;
    for (let i = 0; i < bufferSize - period; i++) {
      correlation += buffer[i] * buffer[i + period];
    }
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestPeriod = period;
    }
  }

  return bestPeriod > 0 ? sampleRate / bestPeriod : 0;
}

function extractPitchStatistics(channelData: Float32Array, sampleRate: number) {
  const windowSize = Math.floor(sampleRate * 0.1); // 100ms windows
  const pitchValues: number[] = [];

  for (let i = 0; i < channelData.length - windowSize; i += windowSize) {
    const window = channelData.slice(i, i + windowSize);
    const rms = Math.sqrt(window.reduce((sum, x) => sum + x * x, 0) / window.length);

    // Only analyze windows with sufficient energy (voiced speech)
    if (rms > 0.01) {
      const f0 = extractF0(window, sampleRate);
      if (f0 > 60 && f0 < 400) {
        pitchValues.push(f0);
      }
    }
  }

  if (pitchValues.length === 0) return { mean: 0, min: 0, max: 0, range: 0, stdDev: 0 };

  const mean = pitchValues.reduce((a, b) => a + b, 0) / pitchValues.length;
  const min = Math.min(...pitchValues);
  const max = Math.max(...pitchValues);
  const range = max - min;
  const stdDev = Math.sqrt(pitchValues.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / pitchValues.length);

  return { mean, min, max, range, stdDev };
}

function extractSpectralCentroid(channelData: Float32Array, sampleRate: number): number {
  const fftSize = Math.min(2048, channelData.length);
  const buffer = channelData.slice(0, fftSize);

  let weightedSum = 0;
  let totalMagnitude = 0;

  for (let k = 0; k < fftSize / 2; k++) {
    let real = 0, imag = 0;
    for (let n = 0; n < fftSize; n++) {
      const angle = (2 * Math.PI * k * n) / fftSize;
      real += buffer[n] * Math.cos(angle);
      imag -= buffer[n] * Math.sin(angle);
    }
    const magnitude = Math.sqrt(real * real + imag * imag);
    const frequency = (k * sampleRate) / fftSize;
    weightedSum += frequency * magnitude;
    totalMagnitude += magnitude;
  }

  return totalMagnitude > 0 ? weightedSum / totalMagnitude : 0;
}

function extractZeroCrossingRate(channelData: Float32Array): number {
  let crossings = 0;
  for (let i = 1; i < channelData.length; i++) {
    if ((channelData[i] >= 0) !== (channelData[i - 1] >= 0)) {
      crossings++;
    }
  }
  return crossings / channelData.length;
}

function extractEnergyStats(channelData: Float32Array) {
  const rms = Math.sqrt(channelData.reduce((sum, x) => sum + x * x, 0) / channelData.length);
  const peak = Math.max(...Array.from(channelData).map(Math.abs));
  return { rms, peak, dynamicRange: peak / (rms + 0.0001) };
}

function estimateFormants(channelData: Float32Array, sampleRate: number) {
  const fftSize = Math.min(4096, channelData.length);
  const buffer = channelData.slice(0, fftSize);

  const magnitudes: number[] = [];
  for (let k = 0; k < fftSize / 2; k++) {
    let real = 0, imag = 0;
    for (let n = 0; n < buffer.length; n++) {
      const angle = (2 * Math.PI * k * n) / fftSize;
      real += buffer[n] * Math.cos(angle);
      imag -= buffer[n] * Math.sin(angle);
    }
    magnitudes.push(Math.sqrt(real * real + imag * imag));
  }

  // Find peaks in 200-900 Hz range (F1) and 700-2500 Hz range (F2)
  const f1Range = [Math.floor(200 * fftSize / sampleRate), Math.floor(900 * fftSize / sampleRate)];
  const f2Range = [Math.floor(700 * fftSize / sampleRate), Math.floor(2500 * fftSize / sampleRate)];

  let f1Peak = 0, f1Mag = 0;
  for (let k = f1Range[0]; k < Math.min(f1Range[1], magnitudes.length); k++) {
    if (magnitudes[k] > f1Mag) { f1Mag = magnitudes[k]; f1Peak = k; }
  }

  let f2Peak = 0, f2Mag = 0;
  for (let k = f2Range[0]; k < Math.min(f2Range[1], magnitudes.length); k++) {
    if (magnitudes[k] > f2Mag) { f2Mag = magnitudes[k]; f2Peak = k; }
  }

  return {
    f1: f1Peak * sampleRate / fftSize,
    f2: f2Peak * sampleRate / fftSize,
  };
}
