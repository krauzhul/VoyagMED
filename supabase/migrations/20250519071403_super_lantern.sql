/*
  # Create reference lists

  1. New Data
    - Add predefined values for various reference lists including:
      - Laboratory tests
      - Instrumental examinations
      - Consultations
      - Other documents
      - Administration methods
      - Clinics
      - Clinic addresses
      - Managers

  2. Changes
    - Create reference_lists table if it doesn't exist
    - Insert predefined values for each category
*/

-- Create reference_lists table if it doesn't exist
CREATE TABLE IF NOT EXISTS reference_lists (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category, value)
);

-- Enable RLS
ALTER TABLE reference_lists ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Enable read access for all users"
  ON reference_lists
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert laboratory tests
INSERT INTO reference_lists (category, value) VALUES
  ('lab_tests_lst', 'ОАК'),
  ('lab_tests_lst', 'БАК'),
  ('lab_tests_lst', 'Коагулограмма'),
  ('lab_tests_lst', 'Гормоны кровь'),
  ('lab_tests_lst', 'Гормоны ЦРК'),
  ('lab_tests_lst', 'Кардиоферменты'),
  ('lab_tests_lst', 'Липидный обмен'),
  ('lab_tests_lst', 'Витамины кровь'),
  ('lab_tests_lst', 'Маркеры воспаления'),
  ('lab_tests_lst', 'Онкомаркеры кровь'),
  ('lab_tests_lst', 'Иммунограмма'),
  ('lab_tests_lst', 'Маркеры АИЗ'),
  ('lab_tests_lst', 'Маркеры остеопороза'),
  ('lab_tests_lst', 'Маркеры и факторы анемии'),
  ('lab_tests_lst', 'Группы крови АВО Rh Kell'),
  ('lab_tests_lst', 'Аллерген-специфические (IgE)'),
  ('lab_tests_lst', 'Мислотрамма'),
  ('lab_tests_lst', 'ОАМ'),
  ('lab_tests_lst', 'Моча - Биохимия'),
  ('lab_tests_lst', 'ОАМ расширенный'),
  ('lab_tests_lst', 'ИППП кровь'),
  ('lab_tests_lst', 'ВИЧ/СПИД/Syphilis'),
  ('lab_tests_lst', 'Гепатиты'),
  ('lab_tests_lst', 'ВЭБ ДНК ПЦР (кол)'),
  ('lab_tests_lst', 'Вирусы'),
  ('lab_tests_lst', 'Ген паспорт'),
  ('lab_tests_lst', 'Ген паспорт (риск деменции)'),
  ('lab_tests_lst', 'Ген паспорт (риск тромбоза)'),
  ('lab_tests_lst', 'Ген паспорт (стрессоустойчивость)'),
  ('lab_tests_lst', 'Копрограмма'),
  ('lab_tests_lst', 'Анализ кала на скрытую кровь'),
  ('lab_tests_lst', 'Дисбактериоз кишечника'),
  ('lab_tests_lst', 'ИППП мазок'),
  ('lab_tests_lst', 'Мазок'),
  ('lab_tests_lst', 'Спермограмма')
ON CONFLICT (category, value) DO NOTHING;

