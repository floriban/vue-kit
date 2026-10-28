import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/index.js')

function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return result.stdout
}

test('create genera un dashboard mínimo sin instalar paquetes', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-create-'))
  try {
    run(['create', 'demo', '--cwd', temporary, '--skip-install'])
    const project = path.join(temporary, 'demo')
    assert.equal(existsSync(path.join(project, 'gitignore')), false)
    assert.equal(existsSync(path.join(project, '.npmignore')), false)
    assert.equal(existsSync(path.join(project, 'node_modules')), false)
    const gitignore = await readFile(path.join(project, '.gitignore'), 'utf8')
    for (const pattern of ['node_modules', 'dist', '.env', '!.env.example']) {
      assert.ok(gitignore.split(/\r?\n/).includes(pattern), pattern)
    }
    const gitInit = spawnSync('git', ['init', '--quiet'], { cwd: project, encoding: 'utf8' })
    assert.equal(gitInit.status, 0, gitInit.stderr)
    const ignored = spawnSync('git', ['check-ignore', '--stdin'], {
      cwd: project, encoding: 'utf8', input: 'node_modules/example.js\ndist/index.html\n.env\n.env.local\n',
    })
    assert.equal(ignored.status, 0, ignored.stderr)
    assert.equal(ignored.stdout.trim().split(/\r?\n/).length, 4)
    const tracked = spawnSync('git', ['check-ignore', '--stdin'], {
      cwd: project, encoding: 'utf8', input: '.env.example\npackage-lock.json\npnpm-lock.yaml\nyarn.lock\nsrc/main.ts\n',
    })
    assert.equal(tracked.status, 1, tracked.stdout || tracked.stderr)
    assert.equal(existsSync(path.join(project, 'src/layouts/AppDashboardLayout.vue')), true)
    assert.equal(existsSync(path.join(project, 'src/assets/vue-kit/theme.css')), true)
    assert.equal(JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8')).name, 'demo')
    const projectPackage = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'))
    assert.ok(projectPackage.devDependencies.tailwindcss)
    assert.ok(projectPackage.devDependencies['@tailwindcss/vite'])
    assert.match(await readFile(path.join(project, 'vite.config.ts'), 'utf8'), /tailwindcss\(\)/)
    assert.match(await readFile(path.join(project, 'src/assets/vue-kit.css'), 'utf8'), /@import "tailwindcss"/)
    assert.equal(
      await readFile(path.join(project, 'src/components/layout/AppDashboardHeader.vue'), 'utf8'),
      await readFile(new URL('../../../src/components/docs/DocsHeader.vue', import.meta.url), 'utf8'),
    )
    for (const component of ['AppTooltip', 'AppDropdown', 'AppDropdownItem', 'AppDropdownSeparator', 'AppDrawer', 'AppNotificationBadge']) {
      assert.equal(existsSync(path.join(project, 'src/components/ui', component + '.vue')), true)
    }
    assert.equal(existsSync(path.join(project, 'src/composables/modalScrollLock.ts')), true)
    const headerStyles = await readFile(path.join(project, 'src/assets/dashboard-header.css'), 'utf8')
    assert.match(headerStyles, /dashboard-user-menu \.app-dropdown__chevron\s*\{\s*display: none/)
    const demoTheme = await readFile(new URL('../../../src/assets/styles/theme.css', import.meta.url), 'utf8')
    assert.equal(
      await readFile(path.join(project, 'src/assets/vue-kit/theme.css'), 'utf8'),
      demoTheme,
      'La plantilla debe conservar la paleta y los ajustes de contraste del demo',
    )
    const demoLogo = await readFile(new URL('../../../public/logo.png', import.meta.url))
    assert.deepEqual(await readFile(path.join(project, 'public/logo.png')), demoLogo)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test('visor y rangos incluyen dependencias, helpers y estilos al instalarlos', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-media-ranges-'))
  try {
    run(['create', 'demo', '--cwd', temporary, '--skip-install'])
    const project = path.join(temporary, 'demo')
    run(['add', 'image-viewer', 'range', 'slider', '--cwd', project, '--skip-install'])
    for (const filename of ['AppImageViewer.vue', 'AppModal.vue', 'AppRange.vue', 'AppSlider.vue']) {
      assert.equal(existsSync(path.join(project, 'src/components/ui', filename)), true, filename)
    }
    for (const filename of ['modalScrollLock.ts', 'rangeValues.ts']) {
      assert.equal(existsSync(path.join(project, 'src/composables', filename)), true, filename)
    }
    const styles = await readFile(path.join(project, 'src/assets/vue-kit-components.css'), 'utf8')
    for (const filename of ['modals.css', 'image-viewer.css', 'ranges.css']) {
      assert.ok(styles.includes(filename), filename)
      assert.equal(existsSync(path.join(project, 'src/assets/styles/components', filename)), true)
    }
    assert.equal(styles.match(/ranges\.css/g)?.length, 1, 'Los estilos compartidos solo deben importarse una vez')
    const config = JSON.parse(await readFile(path.join(project, 'vue-kit.json'), 'utf8'))
    for (const name of ['image-viewer', 'modal', 'range', 'slider']) assert.ok(config.installed[name], name)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test('init y add copian únicamente el componente y sus dependencias', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-add-'))
  try {
    await mkdir(path.join(temporary, 'src'), { recursive: true })
    await writeFile(path.join(temporary, 'package.json'), JSON.stringify({ name: 'fixture', private: true, dependencies: { vue: '^3.5.0' } }))
    await writeFile(path.join(temporary, 'src/main.ts'), "import { createApp } from 'vue'\n")
    run(['init', '--cwd', temporary, '--skip-install'])
    run(['add', 'input-group', 'notification-badge', '--cwd', temporary, '--skip-install'])

    for (const filename of ['AppInputGroup.vue', 'AppInput.vue', 'AppSelect.vue', 'AppButton.vue', 'AppNotificationBadge.vue']) {
      assert.equal(existsSync(path.join(temporary, 'src/components/ui', filename)), true, filename)
    }
    assert.equal(existsSync(path.join(temporary, 'src/components/ui/AppTable.vue')), false)
    const styles = await readFile(path.join(temporary, 'src/assets/vue-kit-components.css'), 'utf8')
    assert.match(styles, /notification-badges\.css/)
    assert.match(styles, /input-groups\.css/)
    assert.match(styles, /forms\.css/)
    assert.match(styles, /buttons\.css/)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test('forms incluye el grupo de botones y las dependencias de los ejemplos', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-forms-'))
  try {
    await mkdir(path.join(temporary, 'src'), { recursive: true })
    await writeFile(path.join(temporary, 'package.json'), JSON.stringify({ name: 'fixture', private: true, dependencies: { vue: '^3.5.0' } }))
    await writeFile(path.join(temporary, 'src/main.ts'), "import { createApp } from 'vue'\n")
    run(['init', '--cwd', temporary, '--skip-install'])
    const output = run(['add', 'forms', '--cwd', temporary, '--skip-install'])

    for (const filename of ['AppButton.vue', 'AppButtonGroup.vue', 'AppInput.vue', 'AppInputGroup.vue']) {
      assert.equal(existsSync(path.join(temporary, 'src/components/ui', filename)), true, filename)
    }
    assert.match(output, /@lucide\/vue@\^1\.42\.0/)
    const config = JSON.parse(await readFile(path.join(temporary, 'vue-kit.json'), 'utf8'))
    assert.equal(typeof config.installed['button-group'], 'string')
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})

test('instala wrappers y presets de integraciones', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-integrations-'))
  try {
    await mkdir(path.join(temporary, 'src'), { recursive: true })
    await writeFile(path.join(temporary, 'package.json'), JSON.stringify({ name: 'fixture', private: true, dependencies: { vue: '^3.5.0' } }))
    await writeFile(path.join(temporary, 'src/main.ts'), "import { createApp } from 'vue'\n")
    run(['init', '--cwd', temporary, '--skip-install'])
    const output = run(['add', 'sweet-alert', 'sortable', 'flatpickr', '--cwd', temporary, '--skip-install'])

    for (const filename of ['AppSweetAlert.vue', 'AppSortable.vue', 'AppDatePicker.vue', 'AppTimePicker.vue']) {
      assert.equal(existsSync(path.join(temporary, 'src/components/ui', filename)), true, filename)
    }
    assert.equal(existsSync(path.join(temporary, 'src/composables/useSweetAlert.ts')), true)
    assert.match(output, /sweetalert2/)
    assert.match(output, /sortablejs/)
    assert.match(output, /flatpickr/)

    const styles = await readFile(path.join(temporary, 'src/assets/vue-kit-components.css'), 'utf8')
    assert.match(styles, /sweetalert\.css/)
    assert.match(styles, /sortable\.css/)
    assert.match(styles, /flatpickr\/dist\/flatpickr\.min\.css/)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})



test('Vue Kit conserva configuración y estilos de proyectos App UI', async () => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'vue-kit-legacy-'))
  try {
    await mkdir(path.join(temporary, 'src/assets'), { recursive: true })
    await writeFile(path.join(temporary, 'package.json'), JSON.stringify({ name: 'legacy', dependencies: { vue: '^3.5.0' } }))
    const main = "import './assets/app-ui.css'\n"
    await writeFile(path.join(temporary, 'src/main.ts'), main)
    await writeFile(path.join(temporary, 'app-ui.json'), JSON.stringify({ version: '0.1.0', installed: { input: '0.1.0' } }))
    await writeFile(path.join(temporary, 'src/assets/app-ui-components.css'), '/* custom styles */\n')
    run(['init', '--cwd', temporary, '--skip-install'])
    run(['add', 'button', '--cwd', temporary, '--skip-install'])
    assert.equal(await readFile(path.join(temporary, 'src/main.ts'), 'utf8'), main)
    assert.equal(existsSync(path.join(temporary, 'vue-kit.json')), false)
    const config = JSON.parse(await readFile(path.join(temporary, 'app-ui.json'), 'utf8'))
    assert.equal(config.installed.input, '0.1.0')
    const currentPackage = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
    assert.equal(config.installed.button, currentPackage.version)
    const styles = await readFile(path.join(temporary, 'src/assets/app-ui-components.css'), 'utf8')
    assert.ok(styles.includes('/* custom styles */'))
    assert.ok(styles.includes('buttons.css'))
    assert.equal(existsSync(path.join(temporary, 'src/assets/vue-kit-components.css')), false)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})
