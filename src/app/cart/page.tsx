export default function Cart() {
  return (
    <>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-unit-xl mt-unit-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <h1 className="font-headline-xl text-2xl md:text-headline-xl mb-unit-lg mt-unit-md">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-unit-xl">
          {/* Cart Table Section */}
          <div className="lg:col-span-8 space-y-unit-md">
            <div className="hidden md:grid grid-cols-12 gap-unit-md pb-unit-sm border-b border-outline-variant font-label-md text-label-md text-on-surface-variant uppercase">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {/* Cart Item 1 */}
            <div className="cart-item-transition grid grid-cols-1 md:grid-cols-12 gap-unit-md items-center py-unit-md border-b border-outline-variant hover:bg-surface-container-lowest rounded-lg group">
              <div className="col-span-6 flex gap-unit-md">
                <div className="w-20 md:w-24 h-28 md:h-32 flex-shrink-0 bg-surface-container overflow-hidden rounded-lg border border-outline-variant">
                  <img className="w-full h-full object-cover" data-alt="High-quality vertical book cover titled &apos;Dynamics of the Spirit&apos; by Dr. Isaiah Wealth. The design is elegant and theological, featuring deep navy blue tones and golden serif typography. A subtle spiritual aura or dove motif is visible in the background, conveying power and divinity in a minimalist, corporate modern style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5KuLhmPod751A5WuLNKbRwkQ8IvOcEayO06z2sg4vU_tcppZbxh5sI31XJEfmFpjXNkgqv0FLejHRZn7AqHTdT7o8CuRL3Awf4vsQIF0wrGwRfyA44Bsl3T1y3YNVjg2imt1OuXEp2MQuNJeprcfsBx2vygAlOEZNK9oVCgLrTu7e1SVnY8AK3gsrAycpkDIiAPWOfAIOCEEVm2LzbibG1SzD68s2gZ3C61bb_GgKzExg8yCfp4v2A73cBZhzs5WVFRSaJT0UUJwG" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-headline-md text-[18px] text-on-surface mb-unit-xs">Dynamics of the Spirit</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">Dr. Isaiah Wealth</p>
                  <button className="mt-unit-sm text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-[16px]" data-icon="delete">delete</span> Remove
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-center font-body-md"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Price</span>&#8358;5,500</div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">-</button>
                  <span className="px-3 py-1 font-body-md border-x border-outline-variant">1</span>
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">+</button>
                </div>
              </div>
              <div className="col-span-2 text-right font-body-md font-bold"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Total</span>&#8358;5,500</div>
            </div>
            {/* Cart Item 2 */}
            <div className="cart-item-transition grid grid-cols-1 md:grid-cols-12 gap-unit-md items-center py-unit-md border-b border-outline-variant hover:bg-surface-container-lowest rounded-lg group">
              <div className="col-span-6 flex gap-unit-md">
                <div className="w-20 md:w-24 h-28 md:h-32 flex-shrink-0 bg-surface-container overflow-hidden rounded-lg border border-outline-variant">
                  <img className="w-full h-full object-cover" data-alt="Premium book cover titled &apos;The Power of Prayer&apos; by Dr. Isaiah Wealth. The visual features a minimalist aesthetic with light cream and primary blue accents. A clean, modern typeface is centered over a soft-focus image of a serene morning landscape. The style is high-fidelity and professional, aimed at a spiritual audience." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW_T9ES_SlBcJweas6YYohSfd60NmrIl_mcn_S6_MV_w6HkXHSASS7zSV_UMPkcvbuBhbTDguW3Hg4B1wouhHbTWKk6ZJAactOhF3zjd5Bjq8tqew_wHFK55Qxd_B409jvLncWaWuyS2QAW6UcGD89eVqwunFQaZD-uk6bgNy_c5qE4ipt8k48W1AW-rQjNMr-EVXF6WcpWAAuv6LW9e5o5BnFH1doKZnJXgZc8PrlsV5qUF2OkWLzxT49fQn8P3APtA7hoecPEpw_" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-headline-md text-[18px] text-on-surface mb-unit-xs">The Power of Prayer</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">Dr. Isaiah Wealth</p>
                  <button className="mt-unit-sm text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-[16px]" data-icon="delete">delete</span> Remove
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-center font-body-md"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Price</span>&#8358;4,200</div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">-</button>
                  <span className="px-3 py-1 font-body-md border-x border-outline-variant">1</span>
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">+</button>
                </div>
              </div>
              <div className="col-span-2 text-right font-body-md font-bold"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Total</span>&#8358;4,200</div>
            </div>
            {/* Cart Item 3 */}
            <div className="cart-item-transition grid grid-cols-1 md:grid-cols-12 gap-unit-md items-center py-unit-md border-b border-outline-variant hover:bg-surface-container-lowest rounded-lg group">
              <div className="col-span-6 flex gap-unit-md">
                <div className="w-20 md:w-24 h-28 md:h-32 flex-shrink-0 bg-surface-container overflow-hidden rounded-lg border border-outline-variant">
                  <img className="w-full h-full object-cover" data-alt="Striking book cover titled &apos;Metanoia: The Shift&apos; by Dr. Isaiah Wealth. Bold geometric typography dominates the composition, utilizing a high-contrast palette of deep purple and bright white. The background features a subtle, sophisticated grain texture. The overall aesthetic is avant-garde yet corporate, suggesting a profound internal transformation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcUEQSVTwmN2NszjLt0j6ehkmcYHKnc6E3MupdemYf_SJGQ1C5VlEJqRzCYAmMuLuvjHOicHCVDQ2s10y5VfoxdnLGixd2OUnTqeW7-8jUGFMXK55kq8kx0xCnME6WwO3b6MTbgVws5-gyxbICk0mzN3WnB9DoTYxLy6lzYoVxFGhvNjsEckCRJsN5xyAHoL9WjVwyyYjVaAp3xJXcqki4kS-2hnVqpkHh6dqzC-ty1-sSwRVe6EoG2sJP3tj0w1FfvC6dba0_dB3k" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-headline-md text-[18px] text-on-surface mb-unit-xs">Metanoia: The Shift</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">Dr. Isaiah Wealth</p>
                  <button className="mt-unit-sm text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
                    <span className="material-symbols-outlined text-[16px]" data-icon="delete">delete</span> Remove
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-center font-body-md"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Price</span>&#8358;6,000</div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">-</button>
                  <span className="px-3 py-1 font-body-md border-x border-outline-variant">1</span>
                  <button className="px-3 py-1 hover:bg-surface-container-high transition-colors">+</button>
                </div>
              </div>
              <div className="col-span-2 text-right font-body-md font-bold"><span className="md:hidden font-label-sm text-on-surface-variant block mb-1">Total</span>&#8358;6,000</div>
            </div>
            <div className="pt-unit-lg">
              <a className="inline-flex items-center text-primary font-label-md hover:translate-x-[-4px] transition-transform duration-200" href="/books">
                <span className="material-symbols-outlined mr-2" data-icon="arrow_back">arrow_back</span>
                Continue Shopping
              </a>
            </div>
          </div>
          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-surface-container-lowest p-unit-lg rounded-lg border border-outline-variant sticky top-32">
              <h2 className="font-headline-md text-headline-md mb-unit-lg">Order Summary</h2>
              <div className="space-y-unit-md mb-unit-lg">
                <div className="flex justify-between font-body-md">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>&#8358;15,700</span>
                </div>
                <div className="flex justify-between font-body-md">
                  <span className="text-on-surface-variant">Shipping Fee</span>
                  <span>&#8358;2,000</span>
                </div>
                <div className="pt-unit-md border-t border-outline-variant">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-headline-md">Total</span>
                    <span className="font-bold text-headline-md text-primary">&#8358;17,700</span>
                  </div>
                </div>
              </div>
              <div className="mb-unit-lg">
                <label className="font-label-md text-on-surface-variant block mb-unit-xs">Discount Code</label>
                <div className="flex gap-unit-xs">
                  <input className="flex-grow bg-surface border border-outline-variant rounded-lg px-unit-md py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Enter code" type="text" />
                  <button className="bg-primary-container text-on-primary-container font-label-md px-unit-md py-2 rounded-lg hover:opacity-90 transition-opacity">Apply</button>
                </div>
              </div>
              <button className="w-full bg-secondary text-white font-headline-md py-unit-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2">
                Proceed to Checkout
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </button>
              <div className="mt-unit-md flex items-center justify-center gap-unit-md opacity-40">
                <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
                <span className="font-label-sm text-label-sm">Secure Checkout Guaranteed</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      {/* Footer */}

      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mousedown', () => {
              button.classList.add('scale-95');
            });
            button.addEventListener('mouseup', () => {
              button.classList.remove('scale-95');
            });
          });
          let lastScroll = 0;
          window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('header');
            if (currentScroll > lastScroll && currentScroll > 100) {
              header.style.transform = 'translateY(-100%)';
            } else {
              header.style.transform = 'translateY(0)';
            }
            header.style.transition = 'transform 0.3s ease';
            lastScroll = currentScroll;
          });
        `
      }} />
    </>
  );
}
