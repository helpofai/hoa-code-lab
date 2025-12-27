import React, { useMemo } from 'react';
import useEditorStore from '../../store/editorStore';
import { buildIframeContent } from '../../utils/iframeBuilder';

const LivePreview = () => {
  const { html, css, js } = useEditorStore();

  const srcDoc = useMemo(() => buildIframeContent(html, css, js), [html, css, js]);

  return (
    <div className="h-full w-full bg-white">
      <iframe
        srcDoc={srcDoc}
        title="preview"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default LivePreview;
