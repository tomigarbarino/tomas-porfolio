import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Home_page from "./pages/Home_page";
import Project_page from "./pages/Project_page";
import About_page from "./pages/About_page";
import Contact_page from "./pages/Contact_page";

// Crear QueryClient para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <div className="bg-[#282C33]">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home_page />} />
              <Route path="/projects" element={<Project_page />} />
              <Route path="/about" element={<About_page />} />
              <Route path="/contact" element={<Contact_page />} />
            </Routes>
            <Footer />
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
