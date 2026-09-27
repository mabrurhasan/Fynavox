"use client";

interface ECGWaveformProps {
  heartRate: number;
  accelerated?: boolean;
}

export function ECGWaveform({ heartRate, accelerated = false }: ECGWaveformProps) {
  const durationSec = accelerated ? 0.9 : Math.max(0.85, 60 / heartRate);

  return (
    <div className="h-20 w-full overflow-hidden rounded-lg bg-slate-900/5">
      <div
        className="ecg-scroll h-full w-[200%]"
        style={{ animationDuration: `${durationSec}s` }}
      >
        <svg
          viewBox="0 0 400 80"
          className="h-full w-1/2"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 L20,40 L25,40 L30,15 L35,55 L40,40 L60,40 L65,40 L70,20 L75,60 L80,40 L120,40 L125,40 L130,18 L135,58 L140,40 L180,40 L185,40 L190,25 L195,50 L200,40 L240,40 L245,40 L250,12 L255,62 L260,40 L300,40 L305,40 L310,22 L315,52 L320,40 L360,40 L365,40 L370,16 L375,56 L380,40 L400,40"
            fill="none"
            stroke="#0069c6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
        <svg
          viewBox="0 0 400 80"
          className="h-full w-1/2"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0,40 L20,40 L25,40 L30,15 L35,55 L40,40 L60,40 L65,40 L70,20 L75,60 L80,40 L120,40 L125,40 L130,18 L135,58 L140,40 L180,40 L185,40 L190,25 L195,50 L200,40 L240,40 L245,40 L250,12 L255,62 L260,40 L300,40 L305,40 L310,22 L315,52 L320,40 L360,40 L365,40 L370,16 L375,56 L380,40 L400,40"
            fill="none"
            stroke="#0069c6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      </div>
      <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        ECG · Live waveform
      </p>
    </div>
  );
}
