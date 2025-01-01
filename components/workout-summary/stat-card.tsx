import { type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={cn('border-slate-800 bg-slate-900', className)}>
      <CardContent className="space-y-2 p-6 text-center">
        <Icon className="mx-auto size-6 text-slate-400" />
        <div className="text-sm text-slate-400">{label}</div>
        <div className="font-mono text-2xl font-bold">
          {value}
          {trend !== undefined && (
            <span
              className={cn(
                'ml-2 text-sm',
                trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-slate-400',
              )}
            >
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
