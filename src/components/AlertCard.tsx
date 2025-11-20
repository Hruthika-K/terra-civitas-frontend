import { AlertTriangle, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlertCardProps {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  location: string;
  time: string;
  description: string;
  status: "pending" | "resolved" | "investigating";
  confidence: number;
}

const AlertCard = ({ type, title, location, time, description, status, confidence }: AlertCardProps) => {
  const getSeverityColor = () => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "investigating":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${type === "critical" ? "bg-destructive/20" : type === "warning" ? "bg-warning/20" : "bg-secondary"}`}>
            <AlertTriangle className={`w-5 h-5 ${type === "critical" ? "text-destructive" : type === "warning" ? "text-warning" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {time}
              </span>
            </div>
          </div>
        </div>
        <Badge variant={getSeverityColor() as any} className="flex items-center gap-1">
          {getStatusIcon()}
          {status}
        </Badge>
      </div>

      <p className="text-muted-foreground mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">AI Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">{confidence}%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {status === "pending" && (
            <>
              <Button variant="outline" size="sm">
                <XCircle className="w-4 h-4 mr-1" />
                Dismiss
              </Button>
              <Button size="sm">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Investigate
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AlertCard;
