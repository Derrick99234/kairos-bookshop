export default function Contact() {
  return (
    <>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-unit-xl pb-unit-xl">
        {/* Page Title Section */}
        <header className="mb-unit-xl text-center md:text-left">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-unit-sm">Get in Touch</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Whether you&apos;re seeking a specific theological work or need assistance with your order, our stewards are here to help you navigate your journey.
          </p>
        </header>
        {/* Main Content: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-unit-lg rounded-lg">
            <form className="space-y-unit-md" id="contactForm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                <div className="space-y-unit-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Name</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-unit-md py-unit-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Your full name" type="text" />
                </div>
                <div className="space-y-unit-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-unit-md py-unit-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="email@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-unit-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
                <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-unit-md py-unit-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="+234 ..." type="tel" />
              </div>
              <div className="space-y-unit-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Message</label>
                <textarea className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-unit-md py-unit-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="How can we assist you today?" rows={6}></textarea>
              </div>
              <button className="w-full md:w-auto bg-secondary text-on-secondary px-unit-xl py-unit-sm font-label-md text-label-md rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all duration-200 uppercase tracking-widest" type="submit">
                Send Message
              </button>
            </form>
          </div>
          {/* Right Column: Info Cards & WhatsApp */}
          <div className="lg:col-span-5 space-y-gutter">
            {/* Contact Info Cards */}
            <div className="space-y-unit-md">
              {/* Address */}
              <div className="flex items-start gap-unit-md p-unit-md bg-white border border-outline-variant rounded-lg">
                <div className="p-unit-sm bg-primary-container/10 rounded-full">
                  <span className="material-symbols-outlined text-primary filled-icon">location_on</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-primary mb-1 uppercase tracking-wider">Address</h3>
                  <p className="font-body-md text-body-md text-on-surface">11 Kudirat Abiola Way, Ikeja, Lagos</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-unit-md p-unit-md bg-white border border-outline-variant rounded-lg">
                <div className="p-unit-sm bg-primary-container/10 rounded-full">
                  <span className="material-symbols-outlined text-primary filled-icon">call</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-primary mb-1 uppercase tracking-wider">Phone</h3>
                  <p className="font-body-md text-body-md text-on-surface">+234 813 567 2235</p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start gap-unit-md p-unit-md bg-white border border-outline-variant rounded-lg">
                <div className="p-unit-sm bg-primary-container/10 rounded-full">
                  <span className="material-symbols-outlined text-primary filled-icon">mail</span>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-primary mb-1 uppercase tracking-wider">Email</h3>
                  <p className="font-body-md text-body-md text-on-surface">info@kairosbookshop.org</p>
                </div>
              </div>
            </div>
            {/* WhatsApp Button */}
            <a className="flex items-center justify-center gap-unit-sm w-full py-unit-md bg-[#25D366] text-white rounded-lg font-label-md text-label-md shadow hover:shadow-lg transition-all group" href="https://wa.me/2348135672235" target="_blank" rel="noopener noreferrer">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.063-10.062 0-2.69-1.048-5.219-2.953-7.124s-4.434-2.952-7.125-2.952c-5.549 0-10.06 4.515-10.063 10.063-.001 2.102.569 3.651 1.609 5.442l-.999 3.647 3.75-.983zm11.234-7.227c-.3-.15-1.774-.875-2.048-.976s-.475-.15-.675.15-.775.976-.95 1.176-.35.225-.65.075c-.3-.15-1.267-.467-2.414-1.491-.892-.796-1.493-1.78-1.668-2.079s-.019-.462.13-.611c.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525-.675-1.625-.925-2.225c-.244-.589-.491-.51-.675-.519l-.575-.011c-.2 0-.525.075-.8.375s-1.05 1.026-1.05 2.5.975 2.901 1.1 3.075 1.919 2.93 4.648 4.104c.649.279 1.157.446 1.552.572.652.207 1.245.178 1.713.108.522-.078 1.606-.657 1.831-1.292s.225-1.176.156-1.292c-.069-.116-.254-.184-.554-.334z"></path></svg>
              Direct WhatsApp Chat
            </a>
          </div>
        </div>
        {/* Social Section */}
        <section className="mt-unit-xl py-unit-lg border-t border-outline-variant">
          <h2 className="font-label-md text-label-md text-center text-primary mb-unit-md uppercase tracking-widest">Connect with our Ministry</h2>
          <div className="flex justify-center gap-unit-md md:gap-unit-xl">
            <a className="group flex flex-col items-center gap-unit-xs" href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <div className="p-unit-sm rounded-full border border-outline-variant group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">video_library</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">YouTube</span>
            </a>
            <a className="group flex flex-col items-center gap-unit-xs" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="p-unit-sm rounded-full border border-outline-variant group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">face_nod</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Facebook</span>
            </a>
            <a className="group flex flex-col items-center gap-unit-xs" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <div className="p-unit-sm rounded-full border border-outline-variant group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">share</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Instagram</span>
            </a>
          </div>
        </section>
        {/* Map Section */}
        <section className="mt-unit-xl rounded-xl overflow-hidden border border-outline-variant h-64 md:h-96 relative">
          <div className="w-full h-full bg-surface-container flex items-center justify-center relative overflow-hidden">
            {/* Simulated Map UI */}
            <div className="absolute inset-0 bg-[#e5e3df] opacity-50"></div>
            <div className="relative z-10 text-center">
              <span className="material-symbols-outlined text-primary text-6xl mb-unit-sm filled-icon">location_on</span>
              <p className="font-headline-md text-headline-md text-primary">Ikeja, Lagos</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Gospel Pillars Ministry Complex</p>
              <button className="mt-unit-md px-unit-lg py-unit-sm bg-primary text-white font-label-md text-label-md rounded shadow-md hover:shadow-lg transition-shadow">Open in Google Maps</button>
            </div>
            {/* Abstract map-like patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#311fa4 0.5px, transparent 0.5px)", backgroundSize: "20px 20px" }}></div>
          </div>
        </section>
      </main>
      {/* Footer Component */}

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'SENDING...';
            btn.disabled = true;
            setTimeout(() => {
              btn.innerText = 'MESSAGE SENT';
              btn.style.backgroundColor = '#15803d';
              e.target.reset();
              setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '#b7141e';
                btn.disabled = false;
              }, 3000);
            }, 1500);
          });
        `
      }} />
    </>
  );
}
