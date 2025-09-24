import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoalCard from "@/components/GoalCard";
import Navigation from "@/components/Navigation";
import { Search, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

// Mock data - Replace with API calls to your Flask backend
const mockGoals: Goal[] = [
  {
    id: 1,
    title: "Complete React Project",
    description: "Build a full-stack task manager application with React frontend and Flask backend",
    status: "pending",
    deadline: "2024-12-31",
    priority: "high",
    categories: [{ id: 1, name: "Development" }, { id: 2, name: "Personal" }]
  },
  {
    id: 2,
    title: "Learn TypeScript",
    description: "Master TypeScript fundamentals and advanced concepts for better code quality",
    status: "done",
    deadline: "2024-10-15",
    priority: "medium",
    categories: [{ id: 1, name: "Development" }]
  },
  {
    id: 3,
    title: "Exercise Routine",
    description: "Maintain a consistent 4x week exercise routine for better health",
    status: "pending",
    deadline: "2024-12-01",
    priority: "low",
    categories: [{ id: 3, name: "Health" }]
  }
];

const mockCategories = [
  { id: 1, name: "Development" },
  { id: 2, name: "Personal" },
  { id: 3, name: "Health" },
  { id: 4, name: "Work" }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState(mockGoals);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || goal.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || goal.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || 
                           goal.categories.some(cat => cat.id.toString() === categoryFilter);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleToggleStatus = (id: number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id 
          ? { ...goal, status: goal.status === "done" ? "pending" : "done" }
          : goal
      )
    );
    
    toast({
      title: "Goal Updated",
      description: "Goal status has been changed successfully.",
    });
  };

  const handleDelete = (id: number) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal Deleted", 
      description: "Goal has been deleted successfully.",
      variant: "destructive",
    });
  };

  const getStatusStats = () => {
    const pending = goals.filter(g => g.status === "pending").length;
    const done = goals.filter(g => g.status === "done").length;
    return { pending, done, total: goals.length };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your goals and track progress</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-accent">
            <Link to="/goals/new">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.done}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        {filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No goals found</h3>
                <p className="mb-4">
                  {goals.length === 0 
                    ? "Get started by creating your first goal!" 
                    : "Try adjusting your filters or search term."
                  }
                </p>
                {goals.length === 0 && (
                  <Button asChild>
                    <Link to="/goals/new">Create Your First Goal</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;