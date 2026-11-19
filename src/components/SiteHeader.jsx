export default function SiteHeader({ authUser, onBack, onLogin, onLogout, onOpenOng, onRegister, onRegisterOng, sectionLabel }) {
  return (
    <header className="bg-[#009900] px-5 py-4 shadow-sm sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
        <div>
          <a className="text-xl font-semibold tracking-tight text-white" href="/" onClick={onBack ? (event) => { event.preventDefault(); onBack() } : undefined}>
            BioFront
          </a>
          {sectionLabel && <p className="mt-0.5 text-xs text-white/80">{sectionLabel}</p>}
        </div>

        {onBack ? (
          <button className="border border-white/80 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#009900]" onClick={onBack} type="button">
            Voltar ao início
          </button>
        ) : (
          <nav aria-label="Navegação principal" className="flex items-center gap-2 text-sm font-medium text-white sm:gap-5">
            {authUser?.role === 'ong' ? (
              <button className="hidden px-2 py-2 transition-opacity hover:opacity-75 sm:inline" onClick={onOpenOng} type="button">
                Área da ONG
              </button>
            ) : (
              <button className="hidden px-2 py-2 transition-opacity hover:opacity-75 sm:inline" onClick={onRegisterOng} type="button">
                Sou uma ONG
              </button>
            )}
            {authUser ? (
              <>
                <span className="hidden sm:inline">Olá, {authUser.name.split(' ')[0]}</span>
                <button className="rounded-sm border border-white/80 px-3 py-2 transition-colors hover:bg-white hover:text-[#009900]" onClick={onLogout} type="button">
                  Sair
                </button>
              </>
            ) : (
              <>
                <button className="px-2 py-2 transition-opacity hover:opacity-75" onClick={onLogin} type="button">
                  Login
                </button>
                <button className="rounded-sm border border-white/80 px-3 py-2 transition-colors hover:bg-white hover:text-[#009900]" onClick={onRegister} type="button">
                  Cadastre-se
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
