
interface CardioProgressBarProps {
  current: number;
  total: number;
}

export default function CardioProgressBar({ current, total }: CardioProgressBarProps) {
  const percentage = Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs mb-1">
        <span>Question {current + 1} of {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-muted h-2 rounded">
        <div
          className="h-2 rounded bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
