export default function AccountOrders() {
  return (
    <>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        <div className="mb-unit-xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Welcome back, Brother Samuel</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-unit-xs">Manage your orders and account settings.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-unit-xl">
          <aside className="w-full md:w-1/4 space-y-unit-sm">
            <nav className="flex flex-col gap-unit-xs">
              <a className="nav-sidebar-item flex items-center gap-unit-md px-unit-md py-3 md:py-unit-sm bg-primary text-on-primary rounded-lg shadow-sm" href="/account/orders">
                <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
                <span className="font-label-md text-label-md">My Orders</span>
              </a>
              <a className="nav-sidebar-item flex items-center gap-unit-md px-unit-md py-3 md:py-unit-sm text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg" href="/account">
                <span className="material-symbols-outlined" data-icon="person">person</span>
                <span className="font-label-md text-label-md">My Profile</span>
              </a>
              <a className="nav-sidebar-item flex items-center gap-unit-md px-unit-md py-3 md:py-unit-sm text-on-surface-variant hover:bg-surface-container hover:text-primary rounded-lg" href="/account">
                <span className="material-symbols-outlined" data-icon="location_on">location_on</span>
                <span className="font-label-md text-label-md">Saved Addresses</span>
              </a>
              <div className="pt-unit-md mt-unit-md border-t border-outline-variant">
                <a className="nav-sidebar-item flex items-center gap-unit-md px-unit-md py-3 md:py-unit-sm text-secondary hover:bg-secondary-fixed rounded-lg" href="/signin">
                  <span className="material-symbols-outlined" data-icon="logout">logout</span>
                  <span className="font-label-md text-label-md">Logout</span>
                </a>
              </div>
            </nav>
            <div className="mt-unit-xl p-unit-md bg-primary-container rounded-xl text-on-primary-container relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <p className="font-label-sm text-label-sm mb-unit-xs uppercase tracking-widest opacity-80">Next Release</p>
                <h3 className="font-headline-md text-headline-md leading-tight mb-unit-sm">Theology of Time</h3>
                <p className="font-body-md text-body-md opacity-90">Pre-order now for exclusive access.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[120px]" data-icon="auto_stories">auto_stories</span>
              </div>
            </div>
          </aside>
          <section className="w-full md:w-3/4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-unit-lg border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-unit-sm bg-white">
                <h2 className="font-headline-md text-headline-md">Order History</h2>
                <button className="text-primary font-label-md text-label-md flex items-center gap-unit-xs hover:underline">
                  Download all as PDF
                  <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-unit-lg py-unit-md font-label-md text-label-md text-on-surface-variant">Order #</th>
                      <th className="px-unit-lg py-unit-md font-label-md text-label-md text-on-surface-variant">Date</th>
                      <th className="px-unit-lg py-unit-md font-label-md text-label-md text-on-surface-variant">Items</th>
                      <th className="px-unit-lg py-unit-md font-label-md text-label-md text-on-surface-variant">Total</th>
                      <th className="px-unit-lg py-unit-md font-label-md text-label-md text-on-surface-variant">Status</th>
                      <th className="px-unit-lg py-unit-md"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant bg-white">
                    <tr className="order-row cursor-pointer">
                      <td className="px-unit-lg py-unit-md font-label-md text-label-md text-primary font-bold">#KB-8921</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Oct 24, 2024</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">The Sovereignty of God + 2 others</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md font-semibold">&#8358;24,500.00</td>
                      <td className="px-unit-lg py-unit-md">
                        <span className="px-unit-sm py-unit-xs bg-primary-container text-white text-[11px] font-bold uppercase rounded tracking-wide">Completed</span>
                      </td>
                      <td className="px-unit-lg py-unit-md text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="order-row cursor-pointer">
                      <td className="px-unit-lg py-unit-md font-label-md text-label-md text-primary font-bold">#KB-8945</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Nov 02, 2024</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Kairos Devotional 2025</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md font-semibold">&#8358;5,000.00</td>
                      <td className="px-unit-lg py-unit-md">
                        <span className="px-unit-sm py-unit-xs bg-secondary text-white text-[11px] font-bold uppercase rounded tracking-wide">Processing</span>
                      </td>
                      <td className="px-unit-lg py-unit-md text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="order-row cursor-pointer">
                      <td className="px-unit-lg py-unit-md font-label-md text-label-md text-primary font-bold">#KB-8812</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Oct 12, 2024</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Ministry Essentials Kit</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md font-semibold">&#8358;12,200.00</td>
                      <td className="px-unit-lg py-unit-md">
                        <span className="px-unit-sm py-unit-xs bg-primary-fixed-dim text-primary text-[11px] font-bold uppercase rounded tracking-wide">Shipped</span>
                      </td>
                      <td className="px-unit-lg py-unit-md text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="order-row cursor-pointer">
                      <td className="px-unit-lg py-unit-md font-label-md text-label-md text-primary font-bold">#KB-8756</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Sep 30, 2024</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">History of the Reformation</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md font-semibold">&#8358;8,700.00</td>
                      <td className="px-unit-lg py-unit-md">
                        <span className="px-unit-sm py-unit-xs bg-primary-container text-white text-[11px] font-bold uppercase rounded tracking-wide">Completed</span>
                      </td>
                      <td className="px-unit-lg py-unit-md text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="order-row cursor-pointer">
                      <td className="px-unit-lg py-unit-md font-label-md text-label-md text-primary font-bold">#KB-8690</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Sep 15, 2024</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md">Understanding Spiritual Gifts</td>
                      <td className="px-unit-lg py-unit-md font-body-md text-body-md font-semibold">&#8358;4,250.00</td>
                      <td className="px-unit-lg py-unit-md">
                        <span className="px-unit-sm py-unit-xs bg-primary-container text-white text-[11px] font-bold uppercase rounded tracking-wide">Completed</span>
                      </td>
                      <td className="px-unit-lg py-unit-md text-right">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-unit-lg bg-surface-container-low flex justify-center border-t border-outline-variant">
                <nav className="flex gap-unit-xs">
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant text-primary font-bold shadow-sm">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">3</button>
                </nav>
              </div>
            </div>
            <div className="mt-unit-lg p-unit-lg bg-white border border-outline-variant rounded-xl flex flex-col md:flex-row items-center gap-unit-lg">
              <div className="bg-primary/5 p-unit-md rounded-full">
                <span className="material-symbols-outlined text-primary text-[32px]" data-icon="support_agent">support_agent</span>
              </div>
              <div className="flex-grow text-center md:text-left">
                <h4 className="font-headline-md text-headline-md text-on-surface">Need help with an order?</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Our support team is available Monday to Friday, 9am - 6pm.</p>
              </div>
              <button className="px-unit-lg py-unit-md bg-primary text-white font-label-md text-label-md rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('.order-row').forEach(row => {
            row.addEventListener('click', () => {
              console.log('Order detail requested for ' + row.querySelector('td').innerText);
            });
            row.classList.add('cursor-pointer');
          });
          const sidebarItems = document.querySelectorAll('.nav-sidebar-item');
          sidebarItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
              if(!item.classList.contains('bg-primary')) {
                item.style.transform = 'translateX(4px)';
              }
            });
            item.addEventListener('mouseleave', () => {
              item.style.transform = 'translateX(0px)';
            });
          });
        `
      }} />
    </>
  );
}
