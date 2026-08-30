import { useState } from 'react';
import { IntroBadge } from './components/IntroBadge';
import { Landing } from './components/landing/Landing';
import { EditorLayout } from './components/editor/EditorLayout';

type View = 'landing' | 'editor';

function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <>
      <IntroBadge />
      {view === 'landing' ? <Landing onStart={() => setView('editor')} /> : <EditorLayout onBack={() => setView('landing')} />}
    </>
  );
}

export default App;
