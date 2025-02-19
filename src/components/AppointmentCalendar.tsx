import React, { useState } from 'react';
import { DayPicker, Matcher } from 'react-day-picker';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Language, translations } from '../utils/translations';

interface AppointmentCalendarProps {
  language: Language;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const AVAILABLE_TIMES: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
];

interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  type: string;
  notes: string;
}

const initialFormData: AppointmentForm = {
  name: '',
  email: '',
  phone: '',
  type: 'consultation',
  notes: ''
};

interface Translations {
  calendar: {
    // proprietà del calendario
  };
  // ... altre proprietà
}

export default function AppointmentCalendar({ language }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [formData, setFormData] = useState<AppointmentForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const t = translations[language].calendar;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would typically make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setFormData(initialFormData);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays: Matcher[] = [
    { from: new Date(2024, 0, 1), to: new Date(2024, 0, 5) },
    { daysOfWeek: [0, 6] } // weekend
  ];

  return (
    <section id="appointments" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t.title}
        </h2>

        <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disabledDays}
                  locale={language === 'it' ? it : undefined}
                />
              </div>

              {selectedDate && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {format(selectedDate, 'PPPP', { locale: language === 'it' ? it : undefined })}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_TIMES.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-red-600 text-white'
                            : slot.available
                            ? 'bg-gray-100 hover:bg-gray-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">{t.form.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">{t.form.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">{t.form.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">{t.form.type}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                >
                  <option value="consultation">{t.form.types.consultation}</option>
                  <option value="scanning">{t.form.types.scanning}</option>
                  <option value="printing">{t.form.types.printing}</option>
                  <option value="pickup">{t.form.types.pickup}</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">{t.form.notes}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-2xl transition-all hover:shadow-red-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.form.submitting : t.form.submit}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-center">{t.form.success}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">{t.form.error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}