export default function BookDetail() {
  return (
    <>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-md">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-unit-xs py-unit-md font-label-md text-label-md text-on-surface-variant/70">
          <a className="hover:text-primary transition-colors" href="/">Home</a>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_right</span>
          <a className="hover:text-primary transition-colors" href="/books">Shop</a>
          <span className="material-symbols-outlined text-sm">keyboard_arrow_right</span>
          <span className="text-on-surface font-semibold">Dynamics of the Spirit</span>
        </nav>
        {/* Product Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-unit-xl mt-unit-md">
          {/* Left: Hero Imagery */}
          <div className="flex flex-col gap-unit-md">
            <div className="bg-white border border-outline-variant/30 rounded-lg overflow-hidden group">
              <img className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" data-alt="A premium close-up studio shot of a theological book titled &apos;Dynamics of the Spirit&apos; by Dr. Isaiah Wealth. The book cover features deep royal blue and gold accents with elegant serif typography. It is positioned on a minimalist, soft cream-colored pedestal against a clean, high-fidelity light-mode background. The lighting is soft and professional, highlighting the high-quality paper texture and embossed details of the cover." src="https://i0.wp.com/kairosbookshop.org/wp-content/uploads/2024/10/Born-To-Set-New-Records.jpeg?w=493&amp;ssl=1" />
            </div>
            <div className="grid grid-cols-3 gap-unit-md">
              <div className="bg-white border border-outline-variant/30 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors ring-2 ring-transparent hover:ring-primary/20">
                <img className="w-full h-auto aspect-square object-cover" data-alt="A side view of the book &apos;Dynamics of the Spirit&apos; showing the spine and the depth of its 320 pages. The spine features gold-foiled text and a small emblem of a dove. The background is a crisp white studio setting with soft shadows, maintaining the premium Kairos brand aesthetic of stewardship and spiritual clarity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Q3Kl6W-BPD1Yg2SgbuVKb7L76YzAgqai3hL-BuyESWwVtTgCBnVURBtK5zyY_APXt5XF2eGRVfaAuajD5vwFGO79V8-kRcKbt60AOpb_b9V01CxCv0pLw1HAeKQSP6CgsYEhGYsfj3rAtxlEcXahMHMkTHrNxMCtKORSfig8VGwQSqTIavD03bfEvNbnZH32Vi9VuCtDZsFAN1cwroOGjicLwn8x0WVxcMOxCCJwt4Zxckt4kShnUEDSt3kSeM2fIxIi93EIzvs8" />
              </div>
              <div className="bg-white border border-outline-variant/30 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors ring-2 ring-transparent hover:ring-primary/20">
                <img className="w-full h-auto aspect-square object-cover" data-alt="A lifestyle shot of an open page from &apos;Dynamics of the Spirit&apos;, showcasing clean, readable typography with ample margins and elegant drop caps. The paper has a warm, high-quality ivory finish. A soft morning light falls across the page, creating an atmosphere of contemplative study and theological depth." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG44JdbIIfhsf6-YPE8-ayVaazzjplUyQ2EKMx-5oMJuf6RkPfumFs4wbEgShWGR77uPdTqg2A51jh4DX8-jWE9kHqs6OaxdcQ9pF8nQSQIEjZkAhw2ckWCwWBcRcACQ193Ei9iqEEMCVP8RVkEppetMptTggEzi_MfAKIvv3gQTdZFRmiwacXzUF4NZfUMrlpwA4DGTNKkySNPS4E4q0TM9SwccCxv1j0xtNTlRLvXZ7Ko9rnHR_TvBCqgRi_OGi8H2aBzYlDL5Te" />
              </div>
              <div className="bg-white border border-outline-variant/30 rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors ring-2 ring-transparent hover:ring-primary/20">
                <img className="w-full h-auto aspect-square object-cover" data-alt="The back cover of the book &apos;Dynamics of the Spirit&apos; displaying a concise synopsis and endorsements from prominent theological figures. The design is structured and professional, featuring clean layouts and small icons representing different spiritual themes. The lighting is bright and modern, consistent with the corporate modern UI style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXHVnJ8vNgPRsVIkkKpHZI5q_HHo02qUDihffnpocsOqUEh0wU5RMuHkuSD5jm0bk6znKZ5YpgJtta7LLbgH7DkRRk0ajRjGrv00ETFt-rzg1wiRj-lkq0QmaMTCjAXxywsKqW5pa0I-Eq0QTSjnyzwyPMI5WmQN6XWGNTGaolF85_tqaM-A8XOpQJmYKKgRze-gB_BfY1da9Na1Bw2vNisf0fTCubThuLRz1KAXCsBS25crvJeDfuwotH7c5cyrAk19SHbQC6FPjS" />
              </div>
            </div>
          </div>
          {/* Right: Hero Content */}
          <div className="flex flex-col gap-unit-lg">
            <div>
              <span className="inline-block px-unit-sm py-[2px] bg-primary/10 text-primary font-label-md text-label-sm uppercase tracking-wider rounded mb-unit-sm">New Arrival</span>
              <h1 className="font-headline-xl text-2xl md:text-headline-xl text-on-surface mb-unit-xs">Born to set New Records</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">Dr. Isaiah Wealth</p>
            </div>
            <div className="flex items-center gap-unit-sm">
              <div className="flex text-secondary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">4.9/5</span>
              <span className="text-on-surface-variant/60 font-body-md text-body-md">(124 Reviews)</span>
            </div>
            <div className="border-y border-outline-variant/30 py-unit-lg">
              <span className="font-headline-lg text-headline-lg text-primary">&#8358;5,000</span>
            </div>
            {/* Format Selector */}
            <div className="flex flex-col gap-unit-sm">
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Select Format</span>
              <div className="grid grid-cols-2 gap-unit-md">
                <button className="flex flex-col items-center gap-1 p-unit-md border-2 border-primary bg-primary/5 rounded transition-all">
                  <span className="font-label-md text-label-md text-primary">Paperback</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">&#8358;5,000</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-unit-md border border-outline-variant/50 hover:border-primary/50 bg-white rounded transition-all">
                  <span className="font-label-md text-label-md text-on-surface">Hardcover</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">&#8358;8,500</span>
                </button>
              </div>
            </div>
            {/* Quantity and Actions */}
            <div className="flex flex-col gap-unit-md">
              <div className="flex items-center gap-unit-md">
                <div className="flex items-center border border-outline-variant rounded bg-white h-12">
                  <button className="w-10 h-full flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="w-12 text-center font-label-md text-label-md">1</span>
                  <button className="w-10 h-full flex items-center justify-center hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
                <button className="flex-1 h-12 bg-primary text-white font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Cart
                </button>
              </div>
              <button className="w-full h-12 bg-secondary text-white font-label-md text-label-md rounded hover:bg-secondary-container transition-all active:scale-95 shadow-lg shadow-secondary/10">
                Buy Now
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-unit-sm sm:gap-unit-lg text-on-surface-variant/80 font-label-sm text-label-sm mt-unit-sm">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Free Delivery on orders above &#8358;50,000
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">history</span>
                Ships in 24-48 hours
              </div>
            </div>
          </div>
        </section>
        {/* Detailed Information */}
        <section className="mt-unit-xl">
          <div className="flex border-b border-outline-variant/30 gap-unit-lg overflow-x-auto no-scrollbar">
            <button className="pb-unit-sm border-b-2 border-primary text-primary font-label-md text-label-md whitespace-nowrap">Description</button>
            <button className="pb-unit-sm border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md whitespace-nowrap transition-colors">Product Details</button>
            <button className="pb-unit-sm border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md whitespace-nowrap transition-colors">Customer Reviews</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-unit-xl mt-unit-lg">
            {/* Description */}
            <div className="lg:col-span-2 space-y-unit-md">
              <h3 className="font-headline-md text-headline-md text-on-surface">The Journey into the Spirit</h3>
              <div className="font-body-md text-body-md text-on-surface-variant space-y-4 leading-relaxed">
                <p>In &ldquo;Dynamics of the Spirit,&rdquo; Dr. Isaiah Wealth masterfully unveils the deep mechanics of spiritual growth and the various dimensions through which a believer interacts with the divine. This isn&apos;t just a book; it&apos;s a navigational chart for those seeking to move beyond the superficial and into the transformative power of spiritual maturity.</p>
                <p>Through precise theological mapping and practical stewardship principles, readers will explore the realms of the spirit, understanding how to host the presence of God and manifest the gifts of the Spirit with clarity and energy. Whether you are a seeker or a seasoned minister, these pages offer a curated path to higher spiritual significance.</p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Understanding the tripartite nature of spiritual interaction.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Developing a consistent and potent prayer life.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                    <span>Identifying the nuances between spiritual gifts and spiritual fruits.</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Product Specs (Sidebar) */}
            <div className="bg-white border border-outline-variant/30 rounded-lg p-unit-lg self-start">
              <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-unit-md">Product Details</h4>
              <div className="space-y-unit-md">
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">ISBN</span>
                  <span className="font-label-sm text-label-sm text-on-surface">978-019-2831-22</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Page Count</span>
                  <span className="font-label-sm text-label-sm text-on-surface">320 Pages</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Dimensions</span>
                  <span className="font-label-sm text-label-sm text-on-surface">6&quot; x 9&quot; (15 x 23 cm)</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Publisher</span>
                  <span className="font-label-sm text-label-sm text-on-surface">Gospel Pillars Publishing</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Language</span>
                  <span className="font-label-sm text-label-sm text-on-surface">English</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Reviews Section */}
        <section className="mt-unit-xl">
          <div className="flex flex-col md:flex-row justify-between items-end gap-unit-md mb-unit-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface">Authentic Growth Reviews</h3>
            <button className="px-unit-lg py-unit-sm border border-primary text-primary font-label-md text-label-md rounded hover:bg-primary/5 transition-colors">Write a Review</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
            {/* Review Card 1 */}
            <div className="bg-white border border-outline-variant/30 rounded-lg p-unit-lg">
              <div className="flex justify-between mb-unit-sm">
                <div className="flex text-secondary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">2 weeks ago</span>
              </div>
              <div className="flex items-center gap-unit-sm mb-unit-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">MK</div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-semibold">Michael K.</p>
                  <p className="text-label-sm text-on-surface-variant/70">Verified Purchase</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">&ldquo;This book has completely redefined my understanding of spiritual growth. The depth of revelation is unparalleled. Highly recommend for anyone serious about their faith journey.&rdquo;</p>
            </div>
            {/* Review Card 2 */}
            <div className="bg-white border border-outline-variant/30 rounded-lg p-unit-lg">
              <div className="flex justify-between mb-unit-sm">
                <div className="flex text-secondary">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">1 month ago</span>
              </div>
              <div className="flex items-center gap-unit-sm mb-unit-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">SE</div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface font-semibold">Sarah E.</p>
                  <p className="text-label-sm text-on-surface-variant/70">Verified Purchase</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">&ldquo;I purchased this for our church library and it has become the most borrowed book. The principles are practical and the teaching is sound. Dr. Wealth has done it again.&rdquo;</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
