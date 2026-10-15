<script setup lang="ts">
import AppCard from '../ui/AppCard.vue'
import AppTable from '../ui/AppTable.vue'

const properties = [
  ['variant', "'solid' | 'outline' | 'soft' | 'ghost'", "'solid'", 'Nivel de énfasis visual.'],
  ['color', "'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger'", "'primary'", 'Color semántico de la acción.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Altura, tamaño de texto y espaciado.'],
  ['loading', 'boolean', 'false', 'Muestra el indicador, deshabilita el botón y activa aria-busy.'],
  ['disabled', 'boolean', 'false', 'Deshabilita la interacción del botón nativo.'],
  ['block', 'boolean', 'false', 'Ocupa el ancho disponible.'],
  ['iconOnly', 'boolean', 'false', 'Botón cuadrado para un icono; usa icon-only en el template y añade aria-label.'],
  ['type', "'button' | 'submit' | 'reset'", "'button'", 'Comportamiento nativo dentro de un formulario.'],
]
</script>

<template>
  <section class="component-section">
    <div class="section-heading">
      <div><span>08</span><h2>Referencia de AppButton</h2></div>
      <p>Propiedades, eventos y contenido.</p>
    </div>
    <AppCard title="API del componente">
      <div class="docs-reference">
      <AppTable label="Propiedades de AppButton" compact>
        <thead><tr><th scope="col">Propiedad</th><th scope="col">Tipo</th><th scope="col">Por defecto</th><th scope="col">Descripción</th></tr></thead>
        <tbody>
          <tr v-for="property in properties" :key="property[0]">
            <td><code>{{ property[0] }}</code></td>
            <td><code>{{ property[1] }}</code></td>
            <td><code>{{ property[2] }}</code></td>
            <td>{{ property[3] }}</td>
          </tr>
        </tbody>
      </AppTable>
      <h3>Eventos y atributos</h3>
      <p><code>@click</code> recibe el <code>MouseEvent</code> del botón nativo. AppButton no declara eventos personalizados. Los atributos como <code>aria-label</code>, <code>name</code>, <code>form</code> y los listeners se heredan en el elemento <code>button</code>.</p>
      <h3>Slot por defecto</h3>
      <p>Acepta el texto y los iconos de la acción. No tiene slots con nombre ni propiedades de slot. El indicador de carga se añade antes de ese contenido.</p>
      <h3>Uso accesible</h3>
      <ul>
        <li>Usa una etiqueta descriptiva: «Guardar cambios», «Eliminar registro».</li>
        <li>Si solo hay un icono, proporciona <code>aria-label</code>. Los iconos decorativos deben usar <code>aria-hidden="true"</code>.</li>
        <li>El botón responde a Enter y Espacio mediante su comportamiento nativo.</li>
        <li><code>loading</code> impide clics adicionales; la operación y su resultado los controla el componente padre.</li>
        <li>Para enviar un formulario, indica <code>type="submit"</code>. El valor predeterminado no lo envía.</li>
      </ul>
      <h3>AppButtonGroup</h3>
      <p><code>attached</code> une los botones (por defecto <code>true</code>), <code>orientation</code> acepta <code>horizontal</code> o <code>vertical</code> (por defecto <code>horizontal</code>) y <code>label</code> da nombre al grupo. Su slot recibe los botones; no administra una selección.</p>
      </div>
    </AppCard>
  </section>
</template>
