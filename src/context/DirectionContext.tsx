import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { DIRECTIONS, BASE_VARS } from "../lib/directions";
import type { Direction } from "../lib/directions";

interface DirectionContextValue {
  dir: Direction;
}

const DIR = DIRECTIONS.portal;

const DirectionContext = createContext<DirectionContextValue>({ dir: DIR });

export function DirectionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const r = document.documentElement;
    Object.entries(BASE_VARS).forEach(([k, v]) => r.style.setProperty(k, v));
    if (DIR.vars) Object.entries(DIR.vars).forEach(([k, v]) => r.style.setProperty(k, v));
    r.style.setProperty("--accent", DIR.accent);
    r.style.setProperty("--accent-soft", DIR.accentSoft);
    r.style.setProperty("--radius", `${DIR.radius}px`);
    r.style.setProperty("--grad", DIR.grad ?? `linear-gradient(100deg, ${DIR.accent}, ${DIR.accent})`);
    document.body.className = DIR.cls ?? "";
  }, []);

  return (
    <DirectionContext.Provider value={{ dir: DIR }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  return useContext(DirectionContext);
}
