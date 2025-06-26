'use client';

import { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import axios from 'axios';

const truncateLabel = (label: string, maxLength = 25) =>
  label.length > maxLength ? label.slice(0, maxLength) + '…' : label;

const GraphComponent = () => {
  const [elements, setElements] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    axios.get('http://localhost:4000/movies')
      .then((res) => {
        if (!isMounted) return;

        const rawData = Array.isArray(res.data) ? res.data.slice(0, 300) : [];

        const nodes: any[] = [];
        const edges: any[] = [];

        const addedMovies = new Set();
        const addedGenres = new Set();
        const addedEdges = new Set();

        rawData.forEach((item: any) => {
          const movie = typeof item?.title === 'string' ? item.title.trim() : '';
          const genre = typeof item?.genre === 'string' ? item.genre.trim() : '';
          if (!movie || !genre) return;

          const truncatedMovie = truncateLabel(movie);
          const truncatedGenre = truncateLabel(genre);

          if (!addedMovies.has(movie)) {
            nodes.push({
              data: { id: movie, label: truncatedMovie },
              classes: 'movie'
            });
            addedMovies.add(movie);
          }

          if (!addedGenres.has(genre)) {
            nodes.push({
              data: { id: genre, label: truncatedGenre },
              classes: 'genre'
            });
            addedGenres.add(genre);
          }

          const edgeId = `${movie}->${genre}`;
          if (!addedEdges.has(edgeId)) {
            edges.push({
              data: {
                id: edgeId,
                source: movie,
                target: genre,
                label: 'BELONGS_TO',
              },
            });
            addedEdges.add(edgeId);
          }
        });

        setElements([...nodes, ...edges]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading data:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p className="text-white text-center py-10">Loading Movie-Genre Graph...</p>;
  if (!elements || elements.length === 0) return <p className="text-white text-center py-10">⚠️ No graph data available.</p>;

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0f172a' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={{
          name: 'cose',
          animate: true,
          fit: true,
          padding: 50,
          nodeOverlap: 10,
          idealEdgeLength: () => 100,
          nodeRepulsion: () => 400000,
          edgeElasticity: () => 100,
          gravity: 80,
          numIter: 1000,
        }}
        stylesheet={[
          {
            selector: '.movie',
            style: {
              shape: 'roundrectangle',
              backgroundColor: '#38bdf8',
              label: 'data(label)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 'bold',
              textValign: 'center',
              textHalign: 'center',
              padding: '6px',
              borderColor: '#0ea5e9',
              borderWidth: 2,
              textOutlineWidth: 2,
              textOutlineColor: '#38bdf8',
              textWrap: 'wrap',
              textMaxWidth: 80,
            },
          },
          {
            selector: '.genre',
            style: {
              shape: 'ellipse',
              backgroundColor: '#facc15',
              label: 'data(label)',
              color: '#000000',
              fontSize: 11,
              fontWeight: 'bold',
              textValign: 'center',
              textHalign: 'center',
              padding: '6px',
              borderColor: '#eab308',
              borderWidth: 2,
              textOutlineWidth: 1,
              textOutlineColor: '#facc15',
              textWrap: 'wrap',
              textMaxWidth: 70,
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              lineColor: '#94a3b8',
              targetArrowShape: 'triangle',
              targetArrowColor: '#94a3b8',
              curveStyle: 'bezier',
              label: 'data(label)',
              fontSize: 9,
              color: '#cbd5e1',
              textBackgroundColor: '#1e293b',
              textBackgroundOpacity: 1,
              textBackgroundShape: 'roundrectangle',
              padding: 2,
            },
          },
        ]}
      />
    </div>
  );
};

export default GraphComponent;
