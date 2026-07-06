export default function Blog() {
  return (
    <>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        <div className="mb-unit-xl">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-unit-sm">Kairos Blog</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Faith, Wisdom &amp; Spiritual Growth. Exploring the timeless truths of God's Word in our modern age.</p>
        </div>
        <section className="mb-unit-xl">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row shadow-sm">
            <div className="md:w-3/5 h-64 md:h-[400px]">
              <div className="w-full h-full bg-cover bg-center" data-alt="A serene landscape at dawn with soft golden light breaking through morning mist over a calm lake. The scene evokes deep spiritual peace and the presence of the divine, with a solitary figure standing at the edge of the water in prayer. High-fidelity cinematic lighting, premium minimalist aesthetic, cool blue tones mixed with warm sunlight." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuApfSJhonP1aqi1-EcHhA5G9bWH2ZcbMwl5xNaj0U-Vnawt0gYIF66vRx7T4caKi2hIkEL-0bRpg6koreqV13jS3Y52EIhL1ZZnhiIrD5qVgSkHI362l_9O9s-AXS4o4Pw_OueBZoKrGkTCrrPt318YnC66Wr_zV8B0HgSAydoIzN7Mo7JJLrHAdnUiDvIv8Kkt-PacGiUEf_Gv3CENxOYIGhyl6jqgfukwUiazbHDxlxD9zLyXQ0ZdpefILiJTeWNBM_wOtUmtRycL')" }}></div>
            </div>
            <div className="md:w-2/5 p-unit-md md:p-unit-lg flex flex-col justify-center">
              <span className="text-secondary font-label-md text-label-md mb-unit-sm uppercase tracking-wider">Featured Story</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-unit-md leading-tight">The Power of Persistent Prayer: Finding Strength in Silence</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-unit-lg">Understanding the divine rhythm of waiting and how faith is forged in the quiet moments of spiritual seeking. Join us as we explore the scriptural foundations of prayer.</p>
              <div className="flex items-center gap-unit-md mb-unit-lg">
                <div className="h-10 w-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">IW</div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Dr. Isaiah Wealth</p>
                  <p className="text-label-sm text-on-surface-variant">October 24, 2024</p>
                </div>
              </div>
              <a className="text-secondary font-bold hover:underline flex items-center gap-unit-sm group" href="/blog">
                Read More
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-unit-xl">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="A macro shot of an antique leather-bound Bible resting on a rustic wooden desk. Soft natural light from a nearby window illuminates the textured paper and gold-leaf edges. The atmosphere is studious, reverent, and scholarly. Premium corporate modern photography style." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEuWA_sQUBTztPv19eAY-abGoaDNm1DgRRkJuwmmsoBXWDjTUwogq8i2B3axgDVNc0e6fAsp6Qs0Tg0iu_LhIER7wiZsvtjR3afDomsjm6dozNptgr5PXTsmtfpw1t2whiz4ZDaNGginioYOY66hO2QadmFSVPVDRoCPxlHMiHZ2LDhgJiX8iVOLl1p2qyKC8AYu8_do_ojz23klwH88_fwTdWbxgGQ53M8VBT4oMsJwsj7T9wokI8dEQg8mVMXluhG0YEL5ekErZL')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Theology</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">Systematic Study: Foundations of Faith</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">Deep dive into the core doctrines that anchor our belief system in an ever-changing world.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="A group of diverse people gathered in a vibrant community center, engaged in heartfelt conversation and sharing a meal. The lighting is warm and inviting, emphasizing fellowship and human connection. Modern, clean high-fidelity style with a focus on genuine emotion." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsJY3ixmADMAiaps4FNridphFukLnYvOhGhXPUmgtQYy1c6wqtR8v7rLldjQdhxu97QlDvZrLkmOxRacQkzkyU8HDpq6o8dps878qf8x4BonLz8cH8YxgoCUZpboDU7pMuloOAbbQUEQYQVoVwLi6mGrfiKpZ6_e0uBbKJUb_jQbLtf0oA05p0Fb9-8mXZgXeI5-xb9mudNvAr8jGskVHM9fuXsXfgIBOpr3ds-Z6OohDfz6wXWOGF9BNgqlNn-nIoo-4sTqYlrolz')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Missions</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">Global Impact: Stories from the Field</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">Witnessing the transformative power of the gospel across continents and cultures through active service.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="An overhead view of a clean, minimalist workspace with a journal, a fountain pen, and a cup of coffee. The setting is bright and organized, suggesting clarity of thought and intentional living. Soft morning sunlight creates delicate shadows. Professional minimalist aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCy7vjSexc2Qq1SAeukt2sS-84RPTpS4-JNy9Ax-7tLM3wjE4HckVqHzwf7BJC41iqgjELhLLkoGyOT1TtSAxTiadaofIUFUNB811349nIkpIy3MREeJtf6NnzhuIfbePa0-NpyN2eEJxwE5EAkXEAl-pD5_yiZBIohlcmlUwaAjxnjpyHzb1ulfQz4qEm6Ty-3-ZDh3zZhWfa2FzIh9tk7Xx1zR3nL406-z67Rbj6IuALmvI7GfXtaShBvHeYUq-4PafVqd84p-ekU')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Wisdom</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">Intentional Living in a Distracted Age</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">Practical steps to reclaim your spiritual focus and maintain a heart of worship in daily activities.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="A dramatic mountain range at sunset, with peaks catching the last rays of crimson light. The vast scale of nature reflects the glory of creation. The aesthetic is epic and awe-inspiring, with high contrast and rich saturated colors. Professional landscape photography." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBzFeuLH3v2nP1uuiXGk3DEsfGURB-N6y5U1Wy-Rbf-pF4S45jtP6iI9s0Y_TxVW9BahZIZ9Er5UWxclwi8RUsQFegrSoL1qnC3pzYCyyq1WMNwPODbaitiiYXT27y5nqNmBSwvbsze-eLahMp7d_LazUnLctmEPFKMwvkw2ZomaxKrx-KFac4Fv2yqPCTtRnV_Dgkq4BkZmlzcNXSkQU6LDZP--K41HfWlw8LZqP_OkkR5kNbNVUlkE6f6M1cYlRmHqiedYZwgHaeI')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Theology</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">The Attributes of God: His Majesty Revealed</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">A theological exploration of the infinite nature of the Creator and what it means for our identity.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="Close up of two hands held together in support, one young and one aged. The image signifies mentorship, lineage, and the passing of spiritual wisdom. The background is softly blurred with warm, comforting tones. Empathetic and professional photography." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD7ySRKwaPgem4O0L2DssssEDGtsGALNZmXMeu04MG8U27OTOX-_XCUxJnKLsVqRLyJeJkC1mv0pfW2rf6UN4-7G_FKjtc4uYoFxJlE0d35LQe0uPa-oqpDFgB9i45mZfTa-EtZmyrYUItpMWqLAq_tWtDxLwLhirN4quGNd2lwD2pGDrkF9-m5djLAFpatIh0mKoPGdKkLnq93u8At91TRbhQhLBfuj6oBndaAlF7tZWDfCjde1OFV68cz4FBT22KQB1Ri-28pDpZd')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Ministry</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">Building Legacy through Mentorship</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">The biblical mandate for discipleship and how to invest in the next generation of spiritual leaders.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col book-card-hover transition-soft">
                <div className="h-48 overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" data-alt="A person sitting in a light-filled room, reading a book with a peaceful expression. Large windows show greenery outside. The interior design is minimalist and modern. The light is soft and diffused, creating a calm and contemplative mood." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKt2DWqwf_74rKYB_t3QtE7iCW7NJBD32WmR7hM71aiMZXRqN0qhiT6zYgi5flgaiTmeXIPJ6JzGq7GMFArnCxS5XHBHH5ahcjepUWnx0ed9i8rl-vzNPs5heXf9s7MxwyqP87RtASqyv5WhjsbNVic1CxT1TTzPKgKEZ-NRufEDV1ZQEL7HRpXPD0pdPkNRkeNcTUplXUXQoU_enxB2CNLl3LaP2aXtdi7JY6ppSJwv7pIiwnnwpNj1n0Z5yg-LlD7Zl8VWfwUwr9')" }}></div>
                </div>
                <div className="p-unit-md flex-grow flex flex-col">
                  <span className="text-primary font-label-sm text-label-sm bg-primary/10 px-unit-sm py-1 rounded inline-block w-fit mb-unit-sm">Wisdom</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm leading-tight">The Art of Spiritual Discernment</h3>
                  <p className="text-on-surface-variant text-body-md mb-unit-md line-clamp-3">Navigating the complexities of life with the guidance of the Holy Spirit and sound scriptural judgment.</p>
                  <div className="mt-auto flex justify-between items-center pt-unit-md border-t border-outline-variant">
                    <span className="text-label-sm text-on-surface-variant">By Dr. Isaiah Wealth</span>
                    <a className="text-secondary font-bold text-label-md hover:underline" href="/blog">Read More</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-unit-md mt-unit-xl">
              <button className="px-unit-md py-2 rounded border border-outline text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30">Previous</button>
              <div className="flex gap-unit-sm">
                <button className="h-10 w-10 rounded bg-primary text-on-primary font-bold">1</button>
                <button className="h-10 w-10 rounded border border-outline-variant text-on-surface hover:bg-surface-container-low">2</button>
                <button className="h-10 w-10 rounded border border-outline-variant text-on-surface hover:bg-surface-container-low">3</button>
              </div>
              <button className="px-unit-md py-2 rounded border border-outline text-on-surface hover:bg-surface-container-low transition-colors">Next</button>
            </div>
          </div>
          <aside className="lg:col-span-4 flex flex-col gap-unit-xl">
            <div className="p-unit-md bg-surface-container-low rounded-lg border border-outline-variant">
              <h4 className="font-headline-md text-headline-md mb-unit-md text-on-surface">Search</h4>
              <div className="relative">
                <input className="w-full bg-white border border-outline-variant rounded px-unit-md py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Search articles..." type="text" />
                <span className="material-symbols-outlined absolute right-unit-md top-1/2 -translate-y-1/2 text-outline">search</span>
              </div>
            </div>
            <div className="p-unit-md bg-white rounded-lg border border-outline-variant">
              <h4 className="font-headline-md text-headline-md mb-unit-md text-on-surface">Categories</h4>
              <ul className="flex flex-col gap-unit-sm">
                <li><a className="flex justify-between items-center py-2 text-on-surface-variant hover:text-primary group transition-colors" href="/blog"><span className="group-hover:translate-x-1 transition-transform">Spiritual Growth</span> <span className="bg-surface-container-high px-2 rounded text-label-sm">12</span></a></li>
                <li className="border-t border-outline-variant/30"><a className="flex justify-between items-center py-2 text-on-surface-variant hover:text-primary group transition-colors" href="/blog"><span className="group-hover:translate-x-1 transition-transform">Theology</span> <span className="bg-surface-container-high px-2 rounded text-label-sm">8</span></a></li>
                <li className="border-t border-outline-variant/30"><a className="flex justify-between items-center py-2 text-on-surface-variant hover:text-primary group transition-colors" href="/blog"><span className="group-hover:translate-x-1 transition-transform">Ministry</span> <span className="bg-surface-container-high px-2 rounded text-label-sm">15</span></a></li>
                <li className="border-t border-outline-variant/30"><a className="flex justify-between items-center py-2 text-on-surface-variant hover:text-primary group transition-colors" href="/blog"><span className="group-hover:translate-x-1 transition-transform">Daily Devotionals</span> <span className="bg-surface-container-high px-2 rounded text-label-sm">42</span></a></li>
              </ul>
            </div>
            <div className="p-unit-md bg-white rounded-lg border border-outline-variant">
              <h4 className="font-headline-md text-headline-md mb-unit-md text-on-surface">Recent Posts</h4>
              <div className="flex flex-col gap-unit-md">
                <a className="flex gap-unit-md group" href="/blog">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-container">
                    <div className="w-full h-full bg-cover bg-center" data-alt="Close up of a small green sprout emerging from dark, rich soil, symbolizing new life and spiritual growth. Fresh morning dew glimmers on the leaves. Minimalist and professional photography style." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYkQoVb05fGM9uxbHT1pjMcA_pgZt7F9xG8LoO5LkbuCRo8ItF6fvvtUNwhVewLmIMEq7G8OAZbyMi8GthYlGlXVFed7S1dYDU7MKmNOfdeFamCE8BevnUV9BeXyZ2dHpQ_HT3nVjoL8Jx1rWV-phd8oMg1XF5247PYOIXiJVUzBXw8TwI5FJvCYENAcTAeo-ZEQgKAS_tfVF_oBvImJXVIQ1mpNMZrM4xW1_mN5ZqHnJ1RFu98uhDXVTyJ6_8EussSRctiAmj9EFO')" }}></div>
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">New Life in Christ: A Fresh Perspective</p>
                    <p className="text-label-sm text-on-surface-variant">Oct 20, 2024</p>
                  </div>
                </a>
                <a className="flex gap-unit-md group" href="/blog">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-container">
                    <div className="w-full h-full bg-cover bg-center" data-alt="A simple wooden cross standing against a clear morning sky. The lighting is soft and hopeful. Clean, professional composition with plenty of whitespace." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgap6UqSJHilFvDos1bIzxh9MQoZIH2DbhAjNOYlN5DAMwIyXQCAyk1d64SDaTD9FYaoPAVOtzemOB9XVKG0_Lu-87FYtJMdDybVMHn_17ffO6Yliu6pOSreM6YaBCDRtsPNCrJymHXH3rAMNO4AQ1QTCiMYsRiH5kQHsUj5Lu9N7Jc6Tfxg1BwlORYRBfiNpU5dKd08ZRRV7_yvZ8R-GBJbAG6sxMwW6HTzIGrFsDLdpuGQTQNgHnUXyQJK80C9S3b-PERTc0gK_7')" }}></div>
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">Walking the Path: Discipleship Today</p>
                    <p className="text-label-sm text-on-surface-variant">Oct 18, 2024</p>
                  </div>
                </a>
                <a className="flex gap-unit-md group" href="/blog">
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-container">
                    <div className="w-full h-full bg-cover bg-center" data-alt="A focused close-up of sheet music for a choral hymn, with blurred candle light in the background. Evokes a sense of worship and tradition. Elegant, high-fidelity professional aesthetic." style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlLa2t3BGBKZMPObxJ5wOah-1s9ZUZAM-3B8Y_obMsxvzck73vfukJvN9QgQBm2c5w0oFqhAlJfh0YVaaHEtuGLpRtUgweUPQVREuYBx4EyF9qx2I0kFEYwSZiKzvQi06sc2FhQ6hbJh5Yf6xXpZUzIej6nbxhc1_PCT8rhuBSFslY3y5f3GKwGFBgqEHBiGMHx70lFafHbmEKHJM_dIsPiCOxY3w37RysltVUOQGMP_Ck2WSNU2z9LjyW2kR86luCdbgQ7lcIGlZZ')" }}></div>
                  </div>
                  <div>
                    <p className="text-label-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-1">Sacred Rhythms: Worship as a Lifestyle</p>
                    <p className="text-label-sm text-on-surface-variant">Oct 15, 2024</p>
                  </div>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          const searchInput = document.querySelector('input[type="text"]');
          searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-primary/20');
          });
          searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-primary/20');
          });
          const cards = document.querySelectorAll('.book-card-hover');
          cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
              const img = card.querySelector('.bg-cover');
              if (img) img.style.transform = 'scale(1.05)';
            });
            card.addEventListener('mouseleave', () => {
              const img = card.querySelector('.bg-cover');
              if (img) img.style.transform = 'scale(1)';
            });
          });
        `
      }} />
    </>
  );
}
