import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Pill, 
  Search, 
  Plus, 
  Edit, 
  Calendar,
  Clock,
  Info,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';

type Drug = {
  drug_id: string;
  patient_id: string;
  status: string;
  mode: string;
  name: string;
  dose: number;
  unit: string;
  quantity: number;
  dosage_form: string;
  periodicity: string;
  week_days: string;
  interval: string;
  course_break: string;
  administration_times: string;
  start_date: string;
  end_date: string;
  administration_method: string;
  notes: string;
  notes_for_manager: string;
  drug_link: string;
  patients: {
    full_name: string;
  };
};

type FormValues = {
  patient_id: string;
  status: string;
  mode: string;
  name: string;
  dose: number;
  unit: string;
  quantity: number;
  dosage_form: string;
  periodicity: string;
  week_days: string;
  interval: string;
  course_break: string;
  administration_times: string;
  start_date: string;
  end_date: string;
  administration_method: string;
  notes: string;
  notes_for_manager: string;
  drug_link: string;
};

const Drugs: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const drugsPerPage = 10;
  const [patients, setPatients] = useState<{ patient_id: string; full_name: string; }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    fetchDrugs();
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

  const fetchDrugs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('drugs')
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
      setTotalPages(Math.ceil((count || 0) / drugsPerPage));

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * drugsPerPage, currentPage * drugsPerPage - 1);

      if (error) throw error;
      setDrugs(data || []);
    } catch (error) {
      console.error('Error fetching drugs:', error);
      toast.error('Не удалось загрузить список лекарств');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('drugs')
        .insert([{
          ...data,
          prescribed_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast.success('Лекарство добавлено');
      reset();
      setShowAddForm(false);
      fetchDrugs();
    } catch (error) {
      console.error('Error adding drug:', error);
      toast.error('Не удалось добавить лекарство');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
            <Pill className="mr-2" size={24} />
            Лекарства
          </h1>
          <p className="text-neutral-600">
            Управление назначениями лекарственных препаратов
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Отменить' : (
            <>
              <Plus size={18} className="mr-2" />
              Добавить лекарство
            </>
          )}
        </button>
      </div>

      {/* Add Drug Form */}
      {showAddForm && (
        <div className="card bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Добавить новое лекарство</h2>

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
              <label htmlFor="name" className="label">Название препарата</label>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Название лекарства"
                {...register('name', { required: 'Введите название препарата' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-accent-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dose" className="label">Дозировка</label>
              <input
                id="dose"
                type="number"
                className={`input ${errors.dose ? 'input-error' : ''}`}
                {...register('dose')}
              />
            </div>

            <div>
              <label htmlFor="unit" className="label">Единица измерения</label>
              <input
                id="unit"
                type="text"
                className={`input ${errors.unit ? 'input-error' : ''}`}
                placeholder="мг, мл, и т.д."
                {...register('unit')}
              />
            </div>

            <div>
              <label htmlFor="quantity" className="label">Количество</label>
              <input
                id="quantity"
                type="number"
                className={`input ${errors.quantity ? 'input-error' : ''}`}
                {...register('quantity')}
              />
            </div>

            <div>
              <label htmlFor="dosage_form" className="label">Форма выпуска</label>
              <input
                id="dosage_form"
                type="text"
                className={`input ${errors.dosage_form ? 'input-error' : ''}`}
                placeholder="таблетки, капсулы, и т.д."
                {...register('dosage_form')}
              />
            </div>

            <div>
              <label htmlFor="periodicity" className="label">Периодичность</label>
              <input
                id="periodicity"
                type="text"
                className={`input ${errors.periodicity ? 'input-error' : ''}`}
                placeholder="1 раз в день, 2 раза в день, и т.д."
                {...register('periodicity')}
              />
            </div>

            <div>
              <label htmlFor="start_date" className="label">Дата начала</label>
              <input
                id="start_date"
                type="date"
                className={`input ${errors.start_date ? 'input-error' : ''}`}
                {...register('start_date')}
              />
            </div>

            <div>
              <label htmlFor="end_date" className="label">Дата окончания</label>
              <input
                id="end_date"
                type="date"
                className={`input ${errors.end_date ? 'input-error' : ''}`}
                {...register('end_date')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="administration_method" className="label">Способ применения</label>
              <textarea
                id="administration_method"
                className={`input ${errors.administration_method ? 'input-error' : ''}`}
                {...register('administration_method')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="label">Примечания</label>
              <textarea
                id="notes"
                className={`input ${errors.notes ? 'input-error' : ''}`}
                {...register('notes')}
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

      {/* Drugs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : drugs.length > 0 ? (
          drugs.map((drug) => (
            <div key={drug.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{drug.name}</h3>
                    <span className={`px-2 py-1 text-sm rounded ${
                      drug.status === 'active' ? 'bg-green-100 text-green-800' :
                      drug.status === 'completed' ? 'bg-neutral-100 text-neutral-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {drug.status === 'active' ? 'Активно' :
                       drug.status === 'completed' ? 'Завершено' :
                       'В процессе'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <User size={16} className="mr-1.5" />
                      {drug.patients?.full_name}
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1.5" />
                      {formatDate(drug.start_date)} - {formatDate(drug.end_date)}
                    </div>
                    {drug.dose && drug.unit && (
                      <div className="flex items-center">
                        <Pill size={16} className="mr-1.5" />
                        {drug.dose} {drug.unit}
                      </div>
                    )}
                  </div>

                  {drug.administration_method && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Способ применения:</h4>
                      <p className="text-neutral-600">{drug.administration_method}</p>
                    </div>
                  )}

                  {drug.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Примечания:</h4>
                      <p className="text-neutral-600">{drug.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/drugs/${drug.id}`}
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
            <AlertCircle size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-600">
              {searchTerm ? 'Лекарства не найдены' : 'Нет добавленных лекарств'}
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

export default Drugs;