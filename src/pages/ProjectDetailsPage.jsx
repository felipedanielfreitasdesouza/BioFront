import SiteHeader from '../components/SiteHeader.jsx'
import { getVacancyCount } from '../lib/storage.js'

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'

function InfoItem({ label, value }) {
  return (
    <div className="border-b border-[#e7e7e7] pb-4 last:border-b-0 last:pb-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888]">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-[#444]">{value || 'Não informado'}</p>
    </div>
  )
}

function handleImageError(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = DEFAULT_PROJECT_IMAGE
}

function VacancyDetailsCard({ vacancy }) {
  const title = vacancy.title || vacancy.name || 'Vaga de voluntariado'
  const quantity = Number(vacancy.quantity || vacancy.vacancies || 0)

  return (
    <article className="border border-[#e0e9df] bg-white p-5 shadow-[0_3px_10px_rgba(0,80,0,0.05)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#009900]">Vaga disponível</p>
          <h3 className="mt-1 text-lg font-semibold text-[#2c2c2c]">{title}</h3>
        </div>
        <span className="rounded-full bg-[#eef8ee] px-3 py-1 text-xs font-semibold text-[#287028]">{quantity} {quantity === 1 ? 'vaga' : 'vagas'}</span>
      </div>

      {vacancy.requirements && (
        <p className="mt-4 border-y border-[#e7eee6] py-3 text-xs leading-5 text-[#697369]"><strong className="font-semibold text-[#4e5d4e]">Requisitos:</strong> {vacancy.requirements}</p>
      )}
      <p className="mt-4 text-sm leading-6 text-[#5d5d5d]">{vacancy.description || 'A ONG ainda não adicionou uma descrição para esta vaga.'}</p>
      {vacancy.contact && <p className="mt-4 text-xs text-[#697369]">Contato: {vacancy.contact}</p>}
    </article>
  )
}

export default function ProjectDetailsPage({ onBack, project }) {
  const vacancies = Array.isArray(project?.vacancies) ? project.vacancies : []
  const vacancyCount = getVacancyCount(project)
  const projectOrganization = project?.organization || project?.organizationName || 'ONG responsável'

  if (!project) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] text-[#242424]">
        <SiteHeader onBack={onBack} sectionLabel="Detalhes do projeto" />
        <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
          <section className="bg-white p-8 text-center shadow-[0_3px_8px_rgba(0,0,0,0.12)] sm:p-12">
            <h1 className="text-2xl font-semibold text-[#2c2c2c]">Projeto não encontrado</h1>
            <p className="mt-3 text-sm text-[#666]">Não foi possível encontrar os detalhes deste projeto.</p>
            <button className="mt-6 bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={onBack} type="button">Voltar aos projetos</button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9] text-[#242424]">
      <SiteHeader onBack={onBack} sectionLabel="Detalhes do projeto" />

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <article className="overflow-hidden bg-white shadow-[0_3px_8px_rgba(0,0,0,0.12)]">
          <div className="grid lg:grid-cols-[minmax(280px,0.9fr)_1.1fr]">
            <div className="aspect-[4/3] min-h-64 bg-[#e8e5df] lg:aspect-auto lg:min-h-[360px]">
              <img alt={`Imagem do projeto ${project.name || project.title}`} className="h-full w-full object-cover" onError={handleImageError} src={project.image || DEFAULT_PROJECT_IMAGE} />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">{project.cause || 'Projeto social'}</p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight text-[#2c2c2c] sm:text-3xl">{project.name || project.title}</h1>
              <p className="mt-2 text-sm text-[#666]">Publicado por {projectOrganization}</p>
              <p className="mt-6 text-sm leading-7 text-[#555]">{project.description || 'A ONG ainda não adicionou uma descrição para este projeto.'}</p>
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="bg-white p-6 shadow-[0_3px_8px_rgba(0,0,0,0.1)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Sobre a iniciativa</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2c2c2c]">Conheça o projeto</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d5d5d]">{project.description || 'A ONG ainda não adicionou uma descrição para este projeto.'}</p>

            <h2 className="mt-8 text-2xl font-semibold text-[#2c2c2c]">Como surgiu</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d5d5d]">{project.origin || 'A história deste projeto ainda não foi adicionada.'}</p>
          </section>

          <aside className="h-fit bg-white p-6 shadow-[0_3px_8px_rgba(0,0,0,0.1)] sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Informações</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#2c2c2c]">Sobre o projeto</h2>
            <div className="mt-6 space-y-4">
              <InfoItem label="Data e horário" value={project.date || project.createdAt} />
              <InfoItem label="Localização" value={project.location} />
              <InfoItem label="Causa" value={project.cause} />
              <InfoItem label="ONG responsável" value={projectOrganization} />
              <InfoItem label="Vagas disponíveis" value={`${vacancyCount} ${vacancyCount === 1 ? 'oportunidade' : 'oportunidades'}`} />
            </div>
          </aside>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#009900]">Participe deste projeto</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#214921]">Vagas disponíveis</h2>
            </div>
            <p className="text-xs text-[#747d74]">{vacancyCount} {vacancyCount === 1 ? 'vaga' : 'vagas'} no total</p>
          </div>

          {vacancies.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {vacancies.map((vacancy) => <VacancyDetailsCard key={vacancy.id} vacancy={vacancy} />)}
            </div>
          ) : (
            <div className="bg-white p-8 text-center text-sm text-[#666] shadow-[0_3px_12px_rgba(0,80,0,0.07)]">As vagas deste projeto ainda não foram detalhadas.</div>
          )}
        </section>
      </main>
    </div>
  )
}