-- Insert instrumental examinations
INSERT INTO reference_lists (category, value) VALUES
  ('instrumental_examinations_lst', 'Рентген'),
  ('instrumental_examinations_lst', 'Рентген - ОГК'),
  ('instrumental_examinations_lst', 'Рентген - маммография'),
  ('instrumental_examinations_lst', 'КТ'),
  ('instrumental_examinations_lst', 'МРТ'),
  ('instrumental_examinations_lst', 'ФГДС'),
  ('instrumental_examinations_lst', 'Колоноскопия'),
  ('instrumental_examinations_lst', 'Денситометрия'),
  ('instrumental_examinations_lst', 'ЭКГ'),
  ('instrumental_examinations_lst', 'ЭКГ Холтер'),
  ('instrumental_examinations_lst', 'СМАД'),
  ('instrumental_examinations_lst', 'ЭХО сердца'),
  ('instrumental_examinations_lst', 'УЗИ ЦРК'),
  ('instrumental_examinations_lst', 'УЗИ СНК'),
  ('instrumental_examinations_lst', 'УЗИ суставы'),
  ('instrumental_examinations_lst', 'УЗИ малый таз'),
  ('instrumental_examinations_lst', 'УЗИ БЦА'),
  ('instrumental_examinations_lst', 'УЗИ ОБП + заброшенное'),
  ('instrumental_examinations_lst', 'УЗИ Простата'),
  ('instrumental_examinations_lst', 'УЗИ молочные железы'),
  ('instrumental_examinations_lst', 'УЗИ спинальных артерий'),
  ('instrumental_examinations_lst', 'УЗИ транскраниально'),
  ('instrumental_examinations_lst', 'Спирометрия'),
  ('instrumental_examinations_lst', 'ПЭТ'),
  ('instrumental_examinations_lst', 'ОФЭКТ'),
  ('instrumental_examinations_lst', 'ЭндоСоно'),
  ('instrumental_examinations_lst', 'ЭНМГ'),
  ('instrumental_examinations_lst', 'Антиография'),
  ('instrumental_examinations_lst', 'Синитография'),
  ('instrumental_examinations_lst', 'Артроскопия'),
  ('instrumental_examinations_lst', 'Цистоскопия'),
  ('instrumental_examinations_lst', 'Аудиограмма'),
  ('instrumental_examinations_lst', 'Биопсия'),
  ('instrumental_examinations_lst', 'Гистология-ФГДС'),
  ('instrumental_examinations_lst', 'Гистология-колоноскопия')
ON CONFLICT (category, value) DO NOTHING;

-- Insert consultations
INSERT INTO reference_lists (category, value) VALUES
  ('consultation_lst', 'гинеколог'),
  ('consultation_lst', 'аллерголог'),
  ('consultation_lst', 'гастроэнтеролог'),
  ('consultation_lst', 'гематолог'),
  ('consultation_lst', 'дерматолог-венеролог'),
  ('consultation_lst', 'диетолог'),
  ('consultation_lst', 'иммунолог'),
  ('consultation_lst', 'инфекционист'),
  ('consultation_lst', 'кардиолог'),
  ('consultation_lst', 'косметолог'),
  ('consultation_lst', 'нарколог'),
  ('consultation_lst', 'невропог'),
  ('consultation_lst', 'нейрохирург'),
  ('consultation_lst', 'онколог'),
  ('consultation_lst', 'ортодонт'),
  ('consultation_lst', 'оториноларинголог'),
  ('consultation_lst', 'офтальмолог'),
  ('consultation_lst', 'пластический хирург'),
  ('consultation_lst', 'психиатр'),
  ('consultation_lst', 'психолог'),
  ('consultation_lst', 'психотерапевт'),
  ('consultation_lst', 'пульмонолог'),
  ('consultation_lst', 'реабилитолог'),
  ('consultation_lst', 'ревматолог'),
  ('consultation_lst', 'сексолог'),
  ('consultation_lst', 'стоматолог'),
  ('consultation_lst', 'терапевт'),
  ('consultation_lst', 'травматолог-ортопед'),
  ('consultation_lst', 'уролог'),
  ('consultation_lst', 'хирург'),
  ('consultation_lst', 'эндокринолог'),
  ('consultation_lst', 'ЧЛХ')
ON CONFLICT (category, value) DO NOTHING;

-- Insert other documents
INSERT INTO reference_lists (category, value) VALUES
  ('other_docs_lst', 'Эпикриз'),
  ('other_docs_lst', 'Справка'),
  ('other_docs_lst', 'Страховка'),
  ('other_docs_lst', 'Вакцинация'),
  ('other_docs_lst', 'Чек/инвойс'),
  ('other_docs_lst', 'Договор')
ON CONFLICT (category, value) DO NOTHING;

