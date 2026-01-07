import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Calendar,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Users,
  IndianRupee,
  Stethoscope,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">      

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by 150+ Hospitals across India
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              The Digital Operating System for{' '}
              <span className="text-primary">Indian Healthcare</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Modern, affordable SaaS platform for patient bookings, doctor management, 
              and seamless hospital operations. Join the healthcare revolution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/hospitals">
                <Button size="lg" className="h-12 px-8">
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register-hospital">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Register Your Hospital
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem icon={Building2} value="150+" label="Hospitals" />
            <StatItem icon={Stethoscope} value="1,200+" label="Doctors" />
            <StatItem icon={Users} value="50K+" label="Patients Served" />
            <StatItem icon={Calendar} value="100K+" label="Appointments" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ROZX?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for Indian healthcare, designed for simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Calendar}
              title="Easy Online Booking"
              description="Patients can book appointments 24/7 with real-time availability. No more phone calls or waiting."
            />
            <FeatureCard
              icon={Clock}
              title="Reduce Wait Times"
              description="Smart scheduling and queue management reduces patient wait times by up to 60%."
            />
            <FeatureCard
              icon={IndianRupee}
              title="Affordable Pricing"
              description="Pay only 10% platform fee per appointment. No setup costs, no hidden charges."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Compliant"
              description="Bank-grade security with full compliance to Indian healthcare data regulations."
            />
            <FeatureCard
              icon={Building2}
              title="Hospital Dashboard"
              description="Complete visibility into appointments, revenue, and performance metrics."
            />
            <FeatureCard
              icon={Stethoscope}
              title="Doctor Portal"
              description="Dedicated interface for doctors to manage schedules, patients, and prescriptions."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to better healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number={1}
              title="Find a Hospital"
              description="Search for hospitals near you by location, specialty, or doctor name"
            />
            <StepCard
              number={2}
              title="Book Appointment"
              description="Choose your preferred doctor, date, and time slot"
            />
            <StepCard
              number={3}
              title="Visit & Pay"
              description="Visit the hospital at your scheduled time and pay securely"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Hospital?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join 150+ hospitals already using ROZX to streamline operations and grow their practice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register-hospital">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Register Your Hospital
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">R</span>
                </div>
                <span className="font-semibold text-foreground">ROZX</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Digital Operating System for Indian Healthcare
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/hospitals" className="hover:text-foreground">Find Hospitals</Link></li>
                <li><Link href="/doctors" className="hover:text-foreground">Find Doctors</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ROZX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
