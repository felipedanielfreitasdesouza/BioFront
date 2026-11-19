import { useMemo, useState } from 'react'
import OrganizationCard from '../components/OrganizationCard.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { SearchIcon } from '../components/icons.jsx'
import { CAUSES, LOCATIONS } from '../data/catalogs.js'
import { projects } from '../data/projects.js'
import { readOrganizationProjects, readPublishedProjects, readStorage, USERS_STORAGE_KEY } from '../lib/storage.js'

function matchesLocation(value, selectedLocation) {
  if (!selectedLocation) return true
  const normalizedValue = (value || '').trim().toLowerCase()
  const normalizedSelection = selectedLocation.trim().toLowerCase()
  return normalizedValue === normalizedSelection || normalizedValue.startsWith(normalizedSelection.split(',')[0])
}

function matchesCause(value, selectedCause) {
  return !selectedCause || (value || '').trim().toLowerCase() === selectedCause.trim().toLowerCase()
}

export default function HomePage({ authUser, onLogin, onLogout, onOpenOng, onOpenOrganization, onOpenProject, onRegister, onRegisterOng }) {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [cause, setCause] = useState('')
  const [publishedProjects] = useState(() => [...projects, ...readPublishedProjects()])
  const [organizations] = useState(() => readStorage(USERS_STORAGE_KEY, [])
    .filter((user) => user.role === 'ong')
    .map((organization) => ({
      ...organization,
      causes: [...new Set([
        organization.cause,
        ...readOrganizationProjects(organization.id).map((project) => project.cause),
      ].filter(Boolean))],
    })))

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return publishedProjects.filter((project) => {
      const projectName = project.title || project.name || ''
      const matchesSearch = !normalizedSearch || projectName.toLowerCase().includes(normalizedSearch)
      const projectMatchesLocation = matchesLocation(project.location, location)
      const projectMatchesCause = matchesCause(project.cause, cause)

      return matchesSearch && projectMatchesLocation && projectMatchesCause
    })
  }, [cause, location, publishedProjects, search])

  const filteredOrganizations = useMemo(() => organizations.filter((organization) => {
    const organizationMatchesLocation = matchesLocation(organization.location, location)
    const organizationMatchesCause = !cause || organization.causes.some((organizationCause) => matchesCause(organizationCause, cause))
    return organizationMatchesLocation && organizationMatchesCause
  }), [cause, location, organizations])

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-[#242424]">
      <SiteHeader authUser={authUser} onLogin={onLogin} onLogout={onLogout} onOpenOng={onOpenOng} onRegister={onRegister} onRegisterOng={onRegisterOng} />

      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        <section className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_5px_24px_rgba(0,80,0,0.08)]">
          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10 lg:max-w-2xl lg:px-12 lg:py-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#009900]">Projetos que aproximam</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#194719] sm:text-4xl">Encontre uma forma de fazer parte.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#667066]">Explore iniciativas sociais, conheça quem está por trás delas e descubra oportunidades de impacto na sua comunidade.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-medium text-[#3f6e3f]">
              <span className="rounded-full bg-[#eef8ee] px-3 py-2">{publishedProjects.length} projetos publicados</span>
              <span className="rounded-full bg-[#eef8ee] px-3 py-2">Comunidade em movimento</span>
            </div>
          </div>
          <div aria-hidden="true" className="absolute -right-14 -top-20 hidden h-80 w-80 rounded-full bg-[#e5f4e4] lg:block" />
          <div aria-hidden="true" className="absolute right-16 top-12 hidden h-52 w-52 rounded-full border-[34px] border-[#b9e3b8] lg:block" />
          <div aria-hidden="true" className="absolute bottom-0 right-0 hidden h-28 w-72 rounded-tl-[100%] bg-[#009900] lg:block" />
        </section>

        <section className="mt-8" aria-label="Busca e filtros de projetos">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Descubra oportunidades</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#254925]">Projetos para você</h2>
            </div>
            <p className="text-xs text-[#747d74]">{filteredProjects.length} {filteredProjects.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[#e1ebe0] bg-white p-3 shadow-[0_3px_12px_rgba(0,80,0,0.05)] sm:grid-cols-[170px_170px_minmax(0,1fr)]">
            <label className="sr-only" htmlFor="location">Localização</label>
            <select className="h-10 w-full border border-[#e1e5e1] bg-[#fbfdfb] px-3 text-sm text-[#555] outline-none transition-colors focus:border-[#009900] focus:ring-2 focus:ring-[#d9f0d8]" id="location" onChange={(event) => setLocation(event.target.value)} value={location}>
              <option value="">Todas as localizações</option>
              {LOCATIONS.map((availableLocation) => <option key={availableLocation} value={availableLocation}>{availableLocation}</option>)}
            </select>

            <label className="sr-only" htmlFor="cause">Causa</label>
            <select className="h-10 w-full border border-[#e1e5e1] bg-[#fbfdfb] px-3 text-sm text-[#555] outline-none transition-colors focus:border-[#009900] focus:ring-2 focus:ring-[#d9f0d8]" id="cause" onChange={(event) => setCause(event.target.value)} value={cause}>
              <option value="">Todas as causas</option>
              {CAUSES.map((availableCause) => <option key={availableCause} value={availableCause}>{availableCause}</option>)}
            </select>

            <label className="relative block" htmlFor="search">
              <span className="sr-only">Buscar projetos</span>
              <input className="h-10 w-full border border-[#e1e5e1] bg-[#fbfdfb] px-4 pr-11 text-sm text-[#444] outline-none placeholder:text-[#8d968d] transition-colors focus:border-[#009900] focus:ring-2 focus:ring-[#d9f0d8]" id="search" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome do projeto" type="search" value={search} />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718071]"><SearchIcon /></span>
            </label>
          </div>
        </section>

        <section aria-label="Projetos disponíveis" className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {filteredProjects.map((project) => <ProjectCard key={project.id} onOpen={onOpenProject} project={project} />)}
        </section>

        {filteredProjects.length === 0 && (
          <p className="mt-6 rounded-2xl border border-[#e1ebe0] bg-white p-8 text-center text-sm text-[#666]">Nenhum projeto encontrado.</p>
        )}

        <section className="mt-12" aria-label="ONGs publicadas">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Conheça quem faz acontecer</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#254925]">ONGs publicadas</h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-[#747d74]">{filteredOrganizations.length} {filteredOrganizations.length === 1 ? 'ONG encontrada' : 'ONGs encontradas'} com este filtro.</p>
          </div>

          {filteredOrganizations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filteredOrganizations.map((organization) => <OrganizationCard key={organization.id} onOpen={onOpenOrganization} organization={organization} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#b9d6b8] bg-white p-8 text-center text-sm text-[#687268]">Nenhuma ONG encontrada para os filtros selecionados.</div>
          )}
        </section>
      </main>
    </div>
  )
}
