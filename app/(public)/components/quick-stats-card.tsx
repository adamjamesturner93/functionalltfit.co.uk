import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  iconColor?: "primary" | "blue" | "green";
}

export function QuickStatsCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  iconColor = "primary",
}: QuickStatsCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
  };

  return (
    <Card className="bg-card transition-all hover:bg-accent/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className={`rounded-full ${colorClasses[iconColor]} p-3 w-fit`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
                {unit && (
                  <span className="text-xl font-medium text-muted-foreground">
                    {unit}
                  </span>
                )}
              </div>
              {trend && (
                <p
                  className={`text-sm ${
                    trend.value >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend.value > 0 && "+"}
                  {trend.value}% {trend.label}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
