import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecentAlertCard from "@/components/RecentAlertCard";
import api from "@/lib/api";

const Dashboard = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user and navigate to home
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    let mounted = true;

    async function fetchAlerts() {
      try {
        
        setLoading(true);
        setError(null);
        const data = await api.getAlerts();
        if (!mounted) return;
        
        console.log("Fetched alerts:", data);
        
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          console.error("Invalid data format:", data);
          setAlerts([]);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error("Error fetching alerts:", err);
        setError(err?.message ?? "Failed to load alerts");
        setAlerts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2c3e50] to-[#1a252f] flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crime Detection System</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Real-time monitoring dashboard</p>
              </div>
            </div>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        {/* Alerts Section */}
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Alerts</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-14">Real-time threat detection and monitoring</p>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Loading alerts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error: {error}</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => {
                try {
                  return <RecentAlertCard key={alert.id || Math.random()} {...alert} />;
                } catch (err) {
                  console.error("Error rendering alert:", alert, err);
                  return null;
                }
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
