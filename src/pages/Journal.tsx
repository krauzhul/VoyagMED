import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Book, 
  Search, 
  Plus, 
  Edit,
  Calendar,
  Clock,
  Info,
  User,
  FileText
} from 'lucide-react';

type JournalEntry = {
  id: string;
  patient_id: string;
  status: string;
  event_time: string;
  event_date: string;
  mode: string;
  name: string;
  agenda: string;
  outcomes: string;
  additional_info: string;
  patients: {
    full_name: string;
  };
};

type FormValues = {
  patient_id: string;
  status: string;
  event_time: string;
  event_date: string;
  mode: string;
  name: string;
  agenda: string;
  outcomes: string;
  additional_info: string;
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 10;
  const [patients, setPatients] = useState<{ id: string; full_name: string; }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    fetchEntries();
    fetchPatients();
  }, [currentPage, searchTerm]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('patient_id, full_name')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Не удалось загрузить список пациентов');
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('journal')
        .select(`
          *,
          patients (
            full_name
          )
        `, { count: 'exact' });

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { count } = await query;
      setTotalPages(Math.ceil((count || 0) / entriesPerPage));

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage - 1);

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Не удалось загрузить записи журнала');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('journal')
        .insert([{
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast.success('Запись добавлена в журнал');
      reset();
      setShowAddForm(false);
      fetchEntries();
    } catch (error) {
      console.error('Error adding journal entry:', error);
      toast.error('Не удалось добавить запись');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '—';
    try {
      return timeString.slice(0, 5); // Returns HH:mm
    } catch (e) {
      return timeString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
            <Book className="mr-2" size={24} />
            Журнал наблюдений
          </h1>
          <p className="text-neutral-600">
            Ведение журнала наблюдений за пациентами
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Отменить' : (
            <>
              <Plus size={18} className="mr-2" />
              Добавить запись
            </>
          )}
        </button>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <div className="card bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Добавить новую запись</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patient_id" className="label">Пациент</label>
              <select
                id="patient_id"
                className={`input ${errors.patient_id ? 'input-error' : ''}`}
                {...register('patient_id', { required: 'Выберите пациента' })}
              >
                <option value="">Выберите пациента</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="mt-1 text-sm text-accent-600">{errors.patient_id.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="label">Статус</label>
              <select
                id="status"
                className={`input ${errors.status ? 'input-error' : ''}`}
                {...register('status')}
              >
                <option value="">Выберите статус</option>
                <option value="planned">Запланировано</option>
                <option value="in_progress">В процессе</option>
                <option value="completed">Завершено</option>
              </select>
            </div>

            <div>
              <label htmlFor="event_date" className="label">Дата</label>
              <input
                id="event_date"
                type="date"
                className={`input ${errors.event_date ? 'input-error' : ''}`}
                {...register('event_date')}
              />
            </div>

            <div>
              <label htmlFor="event_time" className="label">Время</label>
              <input
                id="event_time"
                type="time"
                className={`input ${errors.event_time ? 'input-error' : ''}`}
                {...register('event_time')}
              />
            </div>

            <div>
              <label htmlFor="mode" className="label">Режим</label>
              <select
                id="mode"
                className={`input ${errors.mode ? 'input-error' : ''}`}
                {...register('mode')}
              >
                <option value="">Выберите режим</option>
                <option value="online">Онлайн</option>
                <option value="offline">Очно</option>
                <option value="phone">По телефону</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="label">Название</label>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Название встречи или события"
                {...register('name', { required: 'Введите название' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-accent-600">{errors.name.message}</p>
              )}
            </div>

            <div className="col-span-full">
              <label htmlFor="agenda" className="label">Повестка</label>
              <textarea
                id="agenda"
                className={`input min-h-[100px] ${errors.agenda ? 'input-error' : ''}`}
                placeholder="Опишите повестку встречи"
                {...register('agenda')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="outcomes" className="label">Результаты</label>
              <textarea
                id="outcomes"
                className={`input min-h-[100px] ${errors.outcomes ? 'input-error' : ''}`}
                placeholder="Опишите результаты встречи"
                {...register('outcomes')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="additional_info" className="label">Дополнительная информация</label>
              <textarea
                id="additional_info"
                className={`input ${errors.additional_info ? 'input-error' : ''}`}
                placeholder="Дополнительные заметки или комментарии"
                {...register('additional_info')}
              />
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

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Поиск по названию..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{entry.name}</h3>
                    <span className={`px-2 py-1 text-sm rounded ${
                      entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                      entry.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.status === 'completed' ? 'Завершено' :
                       entry.status === 'in_progress' ? 'В процессе' :
                       'Запланировано'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <User size={16} className="mr-1.5" />
                      {entry.patients?.full_name}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5" />
                      {formatDate(entry.event_date)}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1.5" />
                      {formatTime(entry.event_time)}
                    </div>
                    <div className="flex items-center">
                      <FileText size={16} className="mr-1.5" />
                      {entry.mode === 'online' ? 'Онлайн' :
                       entry.mode === 'offline' ? 'Очно' :
                       entry.mode === 'phone' ? 'По телефону' : entry.mode}
                    </div>
                  </div>

                  {entry.agenda && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Повестка:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{entry.agenda}</p>
                    </div>
                  )}

                  {entry.outcomes && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Результаты:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{entry.outcomes}</p>
                    </div>
                  )}

                  {entry.additional_info && (
                    <div>
                      <h4 className="font-medium mb-1">Дополнительная информация:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{entry.additional_info}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/journal/${entry.id}`}
                    className="btn btn-outline flex-1 md:flex-none"
                  >
                    <Edit size={18} className="mr-2" />
                    Редактировать
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Info size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-600">
              {searchTerm ? 'Записи не найдены' : 'Нет записей в журнале'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Journal;