import { useState } from "react";
import { useAppState, Habit } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { LuPlus as Plus, LuFlame as Flame, LuCircleCheck as CheckCircle2, LuCircle as Circle, LuTrash2 as Trash2, LuCalendar as Calendar } from "react-icons/lu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { HABIT_ICON_NAMES, renderHabitIcon } from "@/lib/HabitIcons";

function getStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const str = d.toISOString().split("T")[0];
    if (sorted.includes(str)) { streak++; } else if (i > 0) { break; }
  }
  return streak;
}

export default function HabitsPage() {
  const { habits, setHabits } = useAppState();
  const { t, i18n } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", icon: HABIT_ICON_NAMES[0], frequency: "daily" as Habit["frequency"] });
  const todayStr = new Date().toISOString().split("T")[0];
  const locale = i18n.language === "ar" ? "ar-SA" : "en-US";

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString(locale, { weekday: "short" }),
      dayNumber: d.getDate(),
    };
  });

  const colors = [
    "hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 55%)",
    "hsl(0, 72%, 55%)", "hsl(199, 89%, 48%)", "hsl(280, 65%, 60%)",
  ];

  const handleAdd = () => {
    if (!newHabit.title) return;
    const habit: Habit = {
      id: Date.now().toString(), title: newHabit.title, icon: newHabit.icon,
      frequency: newHabit.frequency, completedDates: [], createdAt: todayStr,
      color: colors[habits.length % colors.length],
    };
    setHabits((prev) => [...prev, habit]);
    setNewHabit({ title: "", icon: HABIT_ICON_NAMES[0], frequency: "daily" });
    setAddOpen(false);
  };

  const toggleHabit = (id: string, date: string) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== id) return h;
      const completed = h.completedDates.includes(date) ? h.completedDates.filter((d) => d !== date) : [...h.completedDates, date];
      return { ...h, completedDates: completed };
    }));
  };

  const deleteHabit = (id: string) => { setHabits((prev) => prev.filter((h) => h.id !== id)); };

  const totalToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const completionRate = habits.length > 0 ? Math.round((totalToday / habits.length) * 100) : 0;
  const bestStreak = Math.max(0, ...habits.map((h) => getStreak(h.completedDates)));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("habits.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("habits.subtitle")}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> {t("habits.addHabit")}</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>{t("habits.addHabit")}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>{t("common.title")}</Label><Input value={newHabit.title} onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })} placeholder={t("habits.habitTitle")} className="bg-secondary border-border" /></div>
              <div>
                <Label>{t("habits.icon")}</Label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {HABIT_ICON_NAMES.map((iconName) => (
                    <button key={iconName} onClick={() => setNewHabit({ ...newHabit, icon: iconName })} className={`text-xl p-2 rounded-lg transition-all flex items-center justify-center h-10 w-10 ${newHabit.icon === iconName ? "bg-primary/20 ring-1 ring-primary scale-110" : "hover:bg-secondary"}`}>{renderHabitIcon(iconName, "h-5 w-5")}</button>
                  ))}
                </div>
              </div>
              <div><Label>{t("habits.frequency")}</Label>
                <Select value={newHabit.frequency} onValueChange={(v) => setNewHabit({ ...newHabit, frequency: v as Habit["frequency"] })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t("habits.daily")}</SelectItem>
                    <SelectItem value="weekly">{t("habits.weekly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="w-full">{t("habits.createHabit")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{totalToday}/{habits.length}</p><p className="text-xs text-muted-foreground">{t("habits.doneToday")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-warning">{completionRate}%</p><p className="text-xs text-muted-foreground">{t("habits.todaysRate")}</p></CardContent></Card>
        <Card className="glass"><CardContent className="p-4 text-center"><div className="flex items-center justify-center gap-1"><Flame className="h-5 w-5 text-destructive" /><p className="text-2xl font-bold text-destructive">{bestStreak}</p></div><p className="text-xs text-muted-foreground">{t("habits.bestStreak")}</p></CardContent></Card>
      </div>

      {/* Content */}
      {habits.length === 0 ? (
        <EmptyState icon={<Flame className="h-10 w-10 text-muted-foreground/60" />} message={t("habits.noHabits")} />
      ) : (
        <>
          {/* Weekly View */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {t("common.thisWeek")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-xs text-muted-foreground font-medium p-2 w-40">{t("habits.title")}</th>
                      {last7.map((d) => (
                        <th key={d.dateStr} className="text-center p-2">
                          <div className="text-[10px] text-muted-foreground">{d.dayName}</div>
                          <div className={`text-xs font-medium ${d.dateStr === todayStr ? "text-primary" : ""}`}>{d.dayNumber}</div>
                        </th>
                      ))}
                      <th className="text-center text-[10px] text-muted-foreground font-medium p-2">{t("habits.streak")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habits.map((habit) => {
                      const streak = getStreak(habit.completedDates);
                      return (
                        <tr key={habit.id} className="border-t border-border/20">
                          <td className="p-2"><div className="flex items-center gap-2"><div className="h-6 w-6 flex items-center justify-center bg-secondary/30 rounded-full">{renderHabitIcon(habit.icon, "h-3.5 w-3.5")}</div><span className="text-sm font-medium truncate max-w-[120px]">{habit.title}</span></div></td>
                          {last7.map((d) => {
                            const done = habit.completedDates.includes(d.dateStr);
                            return (
                              <td key={d.dateStr} className="p-2 text-center">
                                <button onClick={() => toggleHabit(habit.id, d.dateStr)} className="mx-auto block transition-all hover:scale-110">
                                  {done ? <CheckCircle2 className="h-6 w-6" style={{ color: habit.color }} /> : <Circle className="h-6 w-6 text-muted-foreground/30 hover:text-muted-foreground/60" />}
                                </button>
                              </td>
                            );
                          })}
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {streak > 0 && <Flame className="h-3.5 w-3.5 text-destructive" />}
                              <span className="text-sm font-bold" style={{ color: streak > 0 ? habit.color : undefined }}>{streak}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Habit Cards */}
          <motion.div layout className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {habits.map((habit) => {
                const streak = getStreak(habit.completedDates);
                const done = habit.completedDates.includes(todayStr);
                const weeklyCount = last7.filter((d) => habit.completedDates.includes(d.dateStr)).length;
                return (
                  <motion.div key={habit.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Card className={`glass transition-all ${done ? "border-success/30" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleHabit(habit.id, todayStr)} className="h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-xl bg-secondary/80 text-xl transition-transform hover:scale-110">{renderHabitIcon(habit.icon, "h-5 w-5")}</button>
                            <div>
                              <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{habit.title}</p>
                              <p className="text-xs text-muted-foreground">{weeklyCount}/7 {t("common.thisWeek").toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {streak > 0 && (<Badge className="bg-destructive/10 text-destructive border-0 text-[10px] gap-1"><Flame className="h-3 w-3" />{streak}</Badge>)}
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteHabit(habit.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}
