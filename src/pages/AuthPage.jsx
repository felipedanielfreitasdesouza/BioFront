import { CAUSES, LOCATIONS } from '../data/catalogs.js'

export default function AuthPage({ mode, profileType, form, feedback, onChange, onProfileTypeChange, onSubmit, onSwitchMode }) {
  const isRegister = mode === 'register'
  const isOng = profileType === 'ong'

  return (
    <div className="min-h-screen bg-[#f4f8f3] text-[#242424]">
      <header className="bg-[#009900] px-5 py-4 text-white shadow-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a className="text-xl font-semibold tracking-tight" href="/">BioFront</a>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">Impacto que aproxima</span>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl gap-6 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:px-10">
        <aside className="relative hidden overflow-hidden bg-[#007d00] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[32px] border-white/10" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">Uma rede para fazer o bem</p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight xl:text-5xl">Encontre projetos que combinam com você.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/80">Conheça iniciativas sociais, descubra novas formas de participar e ajude a transformar realidades.</p>
          </div>

          <div className="relative grid gap-3 text-sm text-white/90">
            <div className="border-l-2 border-white/50 pl-4">Projetos com propósito</div>
            <div className="border-l-2 border-white/50 pl-4">Conexões que geram impacto</div>
            <div className="border-l-2 border-white/50 pl-4">Espaço para pessoas e ONGs</div>
          </div>
        </aside>

        <section className="flex items-center justify-center bg-white px-5 py-8 shadow-[0_4px_18px_rgba(0,0,0,0.08)] sm:px-10 sm:py-12">
          <div className="w-full max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009900]">BioFront</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2c2c2c] sm:text-4xl">{isRegister ? 'Crie seu perfil' : 'Bem-vindo de volta'}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#707070]">
              {isRegister ? 'Escolha como você vai participar da plataforma.' : 'Entre para acessar projetos, iniciativas e a sua área de gestão.'}
            </p>

            {isRegister && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2" role="group" aria-label="Tipo de perfil">
                <button className={`border p-4 text-left transition-colors ${!isOng ? 'border-[#009900] bg-[#eef8ee]' : 'border-[#d7ded5] hover:border-[#009900]'}`} onClick={() => onProfileTypeChange('volunteer')} type="button">
                  <span className="block text-sm font-semibold text-[#2c2c2c]">Pessoa / Voluntário</span>
                  <span className="mt-1 block text-xs leading-5 text-[#707070]">Para conhecer projetos e participar da rede.</span>
                </button>
                <button className={`border p-4 text-left transition-colors ${isOng ? 'border-[#009900] bg-[#eef8ee]' : 'border-[#d7ded5] hover:border-[#009900]'}`} onClick={() => onProfileTypeChange('ong')} type="button">
                  <span className="block text-sm font-semibold text-[#2c2c2c]">Perfil de ONG</span>
                  <span className="mt-1 block text-xs leading-5 text-[#707070]">Para publicar e administrar suas iniciativas.</span>
                </button>
              </div>
            )}

            <form className="mt-7 space-y-4" onSubmit={onSubmit}>
              {isRegister && !isOng && (
                <label className="block text-sm font-medium text-[#444]" htmlFor="auth-name">
                  Nome
                  <input autoComplete="name" className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-name" name="name" onChange={onChange} required type="text" value={form.name} />
                </label>
              )}

              {isRegister && isOng && (
                <>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-organization-name">
                    Nome da ONG
                    <input autoComplete="organization" className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-organization-name" name="organizationName" onChange={onChange} required type="text" value={form.organizationName} />
                  </label>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-location">
                    Localização
                    <select className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-location" name="location" onChange={onChange} required value={form.location}>
                      <option value="">Selecione uma localização</option>
                      {LOCATIONS.map((location) => <option key={location} value={location}>{location}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-cause">
                    Causa principal
                    <select className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-cause" name="cause" onChange={onChange} required value={form.cause}>
                      <option value="">Selecione uma causa</option>
                      {CAUSES.map((cause) => <option key={cause} value={cause}>{cause}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-profile-image">
                    Foto da ONG (URL)
                    <input className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-profile-image" name="profileImage" onChange={onChange} placeholder="https://..." type="url" value={form.profileImage} />
                  </label>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-description">
                    Descrição da ONG
                    <textarea className="mt-1.5 min-h-24 w-full resize-y border border-[#d0d8ce] bg-white px-3 py-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-description" name="description" onChange={onChange} required value={form.description} />
                  </label>
                  <label className="block text-sm font-medium text-[#444]" htmlFor="auth-history">
                    História da ONG
                    <textarea className="mt-1.5 min-h-28 w-full resize-y border border-[#d0d8ce] bg-white px-3 py-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-history" name="history" onChange={onChange} placeholder="Conte como a organização surgiu e qual impacto deseja gerar." required value={form.history} />
                  </label>
                </>
              )}

              <label className="block text-sm font-medium text-[#444]" htmlFor="auth-email">
                E-mail
                <input autoComplete="email" className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-email" name="email" onChange={onChange} required type="email" value={form.email} />
              </label>

              <label className="block text-sm font-medium text-[#444]" htmlFor="auth-password">
                Senha
                <input autoComplete={isRegister ? 'new-password' : 'current-password'} className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-password" minLength="6" name="password" onChange={onChange} required type="password" value={form.password} />
              </label>

              {isRegister && (
                <label className="block text-sm font-medium text-[#444]" htmlFor="auth-confirm-password">
                  Confirmar senha
                  <input autoComplete="new-password" className="mt-1.5 h-11 w-full border border-[#d0d8ce] bg-white px-3 font-normal outline-none transition-colors focus:border-[#009900] focus:ring-1 focus:ring-[#009900]" id="auth-confirm-password" minLength="6" name="confirmPassword" onChange={onChange} required type="password" value={form.confirmPassword} />
                </label>
              )}

              {feedback && (
                <p className={`text-sm ${feedback.type === 'error' ? 'text-red-600' : 'text-[#16803c]'}`} role="alert">{feedback.message}</p>
              )}

              <button className="h-11 w-full bg-[#009900] px-4 font-semibold text-white transition-colors hover:bg-[#007d00]" type="submit">
                {isRegister ? (isOng ? 'Criar perfil de ONG' : 'Criar perfil de voluntário') : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#707070]">
              {isRegister ? 'Já possui um cadastro?' : 'Ainda não possui um cadastro?'}{' '}
              <button className="font-semibold text-[#009900] hover:underline" onClick={onSwitchMode} type="button">
                {isRegister ? 'Entrar na página de login' : 'Criar cadastro'}
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
