
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardioQuestion, { CardioQuizAnswer } from "@/components/CardioQuestion";
import CardioProgressBar from "@/components/CardioProgressBar";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  // SYMPTOM-BASED
  "Do you experience chest pain or discomfort? (Especially during physical activity or emotional stress)",
  "Do you feel shortness of breath during exercise or while lying down?",
  "Have you experienced heart palpitations (rapid, fluttering, or pounding heartbeat)?",
  "Do you feel fatigue or weakness more than usual, especially with activity?",
  "Have you noticed swelling in your ankles, feet, or legs (edema)?",
  "Do you ever feel lightheaded, dizzy, or have fainted?",
  "Do you have pain in your arms, neck, jaw, or back?",
  // MEDICAL HISTORY
  "Have you ever been diagnosed with high blood pressure (hypertension)?",
  "Do you have diabetes or high blood sugar levels?",
  "Do you have high cholesterol or triglycerides?",
  "Have you ever had a heart attack, stroke, or mini-stroke (TIA)?",
  "Are you currently taking any medications for heart, blood pressure, or cholesterol?",
  // FAMILY HISTORY
  "Does anyone in your family have a history of heart disease or stroke?",
  "Did any of your close relatives die from a heart condition before age 55 (men) or 65 (women)?",
  // LIFESTYLE
  "Do you smoke or use tobacco products?",
  "Do you drink alcohol frequently or in large amounts?",
  "Do you exercise regularly (at least 150 minutes/week)?",
  "Do you follow a heart-healthy diet low in saturated fats, salt, and sugar?",
  "Are you overweight or obese (BMI > 25)?",
  "Do you experience a lot of stress, anxiety, or sleep disturbances?"
];

export default function CardioQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(CardioQuizAnswer | undefined)[]>(Array(QUESTIONS.length).fill(undefined));
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  function handleAnswer(answer: CardioQuizAnswer) {
    const updated = [...answers];
    updated[step] = answer;
    setAnswers(updated);
  }

  function handleNext() {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setFinished(true);
    }
  }

  function handlePrev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function resetQuiz() {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(undefined));
    setFinished(false);
  }

  // Simple scoring ("yes"/"unsure" to risk factors, "no" to healthy habits)
  const riskScore = QUESTIONS.reduce((acc, txt, idx) => {
    // positive = "yes/unsure" for symptoms/history; negative for good lifestyle habits
    if (
      idx < 16 // Q0-Q15: "yes/unsure" is a risk
    ) {
      if (answers[idx] === "yes" || answers[idx] === "unsure") return acc + 1;
    } else if (
      idx === 16 || idx === 17 // Q16: exercise? Q17: healthy diet?
    ) {
      if (answers[idx] === "no" || answers[idx] === "unsure") return acc + 1;
    } else if (
      idx === 19 // Q19: stress/sleep
    ) {
      if (answers[idx] === "yes" || answers[idx] === "unsure") return acc + 1;
    } else if (
      idx === 18 // overweight
    ) {
      if (answers[idx] === "yes" || answers[idx] === "unsure") return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card shadow-2xl border border-border rounded-2xl p-8 max-w-xl w-full flex flex-col">
        {finished ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="w-14 h-14 text-green-600 mb-3" />
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="mb-4 text-muted-foreground">Here’s a summary of your responses:</p>
            <div className="w-full text-left mb-6">
              <ol className="space-y-2">
                {QUESTIONS.map((q, i) => (
                  <li key={i}>
                    <strong>{q}</strong>
                    <br />
                    <span className="inline-block font-mono text-primary">{answers[i] ? answers[i][0].toUpperCase() + answers[i]?.slice(1) : "No answer"}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mb-4">
              {riskScore <= 3 ? (
                <span className="text-green-700 font-semibold">Low number of risk factors.</span>
              ) : riskScore <= 8 ? (
                <span className="text-yellow-600 font-semibold">Some risk factors present. Consider consulting a healthcare provider if concerned.</span>
              ) : (
                <span className="text-red-700 font-semibold">Multiple possible risk factors identified. Please consider discussing your cardiovascular health with your healthcare provider.</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-8">
              This quiz is for educational purposes only and does not provide medical advice, diagnosis, or treatment.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button onClick={resetQuiz}>
                Retake Quiz
              </Button>
            </div>
          </div>
        ) : (
          <>
            <CardioProgressBar current={step} total={QUESTIONS.length} />
            <CardioQuestion
              question={QUESTIONS[step]}
              answer={answers[step]}
              onAnswer={handleAnswer}
            />
            <div className="flex justify-between gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[step]}
              >
                {step === QUESTIONS.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
