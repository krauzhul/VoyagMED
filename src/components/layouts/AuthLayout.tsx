import React from 'react';
import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding and info */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-12 justify-center text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Activity size={40} className="text-white mr-3" />
            <h1 className="text-3xl font-bold">Медицинское сопровождение</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">
            Платформа для управления медицинскими данными пациентов
          </h2>
          
          <p className="text-lg mb-8 text-white/90">
            Оптимизируйте ваш рабочий процесс, управляйте медицинскими записями и обеспечивайте своевременную связь с пациентами.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Управление медицинскими записями</h3>
                <p className="text-white/80">Храните и управляйте всеми медицинскими данными в одном месте</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Отслеживание назначений</h3>
                <p className="text-white/80">Легко создавайте и отслеживайте медицинские назначения и приемы</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Телеграм-уведомления</h3>
                <p className="text-white/80">Автоматические уведомления пациентов через Телеграм-бота</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right panel - auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Activity size={32} className="text-primary-600 mr-2" />
            <h1 className="text-2xl font-bold text-primary-700">Медицинское сопровождение</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// We need to add these imports at the top
import { FileText, Calendar, MessageCircle } from 'lucide-react';

export default AuthLayout;