import { useState } from "react";
import { useAppState, Course } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, ChevronRight, FileText, ClipboardList, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesPage() {
  const { courses, setCourses } = useAppState();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", professor: "", description: "" });

  const colors = ["hsl(217,91%,60%)", "hsl(142,71%,45%)", "hsl(38,92%,55%)", "hsl(0,72%,55%)", "hsl(199,89%,48%)", "hsl(280,65%,60%)"];

  const handleAddCourse = () => {
    if (!newCourse.name) return;
    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      color: colors[courses.length % colors.length],
      semester: "Fall 2025",
      lectures: [],
      assignments: [],
      exams: [],
    };
    setCourses([...courses, course]);
    setNewCourse({ name: "", code: "", professor: "", description: "" });
    setAddOpen(false);
  };

  if (selectedCourse) {
    const course = courses.find((c) => c.id === selectedCourse.id) || selectedCourse;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => setSelectedCourse(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Back to courses
        </button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: course.color + "20" }}>
            <BookOpen className="h-5 w-5" style={{ color: course.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{course.name}</h1>
            <p className="text-sm text-muted-foreground">{course.code} · {course.professor}</p>
          </div>
        </div>

        <Tabs defaultValue="lectures">
          <TabsList className="bg-secondary">
            <TabsTrigger value="lectures" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-3.5 w-3.5 mr-1.5" />Lectures ({course.lectures.length})
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="h-3.5 w-3.5 mr-1.5" />Assignments ({course.assignments.length})
            </TabsTrigger>
            <TabsTrigger value="exams" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" />Exams ({course.exams.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lectures" className="space-y-3 mt-4">
            {course.lectures.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No lectures yet</p>
            ) : (
              course.lectures.map((l) => (
                <Card key={l.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{l.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{l.date}</p>
                      </div>
                    </div>
                    {l.notes && <p className="text-sm text-muted-foreground mt-2 p-2 rounded bg-secondary/50">{l.notes}</p>}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-3 mt-4">
            {course.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No assignments yet</p>
            ) : (
              course.assignments.map((a) => (
                <Card key={a.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Due: {a.dueDate}</p>
                      </div>
                      <Badge variant={a.status === "completed" ? "default" : "outline"} className="text-[10px] capitalize">{a.status}</Badge>
                    </div>
                    <Progress value={a.progress} className="h-1.5 mt-3" />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="exams" className="space-y-3 mt-4">
            {course.exams.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No exams yet</p>
            ) : (
              course.exams.map((e) => (
                <Card key={e.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
                      </div>
                      <Badge variant={e.readiness > 70 ? "default" : "destructive"} className="text-[10px]">{e.readiness}% ready</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your academic courses</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Add New Course</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Course Name</Label><Input value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} placeholder="e.g., Data Structures" className="bg-secondary border-border" /></div>
              <div><Label>Course Code</Label><Input value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} placeholder="e.g., CS201" className="bg-secondary border-border" /></div>
              <div><Label>Professor</Label><Input value={newCourse.professor} onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })} placeholder="e.g., Dr. Ahmad" className="bg-secondary border-border" /></div>
              <div><Label>Description</Label><Textarea value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Brief description..." className="bg-secondary border-border" /></div>
              <Button onClick={handleAddCourse} className="w-full">Add Course</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div key={course.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="glass cursor-pointer hover:border-primary/30 transition-colors group" onClick={() => setSelectedCourse(course)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: course.color + "20" }}>
                      <BookOpen className="h-4 w-4" style={{ color: course.color }} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-sm mt-2">{course.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{course.code} · {course.professor}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px]">{course.lectures.length} lectures</Badge>
                    <Badge variant="outline" className="text-[10px]">{course.assignments.length} assignments</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
