import { useAppState } from "@/context/AppContext";
import { motion } from "framer-motion";
import { LuBookOpen as BookOpen, LuSquareCheck as CheckSquare, LuClock as Clock, LuLightbulb as Lightbulb, LuTrendingUp as TrendingUp, LuTriangleAlert as AlertTriangle, LuTarget as Target, LuFlame as Flame, LuArrowRight as ArrowRight, LuZap as Zap, LuBrain as Brain } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { renderHabitIcon } from "@/lib/HabitIcons";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, CartesianGrid, Area, AreaChart
} from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function useGreeting() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const hour = new Date().getHours();
  
  let greetingKey = "";
  if (hour < 6) greetingKey = "night";
  else if (hour < 12) greetingKey = "morning";
  else if (hour < 17) greetingKey = "afternoon";
  else if (hour < 21) greetingKey = "evening";
  else greetingKey = "lateNight";

  return { 
    text: `${t(`greeting.${greetingKey}`)}${name ? `, ${name}` : ""}`, 
    sub: t(`greeting.${greetingKey}Sub`) 
  };
}

export default function Dashboard() {
  const { courses, tasks, ideas, studySessions, goals, habits } = useAppState();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const greeting = useGreeting();
  const locale = i18n.language === "ar" ? "ar-SA" : "en-US";

  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high");
  const todayStr = new Date().toISOString().split("T")[0];
  const todayMinutes = studySessions.filter((s) => s.date === todayStr).reduce((acc, s) => acc + s.duration, 0);

  const upcomingAssignments = courses
    .flatMap((c) => c.assignments.filter((a) => a.status !== "completed"))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  const activeGoals = goals.filter((g) => g.status === "active");

  // Weekly chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const mins = studySessions.filter((s) => s.date === dateStr).reduce((a, s) => a + s.duration, 0);
    return { day: new Date(dateStr).toLocaleDateString(locale, { weekday: "short" }), date: dateStr, minutes: mins };
  });

  // Study time per course
  const courseStudyData = courses.map((c) => ({
    name: c.code,
    minutes: studySessions.filter((s) => s.courseId === c.id).reduce((a, s) => a + s.duration, 0),
    color: c.color,
  }));

  // Today's habits
  const todayHabits = habits.map((h) => ({
    ...h,
    done: h.completedDates.includes(todayStr),
  }));
  const habitsCompleted = todayHabits.filter((h) => h.done).length;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs">
        <p className="font-medium">{label}</p>
        <p className="text-primary">{payload[0].value} {t("common.min")}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting.text}</h1>
          <p className="text-muted-foreground text-sm mt-1">{greeting.sub}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/pomodoro")}>
            <Clock className="h-3.5 w-3.5" /> {t("dashboard.startFocus")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="glass group hover:border-primary/30 transition-all cursor-pointer" onClick={() => navigate("/courses")}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.courses")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass group hover:border-warning/30 transition-all cursor-pointer" onClick={() => navigate("/tasks")}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckSquare className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.pendingTasks")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass group hover:border-success/30 transition-all cursor-pointer" onClick={() => navigate("/pomodoro")}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todayMinutes}<span className="text-sm font-normal text-muted-foreground">{t("common.min")}</span></p>
                <p className="text-xs text-muted-foreground">{t("dashboard.todaysStudy")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="glass group hover:border-info/30 transition-all cursor-pointer" onClick={() => navigate("/goals")}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-xs text-muted-foreground">{t("dashboard.activeGoals")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t("dashboard.weeklyStudy")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={last7Days} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                    <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} unit={t("common.min")} />
                    <ReTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="minutes" stroke="hsl(217 91% 60%)" fill="url(#studyGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(217 91% 60%)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="glass h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="h-4 w-4 text-warning" />
                {t("dashboard.todaysHabits")}
                <Badge variant="outline" className="ml-auto text-[10px]">{habitsCompleted}/{todayHabits.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayHabits.map((h) => (
                <div key={h.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${h.done ? "bg-success/10 border border-success/20" : "bg-secondary/50"}`}>
                  <div className="h-8 w-8 flex items-center justify-center bg-secondary/80 rounded-lg shrink-0">{renderHabitIcon(h.icon, "h-4 w-4")}</div>
                  <span className={`text-sm font-medium flex-1 ${h.done ? "line-through text-muted-foreground" : ""}`}>{h.title}</span>
                  {h.done && <Badge className="bg-success/20 text-success text-[10px] border-0">{t("common.done")}</Badge>}
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground gap-1" onClick={() => navigate("/habits")}>
                {t("dashboard.manageHabits")} <ArrowRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  {t("dashboard.upcomingDeadlines")}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => navigate("/courses")}>
                  {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("dashboard.noDeadlines")}</p>
              ) : (
                upcomingAssignments.map((a) => {
                  const course = courses.find((c) => c.id === a.courseId);
                  const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {course?.code} · {daysLeft > 0 ? t("common.daysLeft", { count: daysLeft }) : t("common.overdue")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16">
                          <Progress value={a.progress} className="h-1.5" />
                        </div>
                        <Badge variant={daysLeft <= 3 ? "destructive" : "outline"} className="text-[10px]">
                          {daysLeft <= 0 ? t("common.overdue") : `${daysLeft}d`}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-info" />
                  {t("dashboard.activeGoalsSection")}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => navigate("/goals")}>
                  {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("common.noActiveGoals")}</p>
              ) : (
                activeGoals.slice(0, 3).map((g) => (
                  <div key={g.id} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{g.title}</p>
                      <Badge variant="outline" className="text-[10px] capitalize">{g.type === "short-term" ? t("goals.shortTerm") : t("goals.longTerm")}</Badge>
                    </div>
                    <Progress value={g.progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground">
                      {g.milestones.filter((m) => m.completed).length}/{g.milestones.length} {t("dashboard.milestones")} · {g.progress}%
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                {t("dashboard.studyByCourse")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseStudyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} unit={t("common.min")} />
                    <ReTooltip content={<CustomTooltip />} />
                    <Bar dataKey="minutes" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-3">
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  {t("dashboard.priorityTasks")}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => navigate("/tasks")}>
                  {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {highPriorityTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("dashboard.noHighPriority")}</p>
                ) : (
                  highPriorityTasks.slice(0, 4).map((tk) => (
                    <div key={tk.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tk.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {t(`tasks.${tk.category}`)}{tk.dueDate ? ` · ${t("common.due")} ${tk.dueDate}` : ""}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize">{t(`tasks.${tk.status === "in-progress" ? "inProgress" : tk.status}`)}</Badge>
                    </div>
                  ))
                )}

                {pendingTasks.filter((tk) => tk.priority !== "high").slice(0, 2).map((tk) => (
                  <div key={tk.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className={`h-2 w-2 rounded-full ${tk.priority === "medium" ? "bg-warning" : "bg-success"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tk.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{t(`tasks.${tk.category}`)}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">{t(`tasks.${tk.status === "in-progress" ? "inProgress" : tk.status}`)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
