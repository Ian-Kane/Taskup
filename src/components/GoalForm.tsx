import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id?: number;
  title: string;
  description: string;
  status: "pending" | "done";
  deadline: string;
  priority: "low" | "medium" | "high";
  categoryIds: number[];
}

interface Category {
  id: number;
  name: string;
}

interface GoalFormProps {
  goal?: Goal;
  categories: Category[];
  onSubmit: (goal: Omit<Goal, 'id'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const GoalForm = ({ goal, categories, onSubmit, onCancel, isEditing = false }: GoalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Goal, 'id'>>({
    title: goal?.title || "",
    description: goal?.description || "",
    status: goal?.status || "pending",
    deadline: goal?.deadline || "",
    priority: goal?.priority || "medium",
    categoryIds: goal?.categoryIds || [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (formData.deadline && new Date(formData.deadline) < new Date()) {
      newErrors.deadline = "Deadline cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  const addCategory = (categoryId: number) => {
    if (!formData.categoryIds.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId]
      }));
    }
  };

  const removeCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(id => id !== categoryId)
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Goal" : "Create New Goal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter goal title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your goal"
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as "low" | "medium" | "high" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "pending" | "done" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className={errors.deadline ? "border-destructive" : ""}
              />
              {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <Select onValueChange={(value) => addCategory(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Add a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categoryIds.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                    {category.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => removeCategory(categoryId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Goal" : "Create Goal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;