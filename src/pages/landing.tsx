import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Salad,
  ArrowRight,
  Users,
  ChefHat,
  LineChart,
  Star,
  Award,
  Utensils,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useTranslation();

  const stats = [
    { number: "10,000+", label: t("landing.stats.clients"), icon: Users },
    { number: "1,000+", label: t("landing.stats.dietitians"), icon: Award },
    { number: "50,000+", label: t("landing.stats.mealPlans"), icon: Utensils },
    { number: "95%", label: t("landing.stats.success"), icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Dietitian",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&crop=face",
      content:
        "Dietech has revolutionized how I manage my nutrition practice. The automated tracking and meal planning features save me hours each week.",
    },
    {
      name: "Michael Chen",
      role: "Sports Nutritionist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&crop=face",
      content:
        "The platform's intuitive interface and comprehensive features have helped me provide better service to my athletic clients.",
    },
    {
      name: "Emma Davis",
      role: "Wellness Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&crop=face",
      content:
        "I love how Dietech combines client management with detailed nutrition tracking. It's the all-in-one solution I've been looking for.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="py-20 sm:py-32">
          <div className="container px-4 sm:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8">
              {t("landing.hero.title").split("Smart")[0]}{" "}
              <span className="text-primary">Smart</span>
              {t("landing.hero.title").split("Smart")[1]}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-[800px] mx-auto">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-12 px-8">
                  {t("common.startFreeTrial")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  {t("common.viewDemo")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 sm:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 p-6 bg-background rounded-lg border"
                >
                  <stat.icon className="h-8 w-8 mx-auto text-primary" />
                  <div className="text-3xl font-bold">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-lg border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {t("landing.features.clientManagement.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.features.clientManagement.description")}
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg border">
                <ChefHat className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {t("landing.features.mealPlanning.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.features.mealPlanning.description")}
                </p>
              </div>
              <div className="bg-background p-8 rounded-lg border">
                <LineChart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">
                  {t("landing.features.progressTracking.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("landing.features.progressTracking.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {t("landing.testimonials.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("landing.testimonials.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-background p-8 rounded-lg border space-y-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-[600px] mx-auto">
              Join thousands of nutrition professionals who trust Dietech to manage
              their practice efficiently.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-12 px-8">
                {t("common.startFreeTrial")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container px-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Salad className="h-6 w-6 text-primary" />
              <span className="font-semibold">{t("common.appName")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Dietech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}