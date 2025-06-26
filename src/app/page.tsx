import GraphComponent from "./components/GraphComponents";


export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw', background: '#0f172a' }}>
      <h1 style={{ textAlign: 'center', color: 'white', padding: '20px 0' }}>
        🎬 Movie-Genre Graph
      </h1>
      <GraphComponent />
    </main>
  );
}
