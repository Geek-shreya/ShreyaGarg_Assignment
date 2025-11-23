import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  darkMode: boolean;
}

const THEME_KEY = "tm_theme";

function loadTheme(): boolean {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark";
  } catch {
    return false;
  }
}

const initialState: UIState = {
  darkMode: loadTheme(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem(THEME_KEY, state.darkMode ? "dark" : "light");
    },
  },
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
