import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import SolutionsPage from './pages/SolutionsPage';
import SolutionPage from './pages/SolutionPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:categoryId" element={<CategoryPage />} />
        <Route path="products/:categoryId/:slug" element={<ProductPage />} />
        <Route path="solutions" element={<SolutionsPage />} />
        <Route path="solutions/:machineId" element={<SolutionPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="brochure" element={<Navigate to="/#brochure" replace />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
