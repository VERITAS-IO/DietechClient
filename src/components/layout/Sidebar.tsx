import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Utensils,
  Calendar,
  BarChart2,
  BookOpen,
  Settings,
  ChevronDown,
  Salad,
} from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  subItems?: { title: string; href: string }[];
}

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  const navigation: NavItem[] = [
    {
      title: t('dashboard.menu.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/dashboard',
      subItems: [
        { title: t('dashboard.menu.overview'), href: '/dashboard' },
      ],
    },
    {
      title: t('dashboard.menu.clients'),
      icon: <Users className="w-5 h-5" />,
      href: '/dashboard/clients',
      subItems: [
        { title: t('dashboard.menu.clientList'), href: '/dashboard/clients' },
        { title: t('dashboard.menu.addClient'), href: '/dashboard/clients/new' },
        { title: t('dashboard.menu.progress'), href: '/dashboard/clients/progress' },
      ],
    },
    {
      title: t('dashboard.menu.appointments'),
      icon: <Calendar className="w-5 h-5" />,
      href: '/dashboard/appointments',
      subItems: [
        { title: t('dashboard.menu.calendar'), href: '/dashboard/appointments/calendar' },
        { title: t('dashboard.menu.schedule'), href: '/dashboard/appointments/schedule' },
        { title: t('dashboard.menu.history'), href: '/dashboard/appointments/history' },
        { title: t('dashboard.menu.notes'), href: '/dashboard/appointments/notes' },
      ],
    },
    {
      title: t('dashboard.menu.dietPlans'),
      icon: <Utensils className="w-5 h-5" />,
      href: '/dashboard/diet-plans',
      subItems: [
        { title: t('dashboard.menu.createPlan'), href: '/dashboard/diet-plans/new' },
        { title: t('dashboard.menu.managePlans'), href: '/dashboard/diet-plans' },
        { title: t('dashboard.menu.templates'), href: '/dashboard/diet-plans/templates' },
      ],
    },
    {
      title: t('dashboard.menu.analytics'),
      icon: <BarChart2 className="w-5 h-5" />,
      href: '/dashboard/analytics',
      subItems: [
        { title: t('dashboard.menu.financial'), href: '/dashboard/analytics' },
        { title: t('dashboard.menu.reports'), href: '/dashboard/analytics/reports' },
        { title: t('dashboard.menu.statistics'), href: '/dashboard/analytics/stats' },
      ],
    },
    {
      title: t('dashboard.menu.resources'),
      icon: <BookOpen className="w-5 h-5" />,
      href: '/dashboard/resources',
      subItems: [
        { title: t('dashboard.menu.materials'), href: '/dashboard/resources' },
        { title: t('dashboard.menu.resourceTemplates'), href: '/dashboard/resources/templates' },
        { title: t('dashboard.menu.documents'), href: '/dashboard/resources/documents' },
      ],
    },
    {
      title: t('dashboard.menu.settings'),
      icon: <Settings className="w-5 h-5" />,
      href: '/dashboard/settings',
      subItems: [
        { title: t('dashboard.menu.profile'), href: '/dashboard/settings' },
        { title: t('dashboard.menu.business'), href: '/dashboard/settings/business' },
        { title: t('dashboard.menu.preferences'), href: '/dashboard/settings/preferences' },
      ],
    },
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card">
      <div className="px-6 py-4 border-b border-border flex flex-row gap-2">
        <Link to="/dashboard" className="font-semibold flex items-center gap-2">
          <Salad className="h-6 w-6 text-primary" />
        </Link>
        <h2 className="text-xl font-bold text-foreground">{t('common.appName')}</h2>
      </div>
      <nav className="mt-6">
        {navigation.map((item) => (
          <div key={item.href}>
            <button
              onClick={() => setActiveMenu(activeMenu === item.title ? null : item.title)}
              className={cn(
                "w-full flex items-center justify-between px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                location.pathname.startsWith(item.href) && "bg-accent text-accent-foreground",
              )}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  activeMenu === item.title && "transform rotate-180"
                )}
              />
            </button>
            {activeMenu === item.title && item.subItems && (
              <div className="bg-muted">
                {item.subItems.map((subItem) => (
                  <NavLink
                    key={subItem.href}
                    to={subItem.href}
                    className={({ isActive }) =>
                      cn(
                        "block pl-14 pr-6 py-2 text-sm text-muted-foreground hover:text-accent-foreground hover:bg-accent",
                        isActive && "bg-accent text-accent-foreground"
                      )
                    }
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;