import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Bell,
  Search,
  Plus,
  Edit,
  Calendar,
  Clock,
  Info,
  User,
  MessageCircle
} from 'lucide-react';

type Notification = {
  id: string;
  status: string;
  recipient_type: string;
  subject: string;
  name: string;
  schedule_from_source: string;
  periodicity: string;
  message_schedule: string;
  additional_info: string;
  text_constructor: string;
  message_text: string;
  next_notification_time: string;
  patients: {
    full_name: string;
  };
};

type FormValues = {
  patient_id: string;
  status: string;
  recipient_type: string;
  subject: string;
  name: string;
  schedule_from_source: string;
  periodicity: string;
  message_schedule: string;
  additional_info: string;
  text_constructor: string;
  message_text: string;
  next_notification_time: string;
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [patients, setPatients] = useState<{ id: string; full_name: string; }[]>([]);
  const notificationsPerPage = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    fetchNotifications();
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

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('notifications')
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
      setTotalPages(Math.ceil((count || 0) / notificationsPerPage));

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * notificationsPerPage, currentPage * notificationsPerPage - 1);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Не удалось загрузить уведомления');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast.success('Уведомление создано');
      reset();
      setShowAddForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Не удалось создать уведомление');
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '—';
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateTimeString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
            <Bell className="mr-2" size={24} />
            Уведомления
          </h1>
          <p className="text-neutral-600">
            Управление уведомлениями и оповещениями
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Отменить' : (
            <>
              <Plus size={18} className="mr-2" />
              Создать уведомление
            </>
          )}
        </button>
      </div>

      {/* Add Notification Form */}
      {showAddForm && (
        <div className="card bg-white mb-6">
          <h2 className="text-lg font-medium mb-4">Создать новое уведомление</h2>

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
                <option value="active">Активно</option>
                <option value="paused">Приостановлено</option>
                <option value="completed">Завершено</option>
              </select>
            </div>

            <div>
              <label htmlFor="recipient_type" className="label">Тип получателя</label>
              <select
                id="recipient_type"
                className={`input ${errors.recipient_type ? 'input-error' : ''}`}
                {...register('recipient_type')}
              >
                <option value="">Выберите тип получателя</option>
                <option value="patient">Пациент</option>
                <option value="doctor">Врач</option>
                <option value="manager">Менеджер</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="label">Тема</label>
              <input
                id="subject"
                type="text"
                className={`input ${errors.subject ? 'input-error' : ''}`}
                placeholder="Тема уведомления"
                {...register('subject')}
              />
            </div>

            <div>
              <label htmlFor="name" className="label">Название</label>
              <input
                id="name"
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Название уведомления"
                {...register('name', { required: 'Введите название' })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-accent-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="schedule_from_source" className="label">Источник расписания</label>
              <select
                id="schedule_from_source"
                className={`input ${errors.schedule_from_source ? 'input-error' : ''}`}
                {...register('schedule_from_source')}
              >
                <option value="">Выберите источник</option>
                <option value="manual">Вручную</option>
                <option value="drugs">Лекарства</option>
                <option value="tasks">Задачи</option>
              </select>
            </div>

            <div>
              <label htmlFor="periodicity" className="label">Периодичность</label>
              <select
                id="periodicity"
                className={`input ${errors.periodicity ? 'input-error' : ''}`}
                {...register('periodicity')}
              >
                <option value="">Выберите периодичность</option>
                <option value="once">Однократно</option>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="monthly">Ежемесячно</option>
              </select>
            </div>

            <div>
              <label htmlFor="next_notification_time" className="label">Следующее уведомление</label>
              <input
                id="next_notification_time"
                type="datetime-local"
                className={`input ${errors.next_notification_time ? 'input-error' : ''}`}
                {...register('next_notification_time')}
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="message_text" className="label">Текст сообщения</label>
              <textarea
                id="message_text"
                className={`input min-h-[100px] ${errors.message_text ? 'input-error' : ''}`}
                placeholder="Текст уведомления"
                {...register('message_text', { required: 'Введите текст сообщения' })}
              />
              {errors.message_text && (
                <p className="mt-1 text-sm text-accent-600">{errors.message_text.message}</p>
              )}
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

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{notification.name}</h3>
                    <span className={`px-2 py-1 text-sm rounded ${
                      notification.status === 'active' ? 'bg-green-100 text-green-800' :
                      notification.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {notification.status === 'active' ? 'Активно' :
                       notification.status === 'paused' ? 'Приостановлено' :
                       'Завершено'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                      <User size={16} className="mr-1.5" />
                      {notification.patients?.full_name}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="mr-1.5" />
                      {notification.recipient_type === 'patient' ? 'Пациент' :
                       notification.recipient_type === 'doctor' ? 'Врач' :
                       notification.recipient_type === 'manager' ? 'Менеджер' :
                       notification.recipient_type}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1.5" />
                      Следующее: {formatDateTime(notification.next_notification_time)}
                    </div>
                  </div>

                  {notification.subject && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Тема:</h4>
                      <p className="text-neutral-600">{notification.subject}</p>
                    </div>
                  )}

                  {notification.message_text && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-1">Текст сообщения:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{notification.message_text}</p>
                    </div>
                  )}

                  {notification.additional_info && (
                    <div>
                      <h4 className="font-medium mb-1">Дополнительная информация:</h4>
                      <p className="text-neutral-600 whitespace-pre-line">{notification.additional_info}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/notifications/${notification.id}`}
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
              {searchTerm ? 'Уведомления не найдены' : 'Нет уведомлений'}
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

export default Notifications;