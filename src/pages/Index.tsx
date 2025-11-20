import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import terraLogo from "../assets/terra-civitas.png";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      title: "AI-Powered Detection",
      description: "Advanced Google ViT model for real-time crime detection with 98% accuracy",
    },
    {
      icon: Lock,
      title: "Secure Access",
      description: "Role-based authentication for users and authorities with end-to-end encryption",
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Real-time notifications and comprehensive alert management system",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <section className="min-h-[80vh] relative flex items-center border-b border-border">
        {/* Background Image (match Register page): logo image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${terraLogo})` }}
        >
          {/* Dark semi-transparent overlay to keep content readable */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                TERRA-CIVITAS
              </h1>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="text-xl px-12 py-6 bg-transparent border border-white/30 text-white hover:bg-white/10 font-bold shadow-none transform hover:scale-105 transition-all"
              >
                Access System
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="text-xl px-12 py-6 bg-white text-black hover:bg-gray-100 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Register Now
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </div>
            {/* Dev-only preview buttons removed. Use the Access System button above to auto-login as demo user. */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Advanced Security Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 border-border">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to enhance your security?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the next generation of crime prevention technology
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/login")}
          >
            Get Started
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
