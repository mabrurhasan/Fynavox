"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getSimulationState,
  SIMULATION_DURATION_MS,
  type SimulationState,
} from "@/lib/clinical-simulation";

export type SimulationRunState = "idle" | "running" | "complete";

const TICK_MS = 100;

const emptyHistory = () => ({
  heartRate: [] as number[],
  spo2: [] as number[],
  temperature: [] as number[],
  respiratoryRate: [] as number[],
  risk: [] as number[],
});

export function useClinicalSimulation() {
  const [runState, setRunState] = useState<SimulationRunState>("idle");
  const [state, setState] = useState<SimulationState>(() =>
    getSimulationState(0)
  );
  const initial = getSimulationState(0);
  const [history, setHistory] = useState(() => ({
    heartRate: [initial.vitals.heartRate],
    spo2: [initial.vitals.spo2],
    temperature: [initial.vitals.temperature],
    respiratoryRate: [initial.vitals.respiratoryRate],
    risk: [initial.riskScore],
  }));

  const startRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runStateRef = useRef<SimulationRunState>("idle");

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const appendHistory = useCallback((s: SimulationState) => {
    setHistory((prev) => ({
      heartRate: [...prev.heartRate, s.vitals.heartRate].slice(-24),
      spo2: [...prev.spo2, s.vitals.spo2].slice(-24),
      temperature: [...prev.temperature, s.vitals.temperature].slice(-24),
      respiratoryRate: [
        ...prev.respiratoryRate,
        s.vitals.respiratoryRate,
      ].slice(-24),
      risk: [...prev.risk, s.riskScore].slice(-24),
    }));
  }, []);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startRef.current;
    const next = getSimulationState(elapsed);
    setState(next);
    appendHistory(next);

    if (elapsed >= SIMULATION_DURATION_MS) {
      stopTimer();
      setState(getSimulationState(SIMULATION_DURATION_MS));
      runStateRef.current = "complete";
      setRunState("complete");
    }
  }, [appendHistory, stopTimer]);

  const start = useCallback(() => {
    stopTimer();
    const initial = getSimulationState(0);
    startRef.current = Date.now();
    runStateRef.current = "running";
    setRunState("running");
    setState(initial);
    setHistory({
      heartRate: [initial.vitals.heartRate],
      spo2: [initial.vitals.spo2],
      temperature: [initial.vitals.temperature],
      respiratoryRate: [initial.vitals.respiratoryRate],
      risk: [initial.riskScore],
    });
    tick();
    intervalRef.current = setInterval(tick, TICK_MS);
  }, [stopTimer, tick]);

  const reset = useCallback(() => {
    stopTimer();
    const baseline = getSimulationState(0);
    runStateRef.current = "idle";
    setRunState("idle");
    setState(baseline);
    setHistory({
      heartRate: [baseline.vitals.heartRate],
      spo2: [baseline.vitals.spo2],
      temperature: [baseline.vitals.temperature],
      respiratoryRate: [baseline.vitals.respiratoryRate],
      risk: [baseline.riskScore],
    });
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return { runState, state, history, start, reset };
}
