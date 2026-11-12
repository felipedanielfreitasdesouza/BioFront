import { useEffect, useMemo, useState } from 'react'

const USERS_STORAGE_KEY = 'biofront-users'
const SESSION_STORAGE_KEY = 'biofront-session'

const projects = [
  {
    id: 1,
    title: 'Conexões que transformam',
    location: 'São Paulo',
    cause: 'Comunidade',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'Cuidar é compartilhar',
    location: 'Rio de Janeiro',
    cause: 'Meio ambiente',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Rede de apoio local',
    location: 'São Paulo',
    cause: 'Educação',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Um futuro para todos',
    location: 'Belo Horizonte',
    cause: 'Comunidade',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80',
  },
]

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // A página continua navegável mesmo se o armazenamento estiver bloqueado.
  }
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="overflow-hidden bg-[#9e9896] shadow-[0_3px_8px_rgba(0,0,0,0.16)] transition-transform duration-200 hover:-translate-y-1">
      <div className="aspect-square w-full bg-[#e8e5df]">
        <img
          alt={`Imagem do projeto ${project.title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          src={project.image}
        />
      </div>
      <div className="px-2 py-2.5 text-center text-xs font-medium text-white sm:px-5 sm:py-3.5 sm:text-base">
        {project.title}
      </div>
    </article>
  )
}

function AuthModal({ mode, form, feedback, onChange, onClose, onSubmit, onSwitchMode }) {
  const isRegister = mode === 'register'

  return (
    <div
      aria-labelledby="auth-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-md bg-white p-6 shadow-2xl sm:p-8">
        <button aria-label="Fechar" className="absolute right-4 top-4 text-[#777] transition-colors hover:text-[#009900]" onClick={onClose} type="button">
          <CloseIcon />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">BioFront</p>
        <h2 className="mt-2 pr-8 text-2xl font-semibold text-[#242424]" id="auth-title">
          {isRegister ? 'Crie sua conta' : 'Acesse sua conta'}
        </h2>
        <p className="mt-2 text-sm text-[#707070]">
          {isRegister ? 'Cadastre-se para acompanhar oportunidades.' : 'Entre para continuar navegando pelos projetos.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {isRegister && (
            <label className="block text-sm font-medium text-[#444]" htmlFor="auth-name">
              Nome
              <input autoComplete="name" className="mt-1.5 h-11 w-full border border-[#d0d0d0] px-3 font-normal outline-none focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-name" name="name" onChange={onChange} required type="text" value={form.name} />
            </label>
          )}

          <label className="block text-sm font-medium text-[#444]" htmlFor="auth-email">
            E-mail
            <input autoComplete="email" className="mt-1.5 h-11 w-full border border-[#d0d0d0] px-3 font-normal outline-none focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-email" name="email" onChange={onChange} required type="email" value={form.email} />
          </label>

          <label className="block text-sm font-medium text-[#444]" htmlFor="auth-password">
            Senha
            <input autoComplete={isRegister ? 'new-password' : 'current-password'} className="mt-1.5 h-11 w-full border border-[#d0d0d0] px-3 font-normal outline-none focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-password" minLength="6" name="password" onChange={onChange} required type="password" value={form.password} />
          </label>

          {isRegister && (
            <label className="block text-sm font-medium text-[#444]" htmlFor="auth-confirm-password">
              Confirmar senha
              <input autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#d0d0d0] px-3 font-normal outline-none focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-confirm-password" minLength="6" name="confirmPassword" onChange={onChange} required type="password" value={form.confirmPassword} />
            </label>
          )}

          {feedback && (
            <p className={`text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-[#16803c]'}`} role="alert">
              {feedback.message}
            </p>
          )}

          <button className="h-11 w-full bg-[#009900] px-4 font-semibold text-white transition-colors hover:bg-[#007d00]" type="submit">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#707070]">
          {isRegister ? 'Já possui uma conta?' : 'Ainda não possui uma conta?'}{' '}
          <button className="font-semibold text-[#009900] hover:underline" onClick={onSwitchMode} type="button">
            {isRegister ? 'Fazer login' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [cause, setCause] = useState('')
  const [authMode, setAuthMode] = useState(null)
  const [authUser, setAuthUser] = useState(null)
  const [authFeedback, setAuthFeedback] = useState(null)
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    setAuthUser(readStorage(SESSION_STORAGE_KEY, null))
  }, [])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return projects.filter((project) => {
      const matchesSearch = !normalizedSearch || project.title.toLowerCase().includes(normalizedSearch)
      const matchesLocation = !location || project.location === location
      const matchesCause = !cause || project.cause === cause

      return matchesSearch && matchesLocation && matchesCause
    })
  }, [cause, location, search])

  function openAuth(mode) {
    setAuthMode(mode)
    setAuthFeedback(null)
    setAuthForm({ name: '', email: '', password: '', confirmPassword: '' })
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

      if (users.some((user) => user.email === email)) {
        setAuthFeedback({ type: 'error', message: 'Este e-mail já está cadastrado.' })
        return
      }

      const newUser = { id: Date.now(), name: authForm.name.trim(), email, password: authForm.password }
      writeStorage(USERS_STORAGE_KEY, [...users, newUser])
      writeStorage(SESSION_STORAGE_KEY, { name: newUser.name, email: newUser.email })
      setAuthUser({ name: newUser.name, email: newUser.email })
      setAuthMode(null)
      return
    }

    const user = users.find((storedUser) => storedUser.email === email && storedUser.password === authForm.password)

    if (!user) {
      setAuthFeedback({ type: 'error', message: 'E-mail ou senha inválidos.' })
      return
    }

    const session = { name: user.name, email: user.email }
    writeStorage(SESSION_STORAGE_KEY, session)
    setAuthUser(session)
    setAuthMode(null)
  }

  function handleLogout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    setAuthUser(null)
  }

  return (
    <div className="min-h-screen bg-[#d9d9d9] text-[#242424]">
      <header className="bg-[#009900] px-5 py-4 shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
          <a className="text-xl font-semibold tracking-tight text-white" href="/">
            BioFront
          </a>

          <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm font-medium text-white sm:gap-5">
            {authUser ? (
              <>
                <span className="hidden sm:inline">Olá, {authUser.name.split(' ')[0]}</span>
                <button className="rounded-sm border border-white/80 px-3 py-2 transition-colors hover:bg-white hover:text-[#009900]" onClick={handleLogout} type="button">
                  Sair
                </button>
              </>
            ) : (
              <>
                <button className="px-2 py-2 transition-opacity hover:opacity-75" onClick={() => openAuth('login')} type="button">
                  Login
                </button>
                <button className="rounded-sm border border-white/80 px-3 py-2 transition-colors hover:bg-white hover:text-[#009900]" onClick={() => openAuth('register')} type="button">
                  Cadastre-se
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <section aria-label="Filtros de projetos" className="mb-7">
          <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-[180px_180px]">
            <label className="sr-only" htmlFor="location">Localização</label>
            <select className="h-10 w-full appearance-none bg-white px-3 text-sm text-[#555] outline-none ring-[#009900] focus:ring-2" id="location" onChange={(event) => setLocation(event.target.value)} value={location}>
              <option value="">Localização</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Belo Horizonte</option>
            </select>

            <label className="sr-only" htmlFor="cause">Causa</label>
            <select className="h-10 w-full appearance-none bg-white px-3 text-sm text-[#555] outline-none ring-[#009900] focus:ring-2" id="cause" onChange={(event) => setCause(event.target.value)} value={cause}>
              <option value="">Causa</option>
              <option>Comunidade</option>
              <option>Meio ambiente</option>
              <option>Educação</option>
            </select>
          </div>

          <label className="relative mt-3 block max-w-2xl" htmlFor="search">
            <span className="sr-only">Buscar projetos</span>
            <input className="h-10 w-full bg-white px-4 pr-11 text-sm text-[#444] outline-none placeholder:text-[#8d8d8d] focus:ring-2 focus:ring-[#009900]" id="search" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar projetos" type="search" value={search} />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#777]"><SearchIcon /></span>
          </label>
        </section>

        <section aria-label="Projetos disponíveis" className="grid grid-cols-2 gap-4 sm:gap-8">
          {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </section>

        {filteredProjects.length === 0 && (
          <p className="bg-white/60 p-8 text-center text-sm text-[#666]">Nenhum projeto encontrado.</p>
        )}
      </main>

      {authMode && (
        <AuthModal
          feedback={authFeedback}
          form={authForm}
          mode={authMode}
          onChange={handleAuthChange}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthSubmit}
          onSwitchMode={() => openAuth(authMode === 'login' ? 'register' : 'login')}
        />
      )}
    </div>
  )
}
