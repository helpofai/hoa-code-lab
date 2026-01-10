import { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useTerminalStore } from '../store/useTerminalStore';

interface TerminalProps {
  onData?: (data: string) => void;
}

export function Terminal({ onData }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const setTerminal = useTerminalStore(state => state.setTerminal);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerminal({
      theme: {
        background: '#181818',
        foreground: '#cccccc',
        cursor: '#cccccc',
        selectionBackground: '#333333',
      },
      fontSize: 13,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      cursorBlink: true,
      convertEol: true,
      scrollback: 5000,
      allowProposedApi: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // Register with store
    setTerminal(term);

    // Initial history replay
    const currentHistory = useTerminalStore.getState().history;
    currentHistory.forEach(data => term.write(data));

    term.onData((data) => {
        if (onData) onData(data);
    });

    const handleResize = () => {
        fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      setTerminal(null);
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full bg-[#181818]" />;
}