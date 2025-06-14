
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CardioQuizAnswer = "yes" | "no" | "unsure";

interface CardioQuestionProps {
  question: string;
  answer?: CardioQuizAnswer;
  onAnswer: (a: CardioQuizAnswer) => void;
}

const options = [
  { label: "Yes", value: "yes" as CardioQuizAnswer },
  { label: "No", value: "no" as CardioQuizAnswer },
  { label: "Unsure", value: "unsure" as CardioQuizAnswer },
];

export default function CardioQuestion({
  question,
  answer,
  onAnswer,
}: CardioQuestionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-lg font-medium">{question}</div>
      <div className="flex gap-4">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={answer === opt.value ? "default" : "outline"}
            className={cn(
              "flex-1 py-6 text-lg font-semibold transition",
              answer === opt.value
                ? "ring-2 ring-primary"
                : "hover:bg-muted"
            )}
            onClick={() => onAnswer(opt.value)}
            type="button"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
