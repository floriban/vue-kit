import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = path.resolve(cliRoot, '../..')
const uiRoot = path.join(repoRoot, 'src/components/ui')
const outputRoot = path.join(cliRoot, 'assets/registry')
const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'))
const availableVersions = { ...packageJson.dependencies, ...packageJson.devDependencies }

// Keep installed projects on the demo's palette, including dark component overrides.
const sharedTheme = await readFile(path.join(repoRoot, 'src/assets/styles/theme.css'), 'utf8')
await writeFile(path.join(cliRoot, 'assets/core/src/assets/vue-kit/theme.css'), sharedTheme.replace('@theme {', ':root {'))

await cp(path.join(cliRoot, 'assets/core'), path.join(cliRoot, 'assets/template'), { recursive: true, force: true })
await cp(path.join(repoRoot, '.gitignore'), path.join(cliRoot, 'assets/template/gitignore'))

// New dashboards ship Tailwind; core files used by init stay compatible with plain CSS projects.
const templateCss = path.join(cliRoot, 'assets/template/src/assets/vue-kit.css')
await writeFile(templateCss, '@import "tailwindcss";\n' + await readFile(templateCss, 'utf8'))
await writeFile(path.join(cliRoot, 'assets/template/src/assets/vue-kit/theme.css'), sharedTheme)

// Keep the starter brand identical to the demo on every package build.
await mkdir(path.join(cliRoot, 'assets/template/public'), { recursive: true })
await cp(path.join(repoRoot, 'public/logo.png'), path.join(cliRoot, 'assets/template/public/logo.png'))

// The repository README owns the shared user guide for GitHub and npm.
const repositoryReadme = await readFile(path.join(repoRoot, 'README.md'), 'utf8')
const readmeMarker = '<!-- npm-readme:end -->'
if (!repositoryReadme.includes(readmeMarker)) throw new Error('Missing npm README boundary in README.md')
await writeFile(path.join(cliRoot, 'README.md'), repositoryReadme.split(readmeMarker)[0].trimEnd() + '\n')

const styleMap = {
  accordion: 'accordions.css',
  'advanced-select': 'advanced-forms.css',
  alert: 'alerts.css',
  autocomplete: 'advanced-forms.css',
  avatar: 'avatars.css',
  'avatar-group': 'avatars.css',
  badge: 'badges.css',
  'notification-badge': 'notification-badges.css',
  breadcrumbs: 'navigation-feedback.css',
  button: 'buttons.css',
  'button-group': 'buttons.css',
  card: 'cards.css',
  chart: 'editor-charts.css',
  checkbox: 'forms.css',
  'date-picker': 'advanced-forms.css',
  drawer: 'drawer-utilities.css',
  dropdown: 'dropdowns.css',
  'dropdown-item': 'dropdowns.css',
  'dropdown-separator': 'dropdowns.css',
  editor: 'editor-charts.css',
  field: 'forms.css',
  'file-upload': 'file-upload.css',
  input: 'forms.css',
  'image-viewer': 'image-viewer.css',
  range: 'ranges.css',
  slider: 'ranges.css',
  'input-group': 'input-groups.css',
  'input-mask': 'advanced-forms.css',
  modal: 'modals.css',
  pagination: 'pagination.css',
  popover: 'popovers.css',
  progress: 'progress.css',
  'radio-group': 'forms.css',
  select: 'forms.css',
  skeleton: 'states.css',
  sortable: 'sortable.css',
  spinner: 'timeline-spinners.css',
  state: 'states.css',
  stepper: 'navigation-feedback.css',
  switch: 'forms.css',
  'sweet-alert': 'sweetalert.css',
  table: 'tables.css',
  tabs: 'tabs.css',
  textarea: 'forms.css',
  timeline: 'timeline-spinners.css',
  'time-picker': 'advanced-forms.css',
  toast: 'toasts.css',
  'toast-viewport': 'toasts.css',
  tooltip: 'tooltips.css'
}

