import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  User
} from 'lucide-react';

type Patient = {
  id: string;
  full_name: string;
  birth_date: string | null;
  sex: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
};

type FormValues = {
  full_name: string;
  birth_date: string;
  sex: string;
  contact_phone: string;
  contact_email: string;
  address: string;
};

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const patientsPerPage = 10;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  
  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);
  
  const fetchPatients = async () => {
    setLoading(true);
    
    try {
      // Get total count for pagination
      let query = supabase
        .from('patients')
        .select('*', { count: 'exact' });
      
      // Add search if provided
      if (searchTerm) {
        query = query.ilike('full_name', `%${searchTerm}%`);
      }
      
      const { count, error: countError } = await query;
      
      if (countError) throw countError;
      
      // Calculate total pages
      const total = count || 0;
      setTotalPages(Math.ceil(total / patientsPerPage));
      
      // Get paginated data
      let dataQuery = supabase
        .from('patients')
        .select('*')
        .order('full_name', { ascending: true })
        .range((currentPage - 1) * patientsPerPage, currentPage * patientsPerPage - 1);
      
      // Add search if provided
      if (searchTerm) {
        dataQuery = dataQuery.ilike('full_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await dataQuery;
      
      if (error) throw error;
      
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Не удалось загрузить список пациентов');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase.from('patients').insert([data]);
      
      if (error) throw error;
      
      toast.success('Пациент успешно добавлен');
      reset();
      setShowAddForm(false);
      fetchPatients();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Не удалось добавить пациента');
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchPatients();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
            <Users className="mr-2" size={24} />
            Пациенты
          </h1>
          <p className="text-neutral-600">
            Управление списком пациентов и их данными
          </p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Отменить' : (
            <>
              <Plus size={18} className="mr-2" />
              Добавить пациента
            </>
          )}
        </button>
      </div>
      
      {/* Add Patient Form */}
      {showAddForm && (
        <div className="card bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Добавить нового пациента</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label htmlFor="full_name" className="label">ФИО пациента</label>
              <input
                id="full_name"
                type="text"
                className={`input ${errors.full_name ? 'input-error' : ''}`}
                placeholder="Иванов Иван Иванович"
                {...register('full_name', { required: 'ФИО обязательно' })}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-accent-600">{errors.full_name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="birth_date" className="label">Дата рождения</label>
              <input
                id="birth_date"
                type="date"
                className={`input ${errors.birth_date ? 'input-error' : ''}`}
                {...register('birth_date')}
              />
              {errors.birth_date && (
                <p className="mt-1 text-sm text-accent-600">{errors.birth_date.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="sex" className="label">Пол</label>
              <select
                id="sex"
                className={`input ${errors.sex ? 'input-error' : ''}`}
                {...register('sex')}
              >
                <option value="">Выберите пол</option>
                <option value="мужской">Мужской</option>
                <option value="женский">Женский</option>
              </select>
              {errors.sex && (
                <p className="mt-1 text-sm text-accent-600">{errors.sex.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contact_phone" className="label">Телефон</label>
              <input
                id="contact_phone"
                type="tel"
                className={`input ${errors.contact_phone ? 'input-error' : ''}`}
                placeholder="+7 (999) 123-45-67"
                {...register('contact_phone')}
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-accent-600">{errors.contact_phone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contact_email" className="label">Email</label>
              <input
                id="contact_email"
                type="email"
                className={`input ${errors.contact_email ? 'input-error' : ''}`}
                placeholder="patient@example.com"
                {...register('contact_email')}
              />
              {errors.contact_email && (
                <p className="mt-1 text-sm text-accent-600">{errors.contact_email.message}</p>
              )}
            </div>
            
            <div className="col-span-full">
              <label htmlFor="address" className="label">Адрес</label>
              <input
                id="address"
                type="text"
                className={`input ${errors.address ? 'input-error' : ''}`}
                placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                {...register('address')}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-accent-600">{errors.address.message}</p>
              )}
            </div>
            
            <div className="col-span-full flex justify-end gap-3 mt-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  reset();
                  setShowAddForm(false);
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </span>
                ) : 'Сохранить'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по ФИО..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <button type="submit" className="hidden">Поиск</button>
          </div>
        </form>
      </div>
      
      {/* Patients table */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">ФИО</th>
              <th className="table-header-cell">Дата рождения</th>
              <th className="table-header-cell hidden md:table-cell">Пол</th>
              <th className="table-header-cell hidden md:table-cell">Телефон</th>
              <th className="table-header-cell hidden lg:table-cell">Email</th>
              <th className="table-header-cell text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id} className="table-row">
                  <td className="table-cell font-medium">
                    <Link to={`/patients/${patient.id}`} className="text-primary-600 hover:text-primary-800">
                      {patient.full_name}
                    </Link>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5 text-neutral-400" />
                      {formatDate(patient.birth_date)}
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="flex items-center">
                      <User size={16} className="mr-1.5 text-neutral-400" />
                      {patient.sex || '—'}
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1.5 text-neutral-400" />
                      {patient.contact_phone || '—'}
                    </div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1.5 text-neutral-400" />
                      {patient.contact_email || '—'}
                    </div>
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="p-1.5 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-neutral-500">
                  {searchTerm ? 'Пациенты не найдены' : 'Нет добавленных пациентов'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Patients;