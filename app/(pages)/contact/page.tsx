import Navbar from '@/components/Nabvar';

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-background p-6 md:p-10'>
        <div className="max-w-7xl mx-auto">
          <div className="flex-col text-center space-y-6 mb-10">
              <h1 className="font-serif text-4xl font-extralight">Kontakta oss</h1>
              <p className='text-gray-500'>
                Vi skulle älska att höra från dig. Oavsett om du har en fråga om våra produkter, behöver hjälp, <br />
                eller bara vill säga hej.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Vänster kolumn: Kontaktinformation */}
            <div className="space-y-8 flex flex-col justify-start mt-12 items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Kontaktinformation</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-blush/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail h-5 w-5 text-blush-foreground">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">E-post</h3>
                      <p className="text-muted-foreground">team@duddaloos.se</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-muted/10 p-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin h-5 w-5 text-muted-foreground">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Adress</h3>
                      <p className="text-muted-foreground">Stockholm, Sverige</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Höger kolumn: Formulär */}
            <div className="bg-card rounded-xl p-6 md:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Namn *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Ditt namn"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-post *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="din.epost@exempel.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Ämne *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Vad gäller detta?"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Meddelande *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Ditt meddelande här..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Skicka meddelande
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
