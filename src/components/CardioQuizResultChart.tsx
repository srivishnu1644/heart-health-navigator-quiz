
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

interface CardioQuizResultChartProps {
  total: number;
  riskCount: number;
}

const COLORS = ["#22c55e", "#ef4444", "#fbbf24"]; // Green (no risk), Red (risk), Amber (unsure)

export default function CardioQuizResultChart({
  total,
  riskCount,
}: CardioQuizResultChartProps) {
  const data = [
    { name: "Risk Factors", value: riskCount },
    { name: "No Risk", value: total - riskCount },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-xs text-muted-foreground">Risk factor breakdown</div>
    </div>
  );
}
