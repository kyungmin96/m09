import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './app/router';
import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;