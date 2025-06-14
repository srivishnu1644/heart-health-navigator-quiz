
import React from "react";

interface MealPlanCardProps {
  mealPlan: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
}

const MealPlanCard = ({ mealPlan }: MealPlanCardProps) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 shadow-sm w-full animate-fade-in">
    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Sample Day Meal Plan</h3>
    <ul className="text-sm text-yellow-800 space-y-2">
      <li><span className="font-medium">Breakfast:</span> {mealPlan.breakfast}</li>
      <li><span className="font-medium">Lunch:</span> {mealPlan.lunch}</li>
      <li><span className="font-medium">Snack:</span> {mealPlan.snack}</li>
      <li><span className="font-medium">Dinner:</span> {mealPlan.dinner}</li>
    </ul>
  </div>
);

export default MealPlanCard;
