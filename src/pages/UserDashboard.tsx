import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import NotificationSidebar from "@/components/NotificationSidebar";
import terraLogo from "../assets/terra-civitas.png";

interface UserDashboardProps {
  username: string;
}

const UserDashboard = ({ username }: UserDashboardProps) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [savedAlerts] = useState([
    {
      id: "1",
      type: "critical" as const,
      title: "Suspicious Activity Detected",
      location: "Main Street & 5th Ave",
      time: "2 minutes ago",
      description: "Multiple individuals detected in restricted area after hours.",
      status: "pending" as const,
      confidence: 94,
    },
  ]);

  const stats = [
    {
      title: "Detection Rate",
      value: "98.5%",
      change: "+2.3%",
      icon: Activity,
      color: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logout Button */}
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            {/* Center: Logo and User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Logo Image */}
                <div className="w-12 h-12">
                  <img 
                    src={terraLogo} 
                    alt="TC Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-foreground">Welcome, {username}</h1>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  TERRA-CIVITAS
                </h2>
              </div>
            </div>

            {/* Right: Notification */}
            <NotificationSidebar savedAlerts={savedAlerts} />

            {/* Logout Confirmation Dialog */}
            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to the home page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      // close dialog first, then clear user and navigate home
                      setIsLogoutDialogOpen(false);
                      localStorage.removeItem('user');
                      navigate('/');
                    }}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Video Streaming */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Video Streaming</h2>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Live Video Feed</p>
            </div>
          </div>
        </Card>

        {/* Live Notifications */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Live Notifications</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {savedAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.location}</p>
                      <p className="text-sm text-muted-foreground">{alert.time}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">
                      {alert.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Detection Rate */}
        <div className="grid grid-cols-1 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 border-border">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-success">{stat.change}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;