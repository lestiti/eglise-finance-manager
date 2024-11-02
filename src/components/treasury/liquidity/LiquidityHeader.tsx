import { Card } from "@/components/ui/card";

interface LiquidityHeaderProps {
  title: string;
  description?: string;
}

export const LiquidityHeader = ({ title, description }: LiquidityHeaderProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};