-- Insert administration methods
INSERT INTO reference_lists (category, value) VALUES
  ('administration_method_lst', 'внутрь'),
  ('administration_method_lst', 'залить водой'),
  ('administration_method_lst', 'рассасывать'),
  ('administration_method_lst', 'разжевать'),
  ('administration_method_lst', 'под язык'),
  ('administration_method_lst', 'до еды'),
  ('administration_method_lst', 'во время еды'),
  ('administration_method_lst', 'после еды'),
  ('administration_method_lst', 'натощак'),
  ('administration_method_lst', 'независимо от еды'),
  ('administration_method_lst', 'не запивать молоком'),
  ('administration_method_lst', 'не запивать соком'),
  ('administration_method_lst', 'не запивать алкоголем'),
  ('administration_method_lst', 'избегать солнца'),
  ('administration_method_lst', 'лежать после приема'),
  ('administration_method_lst', 'не принимать с [препаратом]'),
  ('administration_method_lst', 'наружно'),
  ('administration_method_lst', 'мазать на кожу'),
  ('administration_method_lst', 'втирать'),
  ('administration_method_lst', 'под повязку'),
  ('administration_method_lst', 'точечно'),
  ('administration_method_lst', 'в нос'),
  ('administration_method_lst', 'под язык'),
  ('administration_method_lst', 'в прямую кишку'),
  ('administration_method_lst', 'во влагалище'),
  ('administration_method_lst', 'вдыхать'),
  ('administration_method_lst', 'разводить в воде'),
  ('administration_method_lst', 'встряхнуть перед использованием'),
  ('administration_method_lst', 'хранить в холоде')
ON CONFLICT (category, value) DO NOTHING;

-- Insert clinics
INSERT INTO reference_lists (category, value) VALUES
  ('clinic_name_m_lst', 'МЦ Хеликс'),
  ('clinic_name_m_lst', 'МЦ ЛОДЭ'),
  ('clinic_name_m_lst', 'МЦ Мерси'),
  ('clinic_name_m_lst', 'МЦ Авиценна'),
  ('clinic_name_m_lst', 'InVitro'),
  ('clinic_name_m_lst', 'МЦ Томография'),
  ('clinic_name_m_lst', 'УЗ ГК БСМП'),
  ('clinic_name_m_lst', 'МЦ НОРДИН'),
  ('clinic_name_m_lst', 'МЦ Центр Хорошего слуха'),
  ('clinic_name_m_lst', '11 КГБ'),
  ('clinic_name_m_lst', 'МЦ Симметрия')
ON CONFLICT (category, value) DO NOTHING;

-- Insert clinic addresses
INSERT INTO reference_lists (category, value) VALUES
  ('clinic_address_m_lst', 'Независимости 38'),
  ('clinic_address_m_lst', 'Независимости 58а'),
  ('clinic_address_m_lst', 'Победителей, 133'),
  ('clinic_address_m_lst', 'ул. Игнатенко, 8'),
  ('clinic_address_m_lst', 'Громова, 14'),
  ('clinic_address_m_lst', 'Партизанский просп. 107'),
  ('clinic_address_m_lst', 'Новая Боровая, ул. Братьев Райт, 1'),
  ('clinic_address_m_lst', 'Кижеватова, 58'),
  ('clinic_address_m_lst', 'ул. Сурганова 47Б'),
  ('clinic_address_m_lst', 'ул. Воронянского 40'),
  ('clinic_address_m_lst', 'Корженевского 4'),
  ('clinic_address_m_lst', 'ул. Одесская 14')
ON CONFLICT (category, value) DO NOTHING;

-- Insert managers
INSERT INTO reference_lists (category, value) VALUES
  ('manager_lst', 'Волков'),
  ('manager_lst', 'Петуховский'),
  ('manager_lst', 'Савостюк'),
  ('manager_lst', 'Гайко'),
  ('manager_lst', 'Гарбар')
ON CONFLICT (category, value) DO NOTHING;