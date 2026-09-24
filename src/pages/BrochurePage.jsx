import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrochurePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/#brochure', { replace: true });
  }, [navigate]);
  return null;
}
