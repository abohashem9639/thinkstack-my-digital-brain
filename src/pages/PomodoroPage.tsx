import { useState, useEffect, useCallback } from "react";
import { useAppState } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Phase = "work" | "break" | "idle";

export default function PomodoroPage() {
  const { courses, studySessions, setStudySessions } = useAppState();
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [workDuration] = useState(25);
  const [breakDuration] = useState(5);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const totalMinutes = workDuration;

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        if (phase === "work") {
          setSessionsCompleted((s) => s + 1);
          setStudySessions([...studySessions, {
            id: Date.now().toString(),
            courseId: selectedCourse,
            duration: totalMinutes,
            date: new Date().toISOString().split("T")[0],
            type: "pomodoro",
          }]);
          setPhase("break");
          return breakDuration * 60;
        } else {
          setPhase("idle");
          return workDuration * 60;
        }
      }
      return prev - 1;
    });
  }, [phase, breakDuration, workDuration, selectedCourse, studySessions, setStudySessions, totalMinutes]);

  useEffect(() => {
    if (phase === "idle") return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phase, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = phase === "work" ? (1 - timeLeft / (workDuration * 60)) * 100 : phase === "break" ? (1 - timeLeft / (breakDuration * 60)) * 100 : 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const start = () => { setPhase("work"); setTimeLeft(workDuration * 60); };
  const toggle = () => setPhase(phase === "idle" ? "work" : "idle");
  const reset = () => { setPhase("idle"); setTimeLeft(workDuration * 60); };

  const courseStudyTime = studySessions.filter((s) => s.courseId === selectedCourse).reduce((a, s) => a + s.duration, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay focused, one session at a time</p>
      </div>

      <div className="flex justify-center">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64 bg-secondary border-border">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.code} - {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <svg width="280" height="280" className="transform -rotate-90">
            <circle cx="140" cy="140" r="120" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
            <circle
              cx="140" cy="140" r="120" fill="none"
              stroke={phase === "break" ? "hsl(var(--success))" : "hsl(var(--primary))"}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <span className="text-sm text-muted-foreground mt-1 capitalize flex items-center gap-1.5">
              {phase === "break" && <Coffee className="h-3.5 w-3.5" />}
              {phase === "idle" ? "Ready" : phase}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-3">
        {phase === "idle" ? (
          <Button onClick={start} size="lg" className="gap-2 glow-primary">
            <Play className="h-4 w-4" /> Start Session
          </Button>
        ) : (
          <>
            <Button onClick={toggle} variant="outline" size="lg" className="gap-2">
              <Pause className="h-4 w-4" /> Pause
            </Button>
            <Button onClick={reset} variant="ghost" size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{sessionsCompleted}</p>
            <p className="text-xs text-muted-foreground">Sessions Today</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{sessionsCompleted * workDuration}m</p>
            <p className="text-xs text-muted-foreground">Focus Time Today</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{courseStudyTime}m</p>
            <p className="text-xs text-muted-foreground">Total for Course</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
