import { useEffect, useState } from "react";
import { useCodeStore } from "../store/useCodeStore";

interface PreviewProps {
    externalUrl?: string | null;
}

export function Preview({ externalUrl }: PreviewProps) {
  const { files } = useCodeStore();
  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    // Only generate srcDoc if no external URL is provided (standard frontend sandbox)
    if (externalUrl) return;

    const html = (files['index.html'] as any)?.content || '';
    const css = (files['style.css'] as any)?.content || '';
    const js = (files['script.js'] as any)?.content || '';

    const combinedSource = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            try { ${js} } catch (err) { console.error(err); }
          </script>
        </body>
      </html>
    `;
    
    setSrcDoc(combinedSource);
  }, [files, externalUrl]);

  return (
    <div className="h-full w-full bg-white relative">
        <iframe 
            src={externalUrl || undefined}
            srcDoc={externalUrl ? undefined : srcDoc}
            title="preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms"
        />
        {!externalUrl && !srcDoc && (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 bg-neutral-50 text-sm italic">
                Ready for preview...
            </div>
        )}
    </div>
  );
}