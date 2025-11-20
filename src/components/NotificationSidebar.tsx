import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertCard from "./AlertCard";

interface SavedAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  location: string;
  time: string;
  description: string;
  status: "pending" | "investigating" | "resolved";
  confidence: number;
}

interface NotificationSidebarProps {
  savedAlerts: SavedAlert[];
}

const NotificationSidebar = ({ savedAlerts }: NotificationSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Bell className="w-4 h-4" />
          {savedAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {savedAlerts.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Saved Alerts</h2>
        <div className="space-y-4">
          {savedAlerts.map((alert) => (
            <AlertCard key={alert.id} {...alert} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSidebar;