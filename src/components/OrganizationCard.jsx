import { DEFAULT_ONG_IMAGE } from '../data/organizations.js'

function handleImageError(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = DEFAULT_ONG_IMAGE
}

export default function OrganizationCard({ organization, onOpen }) {
  const name = organization.organizationName || organization.name || 'ONG sem nome'
  const cause = organization.cause || organization.causes?.[0]

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e0e9df] bg-white shadow-[0_3px_12px_rgba(0,80,0,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,100,0,0.14)]">
      <button aria-label={`Ver página da ONG ${name}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-[#e8f0e7] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#009900]" onClick={() => onOpen(organization)} type="button">
        <img alt={`Foto da ONG ${name}`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" onError={handleImageError} src={organization.profileImage || DEFAULT_ONG_IMAGE} />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#287028] shadow-sm">ONG</span>
      </button>

      <div className="p-3 sm:p-4">
        <button className="block w-full text-left text-sm font-semibold leading-5 text-[#244d24] transition-colors hover:text-[#009900] focus:outline-none focus:text-[#009900]" onClick={() => onOpen(organization)} type="button">
          {name}
        </button>
        <p className="mt-1 text-xs text-[#788278]">{organization.location || 'Localização não informada'}</p>
        {cause && <p className="mt-1 text-[11px] font-semibold text-[#287028]">{cause}</p>}
        <p className="mt-3 text-xs leading-5 text-[#687268]">{organization.description || 'Conheça a história e as iniciativas desta organização.'}</p>
      </div>
    </article>
  )
}
