import registryData from '../../registry/index.json'

interface RegistryFile {
  source: string
  target: string
}

interface RegistryItem {
  name: string
  type: 'component' | 'preset' | 'internal'
  description: string
  files: RegistryFile[]
  registryDependencies: string[]
  npmDependencies: Record<string, string>
}

interface Registry {
  items: RegistryItem[]
}

export interface InstallDocumentation {
  command: string
  description: string
  components: string[]
  dependencies: string[]
  officialDocumentation?: {
    name: string
    url: string
  }
}

interface RouteInstallConfig {
  items: string[]
  description: string
  officialName?: string
  officialUrl?: string
}

const registry = registryData as unknown as Registry
const registryItems = new Map(registry.items.map((item) => [item.name, item]))

const installByRoute: Record<string, RouteInstallConfig> = {
  accordion: { items: ['accordion'], description: 'Agrega el acordeón y sus tipos para construir grupos de contenido expandible.' },
  'advanced-select': { items: ['advanced-select'], description: 'Agrega el selector avanzado con búsqueda, selección múltiple y panel flotante.' },
  alerts: { items: ['alert'], description: 'Agrega las alertas para comunicar estados informativos, exitosos, preventivos o de error.' },
  autocomplete: { items: ['autocomplete'], description: 'Agrega el campo con sugerencias, filtrado y navegación mediante teclado.' },
  avatars: { items: ['avatar-group'], description: 'Agrega los avatares individuales y su componente para mostrarlos en grupo.' },
  badges: { items: ['badge'], description: 'Agrega badges para representar estados, categorías y valores breves.' },
  breadcrumbs: { items: ['breadcrumbs'], description: 'Agrega breadcrumbs integrados con Vue Router para representar la ubicación actual.' },
  buttons: { items: ['button-group'], description: 'Agrega botones y grupos de botones con variantes, tamaños y estados semánticos.' },
  cards: { items: ['card'], description: 'Agrega la superficie de tarjeta para organizar contenido y acciones relacionadas.' },
  charts: { items: ['chart'], description: 'Agrega el contenedor de gráficos junto con la integración necesaria de ECharts.', officialName: 'Apache ECharts', officialUrl: 'https://echarts.apache.org/handbook/en/get-started/' },
  datepicker: { items: ['date-picker'], description: 'Agrega el selector de fechas y la integración visual de Flatpickr.', officialName: 'Flatpickr', officialUrl: 'https://flatpickr.js.org/' },
  drawer: { items: ['drawer'], description: 'Agrega paneles laterales accesibles para detalles, filtros y formularios.' },
  dropdowns: { items: ['dropdown', 'dropdown-item', 'dropdown-separator'], description: 'Agrega el menú desplegable, sus opciones y el separador para organizar acciones.' },
  editor: { items: ['editor'], description: 'Agrega el editor enriquecido y las extensiones de Tiptap que utiliza su barra de herramientas.', officialName: 'Tiptap', officialUrl: 'https://tiptap.dev/docs/editor/getting-started/overview' },
  'file-upload': { items: ['file-upload'], description: 'Agrega el área para seleccionar, arrastrar y validar archivos antes de subirlos.' },
  forms: { items: ['forms'], description: 'Agrega el conjunto esencial de campos, entradas, selecciones y controles de formulario.' },
  'http-pages': { items: ['http-state'], description: 'Agrega el componente y las escenas visuales para comunicar errores HTTP con mensajes claros.' },
  'input-groups': { items: ['input-group'], description: 'Agrega grupos de entrada junto con los inputs, selects y botones que pueden contener.' },
  'input-mask': { items: ['input-mask'], description: 'Agrega entradas con máscaras para teléfonos, documentos, fechas y formatos personalizados.' },
  modals: { items: ['modal'], description: 'Agrega diálogos modales accesibles para confirmaciones, formularios y contenido enfocado.' },
  pagination: { items: ['pagination'], description: 'Agrega la navegación paginada para recorrer colecciones de datos.' },
  popovers: { items: ['popover'], description: 'Agrega paneles flotantes para mostrar información y acciones contextuales.' },
  progress: { items: ['progress'], description: 'Agrega barras de progreso determinadas e indeterminadas con estados semánticos.' },
  skeleton: { items: ['skeleton'], description: 'Agrega marcadores de carga para reservar el espacio del contenido pendiente.' },
  spinners: { items: ['spinner'], description: 'Agrega indicadores de espera con distintos tamaños, estilos y colores.' },
  states: { items: ['state'], description: 'Agrega estados reutilizables de carga, ausencia de datos y error recuperable.' },
  stepper: { items: ['stepper'], description: 'Agrega el indicador de pasos para representar procesos secuenciales.' },
  tables: { items: ['table'], description: 'Agrega tablas responsive para presentar colecciones y acciones por registro.' },
  sortable: { items: ['sortable'], description: 'Agrega una lista ordenable con arrastre, controles de teclado y sincronización mediante v-model.', officialName: 'SortableJS', officialUrl: 'https://sortablejs.github.io/Sortable/' },
  sweetalert2: { items: ['sweet-alert'], description: 'Agrega AppSweetAlert, el composable useSweetAlert y la integración visual de SweetAlert2.', officialName: 'SweetAlert2', officialUrl: 'https://sweetalert2.github.io/' },
  tabs: { items: ['tabs'], description: 'Agrega pestañas accesibles con navegación por teclado y paneles asociados.' },
  timeline: { items: ['timeline'], description: 'Agrega líneas de tiempo para ordenar actividad, eventos y cambios de estado.' },
  timepicker: { items: ['time-picker'], description: 'Agrega el selector de hora con intervalos, límites y formatos de 12 o 24 horas.', officialName: 'Flatpickr', officialUrl: 'https://flatpickr.js.org/' },
  toasts: { items: ['toast-viewport'], description: 'Agrega las notificaciones temporales y el contenedor que administra su posición.' },
  tooltips: { items: ['tooltip'], description: 'Agrega ayudas breves que aparecen al enfocar o señalar un elemento.' },
}

function resolveItems(names: string[]) {
  const resolved: RegistryItem[] = []
  const visited = new Set<string>()

  function visit(name: string) {
    if (visited.has(name)) return
    const item = registryItems.get(name)
    if (!item) return
    visited.add(name)
    item.registryDependencies.forEach(visit)
    resolved.push(item)
  }

  names.forEach(visit)
  return resolved
}

function componentName(file: RegistryFile) {
  const match = file.target.match(/\/([^/]+)\.vue$/)
  return match?.[1]
}

export function getInstallDocumentation(routeName: unknown): InstallDocumentation | undefined {
  if (typeof routeName !== 'string') return undefined
  const config = installByRoute[routeName]
  if (!config) return undefined

  const resolved = resolveItems(config.items)
  const components = resolved
    .flatMap((item) => item.files.map(componentName))
    .filter((name): name is string => Boolean(name))
    .filter((name, index, names) => names.indexOf(name) === index)
  const dependencies = resolved
    .flatMap((item) => Object.keys(item.npmDependencies))
    .filter((name, index, names) => names.indexOf(name) === index)

  return {
    command: `npx @dediho/vue-kit@latest add ${config.items.join(' ')}`,
    description: config.description,
    components,
    dependencies,
    officialDocumentation: config.officialName && config.officialUrl
      ? { name: config.officialName, url: config.officialUrl }
      : undefined,
  }
}

