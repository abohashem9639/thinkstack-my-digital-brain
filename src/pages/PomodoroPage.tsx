import { useState, useEffect, useCallback } from "react";
import { useAppState } from "@/context/AppContext";
import { motion } from "framer-motion";
import { LuPlay as Play, LuPause as Pause, LuRotateCcw as RotateCcw, LuCoffee as Coffee, LuChartBar as BarChart3 } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

type Phase = "work" | "break" | "idle";

export default function PomodoroPage() {
  const { courses, studySessions, setStudySessions } = useAppState();
  const { t, i18n } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        if (phase === "work") {
          setSessionsCompleted((s) => s + 1);
          setStudySessions((prev) => [...prev, { id: Date.now().toString(), courseId: selectedCourse, duration: workDuration, date: new Date().toISOString().split("T")[0], type: "pomodoro" }]);
          setPhase("break"); return breakDuration * 60;
        } else { setPhase("idle"); return workDuration * 60; }
      }
      return prev - 1;
    });
  }, [phase, breakDuration, workDuration, selectedCourse, setStudySessions]);

  useEffect(() => { 
    if (phase === "idle" || isPaused) return; 
    const interval = setInterval(tick, 1000); 
    return () => clearInterval(interval); 
  }, [phase, isPaused, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = phase === "work" ? (1 - timeLeft / (workDuration * 60)) * 100 : phase === "break" ? (1 - timeLeft / (breakDuration * 60)) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const start = () => { setPhase("work"); setIsPaused(false); setTimeLeft(workDuration * 60); };
  const togglePause = () => setIsPaused((prev) => !prev);
  const reset = () => { setPhase("idle"); setIsPaused(false); setTimeLeft(workDuration * 60); };

  const courseStudyTime = studySessions.filter((s) => s.courseId === selectedCourse).reduce((a, s) => a + s.duration, 0);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayStudyTime = studySessions.filter((s) => s.date === todayStr).reduce((a, s) => a + s.duration, 0);
  const courseStats = courses.map((c) => ({ name: c.code, minutes: studySessions.filter((s) => s.courseId === c.id).reduce((a, s) => a + s.duration, 0) }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (<div className="glass rounded-lg px-3 py-2 text-xs"><p className="font-medium">{label}</p><p className="text-primary">{payload[0].value} {t("common.min")}</p></div>);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t("pomodoro.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("pomodoro.subtitle")}</p>
      </div>

      <div className="flex justify-center gap-3">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64 bg-secondary border-border"><SelectValue placeholder={t("pomodoro.selectCourse")} /></SelectTrigger>
          <SelectContent>
            {courses.length === 0 ? (
              <SelectItem value="empty" disabled>{t("dashboard.noCourses") || t("common.noData")}</SelectItem>
            ) : (
              courses.map((c) => (<SelectItem key={c.id} value={c.id}>{c.code} - {c.name}</SelectItem>))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <svg width="280" height="280" className="transform -rotate-90">
            <circle cx="140" cy="140" r="120" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
            <circle cx="140" cy="140" r="120" fill="none" stroke={phase === "break" ? "hsl(var(--success))" : "hsl(var(--primary))"} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold">{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
            <span className="text-sm text-muted-foreground mt-1 capitalize flex items-center gap-1.5">
              {phase === "break" && <Coffee className="h-3.5 w-3.5" />}
              {phase === "idle" ? t("pomodoro.ready") : isPaused ? t("pomodoro.pause") : phase === "work" ? t("pomodoro.working") : t("pomodoro.break")}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-3">
        {phase === "idle" ? (
          <Button onClick={start} size="lg" className="gap-2 glow-primary"><Play className="h-4 w-4" /> {t("pomodoro.startSession")}</Button>
        ) : (
          <>
            <Button onClick={togglePause} variant={isPaused ? "default" : "outline"} size="lg" className="gap-2">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {isPaused ? (i18n.language === "ar" ? "استئناف" : "Resume") : t("pomodoro.pause")}
            </Button>
            <Button onClick={reset} variant="ghost" size="lg" className="gap-2"><RotateCcw className="h-4 w-4" /> {t("pomodoro.reset")}</Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{sessionsCompleted}</p><p className="text-xs text-muted-foreground">{t("pomodoro.sessionsToday")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{todayStudyTime}{t("common.min")}</p><p className="text-xs text-muted-foreground">{t("pomodoro.totalToday")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-success">{courseStudyTime}{t("common.min")}</p><p className="text-xs text-muted-foreground">{t("pomodoro.totalForCourse")}</p></CardContent></Card>
      </div>

      <Card className="glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />{t("pomodoro.studyTimePerCourse")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseStats} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} tickLine={false} unit={t("common.min")} />
                <ReTooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" fill="hsl(217 91% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
