#!/usr/bin/env node
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const assetsRoot = path.join(cliRoot, 'assets')
const registryPath = path.join(assetsRoot, 'registry/index.json')
const packageInfo = JSON.parse(await readFile(path.join(cliRoot, 'package.json'), 'utf8'))

function parseArguments(argv) {
  const positional = []
  const options = { cwd: process.cwd(), install: true, overwrite: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--cwd') options.cwd = path.resolve(argv[++index])
    else if (value === '--skip-install') options.install = false
    else if (value === '--overwrite' || value === '--force') options.overwrite = true
    else positional.push(value)
  }
  return { positional, options }
}

function safeTarget(root, relativePath) {
  const target = path.resolve(root, relativePath)
  const prefix = root.endsWith(path.sep) ? root : root + path.sep
  if (target !== root && !target.startsWith(prefix)) throw new Error(`Ruta no permitida: ${relativePath}`)
  return target
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'))
}

async function writeJson(filename, value) {
  await mkdir(path.dirname(filename), { recursive: true })
  await writeFile(filename, JSON.stringify(value, null, 2) + '\n')
}

async function copyTree(source, destination, overwrite = false) {
  await mkdir(destination, { recursive: true })
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name)
    const to = path.join(destination, entry.name)
    if (entry.isDirectory()) await copyTree(from, to, overwrite)
    else if (overwrite || !existsSync(to)) await cp(from, to)
  }
}

