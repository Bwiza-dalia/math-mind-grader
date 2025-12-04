import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockCourses } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionForm {
  id: string;
  text: string;
  points: number;
  goldSolutionSteps: { description: string; expression: string; points: number }[];
  finalAnswer: string;
}

export default function CreateExam() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { id: '1', text: '', points: 10, goldSolutionSteps: [{ description: '', expression: '', points: 5 }], finalAnswer: '' }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: String(questions.length + 1),
        text: '',
        points: 10,
        goldSolutionSteps: [{ description: '', expression: '', points: 5 }],
        finalAnswer: '',
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addStep = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].goldSolutionSteps.push({ description: '', expression: '', points: 5 });
    setQuestions(updated);
  };

  const removeStep = (questionIndex: number, stepIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].goldSolutionSteps = updated[questionIndex].goldSolutionSteps.filter((_, i) => i !== stepIndex);
    setQuestions(updated);
  };

  const updateStep = (questionIndex: number, stepIndex: number, field: string, value: any) => {
    const updated = [...questions];
    updated[questionIndex].goldSolutionSteps[stepIndex] = {
      ...updated[questionIndex].goldSolutionSteps[stepIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Exam created!',
      description: 'Your exam has been saved successfully.',
    });
    navigate('/exams');
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Exam</h1>
            <p className="text-muted-foreground mt-1">Define questions and gold solutions for automatic grading</p>
          </div>
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Exam
          </Button>
        </div>

        {/* Basic Info */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg">Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Midterm Exam"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={courseId} onValueChange={setCourseId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of exam content..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <span className="text-sm text-muted-foreground font-mono">
              Total: {totalPoints} points
            </span>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="animate-fade-up" style={{ animationDelay: `${qIndex * 50}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 0)}
                      className="w-20 h-8 text-center"
                      min={1}
                    />
                    <span className="text-sm text-muted-foreground">pts</span>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    placeholder="Enter the question..."
                    rows={2}
                    required
                  />
                </div>

                {/* Gold Solution Steps */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Gold Solution Steps</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStep(qIndex)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {question.goldSolutionSteps.map((step, sIndex) => (
                      <div key={sIndex} className="flex gap-2 items-start p-3 rounded-lg bg-muted/50">
                        <span className="text-xs font-medium text-muted-foreground mt-2 w-6">
                          {sIndex + 1}.
                        </span>
                        <div className="flex-1 grid gap-2 sm:grid-cols-3">
                          <Input
                            value={step.description}
                            onChange={(e) => updateStep(qIndex, sIndex, 'description', e.target.value)}
                            placeholder="Step description"
                            className="h-9"
                          />
                          <Input
                            value={step.expression}
                            onChange={(e) => updateStep(qIndex, sIndex, 'expression', e.target.value)}
                            placeholder="Expression (e.g., 3x² + 2x)"
                            className="h-9 font-mono"
                          />
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={step.points}
                              onChange={(e) => updateStep(qIndex, sIndex, 'points', parseInt(e.target.value) || 0)}
                              className="h-9 w-20"
                              min={0}
                            />
                            {question.goldSolutionSteps.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-destructive"
                                onClick={() => removeStep(qIndex, sIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Answer */}
                <div className="space-y-2">
                  <Label>Final Answer</Label>
                  <Input
                    value={question.finalAnswer}
                    onChange={(e) => updateQuestion(qIndex, 'finalAnswer', e.target.value)}
                    placeholder="Expected final answer (e.g., x = 5)"
                    className="font-mono"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
}