<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faMagnifyingGlass, faBars, faXmark, faArrowLeft, faArrowRight, faCheck, faPlus, faPen, faTrash, faDownload, faUpload, faUser, faUsers, faGear, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { faBell, faEnvelope, faCalendar, faClock, faHeart, faStar, faBookmark, faFolder } from '@fortawesome/free-regular-svg-icons'
import { faGithub, faGitlab, faVuejs, faJs, faHtml5, faCss3Alt, faNpm, faNodeJs } from '@fortawesome/free-brands-svg-icons'
import DocsIconGallery from '../components/docs/DocsIconGallery.vue'
import DocsIconUsage from '../components/docs/DocsIconUsage.vue'
import AppButton from '../components/ui/AppButton.vue'

const icons = Object.entries({
  faHouse, faMagnifyingGlass, faBars, faXmark, faArrowLeft, faArrowRight, faCheck, faPlus,
  faPen, faTrash, faDownload, faUpload, faUser, faUsers, faGear, faCartShopping,
  faBell, faEnvelope, faCalendar, faClock, faHeart, faStar, faBookmark, faFolder,
  faGithub, faGitlab, faVuejs, faJs, faHtml5, faCss3Alt, faNpm, faNodeJs,
}).map(([name, icon]) => ({
  name,
  component: FontAwesomeIcon,
  props: { icon, style: { fontSize: '28px' } },
}))

const installCommand = 'npm install @fortawesome/fontawesome-svg-core @fortawesome/vue-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons'
const example = `<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
<\/script>

<template>
  <span><FontAwesomeIcon :icon="faHouse" aria-hidden="true" /> Inicio</span>
  <button type="button" aria-label="Favoritos">
    <FontAwesomeIcon :icon="faHeart" size="lg" style="color: #c2273a" aria-hidden="true" />
  </button>
  <a href="https://github.com">
    <FontAwesomeIcon :icon="faGithub" aria-hidden="true" /> GitHub
  </a>
</template>`
</script>

<template>
  <DocsIconGallery title="Font Awesome Free" website="https://fontawesome.com/search?ic=free" :icons="icons" />
  <DocsIconUsage library="Font Awesome Free" :command="installCommand" :code="example" documentation="https://docs.fontawesome.com/web/use-with/vue/">
    <span class="icon-demo-label"><FontAwesomeIcon :icon="faHouse" aria-hidden="true" /> Inicio</span>
    <AppButton variant="outline" icon-only aria-label="Favoritos"><FontAwesomeIcon :icon="faHeart" size="lg" style="color: #c2273a" aria-hidden="true" /></AppButton>
    <a class="icon-demo-label" href="https://github.com"><FontAwesomeIcon :icon="faGithub" aria-hidden="true" /> GitHub</a>
    <template #footer><p>Incluye las colecciones gratuitas Solid, Regular y Brands. No requiere una cuenta ni un Kit.
      Consulta la <a href="https://fontawesome.com/license/free" target="_blank" rel="noopener noreferrer">licencia de Font Awesome Free (se abre en otra pestaña)</a>.</p></template>
  </DocsIconUsage>
</template>

<style scoped>
.icon-demo-label { display: inline-flex; align-items: center; gap: 8px; }
</style>
