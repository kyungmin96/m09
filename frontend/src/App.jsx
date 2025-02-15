import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./app/router";
import { AuthProvider } from "./contexts/AuthContext";
import { WorksProvider } from "./contexts/WorksContext";
import { CartProvider } from '@/contexts/CartContext';
import { ToolsProvider } from "./contexts/ToolsContext";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
            <WorksProvider>
                <CartProvider>
                    <ToolsProvider>
                        <AppRouter />
                    </ToolsProvider>
                </CartProvider>
            </WorksProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
