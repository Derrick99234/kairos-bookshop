export default function SignUpPage() {
  return (
    <main className="flex-grow flex items-center justify-center bg-surface-container-low min-h-[calc(100vh-64px)] px-margin-mobile md:px-margin-desktop py-unit-xl">
      <div className="w-full max-w-xl bg-surface dark:bg-surface-dim rounded-modal shadow-sm border border-outline-variant/30 p-unit-lg md:p-unit-xl">
        <div className="text-center mb-unit-lg">
          <div className="flex items-center justify-center gap-unit-sm mb-unit-md">
            <img alt="Kairos Bookshop Logo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLssB72y_9TyQKRY0cJqNLYUpwfxcngfFJ1MIQHVkqvUrXVeLY2QX6DrPkxXoN4tq_wkO7HsGY1bm0KFm-NHislOYg_V2IxMB_kVA-5IUI322A8dEQy11gapZReo6UMmSnCc5LvGPzWaORmWfX8ug2e67wpNS8-R9CBqsayE66AolDax4iXUXgwFTvXfDEC_Ya4Qasn72DZag8B185lQs-d8Pec1J9t7MsbOGQlpOa63CdSG701LcXbkHjaY" />
            <span className="font-headline-md text-headline-md font-bold text-primary">Kairos Bookshop</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Create Account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-unit-xs">Fill in your details to get started.</p>
        </div>

        <form className="space-y-unit-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="firstName">First Name</label>
              <div className="relative">
                <input id="firstName" type="text" placeholder="John" className="w-full h-12 pl-4 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
              </div>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="lastName">Last Name</label>
              <div className="relative">
                <input id="lastName" type="text" placeholder="Doe" className="w-full h-12 pl-4 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
              </div>
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">mail</span>
              <input id="email" type="email" placeholder="you@example.com" className="w-full h-12 pl-10 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">call</span>
              <input id="phone" type="tel" placeholder="+234 800 000 0000" className="w-full h-12 pl-10 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">lock</span>
                <input id="password" type="password" placeholder="Create password" className="w-full h-12 pl-10 pr-10 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">lock</span>
                <input id="confirmPassword" type="password" placeholder="Confirm password" className="w-full h-12 pl-10 pr-10 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-unit-sm pt-unit-xs">
            <input id="terms" type="checkbox" className="mt-0.5 accent-primary w-4 h-4 rounded-input border-outline/40 cursor-pointer" />
            <label htmlFor="terms" className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none">
              I agree to the{" "}
              <a href="#" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="w-full h-12 bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-md text-label-md rounded-button transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-unit-sm">
            Create Account
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <div className="flex items-center gap-unit-md my-unit-md">
          <div className="flex-1 h-px bg-outline-variant/50" />
          <span className="font-body-md text-body-md text-on-surface-variant">or</span>
          <div className="flex-1 h-px bg-outline-variant/50" />
        </div>

        <button type="button" className="w-full h-12 flex items-center justify-center gap-unit-sm bg-surface-container-high hover:bg-transparent border border-outline/30 rounded-button transition-all duration-200 font-label-md text-label-md text-on-surface active:scale-[0.98]">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <div className="bg-primary-container/10 rounded-modal p-unit-md mt-unit-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors">Sign In</a>
          </p>
        </div>
      </div>
    </main>
  );
}
