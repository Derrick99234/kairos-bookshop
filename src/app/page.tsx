export default function Home() {
  return (
    <>

      <main>
        {/* Search-Centric Hero Section */}
        <section className="relative bg-primary-container py-unit-xl md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "linear-gradient(135deg, #493DBB 0%, #E03636 100%)" }}></div>
          <div className="relative max-w-4xl mx-auto px-margin-mobile text-center flex flex-col items-center gap-unit-lg">
            <div className="flex flex-col gap-unit-sm">
              <span className="text-on-primary-container font-label-md uppercase tracking-[0.2em] bg-white/10 self-center px-4 py-1.5 rounded-full border border-white/20">Spiritual Wisdom Library</span>
              <h1 className="font-headline-xl text-4xl md:text-6xl text-white leading-tight">
                Find Your Next <br /><span className="text-secondary-fixed">Transformation</span>
              </h1>
              <p className="font-body-lg text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Search thousands of curated spiritual titles, theological insights, and life-changing devotionals designed to steward your divine purpose.
              </p>
            </div>
            {/* Prominent Search Bar */}
            <div className="w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary-fixed-dim rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex items-center bg-white rounded-xl shadow-2xl overflow-hidden p-1.5">
                <span className="material-symbols-outlined ml-4 text-outline">search</span>
                <input className="flex-grow border-none focus:ring-0 px-4 py-4 text-body-lg text-on-surface placeholder:text-outline" placeholder="Search by title, author, or topic (e.g. 'Prayer', 'Leadership')..." type="text" />
                <button className="bg-primary text-white font-label-md px-8 py-4 rounded-lg hover:bg-primary-container transition-all">
                  Search
                </button>
              </div>
              <div className="mt-unit-md flex flex-wrap justify-center gap-unit-sm">
                <span className="text-white/60 text-label-sm">Popular:</span>
                <a className="text-white/90 text-label-sm hover:text-white underline decoration-white/30" href="/books">Kingdom Finance</a>
                <a className="text-white/90 text-label-sm hover:text-white underline decoration-white/30" href="/books">Prophetic Pulse</a>
                <a className="text-white/90 text-label-sm hover:text-white underline decoration-white/30" href="/books">Stewardship</a>
              </div>
            </div>
          </div>
        </section>
        <section className="py-unit-xl bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-unit-xl gap-unit-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">Featured Wisdom</h2>
                <p className="text-on-surface-variant font-body-md mt-unit-xs">The latest profound releases from Dr. Isaiah Wealth and global faith leaders.</p>
              </div>
              <a className="text-secondary font-label-md flex items-center gap-unit-sm hover:gap-unit-md transition-all" href="/books">
                View Catalog <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[3/4] bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span>
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">Theology</span>
                  <h4 className="font-headline-md text-lg text-primary line-clamp-2 mb-unit-sm">The Art of Kingdom Finance</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary">₦7,500.00</span>
                    <button className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[3/4] bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span>
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">Leadership</span>
                  <h4 className="font-headline-md text-lg text-primary line-clamp-2 mb-unit-sm">Strategic Prayer Manual</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary">₦5,200.00</span>
                    <button className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[3/4] bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span>
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">Prophetic</span>
                  <h4 className="font-headline-md text-lg text-primary line-clamp-2 mb-unit-sm">Understanding Kairos Time</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary">₦8,000.00</span>
                    <button className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Card 4 */}
              <div className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col">
                <div className="aspect-[3/4] bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span>
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">Foundational</span>
                  <h4 className="font-headline-md text-lg text-primary line-clamp-2 mb-unit-sm">The Shepherd&apos;s Voice</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-primary">₦6,800.00</span>
                    <button className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Expanded Browse by Category (4x2 Grid) */}
        <section className="py-unit-xl bg-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-unit-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary">Browse by Category</h2>
              <div className="w-24 h-1 bg-secondary rounded-full mx-auto mt-unit-sm"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-unit-md md:gap-gutter">
              {/* Row 1 */}
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-primary text-[40px]">church</span>
                <h4 className="font-label-md text-primary-container uppercase">Theology</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-secondary text-[40px]">person_apron</span>
                <h4 className="font-label-md text-primary-container uppercase">Leadership</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-primary text-[40px]">auto_stories</span>
                <h4 className="font-label-md text-primary-container uppercase">Prophetic</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-secondary text-[40px]">volunteer_activism</span>
                <h4 className="font-label-md text-primary-container uppercase">Devotionals</h4>
              </a>
              {/* Row 2 */}
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-primary text-[40px]">favorite</span>
                <h4 className="font-label-md text-primary-container uppercase">Marriage</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-secondary text-[40px]">payments</span>
                <h4 className="font-label-md text-primary-container uppercase">Finance</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-primary text-[40px]">rocket_launch</span>
                <h4 className="font-label-md text-primary-container uppercase">Youth</h4>
              </a>
              <a className="category-card bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all h-40" href="/books">
                <span className="material-symbols-outlined text-secondary text-[40px]">auto_awesome</span>
                <h4 className="font-label-md text-primary-container uppercase">Prayer</h4>
              </a>
            </div>
            <div className="mt-unit-xl text-center">
              <button className="text-primary font-label-md flex items-center gap-unit-sm mx-auto hover:gap-unit-md transition-all">
                Explore All Categories <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
        {/* About the Author Section */}
        <section className="py-unit-xl bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-unit-xl items-center">
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-2xl">
                <img alt="Dr. Isaiah Wealth" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-wa0buzS7xgoyHwvoJDEGPsfLL6L0n6ZswGrblmdyTerqkt4mHhN4BTKu3fu0MRT2J3fA2oH0WWDD5sSf3Jc6tmquP3ynaOfQMJIF_-oAeBV-lMtieXeAtnzCv91zComzGOuj35Touews4tVvsM9wczU4xjm-o5bDhf6Nw9yJv0K9tNNMDdCOTfP0zhViYzQN8_ltSqBgdDwyAmAfIbQ81cGiQ6Kb3jBy4_V2ELgvGAszfqP8jBWq3wTjc5fROaJ3HYhsS8-O5Ua0gzQ" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-unit-md rounded-xl shadow-lg">
                <p className="font-headline-md text-xl">Dr. Isaiah Wealth</p>
                <p className="text-label-sm opacity-80">Author &amp; Visionary</p>
              </div>
            </div>
            <div className="flex flex-col gap-unit-md">
              <span className="text-secondary font-label-md tracking-widest uppercase">The Author</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Voices of Revelation</h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Kairos Bookshop features the profound literary works of Dr. Isaiah Wealth, whose ministry has impacted millions globally. Each book is crafted with a meticulous blend of biblical accuracy and practical application.
              </p>
              <p className="font-body-md text-on-surface-variant italic border-l-4 border-secondary pl-unit-md py-2">
                &ldquo;My mission is to deliver the word in its purity, ensuring that every believer is equipped with the wisdom needed to dominate in their sphere of influence.&rdquo;
              </p>
              <button className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg self-start hover:shadow-lg transition-all mt-unit-sm">
                Meet the Author
              </button>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="py-unit-xl bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-unit-xl">Transformed Lives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-white p-unit-lg rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-unit-md">
                <div className="flex text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface-variant">&ldquo;The &apos;Art of Kingdom Finance&apos; completely shifted my perspective on wealth. I went from struggling to stewardship in less than a year.&rdquo;</p>
                <div className="mt-auto pt-unit-md border-t border-outline-variant flex items-center gap-unit-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">SO</div>
                  <div>
                    <p className="font-label-md">Samuel O.</p>
                    <p className="text-label-sm text-outline">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-unit-lg rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-unit-md">
                <div className="flex text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface-variant">&ldquo;Strategic Prayer Manual is now my daily companion. The depth of revelation is unlike anything I&apos;ve read before.&rdquo;</p>
                <div className="mt-auto pt-unit-md border-t border-outline-variant flex items-center gap-unit-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">AA</div>
                  <div>
                    <p className="font-label-md">Anabelle A.</p>
                    <p className="text-label-sm text-outline">London, UK</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-unit-lg rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-unit-md">
                <div className="flex text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-on-surface-variant">&ldquo;As a leader, the principles in &apos;Divine Influence&apos; have given me a roadmap for scaling my impact and organization.&rdquo;</p>
                <div className="mt-auto pt-unit-md border-t border-outline-variant flex items-center gap-unit-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">DM</div>
                  <div>
                    <p className="font-label-md">David M.</p>
                    <p className="text-label-sm text-outline">Houston, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Upcoming Events Section */}
        <section className="py-unit-xl bg-surface-container-low border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-unit-xl gap-unit-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">Ministry Updates</h2>
                <p className="text-on-surface-variant font-body-md">Stay engaged with our upcoming events and book launches.</p>
              </div>
              <button className="text-secondary font-label-md shrink-0">View All Events</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm flex border border-outline-variant">
                <div className="w-24 bg-primary flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-headline-md">15</span>
                  <span className="text-label-sm uppercase">Aug</span>
                </div>
                <div className="p-unit-md flex-grow">
                  <h4 className="font-headline-md text-lg text-primary">The Wisdom Summit 2024</h4>
                  <p className="text-body-md text-on-surface-variant line-clamp-1">Join Dr. Isaiah Wealth for a 3-day encounter.</p>
                  <div className="mt-unit-sm flex items-center gap-2 text-outline text-label-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Main Cathedral, Lagos
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm flex border border-outline-variant">
                <div className="w-24 bg-secondary flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-headline-md">02</span>
                  <span className="text-label-sm uppercase">Sep</span>
                </div>
                <div className="p-unit-md flex-grow">
                  <h4 className="font-headline-md text-lg text-primary">New Book Launch: &apos;Dominion&apos;</h4>
                  <p className="text-body-md text-on-surface-variant line-clamp-1">Pre-order event and exclusive author signing.</p>
                  <div className="mt-unit-sm flex items-center gap-2 text-outline text-label-sm">
                    <span className="material-symbols-outlined text-sm">videocam</span>
                    Online &amp; In-Person
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter */}
        <section className="bg-primary-container py-unit-xl">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
            <h2 className="font-headline-lg text-headline-lg text-white mb-unit-sm">Join the Kairos Community</h2>
            <p className="font-body-md text-white/80 mb-unit-lg max-w-lg">Get exclusive updates on new releases, spiritual insights, and upcoming events from Dr. Isaiah Wealth.</p>
            <form className="flex flex-col sm:flex-row gap-unit-sm w-full max-w-md">
              <input className="flex-grow rounded-lg border-0 px-unit-md py-4 text-body-md focus:ring-2 focus:ring-secondary outline-none" placeholder="Enter your email address" type="email" />
              <button className="bg-secondary text-white font-label-md px-unit-lg py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

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
        `
      }} />
    </>
  );
}
