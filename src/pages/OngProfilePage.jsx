import { useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import { DEFAULT_ONG_IMAGE } from '../data/organizations.js'
import { getVacancyCount, readOrganizationProjects } from '../lib/storage.js'

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'

function handleImageError(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = DEFAULT_ONG_IMAGE
}

function ProjectPreview({ onOpen, project }) {
  const projectName = project.name || project.title || 'Projeto da ONG'
  const vacancyCount = getVacancyCount(project)

  return (
    <article className="overflow-hidden border border-[#e0e9df] bg-white shadow-[0_3px_10px_rgba(0,80,0,0.05)]">
      <button aria-label={`Abrir projeto ${projectName}`} className="block aspect-[16/9] w-full overflow-hidden bg-[#e8f0e7] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#009900]" onClick={() => onOpen(project)} type="button">
        <img alt={`Imagem do projeto ${projectName}`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = DEFAULT_PROJECT_IMAGE }} src={project.image || DEFAULT_PROJECT_IMAGE} />
      </button>
      <div className="p-5">
        <button className="block text-left text-lg font-semibold text-[#2c2c2c] transition-colors hover:text-[#009900] focus:outline-none focus:text-[#009900]" onClick={() => onOpen(project)} type="button">{projectName}</button>
        <p className="mt-2 text-xs text-[#697369]">{project.location || 'Localização não informada'}{project.date ? ` · ${project.date}` : ''}</p>
        {project.cause && <p className="mt-1 text-[11px] font-semibold text-[#287028]">{project.cause}</p>}
        <p className="mt-3 text-sm leading-6 text-[#5d5d5d]">{project.description || 'Conheça esta iniciativa da organização.'}</p>
        <p className="mt-4 text-xs font-semibold text-[#287028]">{vacancyCount} {vacancyCount === 1 ? 'vaga disponível' : 'vagas disponíveis'}</p>
      </div>
    </article>
  )
}

export default function OngProfilePage({ onBack, onOpenProject, organization }) {
  const [organizationProjects] = useState(() => organization ? readOrganizationProjects(organization.id).filter((project) => project.published !== false) : [])
  const name = organization?.organizationName || organization?.name || 'ONG sem nome'
  const description = organization?.description || 'Esta ONG ainda não adicionou uma descrição.'
  const history = organization?.history || 'Esta ONG ainda não adicionou sua história.'
  const totalVacancies = organizationProjects.reduce((total, project) => total + getVacancyCount(project), 0)

  if (!organization) {
    return (
      <div className="min-h-screen bg-[#f4f8f3] text-[#242424]">
        <SiteHeader onBack={onBack} sectionLabel="Página da ONG" />
        <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          <section className="bg-white p-8 text-center shadow-[0_3px_12px_rgba(0,80,0,0.08)] sm:p-12">
            <h1 className="text-2xl font-semibold text-[#2c2c2c]">ONG não encontrada</h1>
            <p className="mt-3 text-sm text-[#666]">Esta página de ONG não está disponível.</p>
            <button className="mt-6 bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={onBack} type="button">Voltar aos projetos</button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-[#242424]">
      <SiteHeader onBack={onBack} sectionLabel="Página da ONG" />

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <section className="overflow-hidden bg-white shadow-[0_5px_20px_rgba(0,80,0,0.08)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="aspect-[4/3] min-h-64 bg-[#e8f0e7] lg:aspect-auto lg:min-h-[340px]">
              <img alt={`Foto da ONG ${name}`} className="h-full w-full object-cover" onError={handleImageError} src={organization.profileImage || DEFAULT_ONG_IMAGE} />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Perfil público</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#214921] sm:text-4xl">{name}</h1>
              <p className="mt-3 text-sm text-[#687268]">{organization.location || 'Localização não informada'}</p>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#566056]">{description}</p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="bg-white p-6 shadow-[0_3px_12px_rgba(0,80,0,0.07)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Nossa história</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2c2c2c]">Por que existimos</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d5d5d]">{history}</p>

            <h2 className="mt-8 text-2xl font-semibold text-[#2c2c2c]">Sobre a organização</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d5d5d]">{description}</p>
          </section>

          <aside className="h-fit bg-white p-6 shadow-[0_3px_12px_rgba(0,80,0,0.07)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Informações</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2c2c2c]">Esta ONG</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="border-b border-[#e7eee6] pb-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Localização</dt>
                <dd className="mt-1.5 text-[#444]">{organization.location || 'Não informada'}</dd>
              </div>
              <div className="border-b border-[#e7eee6] pb-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Contato</dt>
                <dd className="mt-1.5 break-all text-[#444]">{organization.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Vagas abertas</dt>
                <dd className="mt-1.5 text-[#444]">{totalVacancies} {totalVacancies === 1 ? 'oportunidade publicada' : 'oportunidades publicadas'}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">O que fazemos</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#214921]">Projetos e eventos</h2>
            </div>
            <p className="text-xs text-[#747d74]">{organizationProjects.length} {organizationProjects.length === 1 ? 'projeto publicado' : 'projetos publicados'}</p>
          </div>

          {organizationProjects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {organizationProjects.map((project) => <ProjectPreview key={project.id} onOpen={onOpenProject} project={project} />)}
            </div>
          ) : (
            <div className="bg-white p-8 text-center text-sm text-[#666] shadow-[0_3px_12px_rgba(0,80,0,0.07)]">Esta ONG ainda não publicou projetos.</div>
          )}
        </section>
      </main>
    </div>
  )
}
