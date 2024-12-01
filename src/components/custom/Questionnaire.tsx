import { useState } from "react";
import { Button } from "../ui/button";

interface Filters {
  indoor: boolean;
  medication: boolean;
  petTypeId: number | null;
  petSizeId: number | null;
  petBreedId: number | null;
}

interface QuestionnaireProps {
  onClose: () => void;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  applyFilters: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onClose, setFilters, applyFilters }) => {
  const questions: string[] = [
    "Do you have a sibling?",
    "Do you like to exercise?",
    "Do you have a backyard?",
    "Do you have space in your house/flat?",
    "Do you have enough time to focus on your pet?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: "yes" | "no"): void => {
    setAnswers([...answers, answer]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleResult();
    }
  };

  const handleResult = (): void => {
    const yesCount = answers.filter((a) => a === "yes").length;
  
    if (yesCount > questions.length / 2) {
      console.log("Setting petTypeId to 1 (Dog)");
      setFilters((prevFilters: Filters) => ({ ...prevFilters, petTypeId: 1 })); // Kutya
    } else {
      console.log("Setting petTypeId to 2 (Cat)");
      setFilters((prevFilters: Filters) => ({ ...prevFilters, petTypeId: 4 })); // Cica
    }
  
    applyFilters();
    onClose();
  };

  return (
    <div className="p-4 items-center">
      {currentQuestion < questions.length ? (
        <>
          <p className="w-full items-center">{questions[currentQuestion]}</p>
          <div className="mt-4 mx-10 flex gap-2 ">
            <Button
              onClick={() => handleAnswer("yes")}
            >
              Yes
            </Button>
            <Button
              onClick={() => handleAnswer("no")}
              variant="secondary"
            >
              No
            </Button>
          </div>
        </>
      ) : (
        <p>Processing results...</p>
      )}
    </div>
  );
};

export default Questionnaire;
