import { create } from 'zustand';

interface TerminalState {
  terminal: any | null;
  history: string[];
  setTerminal: (term: any) => void;
  write: (data: string) => void;
  clear: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminal: null,
  history: [],
  setTerminal: (terminal) => {
      set({ terminal });
      // If we just attached a new terminal, replay the history
      if (terminal && get().history.length > 0) {
          get().history.forEach(data => terminal.write(data));
      }
  },
  write: (data) => {
    const { terminal, history } = get();
    set({ history: [...history, data] });
    if (terminal) {
        terminal.write(data);
    }
  },
  clear: () => {
    const { terminal } = get();
    set({ history: [] });
    if (terminal) {
        terminal.clear();
    }
  }
}));
