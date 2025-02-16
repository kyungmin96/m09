import { AppRouter } from "./app/routes/AppRouter";
import { Providers } from "./app/providers";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Providers>
        <AppRouter />
      </Providers>
    </div>
  );
}

export default App;