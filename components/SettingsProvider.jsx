"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings } from "../lib/fetchSettings";

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function get() {
      const s = await fetchSettings();
      setSettings(s);
    }
    get();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
