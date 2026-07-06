export default function ShopAllBooks() {
  return (
    <>

      <main className="flex-grow pt-32 pb-unit-xl">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-unit-lg">
            <div>
              <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface">Browse All Books</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Showing 1&ndash;8 of 124 results</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-gutter">
            {/* Filter Sidebar */}
            <aside className="w-full md:w-1/4 flex flex-col gap-unit-lg">
              {/* Categories */}
              <div>
                <h3 className="font-headline-md text-label-md uppercase tracking-wider text-on-surface border-b border-outline-variant pb-unit-sm mb-unit-md">Filter by Category</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Spiritual Warfare</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Prayer</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input defaultChecked className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-primary font-medium">Revival</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Faith</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Healing</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Prophetic</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Prosperity</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input className="w-4 h-4 rounded-sm border-outline text-primary focus:ring-primary" type="checkbox" />
                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Pastoral Ministry</span>
                  </label>
                </div>
              </div>
              {/* Price Range */}
              <div>
                <h3 className="font-headline-md text-label-md uppercase tracking-wider text-on-surface border-b border-outline-variant pb-unit-sm mb-unit-md">Price Range</h3>
                <div className="px-2">
                  <input className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="10000" min="1000" type="range" defaultValue="5000" />
                  <div className="flex justify-between mt-4 text-label-md font-medium text-on-surface-variant">
                    <span>&#8358;1,000</span>
                    <span>&#8358;10,000</span>
                  </div>
                </div>
              </div>
              {/* Sort By */}
              <div>
                <h3 className="font-headline-md text-label-md uppercase tracking-wider text-on-surface border-b border-outline-variant pb-unit-sm mb-unit-md">Sort By</h3>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-body-md focus:border-primary focus:ring-0 outline-none" defaultValue="Newest">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </aside>
            {/* Main Content */}
            <div className="w-full md:w-3/4">
              {/* Search Bar */}
              <div className="relative mb-unit-lg">
                <input className="w-full h-14 pl-12 pr-6 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-body-md outline-none" placeholder="Search within results..." type="text" />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              </div>
              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {/* Book Card 1 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A professional book cover design titled &apos;Dynamics of the Spirit&apos; by Dr. Isaiah Wealth. The design features an abstract ethereal light pattern in deep primary blue and vibrant whites, suggesting spiritual energy. The typography is modern serif for the title and bold sans-serif for the author name. High-fidelity retail catalog style with soft studio lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxTYkuKcOt2XGDKNenIdYbJdPVj7jiXibiWk0jvGemkRqqEGDAvymQZZzFTO2cUyOYcVyscfhxHxoyMsbw_BvyHdbtMjDCEZ9alpl-cV6JZfW8LGe_scdd9epzFkn2zVRZ5g0pxrftLq46uda3K2-OZYBfNfC8hc1HxfpIcapGaGDQmV98co1VMTkDUnGoGvEGVNVDrq3_hOi46Ee8pP7RP3SJiedW5_dMQnbCWM_PetTTpAIgIEp1XhlWD5jGX4YAxmlEsx1UR9CR" />
                    <div className="absolute top-2 right-2 bg-secondary px-2 py-1 text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">New</div>
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Dynamics of the Spirit</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;5,500</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 2 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A premium book cover for &apos;The Art of Kingdom Finance&apos; by Dr. Isaiah Wealth. The visual depicts a minimalist gold and deep blue geometric crown motif intertwined with modern data visualization lines. The aesthetic is clean, corporate, and authoritative. Set against a soft cream background for a high-end editorial feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzQF1zGyBZcttvATLE_XjllDAn8yqDUP2aO4m4u_H7X_zp1KNEvydUh1ZzEOo3-ZD17_6BgX08fU1Gv5v20l_YKaqte3HUwMQs4fXpnWv7eYb6fz9b195_1eqkbAmkbEP4XU81PLgD-E8cLq2W_0nACaUnz1Iy5MaZX09OyJCXVOHYvUHnXH1n3Wn5pD7FFqul09BgBRLjglRJR6AgE0Z4fQo7HoxdjcG97ppc8lrCadGrRsHvtmTyywUHn6OpWcl5TcEC2mPC4mdh" />
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">The Art of Kingdom Finance</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;7,200</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 3 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A spiritual book cover titled &apos;Metanoia: The Shift&apos; featuring a dramatic contrast between shadow and light. A central light burst breaks through a structured stone texture. Deep primary blue tones dominate the composition with crisp white typography. Cinematic, theological, and inspiring visual style for a high-quality book shop catalog." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQeMTfLJa-2-BjXuv3utugXEUuZ_TWohHg6RxFCfCE02w7wnrMZjhToX1Jlbc2jv8VXcFkZvjB6xAtvKqFhMxlMRA2xJcYiBNhzHn6_Hr0GyAu2WGikfUYGCH-74mCbXg7NDlsiPx965yCv83QDvfDjCcfn6SinZnw-nSNSxuMvRQ9pffpqgf5n72zABzUilg5dOSr1SqByr4QS6oDCWzga5IPNRIm4emVYrp-B0bsSXmSyEr0TlTjiCNAt8DkdIGqg_YcB9qJf_P4" />
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Metanoia: The Shift</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;4,800</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 4 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Cover of &apos;Higher Dimensions of Prayer&apos; featuring an elegant, minimalist ladder silhouette reaching into a soft, glowing cloud of celestial blue. The lighting is diffused and peaceful, creating a mood of stewardship and clarity. Professional typography in a premium retail layout. Kairos brand colors primary blue and white." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTjudzc0hnNhS7MQ-a0eLusnVgQFjimFu7XXKOqz-GNixUNSHn1ImmL8LpiHPUGFRRMkWdzou3m9_9t3D12_FjaIhQwebpdWUGhUZCfSe6-4a4J9IpwqNdTd87RBVsKcrpW4HOjpoqGZmePFUNe37C2GcNGSXTXp4jlRAVQYvvKciRzbN41sfZ91kYpJP2YLT1-jmQVJt-6n8N7EnpOYr_BjOMJWsUuFvC3AlN9y1s6kmAUP91M5CzE1fxdAaI25X7vKfgCXvM_r_S" />
                    <div className="absolute top-2 right-2 bg-primary px-2 py-1 text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">Bestseller</div>
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Higher Dimensions of Prayer</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;6,000</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 5 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Book design for &apos;The Prophetic Code&apos; showcasing a complex, high-fidelity digital pattern resembling ancient scrolls merged with modern data pathways. Bold crimson red accents on a deep blue background. The mood is mysterious yet structured. High-quality lighting effects and crisp typography for a discerning theological audience." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvpKgfhtxLX9-sbhsoq7PeCecAcr2kWUIuXM-ANmmQyqYDkh3ZM9K4kFFhBGm3ltT0Az96bWHndB4Q0BYJD6p-xUdw1pqjiQe7Y-giopEcbR6HbBJ-yyHPd9JS0caghO8kK0cI8aJ8eOWs8uOzNuudWZDnhMQnZ9Hg6eqDysasHJEi6Ev9XZkTGBjhwFkWpnrA0IffaOG64YFNh0_69Q1bfokWCuO1WH-O5ukdClDFyb2TbLaXb8_fWrd2h2gyFHb6TQT4mzMK9OKk" />
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">The Prophetic Code</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;5,200</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 6 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Visual for &apos;Walking in Divine Health&apos; book cover. A clean, bright composition featuring a stylized leaf silhouette glowing with soft white light against a calm blue gradient. Minimalism and corporate modern aesthetic. High-fidelity retail presentation with focused light points and elegant, legible fonts." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz0lJuI8H8pmxSqihOfvUkCndDqAiKhJQHnY6SBhY6gRjJAe6fab4AQAAuWZLKOJlS67WanD0U2FVKDijrsDSgCMZ0lHJ1tDXr9ON6z77UrTuzSZxxCeNUxDilfhVLe6Oe9eayqaViGcIziqsxTUOKhCH5Qk_g77IIrdDLzxv5w8Tp3Q3rw8aCPKwjTJAxHWxYCyyQ36qSYocqTBStEvVRYE4bXhKRXjP7nFrR1-DgBQXUrnK5qBaS1jCKgZu0B45zmtip4m5SElU1" />
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Walking in Divine Health</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;4,500</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 7 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Cover of &apos;Secrets of the Kingdom&apos; with a heavy, premium anchor visual&mdash;a golden key lying on a deep velvet-textured dark blue background. The lighting is low-key, professional, and mysterious. Title and author names are in clean, modern Inter typeface with generous tracking for a premium feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOMJ7nNWn77S64RDrpyepDa61p5xYCuUNr32vUM0BkzZq9-U1qdHNRNartnJZDBNwZSgOreJEypOE6NTnVfxs0pAEj11PYssIV6g54J8kbSRurenTOdT6bG5lkjJRfxwKYKDMcinaSGgH73qZNgkDetsqYXvsfGqBiFQGG85ila7aUz1daiRrpvI2k6IDJwTduOxufQcAH3kti3UOGHjnsxAnxPMBY2visusFyJTp5d-5RLWl8V_fwXPcZ06JqWY2M_bgBa7qR5c12" />
                    <div className="absolute top-2 right-2 bg-secondary px-2 py-1 text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">Sale</div>
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Secrets of the Kingdom</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface-variant line-through">&#8358;5,500</span>
                      <span className="font-headline-md text-headline-md text-secondary">&#8358;3,500</span>
                    </div>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
                {/* Book Card 8 */}
                <div className="bg-surface-container-lowest rounded-lg p-4 flex flex-col group book-card-shadow transition-all">
                  <div className="relative aspect-[3/4] mb-unit-md overflow-hidden rounded-sm bg-surface-container">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Theological book cover &apos;Church on Fire&apos; by Dr. Isaiah Wealth. It features an artistic representation of a flame stylized as a geometric phoenix in shades of primary blue and accents of energetic red. The background is a clean white, typical of modern minimalism. Precise outlines and tonal layers create a sense of organized spiritual energy." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKYPHG5QatHqNyzLW4YibKRjClfePY6o203F1QyXVi2_JmLIs2Yk6snzqFhcV_5OBwRP273kwWqErSeoqpQcliBRxeHlT5X6EFgwbZIffRAYlA_tSNtVIzPRq7JGGS6Zqa0eecM0fupS1muuXJx5jv8fy36OaFikvLYyEKHSCciTKl7Co_fU4goebO5tmuYQkKVxXhIWdkZjTvHzgs_m-yl-rhd1T3nh7YYR8MHi3dbXyzp6I9OzVL6hPtXAPgowWRFN_oVjKVT3-2" />
                  </div>
                  <h4 className="font-headline-md text-body-lg text-on-surface line-clamp-1">Church on Fire</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase mt-1">Dr. Isaiah Wealth</p>
                  <div className="flex items-center gap-1 my-2">
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="mt-auto pt-unit-sm flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-primary">&#8358;5,800</span>
                    <button className="bg-primary text-white p-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Pagination */}
              <div className="mt-unit-xl flex items-center justify-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg pagination-active font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary">3</button>
                <button className="px-4 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:border-primary transition-all text-on-surface-variant hover:text-primary gap-1">
                  Next <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}

      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', function() {
              this.classList.add('scale-95');
            });
            btn.addEventListener('mouseup', function() {
              this.classList.remove('scale-95');
            });
          });
          const searchInput = document.querySelector('input[type="text"]');
          const searchIcon = searchInput?.previousElementSibling;
          searchInput?.addEventListener('focus', () => {
            searchIcon?.classList.add('text-primary');
          });
          searchInput?.addEventListener('blur', () => {
            searchIcon?.classList.remove('text-primary');
          });
        `
      }} />
    </>
  );
}
