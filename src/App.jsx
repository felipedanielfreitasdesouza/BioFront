import { useEffect, useState } from 'react'
import AuthPage from './pages/AuthPage.jsx'
import OngProfilePage from './pages/OngProfilePage.jsx'
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import OngPage from './pages/OngPage.jsx'
import { DEFAULT_ONG_IMAGE } from './data/organizations.js'
import { projects } from './data/projects.js'
import {
  clearSession,
  ensureDemoData,
  readStorage,
  readPublishedProjects,
  SESSION_STORAGE_KEY,
  USERS_STORAGE_KEY,
  writeStorage,
} from './lib/storage.js'

ensureDemoData()

const initialAuthForm = {
  name: '',
  organizationName: '',
  location: '',
  cause: '',
  description: '',
  history: '',
  profileImage: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function toSession(user) {
  const role = user?.role === 'ong' ? 'ong' : 'volunteer'

  return {
    id: user?.id,
    role,
    name: user?.name || user?.organizationName || '',
    organizationName: user?.organizationName || '',
    location: user?.location || '',
    cause: user?.cause || '',
    description: user?.description || '',
    history: user?.history || '',
    profileImage: user?.profileImage || (role === 'ong' ? DEFAULT_ONG_IMAGE : ''),
    email: user?.email || '',
  }
}

function usePagePath() {
  const [path, setPath] = useState(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  return [path, navigate]
}

export default function App() {
  const [path, navigate] = usePagePath()
  const [authUser, setAuthUser] = useState(null)
  const [authFeedback, setAuthFeedback] = useState(null)
  const [authForm, setAuthForm] = useState(initialAuthForm)
  const [profileType, setProfileType] = useState('volunteer')
  const authMode = path === '/login' ? 'login' : 'register'

  useEffect(() => {
    const storedSession = readStorage(SESSION_STORAGE_KEY, null)
    setAuthUser(storedSession ? toSession(storedSession) : null)
  }, [])

  function openAuth(mode, nextProfileType = 'volunteer') {
    navigate(mode === 'register' ? '/cadastro' : '/login')
    setProfileType(nextProfileType)
    setAuthFeedback(null)
    setAuthForm(initialAuthForm)
  }

  function handleAuthChange(event) {
    const { name, value } = event.target
    setAuthForm((current) => ({ ...current, [name]: value }))
  }

  function handleAuthSubmit(event) {
    event.preventDefault()

    const email = authForm.email.trim().toLowerCase()
    const users = readStorage(USERS_STORAGE_KEY, [])

    if (authMode === 'register') {
      if (authForm.password !== authForm.confirmPassword) {
        setAuthFeedback({ type: 'error', message: 'As senhas precisam ser iguais.' })
        return
      }

      if (users.some((user) => user.email?.trim().toLowerCase() === email)) {
        setAuthFeedback({ type: 'error', message: 'Este e-mail já está cadastrado.' })
        return
      }

      const isOng = profileType === 'ong'
      const organizationName = authForm.organizationName.trim()
      const name = authForm.name.trim()
      const location = authForm.location.trim()
      const cause = authForm.cause.trim()
      const description = authForm.description.trim()
      const history = authForm.history.trim()
      const profileImage = authForm.profileImage.trim()

      if (isOng && (!organizationName || !location || !cause || !description || !history)) {
        setAuthFeedback({ type: 'error', message: 'Preencha os dados da ONG para continuar.' })
        return
      }

      if (!isOng && !name) {
        setAuthFeedback({ type: 'error', message: 'Informe seu nome para continuar.' })
        return
      }

      const newUser = {
        id: `${profileType}-${Date.now()}`,
        role: profileType,
        name: isOng ? organizationName : name,
        organizationName: isOng ? organizationName : '',
        location: isOng ? location : '',
        cause: isOng ? cause : '',
        description: isOng ? description : '',
        history: isOng ? history : '',
        profileImage: isOng ? profileImage || DEFAULT_ONG_IMAGE : '',
        email,
        password: authForm.password,
      }
      const session = toSession(newUser)
      writeStorage(USERS_STORAGE_KEY, [...users, newUser])
      writeStorage(SESSION_STORAGE_KEY, session)
      setAuthUser(session)
      navigate('/')
      return
    }

    const user = users.find((storedUser) => storedUser.email?.trim().toLowerCase() === email && storedUser.password === authForm.password)

    if (!user) {
      setAuthFeedback({ type: 'error', message: 'E-mail ou senha inválidos.' })
      return
    }

    const session = toSession(user)
    writeStorage(SESSION_STORAGE_KEY, session)
    setAuthUser(session)
    navigate('/')
  }

  function handleLogout() {
    clearSession()
    setAuthUser(null)
    navigate('/cadastro')
  }

  function handleUserUpdate(updates) {
    if (!authUser?.id) return

    const users = readStorage(USERS_STORAGE_KEY, [])
    const updatedUser = users.find((user) => String(user.id) === String(authUser.id))

    if (!updatedUser) return

    const nextUser = { ...updatedUser, ...updates }
    const nextUsers = users.map((user) => String(user.id) === String(authUser.id) ? nextUser : user)
    const session = toSession(nextUser)

    writeStorage(USERS_STORAGE_KEY, nextUsers)
    writeStorage(SESSION_STORAGE_KEY, session)
    setAuthUser(session)
  }

  const ongProfilePathMatch = path.match(/^\/ong\/([^/]+)$/)
  const selectedOrganizationId = ongProfilePathMatch ? decodeURIComponent(ongProfilePathMatch[1]) : null
  const selectedOrganization = selectedOrganizationId ? readStorage(USERS_STORAGE_KEY, []).find((user) => user.role === 'ong' && String(user.id) === selectedOrganizationId) : null
  const projectPathMatch = path.match(/^\/projeto\/([^/]+)$/)
  const selectedProjectId = projectPathMatch ? decodeURIComponent(projectPathMatch[1]) : null
  const allPublishedProjects = [...projects, ...readPublishedProjects()]
  const selectedProject = selectedProjectId ? allPublishedProjects.find((project) => String(project.id) === selectedProjectId) : null
  const shouldShowRegister = path === '/cadastro' || (path === '/' && !authUser)

  const page = path === '/ong' ? (
    <OngPage onBack={() => navigate('/')} onOpenPublicProfile={(user) => navigate(`/ong/${user.id}`)} onUserUpdate={handleUserUpdate} user={authUser} />
  ) : ongProfilePathMatch ? (
    <OngProfilePage onBack={() => navigate('/')} onOpenProject={(project) => navigate(`/projeto/${encodeURIComponent(project.id)}`)} organization={selectedOrganization} />
  ) : projectPathMatch ? (
    <ProjectDetailsPage onBack={() => navigate('/')} project={selectedProject} />
  ) : shouldShowRegister ? (
    <AuthPage
      feedback={authFeedback}
      form={authForm}
      mode="register"
      onChange={handleAuthChange}
      onProfileTypeChange={setProfileType}
      onSubmit={handleAuthSubmit}
      onSwitchMode={() => openAuth('login', profileType)}
      profileType={profileType}
    />
  ) : path === '/login' ? (
    <AuthPage
      feedback={authFeedback}
      form={authForm}
      mode="login"
      onChange={handleAuthChange}
      onProfileTypeChange={setProfileType}
      onSubmit={handleAuthSubmit}
      onSwitchMode={() => openAuth('register', profileType)}
      profileType={profileType}
    />
  ) : (
    <HomePage
      authUser={authUser}
      onLogin={() => openAuth('login')}
      onLogout={handleLogout}
      onOpenOng={() => navigate('/ong')}
      onOpenOrganization={(organization) => navigate(`/ong/${organization.id}`)}
      onOpenProject={(project) => navigate(`/projeto/${encodeURIComponent(project.id)}`)}
      onRegister={() => openAuth('register')}
      onRegisterOng={() => openAuth('register', 'ong')}
    />
  )

  return (
    page
  )
}
