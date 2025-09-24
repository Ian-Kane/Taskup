import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GoalForm from "@/components/GoalForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - Replace with API calls to your Flask backend
const mockGoals = [
  {
    id: 1,
    title: "Complete React Project",
    description: "Build a full-stack task manager application with React frontend and Flask backend",
    status: "pending" as const,
    deadline: "2024-12-31",
    priority: "high" as const,
    categoryIds: [1, 2]
  },
  {
    id: 2,
    title: "Learn TypeScript",
    description: "Master TypeScript fundamentals and advanced concepts for better code quality",
    status: "done" as const,
    deadline: "2024-10-15",
    priority: "medium" as const,
    categoryIds: [1]
  },
  {
    id: 3,
    title: "Exercise Routine",
    description: "Maintain a consistent 4x week exercise routine for better health",
    status: "pending" as const,
    deadline: "2024-12-01",
    priority: "low" as const,
    categoryIds: [3]
  }
];

const mockCategories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Health" },
  { id: 4, name: "Work" }
];

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch goal details
    const fetchGoal = () => {
      const foundGoal = mockGoals.find(g => g.id === parseInt(id || "0"));
      setGoal(foundGoal);
      setLoading(false);
    };

    fetchGoal();
  }, [id]);

  const handleSubmit = (updatedGoal: any) => {
    // In a real app, make API call to update goal
    console.log("Updating goal:", updatedGoal);
    
    toast({
      title: "Goal Updated",
      description: "Your goal has been successfully updated.",
    });
    
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Goal Not Found</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
          goal={goal}
          categories={mockCategories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default GoalDetail;