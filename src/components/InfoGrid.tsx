type SpecCell = {
  label: string
  value: string
  detail?: string
}

const cells: SpecCell[] = [
  {
    label: 'Datum & tid',
    value: '30 Januari 2027, 19:00 - 01:00',
  },
  {
    label: 'Plats',
    value: 'Ultimate Football, Upplands Väsby (Inomhuskonstgräs)',
  },
  {
    label: 'Format',
    value: '7v7 Inomhus',
    detail: '12 lag, 3 grupper (8 till kvartsfinal). Matchtid: 1x18 min.',
  },
  {
    label: 'Prispott',
    value: 'Kontantpris och exklusiva sponsorpriser presenteras inom kort.',
  },
]

export function InfoGrid() {
  return (
    <section className="bg-night">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-2 md:px-8 md:pb-14 md:pt-4">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/8 bg-white/8">
          {cells.map((cell) => (
            <article
              key={cell.label}
              className="bg-surface px-3.5 py-4 md:px-5 md:py-5"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent md:text-xs">
                {cell.label}
              </p>
              <p className="mt-2 font-display text-base font-bold uppercase leading-snug tracking-tight text-ink md:text-xl">
                {cell.value}
              </p>
              {cell.detail ? (
                <p className="mt-1.5 text-sm leading-snug text-muted">
                  {cell.detail}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
