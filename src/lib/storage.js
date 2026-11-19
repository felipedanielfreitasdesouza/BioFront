import { demoOrganizations, demoProjectsByOrganization } from '../data/demoData.js'

export const USERS_STORAGE_KEY = 'biofront-users'
export const SESSION_STORAGE_KEY = 'biofront-session'
export const PROJECTS_STORAGE_PREFIX = 'biofront-projects:'
export const DEMO_SEED_STORAGE_KEY = 'biofront-demo-seeded-v1'
export const SONIC_CLEANUP_STORAGE_KEY = 'biofront-sonic-test-cleaned-v1'
const LEGACY_VACANCIES_PREFIX = 'biofront-vacancies:'
const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'

export function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // A página continua navegável mesmo se o armazenamento estiver bloqueado.
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // A página continua navegável mesmo se o armazenamento estiver bloqueado.
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // O estado em memória ainda é atualizado pelo componente chamador.
  }
}

export function getProjectsStorageKey(organizationId) {
  return `${PROJECTS_STORAGE_PREFIX}${organizationId || 'unknown'}`
}

export function getVacancyCount(project) {
  if (Array.isArray(project?.vacancies)) {
    return project.vacancies.reduce((total, vacancy) => total + Number(vacancy.quantity || vacancy.vacancies || 0), 0)
  }

  return Number(project?.vacancies || 0)
}

export function readOrganizationProjects(organizationId) {
  if (!organizationId) return []

  const projectsKey = getProjectsStorageKey(organizationId)
  const savedProjects = readStorage(projectsKey, null)

  if (Array.isArray(savedProjects)) return savedProjects

  const legacyVacancies = readStorage(`${LEGACY_VACANCIES_PREFIX}${organizationId}`, [])

  if (!Array.isArray(legacyVacancies) || legacyVacancies.length === 0) return []

  const migratedProjects = legacyVacancies.map((vacancy) => ({
    id: `project-${vacancy.id}`,
    organizationId,
    name: vacancy.name || 'Projeto da ONG',
    image: DEFAULT_PROJECT_IMAGE,
    description: vacancy.description || 'Projeto criado pela organização.',
    origin: '',
    location: vacancy.location || '',
    date: vacancy.location || '',
    cause: '',
    published: true,
    vacancies: [{
      id: `vacancy-${vacancy.id}`,
      title: 'Voluntariado',
      quantity: Number(vacancy.vacancies || 1),
      requirements: '',
      description: vacancy.description || '',
      contact: vacancy.contact || '',
    }],
  }))

  writeStorage(projectsKey, migratedProjects)
  return migratedProjects
}

export function readPublishedProjects() {
  return readStorage(USERS_STORAGE_KEY, [])
    .filter((organization) => organization.role === 'ong')
    .flatMap((organization) => readOrganizationProjects(organization.id)
      .filter((project) => project.published !== false)
      .map((project) => ({
        ...project,
        organizationId: organization.id,
        organization: organization.organizationName || organization.name,
        organizationLocation: organization.location || '',
        organizationImage: organization.profileImage || '',
        vacancyCount: getVacancyCount(project),
      })))
}

function isSonicOrganization(user) {
  const name = `${user?.organizationName || ''} ${user?.name || ''}`.trim().toLowerCase()
  const email = user?.email?.trim().toLowerCase() || ''
  return name.includes('sonic') || email.includes('sonic')
}

function isSonicProject(project) {
  const name = `${project?.name || ''} ${project?.title || ''}`.trim().toLowerCase()
  return name.includes('sonic frontier 2')
}

export function removeSonicTestData() {
  if (typeof window === 'undefined' || readStorage(SONIC_CLEANUP_STORAGE_KEY, false)) return

  const users = readStorage(USERS_STORAGE_KEY, [])
  const allUsers = Array.isArray(users) ? users : []
  const sonicUsers = allUsers.filter(isSonicOrganization)
  const sonicIds = new Set(sonicUsers.map((user) => String(user.id)))
  const remainingUsers = allUsers.filter((user) => !isSonicOrganization(user))

  if (sonicUsers.length > 0) writeStorage(USERS_STORAGE_KEY, remainingUsers)

  for (const sonicUser of sonicUsers) {
    removeStorage(getProjectsStorageKey(sonicUser.id))
    removeStorage(`${LEGACY_VACANCIES_PREFIX}${sonicUser.id}`)
  }

  for (const user of remainingUsers) {
    const projectsKey = getProjectsStorageKey(user.id)
    const savedProjects = readStorage(projectsKey, null)

    if (Array.isArray(savedProjects)) {
      const filteredProjects = savedProjects.filter((project) => !isSonicProject(project))
      if (filteredProjects.length !== savedProjects.length) writeStorage(projectsKey, filteredProjects)
    }

    const legacyKey = `${LEGACY_VACANCIES_PREFIX}${user.id}`
    const legacyVacancies = readStorage(legacyKey, null)

    if (Array.isArray(legacyVacancies)) {
      const filteredVacancies = legacyVacancies.filter((vacancy) => !isSonicProject(vacancy))
      if (filteredVacancies.length !== legacyVacancies.length) writeStorage(legacyKey, filteredVacancies)
    }
  }

  const session = readStorage(SESSION_STORAGE_KEY, null)
  if (session && (sonicIds.has(String(session.id)) || isSonicOrganization(session))) clearSession()

  writeStorage(SONIC_CLEANUP_STORAGE_KEY, true)
}

export function ensureDemoData() {
  if (typeof window === 'undefined') return
  removeSonicTestData()
  if (readStorage(DEMO_SEED_STORAGE_KEY, false)) return

  const users = readStorage(USERS_STORAGE_KEY, [])
  const nextUsers = Array.isArray(users) ? [...users] : []

  for (const organization of demoOrganizations) {
    const exists = nextUsers.some((user) => String(user.id) === String(organization.id) || user.email?.trim().toLowerCase() === organization.email.toLowerCase())

    if (!exists) nextUsers.push(organization)

    const projectsKey = getProjectsStorageKey(organization.id)
    const existingProjects = readStorage(projectsKey, null)

    if (!Array.isArray(existingProjects)) {
      writeStorage(projectsKey, demoProjectsByOrganization[organization.id] || [])
    }
  }

  writeStorage(USERS_STORAGE_KEY, nextUsers)
  writeStorage(DEMO_SEED_STORAGE_KEY, true)
}
