import logoUrl from './assets/velta-logo.jpeg'

export function LogoMark({ className }: { className?: string }) {
  return <img className={className} src={logoUrl} alt="" aria-hidden="true" />
}
