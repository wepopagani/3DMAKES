import React, { useState, useCallback } from 'react';
import Map from './Map';
import { Language, translations } from '../utils/translations';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectType: string;
}

interface ContactSectionProps {
  language: Language;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  projectType: 'general'
};

export default function ContactSection({ language }: ContactSectionProps) {
  const t = translations[language].contact;
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const validateForm = useCallback((data: ContactFormData): boolean => {
    if (!data.name.trim()) {
      setError(t.form.validation.name);
      return false;
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t.form.validation.email);
      return false;
    }
    if (!data.message.trim()) {
      setError(t.form.validation.message);
      return false;
    }
    return true;
  }, [t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setError(t.form.error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, t]);

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t.title}
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white mb-6">{t.form.title}</h3>
            
            <form 
              name="contact" 
              method="POST"
              action="/success"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <input name="bot-field" type="hidden" />

              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">{t.form.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  placeholder={t.form.name}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">{t.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  placeholder={t.form.email}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white font-medium mb-2">{t.form.phone}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                  placeholder="Numero di telefono"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-white font-medium mb-2">{t.form.projectType.label}</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white"
                >
                  <option value="general">{t.form.projectType.general}</option>
                  <option value="quote">{t.form.projectType.quote}</option>
                  <option value="prototype">{t.form.projectType.prototype}</option>
                  <option value="scanning">{t.form.projectType.scanning}</option>
                  <option value="bulk">{t.form.projectType.bulk}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">{t.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white resize-none"
                  placeholder={t.form.message}
                />
              </div>

              <div>
                <label htmlFor="attachment" className="block text-white font-medium mb-2">
                  {t.form.attachment}
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                  accept="*/*"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Puoi caricare qualsiasi tipo di file
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? t.form.sending : t.form.send}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-center">{t.form.success}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">{t.form.error}</p>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-6">{t.info.title}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">{t.info.address}</h4>
                    <p className="text-gray-400">Via Pietro Peri 9E<br />6900 Lugano<br />Switzerland</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">{t.info.email}</h4>
                    <a href="mailto:info@3dmakes.ch" className="text-gray-400 hover:text-red-500 transition-colors">
                      info@3dmakes.ch
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">{t.info.phone}</h4>
                    <a href="tel:+41762660396" className="text-gray-400 hover:text-red-500 transition-colors">
                      +41 76 266 03 96
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-white font-medium">{t.info.hours}</h4>
                    <p className="text-gray-400">
                      {t.info.workdays}<br />
                      {t.info.saturday}<br />
                      {t.info.sunday}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-6">{t.location.title}</h3>
              <div className="h-[300px] rounded-lg overflow-hidden">
                <Map />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}