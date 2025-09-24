import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, Circle, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Goal {
  id: number;
  title: string;
  description: string;
  status: "pending" | "done";
  deadline: string;
  priority: "low" | "medium" | "high";
  categories: Array<{
    id: number;
    name: string;
  }>;
}

interface GoalCardProps {
  goal: Goal;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

const GoalCard = ({ goal, onToggleStatus, onDelete }: GoalCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status === "pending";
  
  return (
    <Card className={`transition-all hover:shadow-md ${goal.status === "done" ? "opacity-75" : ""} ${isOverdue ? "border-destructive" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(goal.id)}
              className="p-0 h-5 w-5"
            >
              {goal.status === "done" ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <CardTitle className={`text-lg leading-tight ${goal.status === "done" ? "line-through text-muted-foreground" : ""}`}>
              {goal.title}
            </CardTitle>
          </div>
          <Badge variant={getPriorityColor(goal.priority)} className="ml-2">
            {goal.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {goal.categories.map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            {goal.deadline && (
              <div className={`flex items-center space-x-1 ${isOverdue ? "text-destructive" : ""}`}>
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/goals/${goal.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(goal.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;