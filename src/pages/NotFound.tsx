import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
            <AlertTriangle size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Страница не найдена</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          Запрошенная страница не существует или была перемещена. Проверьте URL или вернитесь на главную.
        </p>
        <Link to="/dashboard" className="btn btn-primary inline-flex items-center">
          <Home size={18} className="mr-2" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;