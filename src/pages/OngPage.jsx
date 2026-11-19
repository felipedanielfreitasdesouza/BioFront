import { useEffect, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import { CAUSES, LOCATIONS } from '../data/catalogs.js'
import { DEFAULT_ONG_IMAGE } from '../data/organizations.js'
import { getProjectsStorageKey, getVacancyCount, readOrganizationProjects, writeStorage } from '../lib/storage.js'

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'

const emptyProjectForm = {
  name: '',
  image: '',
  description: '',
  origin: '',
  date: '',
  location: '',
  cause: '',
}

const emptyVacancyForm = {
  title: '',
  quantity: '',
  requirements: '',
  description: '',
  contact: '',
}

function getProjectForm(project) {
  return {
    name: project?.name || '',
    image: project?.image || '',
    description: project?.description || '',
    origin: project?.origin || '',
    date: project?.date || '',
    location: project?.location || '',
    cause: project?.cause || '',
  }
}

function getProfileForm(user) {
  return {
    organizationName: user?.organizationName || user?.name || '',
    location: user?.location || '',
    cause: user?.cause || '',
    profileImage: user?.profileImage || '',
    description: user?.description || '',
    history: user?.history || '',
  }
}

function handleImageError(event, fallback = DEFAULT_ONG_IMAGE) {
  event.currentTarget.onerror = null
  event.currentTarget.src = fallback
}

function Field({ label, name, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block text-sm font-medium text-[#444]" htmlFor={`ong-${name}`}>
      {label}
      <input
        className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]"
        id={`ong-${name}`}
        name={name}
        onChange={onChange}
        type={type}
        value={value}
        {...props}
      />
    </label>
  )
}

function TextAreaField({ label, name, value, onChange, className = '', ...props }) {
  return (
    <label className={`block text-sm font-medium text-[#444] ${className}`} htmlFor={`ong-${name}`}>
      {label}
      <textarea className="mt-1.5 min-h-28 w-full resize-y border border-[#d0d8ce] bg-white px-3 py-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id={`ong-${name}`} name={name} onChange={onChange} value={value} {...props} />
    </label>
  )
}

function SelectField({ label, name, value, onChange, options, placeholder }) {
  return (
    <label className="block text-sm font-medium text-[#444]" htmlFor={`ong-${name}`}>
      {label}
      <select className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id={`ong-${name}`} name={name} onChange={onChange} required value={value}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function ManagedProjectCard({ project, onEdit, onManageVacancies }) {
  const projectName = project.name || 'Projeto sem nome'
  const vacancyCount = getVacancyCount(project)

  return (
    <article className="overflow-hidden bg-white shadow-[0_3px_8px_rgba(0,0,0,0.1)]">
      <div className="grid sm:grid-cols-[180px_1fr]">
        <div className="aspect-[4/3] bg-[#e8f0e7] sm:aspect-auto sm:min-h-[170px]">
          <img alt={`Imagem do projeto ${projectName}`} className="h-full w-full object-cover" onError={(event) => handleImageError(event, DEFAULT_PROJECT_IMAGE)} src={project.image || DEFAULT_PROJECT_IMAGE} />
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#009900]">Projeto / evento</p>
              <h3 className="mt-1 text-xl font-semibold text-[#2c2c2c]">{projectName}</h3>
            </div>
            <span className="rounded-full bg-[#eef8ee] px-3 py-1 text-xs font-semibold text-[#287028]">{vacancyCount} {vacancyCount === 1 ? 'vaga' : 'vagas'}</span>
          </div>
          <p className="mt-2 text-xs text-[#707a70]">{project.location || 'Localização não informada'}{project.date ? ` · ${project.date}` : ''}</p>
          <p className="mt-4 text-sm leading-6 text-[#5d5d5d]">{project.description || 'Adicione uma descrição para apresentar este projeto.'}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="bg-[#009900] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={() => onManageVacancies(project)} type="button">Gerenciar vagas</button>
            <button className="border border-[#009900] px-4 py-2 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#eef8ee]" onClick={() => onEdit(project)} type="button">Editar projeto</button>
          </div>
        </div>
      </div>
    </article>
  )
}

function ProjectModal({ project, form, onChange, onClose, onSubmit }) {
  const isEditing = Boolean(project)

  return (
    <div aria-labelledby="project-modal-title" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4" role="dialog" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form className="my-8 w-full max-w-2xl bg-white p-6 shadow-2xl sm:p-8" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Página da ONG</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#242424]" id="project-modal-title">{isEditing ? 'Editar projeto' : 'Novo projeto / evento'}</h2>
            <p className="mt-2 text-sm text-[#666]">Depois de criar o projeto, você poderá adicionar várias vagas dentro dele.</p>
          </div>
          <button aria-label="Fechar" className="text-2xl leading-none text-[#777] transition-colors hover:text-[#009900]" onClick={onClose} type="button">×</button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Nome do projeto ou evento" name="name" onChange={onChange} value={form.name} required /></div>
          <SelectField label="Local" name="location" onChange={onChange} options={LOCATIONS} placeholder="Selecione uma localização" value={form.location} />
          <Field label="Data e horário" name="date" onChange={onChange} value={form.date} required />
          <SelectField label="Causa" name="cause" onChange={onChange} options={CAUSES} placeholder="Selecione uma causa" value={form.cause} />
          <Field label="Foto do projeto (URL)" name="image" onChange={onChange} type="url" value={form.image} placeholder="https://..." />
          <TextAreaField className="sm:col-span-2" label="Descrição do projeto" name="description" onChange={onChange} value={form.description} required />
          <TextAreaField className="sm:col-span-2" label="Como surgiu" name="origin" onChange={onChange} value={form.origin} required />
        </div>

        <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button className="px-5 py-3 text-sm font-semibold text-[#666] hover:text-[#009900]" onClick={onClose} type="button">Cancelar</button>
          <button className="bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" type="submit">{isEditing ? 'Salvar projeto' : 'Criar projeto'}</button>
        </div>
      </form>
    </div>
  )
}

function VacancyModal({ project, vacancy, form, onChange, onClose, onSubmit }) {
  const isEditing = Boolean(vacancy)

  return (
    <div aria-labelledby="vacancy-modal-title" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4" role="dialog" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form className="my-8 w-full max-w-2xl bg-white p-6 shadow-2xl sm:p-8" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Vaga do projeto</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#242424]" id="vacancy-modal-title">{isEditing ? 'Editar vaga' : 'Adicionar vaga'}</h2>
            <p className="mt-2 text-sm text-[#666]">Defina o tipo de ajuda que as pessoas poderão oferecer neste projeto.</p>
          </div>
          <button aria-label="Fechar" className="text-2xl leading-none text-[#777] transition-colors hover:text-[#009900]" onClick={onClose} type="button">×</button>
        </div>

        <div className="mt-6 grid gap-3 border border-[#d9ead8] bg-[#f4faf3] p-4 text-xs text-[#596659] sm:grid-cols-3">
          <div><span className="font-semibold text-[#287028]">Projeto:</span> {project?.name}</div>
          <div><span className="font-semibold text-[#287028]">Local:</span> {project?.location}</div>
          <div><span className="font-semibold text-[#287028]">Causa:</span> {project?.cause}</div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Nome da vaga / função" name="title" onChange={onChange} value={form.title} placeholder="Ex.: Apoio na organização" required /></div>
          <Field label="Quantidade de pessoas" name="quantity" onChange={onChange} type="number" value={form.quantity} min="1" required />
          <Field label="Contato" name="contact" onChange={onChange} value={form.contact} required />
          <TextAreaField className="sm:col-span-2" label="O que a pessoa fará" name="description" onChange={onChange} value={form.description} required />
          <TextAreaField className="sm:col-span-2" label="Requisitos ou informações importantes" name="requirements" onChange={onChange} value={form.requirements} placeholder="Ex.: disponibilidade no período da manhã" />
        </div>

        <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button className="px-5 py-3 text-sm font-semibold text-[#666] hover:text-[#009900]" onClick={onClose} type="button">Cancelar</button>
          <button className="bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" type="submit">{isEditing ? 'Salvar vaga' : 'Adicionar vaga'}</button>
        </div>
      </form>
    </div>
  )
}

function ManagedVacancyCard({ vacancy, onEdit }) {
  const title = vacancy.title || vacancy.name || 'Vaga de voluntariado'
  const quantity = Number(vacancy.quantity || vacancy.vacancies || 0)

  return (
    <article className="border border-[#e0e9df] bg-white p-5 shadow-[0_3px_10px_rgba(0,80,0,0.05)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#009900]">Vaga</p>
          <h3 className="mt-1 text-lg font-semibold text-[#2c2c2c]">{title}</h3>
        </div>
        <button className="border border-[#009900] px-3 py-1.5 text-xs font-semibold text-[#009900] transition-colors hover:bg-[#009900] hover:text-white" onClick={() => onEdit(vacancy)} type="button">Editar</button>
      </div>
      <p className="mt-3 text-xs font-semibold text-[#287028]">{quantity} {quantity === 1 ? 'pessoa' : 'pessoas'} necessárias</p>
      <p className="mt-3 text-sm leading-6 text-[#5d5d5d]">{vacancy.description}</p>
      {vacancy.requirements && <p className="mt-3 text-xs leading-5 text-[#697369]"><strong className="font-semibold text-[#4e5d4e]">Requisitos:</strong> {vacancy.requirements}</p>}
      <p className="mt-3 text-xs text-[#697369]">Contato: {vacancy.contact}</p>
    </article>
  )
}

function ProjectVacancyManager({ project, onBack, onEditProject, onAddVacancy, onEditVacancy }) {
  const vacancies = Array.isArray(project.vacancies) ? project.vacancies : []
  const projectName = project.name || 'Projeto sem nome'

  return (
    <section>
      <button className="mb-5 text-sm font-semibold text-[#009900] hover:underline" onClick={onBack} type="button">← Voltar para projetos</button>
      <div className="bg-white p-6 shadow-[0_3px_8px_rgba(0,0,0,0.1)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e7e7e7] pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Gerenciar projeto</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#2c2c2c]">{projectName}</h2>
            <p className="mt-2 text-sm text-[#666]">{project.location || 'Localização não informada'}{project.date ? ` · ${project.date}` : ''}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="border border-[#009900] px-4 py-2 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#eef8ee]" onClick={() => onEditProject(project)} type="button">Editar projeto</button>
            <button className="bg-[#009900] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={onAddVacancy} type="button">+ Adicionar vaga</button>
          </div>
        </div>
        <p className="mt-6 text-sm leading-7 text-[#5d5d5d]">{project.description || 'Este projeto ainda não possui uma descrição.'}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Oportunidades deste projeto</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#2c2c2c]">Vagas cadastradas</h3>
        </div>
        <p className="text-xs text-[#747d74]">{vacancies.length} {vacancies.length === 1 ? 'tipo de vaga' : 'tipos de vaga'}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {vacancies.length > 0 ? vacancies.map((vacancy) => <ManagedVacancyCard key={vacancy.id} onEdit={onEditVacancy} vacancy={vacancy} />) : (
          <div className="bg-white p-8 text-center text-sm text-[#666] md:col-span-2">Este projeto ainda não possui vagas. Adicione a primeira oportunidade para as pessoas participarem.</div>
        )}
      </div>
    </section>
  )
}

function ProfileEditor({ form, feedback, onChange, onCancel, onSubmit }) {
  return (
    <form className="bg-white p-6 shadow-[0_3px_8px_rgba(0,0,0,0.12)] sm:p-8" onSubmit={onSubmit}>
      <div className="border-b border-[#e7e7e7] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Página pública</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#2c2c2c]">Editar perfil da ONG</h2>
        <p className="mt-2 text-sm leading-6 text-[#666]">Essas informações aparecem na página pública e na lista de ONGs da página principal.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Field label="Nome da ONG" name="organizationName" onChange={onChange} value={form.organizationName} required />
        <SelectField label="Localização" name="location" onChange={onChange} options={LOCATIONS} placeholder="Selecione uma localização" value={form.location} />
        <SelectField label="Causa principal" name="cause" onChange={onChange} options={CAUSES} placeholder="Selecione uma causa" value={form.cause} />
        <div className="sm:col-span-2"><Field label="Foto da ONG (URL)" name="profileImage" onChange={onChange} type="url" value={form.profileImage} placeholder="https://..." /></div>
        <TextAreaField className="sm:col-span-2" label="Descrição curta" name="description" onChange={onChange} value={form.description} required />
        <TextAreaField className="sm:col-span-2" label="História da ONG" name="history" onChange={onChange} value={form.history} required />
      </div>

      {feedback && <p className={`mt-5 text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-[#16803c]'}`} role="alert">{feedback.message}</p>}

      <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button className="px-5 py-3 text-sm font-semibold text-[#666] hover:text-[#009900]" onClick={onCancel} type="button">Cancelar</button>
        <button className="bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" type="submit">Salvar perfil</button>
      </div>
    </form>
  )
}

export default function OngPage({ onBack, onOpenPublicProfile, onUserUpdate, user }) {
  const isOng = user?.role === 'ong'
  const projectsStorageKey = getProjectsStorageKey(user?.id)
  const [activeView, setActiveView] = useState('projetos')
  const [projectsOwned, setProjectsOwned] = useState(() => isOng ? readOrganizationProjects(user.id) : [])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState(emptyProjectForm)
  const [isVacancyEditorOpen, setIsVacancyEditorOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState(null)
  const [vacancyForm, setVacancyForm] = useState(emptyVacancyForm)
  const [profileForm, setProfileForm] = useState(() => getProfileForm(user))
  const [profileFeedback, setProfileFeedback] = useState(null)
  const organizationName = user?.organizationName || user?.name || 'Nome ONG'
  const organizationEmail = user?.email || 'contato@nomeong.org.br'
  const organizationLocation = user?.location || 'Localização não informada'
  const organizationDescription = user?.description || 'Somos uma organização dedicada a conectar pessoas, iniciativas e oportunidades que geram impacto positivo na comunidade.'
  const organizationHistory = user?.history || organizationDescription
  const organizationImage = user?.profileImage || DEFAULT_ONG_IMAGE
  const selectedProject = projectsOwned.find((project) => String(project.id) === String(selectedProjectId))

  useEffect(() => {
    if (isOng) writeStorage(projectsStorageKey, projectsOwned)
  }, [isOng, projectsOwned, projectsStorageKey])

  useEffect(() => {
    setProfileForm(getProfileForm(user))
  }, [user?.id])

  function openProjectForm(project = null) {
    setEditingProject(project)
    setProjectForm(project ? getProjectForm(project) : { ...emptyProjectForm })
    setIsProjectEditorOpen(true)
  }

  function closeProjectForm() {
    setIsProjectEditorOpen(false)
    setEditingProject(null)
    setProjectForm({ ...emptyProjectForm })
  }

  function handleProjectChange(event) {
    const { name, value } = event.target
    setProjectForm((current) => ({ ...current, [name]: value }))
  }

  function handleProjectSubmit(event) {
    event.preventDefault()
    const nextProject = {
      ...projectForm,
      id: editingProject?.id || `project-${user.id}-${Date.now()}`,
      organizationId: user.id,
      image: projectForm.image.trim() || DEFAULT_PROJECT_IMAGE,
      name: projectForm.name.trim(),
      description: projectForm.description.trim(),
      origin: projectForm.origin.trim(),
      date: projectForm.date.trim(),
      location: projectForm.location.trim(),
      cause: projectForm.cause.trim(),
      published: true,
      vacancies: editingProject?.vacancies || [],
    }

    setProjectsOwned((current) => editingProject ? current.map((project) => project.id === editingProject.id ? nextProject : project) : [...current, nextProject])
    closeProjectForm()
    setActiveView('projetos')
  }

  function openVacancyForm(vacancy = null) {
    setEditingVacancy(vacancy)
    setVacancyForm(vacancy ? {
      title: vacancy.title || vacancy.name || '',
      quantity: String(vacancy.quantity || vacancy.vacancies || ''),
      requirements: vacancy.requirements || '',
      description: vacancy.description || '',
      contact: vacancy.contact || '',
    } : { ...emptyVacancyForm })
    setIsVacancyEditorOpen(true)
  }

  function closeVacancyForm() {
    setIsVacancyEditorOpen(false)
    setEditingVacancy(null)
    setVacancyForm({ ...emptyVacancyForm })
  }

  function handleVacancyChange(event) {
    const { name, value } = event.target
    setVacancyForm((current) => ({ ...current, [name]: value }))
  }

  function handleVacancySubmit(event) {
    event.preventDefault()
    if (!selectedProject) return

    const nextVacancy = {
      ...vacancyForm,
      id: editingVacancy?.id || `vacancy-${user.id}-${Date.now()}`,
      title: vacancyForm.title.trim(),
      quantity: Number(vacancyForm.quantity),
      requirements: vacancyForm.requirements.trim(),
      description: vacancyForm.description.trim(),
      contact: vacancyForm.contact.trim(),
    }

    setProjectsOwned((current) => current.map((project) => {
      if (project.id !== selectedProject.id) return project
      const currentVacancies = Array.isArray(project.vacancies) ? project.vacancies : []
      const nextVacancies = editingVacancy ? currentVacancies.map((vacancy) => vacancy.id === editingVacancy.id ? nextVacancy : vacancy) : [...currentVacancies, nextVacancy]
      return { ...project, vacancies: nextVacancies }
    }))
    closeVacancyForm()
  }

  function handleProfileChange(event) {
    const { name, value } = event.target
    setProfileForm((current) => ({ ...current, [name]: value }))
    setProfileFeedback(null)
  }

  function handleProfileSubmit(event) {
    event.preventDefault()
    const organizationNameValue = profileForm.organizationName.trim()
    const locationValue = profileForm.location.trim()
    const causeValue = profileForm.cause.trim()
    const descriptionValue = profileForm.description.trim()
    const historyValue = profileForm.history.trim()

    if (!organizationNameValue || !locationValue || !causeValue || !descriptionValue || !historyValue) {
      setProfileFeedback({ type: 'error', message: 'Preencha nome, localização, causa, descrição e história da ONG.' })
      return
    }

    const nextProfile = {
      organizationName: organizationNameValue,
      name: organizationNameValue,
      location: locationValue,
      cause: causeValue,
      description: descriptionValue,
      history: historyValue,
      profileImage: profileForm.profileImage.trim() || DEFAULT_ONG_IMAGE,
    }

    onUserUpdate(nextProfile)
    setProfileForm({ ...profileForm, ...nextProfile })
    setProfileFeedback({ type: 'success', message: 'Perfil da ONG atualizado com sucesso.' })
    setActiveView('perfil')
  }

  if (!isOng) {
    return (
      <div className="min-h-screen bg-[#d9d9d9] text-[#242424]">
        <SiteHeader onBack={onBack} sectionLabel="Área da ONG" />
        <main className="mx-auto flex max-w-2xl items-center justify-center px-5 py-20 sm:px-8">
          <section className="w-full bg-white p-8 text-center shadow-[0_3px_8px_rgba(0,0,0,0.12)] sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Acesso restrito</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#2c2c2c]">Área exclusiva para perfis de ONG</h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#666]">Entre com um perfil de ONG para criar projetos, publicar vagas e administrar a página da organização.</p>
            <button className="mt-7 bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={onBack} type="button">Voltar ao início</button>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9] text-[#242424]">
      <SiteHeader onBack={onBack} sectionLabel="Área da ONG" />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[230px_1fr] lg:px-10">
        <aside className="h-fit bg-white p-5 shadow-[0_3px_8px_rgba(0,0,0,0.1)]">
          <div className="border-b border-[#e8e8e8] pb-5">
            <img alt="" className="h-16 w-16 rounded-full object-cover" onError={(event) => handleImageError(event)} src={organizationImage} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">Perfil da ONG</p>
            <h1 className="mt-2 text-xl font-semibold text-[#2c2c2c]">{organizationName}</h1>
            <p className="mt-1 break-all text-xs text-[#777]">{organizationEmail}</p>
          </div>

          <nav aria-label="Navegação da ONG" className="mt-5 space-y-2">
            <button className={`w-full px-3 py-3 text-left text-sm font-semibold transition-colors ${activeView === 'projetos' || activeView === 'vagas' ? 'bg-[#009900] text-white' : 'text-[#555] hover:bg-[#eef8ee]'}`} onClick={() => { setSelectedProjectId(null); setActiveView('projetos') }} type="button">Gerenciar Projetos</button>
            <button className={`w-full px-3 py-3 text-left text-sm font-semibold transition-colors ${activeView === 'perfil' ? 'bg-[#009900] text-white' : 'text-[#555] hover:bg-[#eef8ee]'}`} onClick={() => setActiveView('perfil')} type="button">Visualizar Perfil</button>
            <button className={`w-full px-3 py-3 text-left text-sm font-semibold transition-colors ${activeView === 'editar' ? 'bg-[#009900] text-white' : 'text-[#555] hover:bg-[#eef8ee]'}`} onClick={() => { setProfileFeedback(null); setActiveView('editar') }} type="button">Editar Perfil</button>
          </nav>
        </aside>

        <section>
          {activeView === 'projetos' && (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Painel da ONG</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#2c2c2c]">Gerenciar Projetos</h2>
                  <p className="mt-2 text-sm text-[#666]">Crie projetos ou eventos e, dentro deles, adicione as vagas para voluntários.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="border border-[#009900] px-4 py-3 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#eef8ee]" onClick={() => onOpenPublicProfile(user)} type="button">Ver página pública</button>
                  <button className="bg-[#009900] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007d00]" onClick={() => openProjectForm()} type="button">+ Novo projeto</button>
                </div>
              </div>

              <div className="space-y-5">
                {projectsOwned.length > 0 ? projectsOwned.map((project) => <ManagedProjectCard key={project.id} onEdit={openProjectForm} onManageVacancies={(nextProject) => { setSelectedProjectId(nextProject.id); setActiveView('vagas') }} project={project} />) : (
                  <div className="bg-white p-8 text-center shadow-[0_3px_8px_rgba(0,0,0,0.1)]">
                    <p className="text-sm text-[#666]">Nenhum projeto criado ainda.</p>
                    <button className="mt-4 border border-[#009900] px-4 py-2 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#009900] hover:text-white" onClick={() => openProjectForm()} type="button">Criar primeiro projeto</button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === 'vagas' && selectedProject && (
            <ProjectVacancyManager onAddVacancy={() => openVacancyForm()} onBack={() => { setSelectedProjectId(null); setActiveView('projetos') }} onEditProject={openProjectForm} onEditVacancy={openVacancyForm} project={selectedProject} />
          )}

          {activeView === 'perfil' && (
            <section className="bg-white p-6 shadow-[0_3px_8px_rgba(0,0,0,0.12)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#e7e7e7] pb-6">
                <div className="flex min-w-0 items-center gap-4">
                  <img alt={`Foto da ONG ${organizationName}`} className="h-20 w-20 rounded-full object-cover" onError={(event) => handleImageError(event)} src={organizationImage} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">Perfil público</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#2c2c2c]">{organizationName}</h2>
                    <p className="mt-2 text-sm text-[#666]">{organizationLocation}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="border border-[#009900] px-4 py-2 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#009900] hover:text-white" onClick={() => onOpenPublicProfile(user)} type="button">Abrir página pública</button>
                  <button className="border border-[#009900] px-4 py-2 text-sm font-semibold text-[#009900] transition-colors hover:bg-[#009900] hover:text-white" onClick={() => setActiveView('editar')} type="button">Editar Perfil</button>
                </div>
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Contato</p><p className="mt-2 break-all text-[#444]">{organizationEmail}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Causa principal</p><p className="mt-2 text-[#444]">{user?.cause || 'Não informada'}</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Projetos publicados</p><p className="mt-2 text-[#444]">{projectsOwned.length} {projectsOwned.length === 1 ? 'projeto' : 'projetos'}</p></div>
                <div className="sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Descrição</p><p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d5d5d]">{organizationDescription}</p></div>
                <div className="sm:col-span-2"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#888]">Nossa história</p><p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d5d5d]">{organizationHistory}</p></div>
              </div>
            </section>
          )}

          {activeView === 'editar' && <ProfileEditor form={profileForm} feedback={profileFeedback} onCancel={() => setActiveView('perfil')} onChange={handleProfileChange} onSubmit={handleProfileSubmit} />}
        </section>
      </main>

      {isProjectEditorOpen && <ProjectModal form={projectForm} onChange={handleProjectChange} onClose={closeProjectForm} onSubmit={handleProjectSubmit} project={editingProject} />}
      {isVacancyEditorOpen && <VacancyModal form={vacancyForm} onChange={handleVacancyChange} onClose={closeVacancyForm} onSubmit={handleVacancySubmit} project={selectedProject} vacancy={editingVacancy} />}
    </div>
  )
}
