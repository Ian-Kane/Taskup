import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GoalForm from "@/components/GoalForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock categories - Replace with API call to your Flask backend
const mockCategories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Health" },
  { id: 4, name: "Work" }
];

const NewGoal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (goalData: any) => {
    // In a real app, make API call to create goal
    console.log("Creating goal:", goalData);
    
    toast({
      title: "Goal Created",
      description: "Your new goal has been successfully created!",
    });
    
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => navigate("/")} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <GoalForm
          categories={mockCategories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default NewGoal;