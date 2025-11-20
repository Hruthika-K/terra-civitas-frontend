import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import terraLogo from "../assets/terra-civitas.png";
import api from "@/lib/api";
import { toast } from "sonner";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    (async () => {
      try {
        const res = await api.register(formData.email, formData.password);
        toast.success('Registered successfully. Please login.');
        navigate('/login');
      } catch (err: any) {
        const msg = err?.message || 'Registration failed';
        toast.error(msg.includes('already') ? 'Email already registered' : msg);
      }
    })();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background */}
      <section className="min-h-[80vh] relative flex items-center border-b border-border">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${terraLogo})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>        {/* Content */}
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                TERRA-CIVITAS
              </h1>
            </div>

            {/* Registration Form */}
            <Card className="w-full max-w-md p-6 space-y-6 bg-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-center text-white">Create an Account</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-white/20 text-white placeholder:text-white/70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-white/20 text-white placeholder:text-white/70"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full text-lg px-8 bg-white text-black hover:bg-white/90"
                >
                  Register Now
                  <ArrowRight className="ml-2" />
                </Button>
              </form>

              <div className="text-center text-white">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="pl-1 h-auto p-0 text-white hover:text-white/90"
                  onClick={() => navigate("/login")}
                >
                  Login here
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;