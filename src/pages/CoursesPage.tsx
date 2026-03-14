import { useState } from "react";
import { useAppState, Course, Lecture, Assignment, Exam } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import {
  LuPlus as Plus,
  LuBookOpen as BookOpen,
  LuChevronRight as ChevronRight,
  LuFileText as FileText,
  LuClipboardList as ClipboardList,
  LuGraduationCap as GraduationCap,
  LuTrash2 as Trash2,
} from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export default function CoursesPage() {
  const { courses, setCourses } = useAppState();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    professor: "",
    description: "",
  });

  // Add sub-item dialogs
  const [addLectureOpen, setAddLectureOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [addExamOpen, setAddExamOpen] = useState(false);

  const [newLecture, setNewLecture] = useState({ title: "", date: "", notes: "" });
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending" as Assignment["status"],
  });
  const [newExam, setNewExam] = useState({ title: "", date: "", readiness: 0, studyPlan: "" });

  const colors = [
    "hsl(217,91%,60%)",
    "hsl(142,71%,45%)",
    "hsl(38,92%,55%)",
    "hsl(0,72%,55%)",
    "hsl(199,89%,48%)",
    "hsl(280,65%,60%)",
  ];

  // ─── Helper: update a single course inside the array ───────────────
  const updateCourse = (courseId: string, updater: (c: Course) => Course) => {
    setCourses((prev: Course[]) =>
      prev.map((c) => (c.id === courseId ? updater(c) : c))
    );
  };

  // ─── Add Course ────────────────────────────────────────────────────
  const handleAddCourse = () => {
    if (!newCourse.name) return;
    const course: Course = {
      id: Date.now().toString(),
      ...newCourse,
      color: colors[courses.length % colors.length],
      semester: "2025",
      lectures: [],
      assignments: [],
      exams: [],
    };
    setCourses([...courses, course]);
    setNewCourse({ name: "", code: "", professor: "", description: "" });
    setAddCourseOpen(false);
  };

  // ─── Delete Course ─────────────────────────────────────────────────
  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev: Course[]) => prev.filter((c) => c.id !== courseId));
    if (selectedCourseId === courseId) setSelectedCourseId(null);
  };

  // ─── Add Lecture ───────────────────────────────────────────────────
  const handleAddLecture = () => {
    if (!newLecture.title || !selectedCourseId) return;
    const lecture: Lecture = {
      id: Date.now().toString(),
      ...newLecture,
      courseId: selectedCourseId,
    };
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      lectures: [...c.lectures, lecture],
    }));
    setNewLecture({ title: "", date: "", notes: "" });
    setAddLectureOpen(false);
  };

  // ─── Delete Lecture ────────────────────────────────────────────────
  const handleDeleteLecture = (lectureId: string) => {
    if (!selectedCourseId) return;
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      lectures: c.lectures.filter((l) => l.id !== lectureId),
    }));
  };

  // ─── Add Assignment ────────────────────────────────────────────────
  const handleAddAssignment = () => {
    if (!newAssignment.title || !selectedCourseId) return;
    const assignment: Assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      status: newAssignment.status,
      progress: 0,
      courseId: selectedCourseId,
    };
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      assignments: [...c.assignments, assignment],
    }));
    setNewAssignment({ title: "", description: "", dueDate: "", status: "pending" });
    setAddAssignmentOpen(false);
  };

  // ─── Delete Assignment ─────────────────────────────────────────────
  const handleDeleteAssignment = (assignmentId: string) => {
    if (!selectedCourseId) return;
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      assignments: c.assignments.filter((a) => a.id !== assignmentId),
    }));
  };

  // ─── Add Exam ──────────────────────────────────────────────────────
  const handleAddExam = () => {
    if (!newExam.title || !selectedCourseId) return;
    const exam: Exam = {
      id: Date.now().toString(),
      title: newExam.title,
      date: newExam.date,
      readiness: newExam.readiness,
      courseId: selectedCourseId,
      studyPlan: newExam.studyPlan,
    };
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      exams: [...c.exams, exam],
    }));
    setNewExam({ title: "", date: "", readiness: 0, studyPlan: "" });
    setAddExamOpen(false);
  };

  // ─── Delete Exam ───────────────────────────────────────────────────
  const handleDeleteExam = (examId: string) => {
    if (!selectedCourseId) return;
    updateCourse(selectedCourseId, (c) => ({
      ...c,
      exams: c.exams.filter((e) => e.id !== examId),
    }));
  };

  // ─── Course Detail View ────────────────────────────────────────────
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  if (selectedCourse) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedCourseId(null)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {t("courses.backToCourses")}
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: selectedCourse.color + "20" }}
            >
              <BookOpen className="h-5 w-5" style={{ color: selectedCourse.color }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">{selectedCourse.name}</h1>
              <p className="text-sm text-muted-foreground">
                {selectedCourse.code} · {selectedCourse.professor}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => handleDeleteCourse(selectedCourse.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t("common.delete")}
          </Button>
        </div>

        {selectedCourse.description && (
          <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
            {selectedCourse.description}
          </p>
        )}

        <Tabs defaultValue="lectures">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="lectures"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-3.5 w-3.5 me-1.5" />
              {t("courses.lectures")} ({selectedCourse.lectures.length})
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <ClipboardList className="h-3.5 w-3.5 me-1.5" />
              {t("courses.assignments")} ({selectedCourse.assignments.length})
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <GraduationCap className="h-3.5 w-3.5 me-1.5" />
              {t("courses.exams")} ({selectedCourse.exams.length})
            </TabsTrigger>
          </TabsList>

          {/* ═══ LECTURES TAB ═══ */}
          <TabsContent value="lectures" className="space-y-3 mt-4">
            <div className="flex justify-end">
              <Dialog open={addLectureOpen} onOpenChange={setAddLectureOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إضافة محاضرة" : "Add Lecture"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "محاضرة جديدة" : "New Lecture"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>{isRTL ? "عنوان المحاضرة" : "Lecture Title"}</Label>
                      <Input
                        value={newLecture.title}
                        onChange={(e) =>
                          setNewLecture({ ...newLecture, title: e.target.value })
                        }
                        placeholder={isRTL ? "مثال: مقدمة في هياكل البيانات" : "e.g. Introduction to Data Structures"}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "التاريخ" : "Date"}</Label>
                      <Input
                        type="date"
                        value={newLecture.date}
                        onChange={(e) =>
                          setNewLecture({ ...newLecture, date: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "ملاحظات" : "Notes"}</Label>
                      <Textarea
                        value={newLecture.notes}
                        onChange={(e) =>
                          setNewLecture({ ...newLecture, notes: e.target.value })
                        }
                        placeholder={isRTL ? "ملاحظات اختيارية..." : "Optional notes..."}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <Button onClick={handleAddLecture} className="w-full">
                      {isRTL ? "إضافة المحاضرة" : "Add Lecture"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedCourse.lectures.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                {t("courses.noLectures")}
              </p>
            ) : (
              selectedCourse.lectures.map((l) => (
                <Card key={l.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{l.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{l.date}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteLecture(l.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {l.notes && (
                      <p className="text-sm text-muted-foreground mt-2 p-2 rounded bg-secondary/50">
                        {l.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ═══ ASSIGNMENTS TAB ═══ */}
          <TabsContent value="assignments" className="space-y-3 mt-4">
            <div className="flex justify-end">
              <Dialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إضافة واجب" : "Add Assignment"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "واجب جديد" : "New Assignment"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>{isRTL ? "عنوان الواجب" : "Assignment Title"}</Label>
                      <Input
                        value={newAssignment.title}
                        onChange={(e) =>
                          setNewAssignment({ ...newAssignment, title: e.target.value })
                        }
                        placeholder={isRTL ? "مثال: تنفيذ شجرة AVL" : "e.g. Implement AVL Tree"}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "الوصف" : "Description"}</Label>
                      <Textarea
                        value={newAssignment.description}
                        onChange={(e) =>
                          setNewAssignment({ ...newAssignment, description: e.target.value })
                        }
                        placeholder={isRTL ? "وصف الواجب..." : "Describe the assignment..."}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "تاريخ التسليم" : "Due Date"}</Label>
                      <Input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) =>
                          setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "الحالة" : "Status"}</Label>
                      <Select
                        value={newAssignment.status}
                        onValueChange={(v) =>
                          setNewAssignment({
                            ...newAssignment,
                            status: v as Assignment["status"],
                          })
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            {isRTL ? "قيد الانتظار" : "Pending"}
                          </SelectItem>
                          <SelectItem value="in-progress">
                            {isRTL ? "قيد التنفيذ" : "In Progress"}
                          </SelectItem>
                          <SelectItem value="completed">
                            {isRTL ? "مكتمل" : "Completed"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddAssignment} className="w-full">
                      {isRTL ? "إضافة الواجب" : "Add Assignment"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedCourse.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                {t("courses.noAssignments")}
              </p>
            ) : (
              selectedCourse.assignments.map((a) => (
                <Card key={a.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0 me-3">
                        <p className="font-medium text-sm">{a.title}</p>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {a.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("courses.due")}: {a.dueDate || (isRTL ? "غير محدد" : "Not set")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={a.status === "completed" ? "default" : "outline"}
                          className="text-[10px] capitalize"
                        >
                          {a.status === "completed"
                            ? t("common.completed")
                            : a.status === "in-progress"
                            ? t("tasks.inProgress")
                            : t("tasks.todo")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteAssignment(a.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={a.progress} className="h-1.5 mt-3" />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ═══ EXAMS TAB ═══ */}
          <TabsContent value="exams" className="space-y-3 mt-4">
            <div className="flex justify-end">
              <Dialog open={addExamOpen} onOpenChange={setAddExamOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إضافة امتحان" : "Add Exam"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{isRTL ? "امتحان جديد" : "New Exam"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>{isRTL ? "عنوان الامتحان" : "Exam Title"}</Label>
                      <Input
                        value={newExam.title}
                        onChange={(e) =>
                          setNewExam({ ...newExam, title: e.target.value })
                        }
                        placeholder={isRTL ? "مثال: الامتحان النصفي" : "e.g. Midterm Exam"}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "تاريخ الامتحان" : "Exam Date"}</Label>
                      <Input
                        type="date"
                        value={newExam.date}
                        onChange={(e) =>
                          setNewExam({ ...newExam, date: e.target.value })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "نسبة الجاهزية (%)" : "Readiness (%)"}</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={newExam.readiness}
                        onChange={(e) =>
                          setNewExam({
                            ...newExam,
                            readiness: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                          })
                        }
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label>{isRTL ? "خطة الدراسة" : "Study Plan"}</Label>
                      <Textarea
                        value={newExam.studyPlan}
                        onChange={(e) =>
                          setNewExam({ ...newExam, studyPlan: e.target.value })
                        }
                        placeholder={isRTL ? "خطة المراجعة..." : "Review plan..."}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <Button onClick={handleAddExam} className="w-full">
                      {isRTL ? "إضافة الامتحان" : "Add Exam"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {selectedCourse.exams.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                {t("courses.noExams")}
              </p>
            ) : (
              selectedCourse.exams.map((e) => (
                <Card key={e.id} className="glass">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
                        {e.studyPlan && (
                          <p className="text-xs text-muted-foreground mt-1 p-2 rounded bg-secondary/50">
                            {e.studyPlan}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={e.readiness > 70 ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {t("courses.ready", { percent: e.readiness })}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteExam(e.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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

  // ─── Course List View ──────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("courses.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("courses.subtitle")}</p>
        </div>
        <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("courses.addCourse")}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>{t("courses.addNewCourse")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>{t("courses.courseName")}</Label>
                <Input
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder={t("courses.courseNamePlaceholder")}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label>{t("courses.courseCode")}</Label>
                <Input
                  value={newCourse.code}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  placeholder={t("courses.courseCodePlaceholder")}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label>{t("courses.professor")}</Label>
                <Input
                  value={newCourse.professor}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, professor: e.target.value })
                  }
                  placeholder={t("courses.professorPlaceholder")}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label>{t("courses.description")}</Label>
                <Textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder={t("courses.descriptionPlaceholder")}
                  className="bg-secondary border-border"
                />
              </div>
              <Button onClick={handleAddCourse} className="w-full">
                {t("courses.addCourse")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {courses.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-10 w-10 text-muted-foreground/60" />}
              message={t("dashboard.noCourses") || t("common.noData")}
            />
          ) : (
            courses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  className="glass cursor-pointer hover:border-primary/30 transition-colors group"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: course.color + "20" }}
                      >
                        <BookOpen
                          className="h-4 w-4"
                          style={{ color: course.color }}
                        />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-sm mt-2">{course.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {course.code} · {course.professor}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">
                        {course.lectures.length} {t("courses.lectures")}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {course.assignments.length} {t("courses.assignments")}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {course.exams.length} {t("courses.exams")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
