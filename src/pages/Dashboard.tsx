import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Users, ListTodo, Pill, Bell, Plus, Calendar, User, Edit, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    patients: 0,
    tasks: 0,
    drugs: 0,
    notifications: 0
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const fetchTableCount = async (table: string) => {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return count || 0;
      };

      const [patientsCount, tasksCount, drugsCount, notificationsCount] = await Promise.all([
        fetchTableCount('patients'),
        fetchTableCount('tasks'),
        fetchTableCount('drugs'),
        fetchTableCount('notifications')
      ]);

      setStats({
        patients: patientsCount,
        tasks: tasksCount,
        drugs: drugsCount,
        notifications: notificationsCount
      });

      // Fetch patients list
      const { data: patientsData } = await supabase
        .from('patients')
        .select('*')
        .limit(3);
      
      setPatients(patientsData || []);

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select(`
          *,
          patients (full_name)
        `)
        .limit(5);
      
      setTasks(tasksData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/patients" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-primary-600 mb-2">
                <Users className="h-6 w-6" />
                <span className="ml-2 font-medium">Пациенты</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">{stats.patients}</div>
              <div className="text-sm text-neutral-500">Активных пациентов</div>
            </div>
          </div>
        </Link>

        <Link to="/tasks" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-emerald-600 mb-2">
                <ListTodo className="h-6 w-6" />
                <span className="ml-2 font-medium">Задачи</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">{stats.tasks}</div>
              <div className="text-sm text-neutral-500">Текущие задачи</div>
            </div>
          </div>
        </Link>

        <Link to="/drugs" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-rose-600 mb-2">
                <Pill className="h-6 w-6" />
                <span className="ml-2 font-medium">Назначения</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">{stats.drugs}</div>
              <div className="text-sm text-neutral-500">Активных курсов</div>
            </div>
          </div>
        </Link>

        <Link to="/notifications" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-amber-600 mb-2">
                <Bell className="h-6 w-6" />
                <span className="ml-2 font-medium">Уведомления</span>
              </div>
              <div className="text-3xl font-bold text-neutral-900">{stats.notifications}</div>
              <div className="text-sm text-neutral-500">Требуют внимания</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Список пациентов</h2>
            <Link to="/patients/new" className="btn btn-primary">
              <Plus size={18} className="mr-2" />
              Новый пациент
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">ФИО</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Дата рождения</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Основной диагноз</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Актуальные задачи</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Менеджер</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <User size={16} />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-neutral-900">{patient.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {patient.birth_date ? formatDate(patient.birth_date) : '—'}
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {patient.diagnosis || '—'}
                    </td>
                    <td className="py-4 px-4">
                      {patient.current_task ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {patient.current_task}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {patient.manager || '—'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="p-1 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                        >
                          <Edit size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Задачи</h2>
            <Link to="/tasks/new" className="btn btn-primary">
              <Plus size={18} className="mr-2" />
              Новая задача
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Название</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Статус</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Дата начала</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Дедлайн</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600">Менеджер</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-neutral-900">{task.task_name}</div>
                      {task.patients?.full_name && (
                        <div className="text-sm text-neutral-500">{task.patients.full_name}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'doing' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'to_do' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.status === 'doing' ? 'В работе' :
                         task.status === 'to_do' ? 'К выполнению' :
                         'Завершено'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {task.start_date ? formatDate(task.start_date) : '—'}
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {task.due_date ? formatDate(task.due_date) : '—'}
                    </td>
                    <td className="py-4 px-4 text-neutral-600">
                      {task.manager || '—'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-primary-50">
                          <Edit size={18} />
                        </button>
                        <button className="p-1 rounded-md text-neutral-600 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;