const dependencyOverrides = {
  'input-group': ['input', 'select', 'button'],
  'avatar-group': ['avatar'],
  'button-group': ['button'],
  'toast-viewport': ['toast']
}

// Components that accept icons through slots or Component props do not import an
// icon library themselves. Their documented examples use Lucide, so keep those
// examples ready to copy after running add.
const documentedDependencyOverrides = {
  button: ['@lucide/vue'],
  card: ['@lucide/vue'],
  'input-group': ['@lucide/vue'],
  table: ['@lucide/vue'],
  tabs: ['@lucide/vue'],
  timeline: ['@lucide/vue'],
  tooltip: ['@lucide/vue']
}

const externalStyles = {
  'date-picker': ['flatpickr/dist/flatpickr.min.css'],
  'time-picker': ['flatpickr/dist/flatpickr.min.css']
}

function kebab(value) {
  return value
    .replace(/^App/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function packageName(specifier) {
  if (specifier.startsWith('@')) return specifier.split('/').slice(0, 2).join('/')
  return specifier.split('/')[0]
}

async function addSupportFiles(source, files) {
  const supportPattern = /from\s+['"](\.\.\/\.\.\/(?:composables|types|config)\/[^'"]+)['"]/g
  for (const match of source.matchAll(supportPattern)) {
    const resolved = path.resolve(uiRoot, match[1])
    const withExtension = path.extname(resolved) ? resolved : `${resolved}.ts`
    const relative = path.relative(repoRoot, withExtension).replaceAll('\\', '/')
    files.set(relative, relative.replace(/^src\//, 'src/'))
  }
}

await rm(outputRoot, { recursive: true, force: true })
await mkdir(path.join(outputRoot, 'files'), { recursive: true })

const components = []
for (const filename of (await readdir(uiRoot)).filter(name => name.endsWith('.vue')).sort()) {
  const name = kebab(path.basename(filename, '.vue'))
  const sourcePath = path.join(uiRoot, filename)
  const source = await readFile(sourcePath, 'utf8')
  const files = new Map([[path.relative(repoRoot, sourcePath).replaceAll('\\', '/'), `src/components/ui/${filename}`]])
  await addSupportFiles(source, files)

  const registryDependencies = new Set(dependencyOverrides[name] ?? [])
  for (const match of source.matchAll(/from\s+['"]\.\/(App[^'"]+)\.vue['"]/g)) registryDependencies.add(kebab(match[1]))

  const npmDependencies = {}
  for (const match of source.matchAll(/from\s+['"]([^.'"][^'"]*)['"]/g)) {
    const dependency = packageName(match[1])
    if (dependency !== 'vue' && availableVersions[dependency]) npmDependencies[dependency] = availableVersions[dependency]
  }
  for (const dependency of documentedDependencyOverrides[name] ?? []) {
    if (availableVersions[dependency]) npmDependencies[dependency] = availableVersions[dependency]
  }

  components.push({
    name,
    type: name === 'http-scene' ? 'internal' : 'component',
    description: `Instala ${path.basename(filename, '.vue')}.`,
    files: [...files].map(([sourceFile, target]) => ({ source: sourceFile, target })),
    registryDependencies: [...registryDependencies],
    npmDependencies,
    styles: styleMap[name] ? [styleMap[name]] : [],
    externalStyles: externalStyles[name] ?? []
  })
}

const presets = [
  { name: 'forms', type: 'preset', description: 'Controles esenciales para formularios.', registryDependencies: ['field', 'input', 'textarea', 'select', 'checkbox', 'radio-group', 'switch', 'input-group', 'button-group'] },
  { name: 'data-table', type: 'preset', description: 'Tabla, paginación y estados de contenido.', registryDependencies: ['table', 'pagination', 'state', 'spinner'] },
  { name: 'feedback', type: 'preset', description: 'Alertas, modales, notificaciones y estados.', registryDependencies: ['alert', 'modal', 'toast', 'toast-viewport', 'state'] },
  { name: 'flatpickr', type: 'preset', description: 'Selectores de fecha y hora con Flatpickr.', registryDependencies: ['date-picker', 'time-picker'] }
].map(item => ({ ...item, files: [], npmDependencies: {}, styles: [], externalStyles: [] }))

for (const component of components) {
  for (const file of component.files) {
    const source = path.join(repoRoot, file.source)
    const destination = path.join(outputRoot, 'files', file.source)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(source, destination)
  }
  for (const stylesheet of component.styles) {
    const source = path.join(repoRoot, 'src/assets/styles/components', stylesheet)
    const relative = `src/assets/styles/components/${stylesheet}`
    const destination = path.join(outputRoot, 'files', relative)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(source, destination)
  }
}

// Ship the same header and supporting UI as the demo, with dashboard-only links by default.
const templateRoot = path.join(cliRoot, 'assets/template')
await mkdir(path.join(templateRoot, 'src/components/layout'), { recursive: true })
await cp(path.join(repoRoot, 'src/components/docs/DocsHeader.vue'), path.join(templateRoot, 'src/components/layout/AppDashboardHeader.vue'))
const headerItems = ['notification-badge', 'tooltip', 'dropdown', 'dropdown-item', 'dropdown-separator', 'drawer']
const headerStyles = new Set(['buttons.css'])
for (const name of headerItems) {
  const item = components.find(component => component.name === name)
  if (!item) throw new Error('Missing header component: ' + name)
  for (const file of item.files) {
    const destination = path.join(templateRoot, file.target)
    await mkdir(path.dirname(destination), { recursive: true })
    await cp(path.join(repoRoot, file.source), destination)
  }
  item.styles.forEach(style => headerStyles.add(style))
}
for (const style of headerStyles) {
  const destination = path.join(templateRoot, 'src/assets/styles/components', style)
  await mkdir(path.dirname(destination), { recursive: true })
  await cp(path.join(repoRoot, 'src/assets/styles/components', style), destination)
}
const demoLayout = await readFile(path.join(repoRoot, 'src/assets/styles/layout.css'), 'utf8')
const contentSpacing = demoLayout.match(/\.docs-content\s*\{[^}]*\}/)?.[0]
if (!contentSpacing) throw new Error('Missing demo content spacing')
const brandMark = demoLayout.slice(demoLayout.indexOf('.brand__mark {'), demoLayout.indexOf('.brand strong,'))
const desktopHeader = demoLayout.slice(demoLayout.indexOf('.dashboard-header {'), demoLayout.indexOf('/* Grouped component navigation */'))
const mobileHeader = demoLayout.slice(demoLayout.indexOf('/* Mobile layout follows'))
await writeFile(path.join(templateRoot, 'src/assets/dashboard-header.css'), contentSpacing + '\n' + brandMark + desktopHeader + mobileHeader)
await writeFile(path.join(templateRoot, 'src/assets/vue-kit-components.css'),
  [...headerStyles].map(style => '@import "./styles/components/' + style + '";').join('\n') + '\n@import "./dashboard-header.css";\n')
const templateConfigPath = path.join(templateRoot, 'vue-kit.json')
const templateConfig = JSON.parse(await readFile(templateConfigPath, 'utf8'))
templateConfig.version = JSON.parse(await readFile(path.join(cliRoot, 'package.json'), 'utf8')).version
for (const name of headerItems) templateConfig.installed[name] = JSON.parse(await readFile(path.join(cliRoot, 'package.json'), 'utf8')).version
await writeFile(templateConfigPath, JSON.stringify(templateConfig, null, 2) + '\n')

const registry = {
  schemaVersion: 1,
  items: [...components, ...presets]
}
await writeFile(path.join(outputRoot, 'index.json'), JSON.stringify(registry, null, 2) + '\n')
await mkdir(path.join(repoRoot, 'registry'), { recursive: true })
await writeFile(path.join(repoRoot, 'registry/index.json'), JSON.stringify(registry, null, 2) + '\n')
console.log(`Registro generado: ${components.length} componentes y ${presets.length} presets.`)
