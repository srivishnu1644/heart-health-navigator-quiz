
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="bg-card shadow-2xl border border-border rounded-2xl max-w-lg w-full flex flex-col items-center p-10 gap-6">
        <HeartPulse className="w-16 h-16 text-red-600 mb-1" strokeWidth={2.5}/>
        <h1 className="text-3xl md:text-4xl font-bold text-center">Cardio Health Risk Quiz</h1>
        <p className="max-w-md text-muted-foreground text-center">
          Answer these quick questions to get a sense of your cardiovascular risk factors, symptoms, and lifestyle habits.<br />
          Your responses stay private and no information is stored.
        </p>
        <Button
          className="w-full py-6 text-lg font-semibold mt-2"
          size="lg"
          onClick={() => navigate("/cardio-quiz")}
        >
          Start Quiz
        </Button>
      </div>
    </main>
  );
};

export default Index;
