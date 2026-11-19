export default function ProjectCard({ project, onOpen }) {
  const projectName = project.name || project.title || 'Projeto social'
  const organizationName = project.organization || project.organizationName || ''

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e0e9df] bg-white shadow-[0_3px_12px_rgba(0,80,0,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,100,0,0.14)]">
      <button aria-label={`Ver detalhes de ${projectName}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#e8f0e7] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#009900]" onClick={() => onOpen(project)} type="button">
        <img
          alt={`Imagem do projeto ${projectName}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          src={project.image}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#287028] shadow-sm">{project.cause}</span>
      </button>

      <div className="p-3 sm:p-4">
        <button className="block w-full text-left text-xs font-semibold leading-5 text-[#244d24] transition-colors hover:text-[#009900] focus:outline-none focus:text-[#009900] sm:text-sm" onClick={() => onOpen(project)} type="button">
          {projectName}
        </button>
        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[#788278] sm:text-xs">
          <span>{project.location}</span>
          <span className="truncate text-right">{organizationName}</span>
        </div>
      </div>
    </article>
  )
}
