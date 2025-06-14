import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardioQuestion, { CardioQuizAnswer } from "@/components/CardioQuestion";
import CardioProgressBar from "@/components/CardioProgressBar";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Cardio questions (existing)
const CARDIO_QUESTIONS = [
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

// Digestion & Metabolism questions (new!)
const DIGESTION_METAB_QUESTIONS = [
  "Do you experience frequent heartburn or acid reflux?",
  "Do you have bloating, gas, or discomfort after eating?",
  "Do you have difficulty digesting certain foods (e.g. dairy, gluten)?",
  "Have you noticed unexplained weight loss or gain lately?",
  "Do you have frequent constipation or diarrhea?",
  "Do you feel tired or sluggish after meals?",
  "Do you often have cravings for sweets or carbohydrates?",
  "Do you experience frequent nausea or indigestion?",
  "Do you have a diagnosed metabolic condition (e.g. thyroid disorder, PCOS)?"
];

// Combine both into sections
const SECTIONS = [
  {
    label: "Cardiovascular Health",
    questions: CARDIO_QUESTIONS,
    key: "cardio"
  },
  {
    label: "Digestion & Metabolism",
    questions: DIGESTION_METAB_QUESTIONS,
    key: "digest"
  }
];

// Helper for indices within all questions
const TOTAL_QUESTIONS = SECTIONS.reduce((acc, sec) => acc + sec.questions.length, 0);

export default function CardioQuiz() {
  // Track flat step (which question out of all questions)
  const [step, setStep] = useState(0);
  // Store answers for all questions in all sections
  const [answers, setAnswers] = useState<(CardioQuizAnswer | undefined)[]>(Array(TOTAL_QUESTIONS).fill(undefined));
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  // Map flat step/index to section and question number in section
  function getSectionInfo(idx: number) {
    let running = 0;
    for (let i = 0; i < SECTIONS.length; i++) {
      const section = SECTIONS[i];
      if (idx < running + section.questions.length) {
        return { sectionIndex: i, questionIndex: idx - running, section };
      }
      running += section.questions.length;
    }
    // fallback to last
    return { sectionIndex: SECTIONS.length - 1, questionIndex: SECTIONS[SECTIONS.length - 1].questions.length - 1, section: SECTIONS[SECTIONS.length - 1] };
  }

  function handleAnswer(answer: CardioQuizAnswer) {
    const updated = [...answers];
    updated[step] = answer;
    setAnswers(updated);
  }

  function handleNext() {
    if (step < TOTAL_QUESTIONS - 1) {
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
    setAnswers(Array(TOTAL_QUESTIONS).fill(undefined));
    setFinished(false);
  }

  // --- Cardio risk scoring, unchanged ---
  const cardioRiskScore = CARDIO_QUESTIONS.reduce((acc, txt, idx) => {
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

  // --- Digestion & Metabolism scoring and recommendations ---
  const digestionStart = CARDIO_QUESTIONS.length;
  const digestionEnd = digestionStart + DIGESTION_METAB_QUESTIONS.length;

  const digestionRiskScore = DIGESTION_METAB_QUESTIONS.reduce((acc, txt, idx) => {
    const answerIdx = idx + digestionStart;
    // Most are symptom: "yes/unsure" = higher risk
    if (
      idx === 3 // Q3: unexplained weight change
      || idx === 8 // Q8: diagnosed condition
    ) {
      if (answers[answerIdx] === "yes" || answers[answerIdx] === "unsure") return acc + 2; // Weight & diagnosis = higher weight
    } else {
      if (answers[answerIdx] === "yes" || answers[answerIdx] === "unsure") return acc + 1;
    }
    return acc;
  }, 0);

  // --- Cardio Recommendations: unchanged ---
  function getCardioRecommendations(risk: number) {
    if (risk <= 3) {
      return {
        level: "Low number of risk factors.",
        color: "text-green-700",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Lifestyle Guidance</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Continue with regular moderate exercise like brisk walking, jogging, cycling, or swimming (150+ minutes/week).</li>
              <li>Eat a heart-healthy diet: lots of vegetables, fruits, whole grains, lean protein, healthy fats (olive oil, avocado, nuts).</li>
              <li>Limit salt, processed foods, and sugary snacks. Avoid trans and saturated fats.</li>
              <li>Stay hydrated. Limit alcohol; avoid tobacco.</li>
              <li>Manage stress and aim for 7–9 hours of sleep nightly.</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Oatmeal with berries & nuts<br/>
              <b>Lunch:</b> Grilled chicken salad with olive oil vinaigrette<br/>
              <b>Snack:</b> Greek yogurt & sliced fruit<br/>
              <b>Dinner:</b> Baked salmon, quinoa, & steamed broccoli<br/>
            </div>
          </>
        ),
        workouts: [
          "Brisk walking, jogging, swimming, or cycling (moderate cardio)",
          "Yoga or pilates for flexibility and core strength",
          "Bodyweight strength training (2x/week)"
        ],
        diet: [
          "Focus on vegetables, fruits, whole grains, lean protein, healthy fats",
          "Avoid excess salt, sugar, processed and fried foods"
        ]
      };
    } else if (risk <= 8) {
      return {
        level: "Some risk factors present. Consider consulting a healthcare provider if concerned.",
        color: "text-yellow-600",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Lifestyle Improvements</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Aim for at least 150 minutes of moderate aerobic exercise each week. Good options: walking, light jogging, cycling, water aerobics, or low-impact group fitness.</li>
              <li>Incorporate 2 sessions/week of strength training with bands or bodyweight.</li>
              <li>Gradually reduce sodium, saturated fats, and sugar intake. Eat more veggies, fruits, legumes, and whole grains.</li>
              <li>Prioritize lean proteins (chicken, fish, tofu), and use olive/canola oil in place of butter or margarine.</li>
              <li>If overweight, focus on portion control and increase activity. Avoid crash diets.</li>
              <li>Limit alcohol; quit smoking/tobacco. Seek help for stress or sleep issues if needed.</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Whole-grain toast, avocado, and boiled egg<br/>
              <b>Lunch:</b> Lentil & vegetable soup, side salad<br/>
              <b>Snack:</b> Raw veggie sticks with hummus<br/>
              <b>Dinner:</b> Grilled fish, roasted sweet potato, & steamed greens<br/>
            </div>
          </>
        ),
        workouts: [
          "Walking, cycling, water aerobics (moderate intensity, avoid high impact if unsure)",
          "Beginner strength or resistance bands (2x/week)",
          "Chair yoga or stretching"
        ],
        diet: [
          "Gradually reduce salt, sugar, and saturated fats",
          "Choose whole grains, legumes, lean proteins"
        ]
      };
    } else {
      return {
        level: "Multiple possible risk factors identified. Please consider discussing your cardiovascular health with your healthcare provider.",
        color: "text-red-700",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Immediate Steps to Improve Heart Health</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Consult a healthcare professional for a personalized plan and medical checkup.</li>
              <li>If new to exercise, start with low-impact activities like short walks, gentle cycling, or chair exercises, gradually increasing duration as tolerated.</li>
              <li>Avoid strenuous activity until medically cleared if having symptoms.</li>
              <li>Stop tobacco use; seek support to quit if necessary.</li>
              <li>Adopt a DASH or Mediterranean-style diet:</li>
              <ul className="ml-6 list-circle">
                <li>Plenty of veggies, fruits, beans, nuts, and seeds</li>
                <li>Minimize red/processed meats, sugary drinks, & fried foods</li>
                <li>Use herbs & spices instead of excess salt</li>
              </ul>
              <li>Manage stress healthfully: gentle yoga, breathing exercises, social connection</li>
              <li>Monitor blood pressure/sugars if advised</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Unsweetened oatmeal, sliced banana, walnuts<br/>
              <b>Lunch:</b> Quinoa bowl with mixed greens, chickpeas, roasted veggies<br/>
              <b>Snack:</b> Apple slices & a handful of almonds<br/>
              <b>Dinner:</b> Baked chicken or tofu, brown rice, steamed spinach<br/>
            </div>
          </>
        ),
        workouts: [
          "Start with short, gentle walks or seated exercises",
          "Avoid vigorous activity until cleared by a doctor",
          "Gentle stretching, deep breathing, relaxation"
        ],
        diet: [
          "Plant-based diet: veggies, fruits, legumes, nuts, seeds",
          "Avoid added sugars, fried foods, limit sodium"
        ]
      };
    }
  }

  // Digestion/Metabolism personalized recommendations by risk score
  function getDigestionRecommendations(risk: number) {
    if (risk <= 2) {
      return {
        level: "No significant digestive/metabolic concerns.",
        color: "text-green-700",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Keep Up the Good Work</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Continue eating a balanced diet high in fiber (fruits, vegetables, whole grains).</li>
              <li>Stay hydrated. Limit processed foods and added sugars.</li>
              <li>Regular meals help maintain energy and promote a healthy metabolism.</li>
              <li>Exercise: moderate cardio (brisk walking, cycling), plus some strength training.</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Whole grain cereal with oat milk and berries<br/>
              <b>Lunch:</b> Quinoa salad with chickpeas and mixed veggies<br/>
              <b>Snack:</b> Sliced bell pepper & hummus<br/>
              <b>Dinner:</b> Stir-fried tofu with brown rice & broccoli<br/>
            </div>
          </>
        ),
        workouts: [
          "Brisk walking, cycling, or swimming (3–5x/week)",
          "Strength training (2x/week)",
        ],
        diet: [
          "Continue eating a variety of plant-based, high-fiber foods",
          "Stay hydrated; eat regularly"
        ]
      };
    } else if (risk <= 5) {
      return {
        level: "Some potential digestive/metabolic issues detected.",
        color: "text-yellow-600",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Digestive & Metabolic Support</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Focus on regular meals, avoid skipping meals to prevent sluggishness.</li>
              <li>Increase dietary fiber: whole grains, fruits, vegetables, legumes. Try a non-dairy probiotic yogurt if sensitive to lactose.</li>
              <li>For bloating/reflux, avoid fried/spicy foods and limit portion sizes.</li>
              <li>Support metabolism by being physically active most days: brisk walk, cycling, yoga, and strength training as tolerated.</li>
              <li>Monitor weight trends and consult a physician about unexplained changes or persistent symptoms.</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Oatmeal with chia seeds & apple<br/>
              <b>Lunch:</b> Chicken or lentil soup with leafy greens<br/>
              <b>Snack:</b> Banana & a handful of nuts<br/>
              <b>Dinner:</b> Baked fish or beans, sweet potato, sautéed spinach<br/>
            </div>
          </>
        ),
        workouts: [
          "Walking, gentle cycling, low-impact aerobic classes",
          "Yoga or stretching daily",
        ],
        diet: [
          "Focus on fiber, moderate protein, easily-digested foods",
          "Limit fried/greasy foods, spices if symptomatic"
        ]
      };
    } else {
      return {
        level: "Significant digestive/metabolic issues detected—consider medical evaluation.",
        color: "text-red-700",
        advice: (
          <>
            <h3 className="font-semibold text-lg mt-4 mb-2">Important Steps</h3>
            <ul className="list-disc list-inside space-y-1 text-left mb-3">
              <li>Consult your healthcare provider for investigation of symptoms and a personalized plan.</li>
              <li>Try a simple, easily-digested diet: bland foods, clear fluids, and avoid anything that triggers symptoms.</li>
              <li>Eat small meals more frequently if regular meals worsen symptoms.</li>
              <li>Physical activity: start with gentle movement (short walks, chair exercises); avoid strenuous activity until cleared.</li>
              <li>Keep a symptom and food diary to help identify triggers.</li>
            </ul>
            <h4 className="font-semibold mb-1">Sample Day Meal Plan</h4>
            <div className="text-sm leading-relaxed">
              <b>Breakfast:</b> Plain toast with banana<br/>
              <b>Lunch:</b> Rice porridge or chicken broth with soft veggies<br/>
              <b>Snack:</b> Applesauce or plain crackers<br/>
              <b>Dinner:</b> Steamed fish or lentils with peeled zucchini<br/>
            </div>
          </>
        ),
        workouts: [
          "Short walks, chair-based activities",
          "Gentle stretching or deep breathing",
        ],
        diet: [
          "Bland, easily-digested foods",
          "Keep hydration up, avoid trigger foods"
        ]
      };
    }
  }

  // --------- UI ---------
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card shadow-2xl border border-border rounded-2xl p-8 max-w-xl w-full flex flex-col">
        {finished ? (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="w-14 h-14 text-green-600 mb-3" />
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="mb-4 text-muted-foreground">Here’s a summary of your responses:</p>
            {/* Summary for both sections */}
            <div className="w-full text-left mb-6">
              {SECTIONS.map((section, sIdx) => (
                <div className="mb-4" key={section.key}>
                  <h3 className="font-semibold text-lg mb-2">{section.label}</h3>
                  <ol className="space-y-2">
                    {section.questions.map((q, qIdx) => {
                      const globalIdx = SECTIONS.slice(0, sIdx).reduce((acc, sec) => acc + sec.questions.length, 0) + qIdx;
                      return (
                        <li key={qIdx}>
                          <strong>{q}</strong><br />
                          <span className="inline-block font-mono text-primary">{answers[globalIdx] ? answers[globalIdx]?.toString().charAt(0).toUpperCase() + answers[globalIdx]?.toString().slice(1) : "No answer"}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
            {/* Cardio recommendations */}
            <div className={`mb-2 font-semibold ${getCardioRecommendations(cardioRiskScore).color}`}>
              Cardiovascular: {getCardioRecommendations(cardioRiskScore).level}
            </div>
            <div className="pt-2 w-full text-base text-left mb-5">
              {getCardioRecommendations(cardioRiskScore).advice}
              <div className="mt-2">
                <h4 className="font-semibold">Recommended Workouts:</h4>
                <ul className="list-disc list-inside text-sm">
                  {getCardioRecommendations(cardioRiskScore).workouts.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-2">Diet Focus:</h4>
                <ul className="list-disc list-inside text-sm">
                  {getCardioRecommendations(cardioRiskScore).diet.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Digestion/Metabolism recommendations */}
            <div className={`mb-2 font-semibold ${getDigestionRecommendations(digestionRiskScore).color}`}>
              Digestion &amp; Metabolism: {getDigestionRecommendations(digestionRiskScore).level}
            </div>
            <div className="pt-2 w-full text-base text-left">
              {getDigestionRecommendations(digestionRiskScore).advice}
              <div className="mt-2">
                <h4 className="font-semibold">Recommended Workouts:</h4>
                <ul className="list-disc list-inside text-sm">
                  {getDigestionRecommendations(digestionRiskScore).workouts.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mt-2">Diet Focus:</h4>
                <ul className="list-disc list-inside text-sm">
                  {getDigestionRecommendations(digestionRiskScore).diet.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-8 mt-4">
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
            <CardioProgressBar current={step} total={TOTAL_QUESTIONS} />
            <div className="text-muted-foreground text-sm mb-2 text-center">
              {getSectionInfo(step).section.label}
            </div>
            <CardioQuestion
              question={getSectionInfo(step).section.questions[getSectionInfo(step).questionIndex]}
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
                {step === TOTAL_QUESTIONS - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
