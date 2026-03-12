import { LuLayoutDashboard as LayoutDashboard, LuGraduationCap as GraduationCap, LuSquareCheck as CheckSquare, LuTimer as Timer, LuLightbulb as Lightbulb, LuCode as Code2, LuZap as Zap, LuTarget as Target, LuFlame as Flame, LuBrain as Brain, LuMonitor as Monitor, LuFocus as Focus } from "react-icons/lu";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuth } from "@/context/AuthContext";
import { LuLogOut as LogOut } from "react-icons/lu";
import { isSupabaseAvailable } from "@/lib/supabase";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const isRTL = i18n.language === "ar";
  const isActive = (path: string) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const sections = [
    {
      label: t("nav.main"),
      items: [
        { title: t("nav.dashboard"), url: "/", icon: LayoutDashboard },
        { title: t("nav.courses"), url: "/courses", icon: GraduationCap },
        { title: t("nav.tasks"), url: "/tasks", icon: CheckSquare },
        { title: t("nav.pomodoro"), url: "/pomodoro", icon: Timer },
      ],
    },
    {
      label: t("nav.devTools"),
      items: [
        { title: t("nav.ideas"), url: "/ideas", icon: Lightbulb },
        { title: t("nav.snippets"), url: "/snippets", icon: Code2 },
        { title: t("nav.techLibrary"), url: "/tech-library", icon: Monitor },
      ],
    },
    {
      label: t("nav.productivity"),
      items: [
        { title: t("nav.goals"), url: "/goals", icon: Target },
        { title: t("nav.habits"), url: "/habits", icon: Flame },
        { title: t("nav.focusMode"), url: "/focus", icon: Focus },
      ],
    },
    {
      label: t("nav.knowledge"),
      items: [
        { title: t("nav.knowledgeBase"), url: "/knowledge", icon: Brain },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" side={isRTL ? "right" : "left"}>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex-shrink-0">
            <img src="/logo-icon.png" alt="ThinkStack Icon" className="h-full w-full object-contain" />
          </div>
          {!collapsed && (
            <div className="h-6">
              <img src="/logo-text.png" alt="ThinkStack" className="h-full object-contain dark:invert" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-widest">
              {!collapsed && section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-primary font-medium">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 flex flex-col gap-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-secondary/30">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        {!collapsed && user && isSupabaseAvailable() && (
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full p-2 rounded-lg hover:bg-secondary/50"
          >
            <LogOut className="h-4 w-4" />
            {isRTL ? "تسجيل الخروج" : "Sign Out"}
          </button>
        )}
        {!collapsed && (
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-muted-foreground/40 font-mono">
              {t("common.version")}
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 w-full">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