function packageManager(cwd) {
  if (existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return { command: 'pnpm', args: ['add'] }
  if (existsSync(path.join(cwd, 'yarn.lock'))) return { command: 'yarn', args: ['add'] }
  return { command: 'npm', args: ['install'] }
}

async function installDependencies(cwd, dependencies, enabled) {
  const packageNames = Object.entries(dependencies).map(([name, version]) => `${name}@${version}`)
  if (!packageNames.length) return
  const project = await readJson(path.join(cwd, 'package.json'))
  const installed = { ...project.dependencies, ...project.devDependencies }
  const missing = packageNames.filter(value => !installed[value.startsWith('@') ? value.split('@').slice(0, 2).join('@') : value.split('@')[0]])
  if (!missing.length) return
  if (!enabled) {
    console.log(`Dependencias pendientes: ${missing.join(', ')}`)
    return
  }
  const manager = packageManager(cwd)
  console.log(`Instalando ${missing.join(', ')}…`)
  const result = spawnSync(manager.command, [...manager.args, ...missing], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
  if (result.status !== 0) throw new Error('No se pudieron instalar las dependencias.')
}

async function ensureVueProject(cwd) {
  const packageFile = path.join(cwd, 'package.json')
  if (!existsSync(packageFile)) throw new Error('No se encontró package.json. Ejecuta el comando dentro de un proyecto Vue.')
  const project = await readJson(packageFile)
  if (!project.dependencies?.vue && !project.devDependencies?.vue) throw new Error('El proyecto no tiene Vue instalado.')
  return project
}

async function ensureStyleImport(cwd) {
  const candidates = ['src/main.ts', 'src/main.js']
  const mainRelative = candidates.find(candidate => existsSync(path.join(cwd, candidate)))
  if (!mainRelative) throw new Error('No se encontró src/main.ts ni src/main.js.')
  const filename = path.join(cwd, mainRelative)
  const source = await readFile(filename, 'utf8')
  const statement = "import './assets/vue-kit.css'"
  if (!source.includes(statement)) await writeFile(filename, statement + '\n' + source)
}

function projectConfig(cwd) {
  const current = path.join(cwd, 'vue-kit.json')
  const legacy = path.join(cwd, 'app-ui.json')
  return !existsSync(current) && existsSync(legacy) ? legacy : current
}

async function initProject(options) {
  await ensureVueProject(options.cwd)
  const configFile = projectConfig(options.cwd)
  if (path.basename(configFile) === 'app-ui.json') {
    console.log('Proyecto App UI existente detectado. Puedes usar "vue-kit add <componente>" conservando su configuración y estilos.')
    return
  }
  const coreRoot = path.join(assetsRoot, 'core')
  if (!existsSync(coreRoot)) throw new Error('No se encontraron los archivos base del paquete.')
  await copyTree(coreRoot, options.cwd, options.overwrite)
  await ensureStyleImport(options.cwd)
  if (!existsSync(configFile) || options.overwrite) {
    await writeJson(configFile, {
      version: packageInfo.version,
      typescript: existsSync(path.join(options.cwd, 'tsconfig.json')),
      paths: {
        components: 'src/components/ui',
        composables: 'src/composables',
        styles: 'src/assets/styles/components'
      },
      installed: {}
    })
  }
  await installDependencies(options.cwd, { '@fontsource/poppins': '^5.3.0' }, options.install)
  console.log('Vue Kit quedó inicializado. Usa "vue-kit add <componente>" para agregar piezas.')
}

async function loadRegistry() {
  if (!existsSync(registryPath)) throw new Error('El registro no está generado. Ejecuta "npm run registry:build" en el repositorio de Vue Kit.')
  return readJson(registryPath)
}

function resolveItems(registry, requested) {
  const byName = new Map(registry.items.map(item => [item.name, item]))
  const resolved = []
  const visiting = new Set()
  const visited = new Set()
  function visit(name) {
    if (visited.has(name)) return
    const item = byName.get(name)
    if (!item || item.type === 'internal' && !visiting.size) throw new Error(`No existe "${name}" en el registro.`)
    if (visiting.has(name)) throw new Error(`Dependencia circular detectada en "${name}".`)
    visiting.add(name)
    for (const dependency of item.registryDependencies ?? []) visit(dependency)
    visiting.delete(name)
    visited.add(name)
    resolved.push(item)
  }
  requested.forEach(visit)
  return resolved
}

async function appendImports(filename, imports) {
  const existing = existsSync(filename) ? await readFile(filename, 'utf8') : ''
  const additions = imports.filter(value => !existing.includes(value))
  if (!additions.length) return
  await mkdir(path.dirname(filename), { recursive: true })
  await writeFile(filename, existing.trimEnd() + (existing ? '\n' : '') + additions.map(value => `@import "${value}";`).join('\n') + '\n')
}

async function addItems(names, options) {
  if (!names.length) throw new Error('Indica al menos un componente: vue-kit add button')
  await ensureVueProject(options.cwd)
  const configFile = projectConfig(options.cwd)
  if (!existsSync(configFile)) throw new Error('Vue Kit no está inicializado. Ejecuta primero "vue-kit init".')
  const config = await readJson(configFile)
  const registry = await loadRegistry()
  const items = resolveItems(registry, names)
  const dependencies = {}
  const styles = new Set()
  const externalStyles = new Set()
  const changed = []

  for (const item of items) {
    Object.assign(dependencies, item.npmDependencies)
    item.styles?.forEach(value => styles.add(value))
    item.externalStyles?.forEach(value => externalStyles.add(value))
    for (const file of item.files ?? []) {
      const source = path.join(assetsRoot, 'registry/files', file.source)
      const target = safeTarget(options.cwd, file.target)
      if (existsSync(target) && !options.overwrite) continue
      await mkdir(path.dirname(target), { recursive: true })
      await cp(source, target)
      changed.push(file.target)
    }
    for (const stylesheet of item.styles ?? []) {
      const relative = `src/assets/styles/components/${stylesheet}`
      const source = path.join(assetsRoot, 'registry/files', relative)
      const target = safeTarget(options.cwd, relative)
      if (!existsSync(target) || options.overwrite) {
        await mkdir(path.dirname(target), { recursive: true })
        await cp(source, target)
        changed.push(relative)
      }
    }
    config.installed[item.name] = packageInfo.version
  }

  await appendImports(path.join(options.cwd, path.basename(configFile) === 'app-ui.json' ? 'src/assets/app-ui-components.css' : 'src/assets/vue-kit-components.css'), [
    ...[...externalStyles],
    ...[...styles].map(value => `./styles/components/${value}`)
  ])
  await writeJson(configFile, config)
  await installDependencies(options.cwd, dependencies, options.install)
  console.log(changed.length ? `Archivos agregados: ${changed.length}.` : 'Los componentes ya estaban instalados.')
  console.log(`Componentes resueltos: ${items.map(item => item.name).join(', ')}`)
}

async function createProject(name, options) {
  if (!name) throw new Error('Indica el nombre del proyecto: vue-kit create mi-dashboard')
  const target = path.resolve(options.cwd, name)
  if (existsSync(target) && (await readdir(target)).length) throw new Error(`La carpeta "${target}" no está vacía.`)
  await mkdir(target, { recursive: true })
  await copyTree(path.join(assetsRoot, 'template'), target, true)
  const projectFile = path.join(target, 'package.json')
  const project = await readJson(projectFile)
  project.name = path.basename(target).toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  await writeJson(projectFile, project)
  if (options.install) {
    const result = spawnSync('npm', ['install'], { cwd: target, stdio: 'inherit', shell: process.platform === 'win32' })
    if (result.status !== 0) throw new Error('La plantilla fue creada, pero npm install no terminó correctamente.')
  }
  console.log(`Dashboard creado en ${target}`)
}

async function listItems() {
  const registry = await loadRegistry()
  const visible = registry.items.filter(item => item.type !== 'internal')
  const width = Math.max(...visible.map(item => item.name.length))
  for (const item of visible) console.log(`${item.name.padEnd(width)}  ${item.type.padEnd(9)}  ${item.description}`)
}

function help() {
  console.log(`Vue Kit ${packageInfo.version}

Uso:
  vue-kit create <nombre> [--skip-install]
  vue-kit init [--cwd <ruta>] [--skip-install] [--force]
  vue-kit add <componente...> [--skip-install] [--overwrite]
  vue-kit list

Ejemplos:
  vue-kit create mi-dashboard
  vue-kit init
  vue-kit add input-group
  vue-kit add table pagination`)
}

const { positional, options } = parseArguments(process.argv.slice(2))
const [command, ...values] = positional
try {
  if (!command || command === 'help' || command === '--help') help()
  else if (command === 'init') await initProject(options)
  else if (command === 'add') await addItems(values, options)
  else if (command === 'list') await listItems()
  else if (command === 'create') await createProject(values[0], options)
  else throw new Error(`Comando desconocido: ${command}`)
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
