export default function Checkout() {
  return (
    <>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        {/* Progress Stepper */}
        <div className="mb-unit-xl">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="flex flex-col items-center gap-unit-sm z-10 bg-background px-1 md:px-4">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]" data-icon="check" style={{ fontVariationSettings: "'wght' 600" }}>check</span>
              </div>
              <span className="font-label-md text-label-md md:text-label-md text-[10px] text-on-surface-variant">Cart</span>
            </div>
            <div className="absolute top-4 left-0 w-full h-[2px] bg-outline-variant/30 -z-10">
              <div className="h-full bg-primary w-1/3"></div>
            </div>
            <div className="flex flex-col items-center gap-unit-sm z-10 bg-background px-1 md:px-4">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center ring-4 ring-primary/10">
                <span className="font-label-md text-label-md">2</span>
              </div>
              <span className="font-label-md text-label-md md:text-label-md text-[10px] text-primary">Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-unit-sm z-10 bg-background px-1 md:px-4">
              <div className="w-8 h-8 rounded-full border-2 border-outline-variant bg-surface text-on-surface-variant flex items-center justify-center">
                <span className="font-label-md text-label-md">3</span>
              </div>
              <span className="font-label-md text-label-md md:text-label-md text-[10px] text-on-surface-variant">Payment</span>
            </div>
            <div className="flex flex-col items-center gap-unit-sm z-10 bg-background px-1 md:px-4">
              <div className="w-8 h-8 rounded-full border-2 border-outline-variant bg-surface text-on-surface-variant flex items-center justify-center">
                <span className="font-label-md text-label-md">4</span>
              </div>
              <span className="font-label-md text-label-md md:text-label-md text-[10px] text-on-surface-variant">Done</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Shipping Form */}
          <section className="lg:col-span-7 space-y-unit-lg">
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-unit-lg">
              <h2 className="font-headline-md text-headline-md text-primary mb-unit-lg">Shipping Information</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">Full Name</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="Enter your full name" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">Email Address</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="example@email.com" type="email" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">Phone Number</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="+234 800 000 0000" type="tel" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">Street Address</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="123 Ministry Way, Victoria Island" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">City</label>
                  <input className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="Lagos" type="text" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">State</label>
                  <select className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md appearance-none">
                    <option>Select State</option>
                    <option>Lagos</option>
                    <option>Abuja (FCT)</option>
                    <option>Oyo</option>
                    <option>Rivers</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit-xs">Order Notes (Optional)</label>
                  <textarea className="w-full bg-surface-container border border-outline-variant rounded focus:ring-2 focus:ring-primary focus:border-transparent transition-all px-unit-md py-unit-sm font-body-md" placeholder="Special instructions for delivery..." rows={4}></textarea>
                </div>
              </form>
            </div>
            <div className="flex items-center gap-unit-sm text-on-surface-variant p-unit-md bg-surface-container-low rounded-lg border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary" data-icon="info">info</span>
              <p className="font-body-md text-body-md">By continuing, you agree to our <a className="text-primary hover:underline" href="/contact">Shipping Policy</a>.</p>
            </div>
          </section>
          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-surface sticky top-32 border border-outline-variant/20 rounded-lg shadow-sm overflow-hidden">
              <div className="p-unit-lg border-b border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-lg">Order Summary</h3>
                <div className="space-y-unit-md">
                  <div className="flex gap-unit-md items-start">
                    <div className="w-16 h-20 bg-surface-container rounded-sm overflow-hidden flex-shrink-0 border border-outline-variant/20">
                      <img className="w-full h-full object-cover" data-alt="A beautiful professional book cover titled 'Dynamics of the Spirit' with minimalist theological design elements. The cover uses deep blues and gold accents against a cream paper texture, presented in soft studio lighting on a neutral tabletop. High-fidelity, premium Christian literature aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeNldnl_Tr7tYeXGODmlx9zD5dKeWiDgmCcUUjs1-stSw8GV8_leTHFpO_KwzymjbWiRwBgpvXwv_qtMYtsWUqVbiC9ds4DIidNwqZMMhM4LV2KcIAR8eVkM7Kia--NM1pSj7JWfDoZfUI1uem5qobLec2foW65WNFGQW0sCdzmyWeEDu2x-L1DnH-DDSftttQbCPYAOfdtZjANGWuJtU0rsE0pN4kQPRX-8c6vUDhPvsKKbXr5lJBwJhT-O9W7qtIryQaVvJfa7Dx" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-label-md text-label-md text-on-surface leading-tight">Dynamics of the Spirit</h4>
                      <p className="font-body-md text-sm text-on-surface-variant">Qty: 1</p>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface">&#8358;12,500</span>
                  </div>
                  <div className="flex gap-unit-md items-start">
                    <div className="w-16 h-20 bg-surface-container rounded-sm overflow-hidden flex-shrink-0 border border-outline-variant/20">
                      <img className="w-full h-full object-cover" data-alt="A striking historical book cover titled 'The Reformation' featuring a classic engraved portrait or architectural detail in monochromatic sepia tones. The typography is bold and authoritative with a modern clean layout. Set in a professional library context with soft focus background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2E7Kaj2j_fE7nxcudSVkoDFup3gV_bQL4rEA1WFLZZX2-s7KsKViRzyhlyxzmdKRcs_2IbFKvIZ3k67kf1zlIoMOYwd7qslUw-9SpY-DD94QNhRAfBNsCawCe8x985q-aLDMuoOETdwVi8HsVu72fY5ru0pY4BKebRJbX522KbNec_8xu1JfsEP9M-hoP4mr2bL5qr1eCmfXANhSh6f2FqKYC_bLV5qKo5iH8u5QiiAEiTep_K4qXT3i0LNYspbLSVFgsKv2-_M6A" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-label-md text-label-md text-on-surface leading-tight">The Reformation</h4>
                      <p className="font-body-md text-sm text-on-surface-variant">Qty: 1</p>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface">&#8358;8,750</span>
                  </div>
                </div>
              </div>
              <div className="p-unit-lg space-y-unit-sm bg-surface-container-lowest">
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>&#8358;21,250</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="italic font-label-sm">Calculated at next step</span>
                </div>
                <div className="pt-unit-md border-t border-outline-variant/20 flex justify-between items-baseline">
                  <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">&#8358;21,250</span>
                </div>
              </div>
              <div className="p-unit-lg">
                <button className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-4 rounded-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all mb-unit-md flex items-center justify-center gap-unit-sm uppercase tracking-wider">
                  <span>Place Order</span>
                  <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
                </button>
                <div className="flex flex-col items-center gap-unit-sm">
                  <div className="flex items-center gap-unit-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    <span className="text-label-sm font-label-sm">Secure Payment via Paystack</span>
                  </div>
                  <a className="text-primary font-label-md text-label-md hover:underline flex items-center gap-unit-xs" href="/contact">
                    <span className="material-symbols-outlined text-[18px]" data-icon="support_agent">support_agent</span>
                    Talk to a Curator
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('focus', () => {
              el.parentElement.classList.add('scale-[1.01]');
              el.parentElement.style.transition = 'all 0.2s ease-out';
            });
            el.addEventListener('blur', () => {
              el.parentElement.classList.remove('scale-[1.01]');
            });
          });
        `
      }} />
    </>
  );
}
