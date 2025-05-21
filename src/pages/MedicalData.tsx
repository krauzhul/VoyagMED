import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  FileText, 
  Search, 
  Plus, 
  Edit,
  Calendar,
  Clock,
  Building,
  MapPin,
  Phone,
  DollarSign,
  CreditCard,
  FileCheck,
  Info,
  User
} from 'lucide-react';

type MedicalRecord = {
  id: string;
  patient_id: string;
  status: string;
  examination_type: string;
  examination_details: string | null;
  examination_time: string | null;
  examination_date: string | null;
  doctor_name: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  clinic_contact: string | null;
  price: number | null;
  currency: string | null;
  payment_method: string | null;
  guide: string | null;
  results: string | null;
  conclusion: string | null;
  recommendations: string | null;
  notes: string | null;
  patients: {
    full_name: string;
  };
};

type FormValues = {
  patient_id: string;
  status: string;
  examination_type: string;
  examination_details: string;
  examination_time: string;
  examination_date: string;
  doctor_name: string;
  clinic_name: string;
  clinic_address: string;
  clinic_contact: string;
  price: number;
  currency: string;
  payment_method: string;
  guide: string;
  results: string;
  conclusion: string;
  recommendations: string;
  notes: string;
};

const MedicalData: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 10;
  const [patients, setPatients] = useState<{ id: string; full_name: string; }[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    fetchRecords();
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

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('medical_data')
        .select(`
          *,
          patients (
            full_name
          )
        `, { count: 'exact' });

      if (searchTerm) {
        query = query.ilike('examination_type', `%${searchTerm}%`);
      }

      const { count } = await query;
      setTotalPages(Math.ceil((count || 0) / recordsPerPage));

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage - 1);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Не удалось загрузить медицинские данные');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('medical_data')
        .insert([{
          ...data,
          recorded_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast.success('Медицинские данные добавлены');
      reset();
      setShowAddForm(false);
      fetchRecords();
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast.error('Не удалось добавить медицинские данные');
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

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '—';
    try {
      return timeString.slice(0, 5); // Returns HH:mm
    } catch (e) {
      return timeString;
    }
  };

  const formatPrice = (price: number | null, currency: string | null) => {
    if (price === null) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency || 'RUB',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
            <FileText className="mr-2" size={24} />
            Медицинские данные
          </h1>
          <p className="text-neutral-600">
            Управление медицинскими данными и результатами обследований
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

      {/* Add Record Form */}
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
                <option value="completed">Завершено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>

            <div>
              <label htmlFor="examination_type" className="label">Тип обследования</label>
              <input
                id="examination_type"
                type="text"
                className={`input ${errors.examination_type ? 'input-error' : ''}`}
                placeholder="Например: МРТ, анализ крови"
                {...register('examination_type', { required: 'Укажите тип обследования' })}
              />
              {errors.examination_type && (
                <p className="mt-1 text-sm text-accent-600">{errors.examination_type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="examination_details" className="label">Детали обследования</label>
              <input
                id="examination_details"
                type="text"
                className={`input ${errors.examination_details ? 'input-error' : ''}`}
                placeholder="Дополнительная информация"
                {...register('examination_details')}
              />
            </div>

            <div>
              <label htmlFor="examination_date" className="label">Дата</label>
              <input
                id="examination_date"
                type="date"
                className={`input ${errors.examination_date ? 'input-error' : ''}`}
                {...register('examination_date')}
              />
            </div>

            <div>
              <label htmlFor="examination_time" className="label">Время</label>
              <input
                id="examination_time"
                type="time"
                className={`input ${errors.examination_time ? 'input-error' : ''}`}
                {...register('examination_time')}
              />
            </div>

            <div>
              <label htmlFor="doctor_name" className="label">Врач</label>
              <input
                id="doctor_name"
                type="text"
                className={`input ${errors.doctor_name ? 'input-error' : ''}`}
                placeholder="ФИО врача"
                {...register('doctor_name')}
              />
            </div>

            <div>
              <label htmlFor="clinic_name" className="label">Клиника</label>
              <input
                id="clinic_name"
                type="text"
                className={`input ${errors.clinic_name ? 'input-error' : ''}`}
                placeholder="Название клиники"
                {...register('clinic_name')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="clinic_address" className="label">Адрес клиники</label>
              <input
                id="clinic_address"
                type="text"
                className={`input ${errors.clinic_address ? 'input-error' : ''}`}
                placeholder="Полный адрес клиники"
                {...register('clinic_address')}
              />
            </div>

            <div>
              <label htmlFor="clinic_contact" className="label">Контакты клиники</label>
              <input
                id="clinic_contact"
                type="text"
                className={`input ${errors.clinic_contact ? 'input-error' : ''}`}
                placeholder="Телефон, email"
                {...register('clinic_contact')}
              />
            </div>

            <div>
              <label htmlFor="price" className="label">Стоимость</label>
              <input
                id="price"
                type="number"
                className={`input ${errors.price ? 'input-error' : ''}`}
                placeholder="0"
                {...register('price', { valueAsNumber: true })}
              />
            </div>

            <div>
              <label htmlFor="currency" className="label">Валюта</label>
              <select
                id="currency"
                className={`input ${errors.currency ? 'input-error' : ''}`}
                {...register('currency')}
              >
                <option value="RUB">RUB</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label htmlFor="payment_method" className="label">Способ оплаты</label>
              <select
                id="payment_method"
                className={`input ${errors.payment_method ? 'input-error' : ''}`}
                {...register('payment_method')}
              >
                <option value="">Выберите способ оплаты</option>
                <option value="cash">Наличные</option>
                <option value="card">Карта</option>
                <option value="insurance">Страховка</option>
              </select>
            </div>

            <div className="col-span-full">
              <label htmlFor="guide" className="label">Подготовка к обследованию</label>
              <textarea
                id="guide"
                className={`input min-h-[100px] ${errors.guide ? 'input-error' : ''}`}
                placeholder="Инструкции по подготовке"
                {...register('guide')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="results" className="label">Результаты</label>
              <textarea
                id="results"
                className={`input min-h-[100px] ${errors.results ? 'input-error' : ''}`}
                placeholder="Результаты обследования"
                {...register('results')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="conclusion" className="label">Заключение</label>
              <textarea
                id="conclusion"
                className={`input min-h-[100px] ${errors.conclusion ? 'input-error' : ''}`}
                placeholder="Заключение врача"
                {...register('conclusion')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="recommendations" className="label">Рекомендации</label>
              <textarea
                id="recommendations"
                className={`input min-h-[100px] ${errors.recommendations ? 'input-error' : ''}`}
                placeholder="Рекомендации врача"
                {...register('recommendations')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="label">Заметки</label>
              <textarea
                id="notes"
                className={`input ${errors.notes ? 'input-error' : ''}`}
                placeholder="Дополнительные заметки"
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
            placeholder="Поиск по типу обследования..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{record.examination_type}</h3>
                    <span className={`px-2 py-1 text-sm rounded ${
                      record.status === 'completed' ? 'bg-green-100 text-green-800' :
                      record.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {record.status === 'completed' ? 'Завершено' :
                       record.status === 'cancelled' ? 'Отменено' :
                       'Запланировано'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <User size={16} className="mr-1.5" />
                      {record.patients?.full_name}
                    </div>
                    {record.examination_date && (
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1.5" />
                        {formatDate(record.examination_date)}
                      </div>
                    )}
                    {record.examination_time && (
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1.5" />
                        {formatTime(record.examination_time)}
                      </div>
                    )}
                    {record.doctor_name && (
                      <div className="flex items-center">
                        <User size={16} className="mr-1.5" />
                        {record.doctor_name}
                      </div>
                    )}
                  </div>

                  {record.clinic_name && (
                    <div className="mb-3">
                      <div className="flex items-center text-neutral-600">
                        <Building size={16} className="mr-1.5" />
                        {record.clinic_name}
                      </div>
                      {record.clinic_address && (
                        <div className="flex items-center text-neutral-600 mt-1">
                          <MapPin size={16} className="mr-1.5" />
                          {record.clinic_address}
                        </div>
                      )}
                      {record.clinic_contact && (
                        <div className="flex items-center text-neutral-600 mt-1">
                          <Phone size={16} className="mr-1.5" />
                          {record.clinic_contact}
                        </div>
                      )}
                    </div>
                  )}

                  {(record.price !== null || record.payment_method) && (
                    <div className="mb-3 space-y-1">
                      {record.price !== null && (
                        <div className="flex items-center text-neutral-600">
                          <DollarSign size={16} className="mr-1.5" />
                          {formatPrice(record.price, record.currency)}
                        </div>
                      )}
                      {record.payment_method && (
                        <div className="flex items-center text-neutral-600">
                          <CreditCard size={16} className="mr-1.5" />
                          {record.payment_method === 'cash' ? 'Наличные' :
                           record.payment_method === 'card' ? 'Карта' :
                           record.payment_method === 'insurance' ? 'Страховка' :
                           record.payment_method}
                        </div>
                      )}
                    </div>
                  )}

                  {record.results && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1 flex items-center">
                        <FileCheck size={16} className="mr-1.5" />
                        Результаты:
                      </h4>
                      <p className="text-neutral-600 whitespace-pre-line">{record.results}</p>
                    </div>
                  )}

                  {record.conclusion && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Заключение:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{record.conclusion}</p>
                    </div>
                  )}

                  {record.recommendations && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Рекомендации:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{record.recommendations}</p>
                    </div>
                  )}

                  {record.notes && (
                    <div>
                      <h4 className="font-medium mb-1">Заметки:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{record.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/medical_data/${record.id}`}
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
              {searchTerm ? 'Записи не найдены' : 'Нет медицинских данных'}
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

export default MedicalData;