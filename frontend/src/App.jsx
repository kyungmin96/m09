import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/router';
import { AuthProvider } from './contexts/AuthContext';
import { WorksProvider } from './contexts/WorksContext';
import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <WorksProvider>
            <AppRouter />
          </WorksProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;