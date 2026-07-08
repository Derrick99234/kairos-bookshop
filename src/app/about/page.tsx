import NewsletterForm from "@/components/NewsletterForm";

export default function About() {
  return (
    <>

      <main className="pt-unit-xl">
        {/* Hero Section */}
        <section className="hero-mesh text-white py-24 md:py-32 overflow-hidden relative">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <div className="max-w-2xl">
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed/80 mb-4 block">Our Heritage</span>
              <h1 className="font-headline-xl text-2xl md:text-headline-xl md:text-6xl mb-6">About Gospel Pillars</h1>
              <p className="font-body-lg text-body-lg text-primary-fixed opacity-90 leading-relaxed">
                The literary arm of Gospel Pillars Ministry, dedicated to publishing the profound revelations and teachings of Dr. Isaiah Wealth. We translate spiritual insight into practical literature for global transformation.
              </p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
        </section>
        {/* Mission Section */}
        <section className="py-unit-xl cream-gradient">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid md:grid-cols-2 gap-unit-xl items-center">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-6">Our Mission</h2>
                <div className="space-y-4">
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    We are driven by a singular mandate: to spread the gospel of Jesus Christ to every corner of the earth through spirit-filled literature. Our books are more than words on paper; they are vehicles of the Spirit designed to equip the body of Christ.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    By fostering spiritual maturity and providing deep theological clarity, we empower believers to live out their divine purpose with conviction and stewardship.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <button className="bg-primary text-white px-6 py-3 font-label-md rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
                      Explore Publications
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-xl transition-all group-hover:scale-105"></div>
                <img className="relative z-10 rounded-lg shadow-xl object-cover aspect-[4/3] w-full" data-alt="A professional, high-fidelity photograph of a minimalist bookshop interior. The shelves are neatly organized with premium-quality hardcover books under soft, warm lighting. The aesthetic is clean, modern, and corporate, reflecting a &apos;Kairos&apos; atmosphere of spiritual significance and quiet intellectualism. The background includes textures of light oak and cream-colored walls." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSvzwKs_V4-InVDj6eyDb5bIy_unt4aP_3AKlItBcfGc0ve3XuyI5y8nf18wYfdopzyNqRuIrdtd5vo3NqmWltWUDL-Dwyl79e80FARwvU0FjfneIrjd0FaSOqWigrIoPUdfRDx1d1knuc8-aRAHdwVCrLnc5IzinP85Qii9hD4D_PeX5xo9HZCHgHh7RB9FANw91RrYeB8p4vnqhzCZJ7FtffbQ1Jo91Z-2itoAVwj_sOqrdrhv3fARsXKJimzFaQ3KEyxB3I6FXg" />
              </div>
            </div>
          </div>
        </section>
        {/* Stats Row */}
        <section className="bg-surface-container-highest/30 py-16 border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-headline-lg text-headline-lg text-primary mb-1">200+</div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Books Published</div>
              </div>
              <div className="text-center">
                <div className="font-headline-lg text-headline-lg text-primary mb-1">1M+</div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Readers Globally</div>
              </div>
              <div className="text-center">
                <div className="font-headline-lg text-headline-lg text-primary mb-1">20+</div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Years of Ministry</div>
              </div>
              <div className="text-center">
                <div className="font-headline-lg text-headline-lg text-primary mb-1">15+</div>
                <div className="font-label-md text-label-md text-secondary uppercase tracking-wider">Categories</div>
              </div>
            </div>
          </div>
        </section>
        {/* Author Section */}
        <section className="py-unit-xl bg-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row gap-unit-xl items-center">
              <div className="w-full md:w-5/12">
                <div className="relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-12 -mt-12 z-0"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-8 -mb-8 z-0"></div>
                  <img className="relative z-10 rounded-lg shadow-2xl border-4 border-white object-cover aspect-[3/4] w-full" data-alt="A dignified, professional portrait of Dr. Isaiah Wealth in a corporate but welcoming pose. He is wearing a tailored navy suit against a soft, out-of-focus background of a theological library. The lighting is warm and directional, highlighting a sense of wisdom and authoritative leadership. The overall tone is high-fidelity, premium, and spiritual." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvRR1gw8JWcgvUu2KCnQarDM3Qh0sAn0TrEhVMqGWAXAKASRChAIwIed5cJVZlZ9vDmEuZRqdeVJryFo8TQkV5ZoDvAUBaKvIa--x_8LM2DQn4TlfUV8W4EmFYCjcDbJQE2jqNX7dBklXp9teL03M2jheH6kp4byxQo328AsC-Yxs_0QKILl4x1wTVmJCiFTr2G12gHg9qH3hvcLw_FPHsXeJGY1WXzWP7FxE8iLvhlu2Q7eQfK-C_e0c4XUwx9mjhB4tqTaviMUj7j1U" />
                </div>
              </div>
              <div className="w-full md:w-7/12">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">About Dr. Isaiah Wealth</h2>
                <div className="prose prose-blue max-w-none space-y-6">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Dr. Isaiah Wealth is the founder and presiding Bishop of Gospel Pillars Ministry. A visionary leader with a profound mandate to reveal the person of Jesus to the world, he has dedicated over two decades to the ministry of the Word and the Spirit.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    As a prolific author of hundreds of titles, his writings cover diverse areas of the Christian faith including theology, prophecy, finances, and character development. His literary works are celebrated globally for their clarity, spiritual depth, and transformative power.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed italic">
                    &ldquo;Through these pages, my prayer is that you encounter the same fire that has consumed my life for the sake of the Kingdom.&rdquo;
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="h-px bg-outline-variant flex-grow"></div>
                    <span className="font-label-md text-label-md text-primary">Founder, Gospel Pillars Ministry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter CTA (Bento Style) */}
        <section className="py-unit-xl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="bg-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="p-6 md:p-12 md:w-2/3">
                <h3 className="font-headline-lg text-headline-lg text-white mb-4">Stay Inspired</h3>
                <p className="font-body-md text-primary-fixed opacity-80 mb-8 max-w-lg">Join our global community of readers. Receive weekly insights, new release notifications, and exclusive theological notes from Dr. Isaiah Wealth.</p>
                <NewsletterForm dark />
              </div>
              <div className="md:w-1/3 relative min-h-[200px] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}

      <script dangerouslySetInnerHTML={{
        __html: `
          const observerOptions = { threshold: 0.5 };
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate-pulse');
                setTimeout(() => entry.target.classList.remove('animate-pulse'), 1000);
              }
            });
          }, observerOptions);
          document.querySelectorAll('.font-headline-lg').forEach(stat => {
            observer.observe(stat);
          });
          const navLinks = document.querySelectorAll('nav a');
          navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
              if (!link.classList.contains('text-primary')) {
                link.style.transform = 'translateY(-2px)';
              }
            });
            link.addEventListener('mouseleave', () => {
              link.style.transform = 'translateY(0)';
            });
          });
        `
      }} />
    </>
  );
}
