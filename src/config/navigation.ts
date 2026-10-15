import { httpPages } from "./httpPages";
import type { Component } from "vue";
import {
  Boxes,
  Compass,
  Database,
  FormInput,
  LayoutDashboard,
  MessagesSquare,
  PanelsTopLeft,
  Plug,
  Shapes,
} from "@lucide/vue";

export interface NavigationItem {
  name: string;
  label: string;
}

export interface NavigationGroup {
  id: string;
  label: string;
  description: string;
  icon: Component;
  items: NavigationItem[];
}

export const dashboardItem = {
  name: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
};

export const navigationGroups: NavigationGroup[] = [
  {
    id: "utilities",
    label: "Utilidades",
    description: "Distribución y estilos compartidos.",
    icon: Shapes,
    items: [
      { name: "grid", label: "Distribuciones" },
      { name: "utilities", label: "Tipografía y utilidades" },
      { name: "states", label: "Estados de contenido" },
    ],
  },
  {
    id: "elements",
    label: "Elementos visuales",
    description: "Piezas de presentación, identidad y contenido.",
    icon: Boxes,
    items: [
      { name: "buttons", label: "Botones" },
      { name: "cards", label: "Tarjetas" },
      { name: "badges", label: "Badges" },
      { name: "notification-badges", label: "Indicadores" },
      { name: "avatars", label: "Avatares" },
      { name: "timeline", label: "Timeline" },
    ],
  },
  {
    id: "forms",
    label: "Formularios",
    description: "Controles para capturar, buscar y seleccionar datos.",
    icon: FormInput,
    items: [
      { name: "forms", label: "Controles base" },
      { name: "autocomplete", label: "Autocomplete" },
      { name: "input-mask", label: "Input Mask" },
      { name: "input-groups", label: "Input Group" },
      { name: "advanced-select", label: "Select avanzado" },
      { name: "file-upload", label: "File Upload" },
    ],
  },
  {
    id: "data",
    label: "Datos",
    description: "Presentación y recorrido de colecciones de información.",
    icon: Database,
    items: [
      { name: "tables", label: "Tablas" },
      { name: "pagination", label: "Pagination" },
    ],
  },
  {
    id: "navigation",
    label: "Navegación",
    description: "Patrones para cambiar de contexto y organizar contenido.",
    icon: Compass,
    items: [
      { name: "dropdowns", label: "Dropdowns" },
      { name: "tabs", label: "Tabs" },
      { name: "accordion", label: "Accordion" },
      { name: "breadcrumbs", label: "Breadcrumbs" },
      { name: "stepper", label: "Stepper" },
    ],
  },
  {
    id: "integrations",
    label: "Integraciones",
    description: "Componentes respaldados por librerías especializadas.",
    icon: Plug,
    items: [
      { name: "sweetalert2", label: "SweetAlert2" },
      { name: "editor", label: "Editor de texto" },
      { name: "sortable", label: "SortableJS" },
      { name: "datepicker", label: "Datepicker" },
      { name: "timepicker", label: "Timepicker" },
      { name: "charts", label: "ECharts" },
    ],
  },
  {
    id: "http-pages",
    label: "Páginas HTTP",
    description: "Situaciones de acceso, conexión y disponibilidad.",
    icon: PanelsTopLeft,
    items: httpPages.map((page) => ({
      name: "http-" + page.code,
      label: page.code + " · " + page.label,
    })),
  },
  {
    id: "feedback",
    label: "Feedback y capas",
    description: "Estados, mensajes y contenido temporal superpuesto.",
    icon: MessagesSquare,
    items: [
      { name: "alerts", label: "Alertas" },
      { name: "modals", label: "Modales" },
      { name: "drawer", label: "Drawer" },
      { name: "toasts", label: "Notificaciones" },
      { name: "progress", label: "Progress" },
      { name: "spinners", label: "Spinners" },
      { name: "skeleton", label: "Skeleton" },
      { name: "tooltips", label: "Tooltips" },
      { name: "popovers", label: "Popovers" },
    ],
  },
];

export function findNavigationItem(name: unknown) {
  if (name === dashboardItem.name) return dashboardItem;
  return navigationGroups
    .flatMap((group) => group.items)
    .find((item) => item.name === name);
}
