import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-background text-foreground px-4 sm:px-6">
      {/* Main Container */}
      <div className="flex flex-col items-center justify-center max-w-3xl w-full">
        {/* Logo / Brand Mark */}
        <div className="my-12 sm:my-16 lg:my-20">
          <Image
            src="/rozx-dark-logo.png"
            alt="Rozx Logo"
            width={320}
            height={80}
            priority
            className="h-auto w-48 sm:w-64"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 leading-tight tracking-tight">
          Hospital operating system
        </h1>

        {/* Divider Line */}
        <div className="h-0.5 w-16 sm:w-20 bg-border/60 mb-8 sm:mb-10 lg:mb-12"></div>

        {/* Description */}
        <p className="text-lg sm:text-xl lg:text-lg text-muted-foreground text-center mb-12 sm:mb-16 lg:mb-14 leading-relaxed max-w-xl">
          ROZX is building the digital infrastructure for hospitals. We're creating software that helps clinics and hospitals manage appointments, doctors, patients, and operations — simply and reliably.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
          <a
            href="mailto:hello@rozx.in"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-primary text-primary-foreground font-medium text-base rounded-md border border-primary hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Request early access
          </a>
          <a
            href="https://rozx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-secondary text-secondary-foreground font-medium text-base rounded-md border border-border hover:bg-accent active:bg-border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Learn more
          </a>
        </div>

        {/* Subtle Footer Text */}
        <div className="w-full mt-16 sm:mt-20 lg:mt-24 mb-8 sm:mb-12 lg:mb-16 flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-6">
          <Link href="/privacy" className="text-sm text-muted-foreground underline">
            Privacy Policy
          </Link>
            <p className="text-sm text-muted-foreground text-center opacity-75">
            Launching soon
          </p>
          <Link href="/terms" className="text-sm text-muted-foreground underline">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
