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
    assert.equal(existsSync(path.join(project, 'src/layouts/AppDashboardLayout.vue')), true)
    assert.equal(existsSync(path.join(project, 'src/assets/vue-kit/theme.css')), true)
    assert.equal(JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8')).name, 'demo')
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
    run(['add', 'input-group', '--cwd', temporary, '--skip-install'])

    for (const filename of ['AppInputGroup.vue', 'AppInput.vue', 'AppSelect.vue', 'AppButton.vue']) {
      assert.equal(existsSync(path.join(temporary, 'src/components/ui', filename)), true, filename)
    }
    assert.equal(existsSync(path.join(temporary, 'src/components/ui/AppTable.vue')), false)
    const styles = await readFile(path.join(temporary, 'src/assets/vue-kit-components.css'), 'utf8')
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
    assert.equal(config.installed.button, '0.1.0')
    const styles = await readFile(path.join(temporary, 'src/assets/app-ui-components.css'), 'utf8')
    assert.ok(styles.includes('/* custom styles */'))
    assert.ok(styles.includes('buttons.css'))
    assert.equal(existsSync(path.join(temporary, 'src/assets/vue-kit-components.css')), false)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
})
