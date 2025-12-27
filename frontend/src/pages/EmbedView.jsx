import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import penService from '../services/pen.service';
import useEditorStore from '../store/editorStore';
import { buildIframeContent } from '../utils/iframeBuilder';

const EmbedView = () => {
  const { id } = useParams();
  const [pen, setPen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPen = async () => {
      try {
        const data = await penService.getPenById(id);
        setPen(data);
      } catch (err) {
        console.error("Failed to load embedded pen", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPen();
  }, [id]);

  if (loading) return null;
  if (!pen) return <div className="p-4 font-bold">Pen not found.</div>;

  const srcDoc = buildIframeContent(pen.html, pen.css, pen.js);

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      <iframe
        srcDoc={srcDoc}
        title={pen.title}
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default EmbedView;
