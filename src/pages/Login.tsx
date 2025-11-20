import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail } from "lucide-react";
import terraLogo from "../assets/terra-civitas.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// simplified: single user login form (authority removed)
import { toast } from "sonner";
import api from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    // Call backend login endpoint and validate credentials
    (async () => {
      try {
        const res = await api.login(email, password);
        // expected res: { token, user: { id, email } }
        const user = res.user || { email };
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: (user.email || email).split('@')[0],
          token: res.token,
          role: 'user'
        }));
        toast.success('Logged in successfully');
        navigate('/dashboard/recent');
      } catch (err: any) {
        const msg = err?.message || 'Login failed';
        toast.error(msg.includes('Invalid') ? 'Invalid email or password' : msg);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="min-h-screen relative flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${terraLogo})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                TERRA-CIVITAS
              </h1>
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md p-6 space-y-6 bg-white/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-center text-white">Login to Your Account</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100" size="lg">
                  Sign In
                </Button>
              </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/70">
            Protected by end-to-end encryption
          </p>
        </div>
      </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
