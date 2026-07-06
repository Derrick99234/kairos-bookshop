export default function ForgotPasswordPage() {
  return (
    <main className="flex-grow flex items-center justify-center bg-surface-container-low min-h-[calc(100vh-64px)] px-margin-mobile md:px-margin-desktop py-unit-xl">
      <div className="w-full max-w-md bg-surface dark:bg-surface-dim rounded-modal shadow-sm border border-outline-variant/30 p-unit-lg md:p-unit-xl">
        <div className="text-center mb-unit-lg">
          <div className="flex items-center justify-center gap-unit-sm mb-unit-md">
            <img alt="Kairos Bookshop Logo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLssB72y_9TyQKRY0cJqNLYUpwfxcngfFJ1MIQHVkqvUrXVeLY2QX6DrPkxXoN4tq_wkO7HsGY1bm0KFm-NHislOYg_V2IxMB_kVA-5IUI322A8dEQy11gapZReo6UMmSnCc5LvGPzWaORmWfX8ug2e67wpNS8-R9CBqsayE66AolDax4iXUXgwFTvXfDEC_Ya4Qasn72DZag8B185lQs-d8Pec1J9t7MsbOGQlpOa63CdSG701LcXbkHjaY" />
            <span className="font-headline-md text-headline-md font-bold text-primary">Kairos Bookshop</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Reset Password</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-unit-xs">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <form className="space-y-unit-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-unit-xs block" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">mail</span>
              <input id="email" type="email" placeholder="you@example.com" className="w-full h-12 pl-10 pr-4 bg-transparent border border-outline/40 rounded-input focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 transition-all duration-200" />
            </div>
          </div>

          <button type="submit" className="w-full h-12 bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-md text-label-md rounded-button transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-unit-sm">
            Send Reset Link
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>

        <div className="bg-primary-container/10 rounded-modal p-unit-md mt-unit-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Remember your password?{" "}
            <a href="/signin" className="text-primary hover:text-primary-fixed-dim font-label-md text-label-md transition-colors">Sign In</a>
          </p>
        </div>
      </div>
    </main>
  );
}
