import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Save, ArrowLeft, BookOpen, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface Subtopic {
  id: string;
  name: string;
  description: string;
  order: number;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  order: number;
  subtopics: Subtopic[];
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<string>('all_levels');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addTopic = () => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: topics.length,
      subtopics: [],
    };
    setTopics([...topics, newTopic]);
  };

  const removeTopic = (topicId: string) => {
    setTopics(topics.filter((t) => t.id !== topicId));
  };

  const updateTopic = (topicId: string, field: keyof Topic, value: any) => {
    setTopics(topics.map((t) => (t.id === topicId ? { ...t, [field]: value } : t)));
  };

  const addSubtopic = (topicId: string) => {
    setTopics(
      topics.map((t) => {
        if (t.id === topicId) {
          const newSubtopic: Subtopic = {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            order: t.subtopics.length,
          };
          return { ...t, subtopics: [...t.subtopics, newSubtopic] };
        }
        return t;
      })
    );
  };

  const removeSubtopic = (topicId: string, subtopicId: string) => {
    setTopics(
      topics.map((t) =>
        t.id === topicId
          ? { ...t, subtopics: t.subtopics.filter((s) => s.id !== subtopicId) }
          : t
      )
    );
  };

  const updateSubtopic = (
    topicId: string,
    subtopicId: string,
    field: keyof Subtopic,
    value: any
  ) => {
    setTopics(
      topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subtopics: t.subtopics.map((s) =>
                s.id === subtopicId ? { ...s, [field]: value } : s
              ),
            }
          : t
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !code) {
      toast.error('Please fill in course name and code');
      return;
    }

    setIsSaving(true);
    try {
      const courseData = {
        name,
        code,
        description,
        level,
        topics: topics.map((t) => ({
          name: t.name,
          description: t.description,
          order: t.order,
          subtopics: t.subtopics.map((s) => ({
            name: s.name,
            description: s.description,
            order: s.order,
          })),
        })),
      };

      await api.courses.create(courseData);
      toast.success('Course created successfully!');
      navigate('/courses');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/courses')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
              <p className="text-muted-foreground mt-1">
                Set up a new course with topics and structure
              </p>
            </div>
          </div>
          <Button onClick={handleSubmit} size="lg" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Course'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Information
              </CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Introduction to Physics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code *</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g., PHY101"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all_levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the course..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Topics & Subtopics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Topics</CardTitle>
                  <CardDescription>
                    Add topics and subtopics to organize your course content
                  </CardDescription>
                </div>
                <Button type="button" onClick={addTopic} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {topics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No topics added yet</p>
                  <p className="text-sm">Click "Add Topic" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic, tIndex) => (
                    <Card key={topic.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <div className="flex-1 grid gap-3">
                            <div className="flex items-center gap-2">
                              <Input
                                value={topic.name}
                                onChange={(e) => updateTopic(topic.id, 'name', e.target.value)}
                                placeholder={`Topic ${tIndex + 1} name`}
                                className="font-semibold"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addSubtopic(topic.id)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Sub
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTopic(topic.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              value={topic.description}
                              onChange={(e) =>
                                updateTopic(topic.id, 'description', e.target.value)
                              }
                              placeholder="Topic description (optional)"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      {topic.subtopics.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="ml-8 space-y-2 border-l-2 pl-4">
                            {topic.subtopics.map((subtopic, sIndex) => (
                              <div key={subtopic.id} className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-6">
                                  {tIndex + 1}.{sIndex + 1}
                                </span>
                                <Input
                                  value={subtopic.name}
                                  onChange={(e) =>
                                    updateSubtopic(
                                      topic.id,
                                      subtopic.id,
                                      'name',
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Subtopic name`}
                                  className="h-9 text-sm"
                                />
                                <Input
                                  value={subtopic.description}
                                  onChange={(e) =>
                                    updateSubtopic(
                                      topic.id,
                                      subtopic.id,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Description"
                                  className="h-9 text-sm"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive"
                                  onClick={() => removeSubtopic(topic.id, subtopic.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">What's Next?</p>
                  <p className="text-sm text-muted-foreground">
                    After creating the course, you'll be able to:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                    <li>Approve or reject student enrollment requests</li>
                    <li>Manage enrolled students</li>
                    <li>Create exams for this course</li>
                    <li>View student submissions</li>
                    <li>Edit course details and topics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}

