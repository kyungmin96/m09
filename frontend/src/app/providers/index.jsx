import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorksProvider } from "@/contexts/WorksContext";
import { CartProvider } from '@/contexts/CartContext';
import { ToolsProvider } from "@/contexts/ToolsContext";

export const Providers = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorksProvider>
          <CartProvider>
            <ToolsProvider>
              {children}
            </ToolsProvider>
          </CartProvider>
        </WorksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};