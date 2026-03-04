'use client';

import { useRef } from 'react';

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Cuerpo del email en sueco
    const mailtoLink = `mailto:team@duddaloos.se?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(
      `Namn: ${name}\nE-post: ${email}\n\nMeddelande:\n${message}`
    )}`;

    window.location.href = mailtoLink;

    // Rensar formuläret efter att ha öppnat e-postklienten
    setTimeout(() => {
      formRef.current?.reset();
    }, 500);
  };

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-sm border">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Namn *</label>
            <input
              name="name"
              type="text"
              id="name"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Ditt namn"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">E-post *</label>
            <input
              name="email"
              type="email"
              id="email"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="din.epost@exempel.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">Ämne *</label>
          <input
            name="subject"
            type="text"
            id="subject"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Vad gäller detta?"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">Meddelande *</label>
          <textarea
            name="message"
            id="message"
            required
            rows={5}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            placeholder="Ditt meddelande här..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skicka meddelande
        </button>
      </form>
    </div>
  );
};

export default ContactForm;