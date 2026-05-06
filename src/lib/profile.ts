export const PROFILE_NAME = 'Felipe Augustos'
export const GITHUB_AVATAR_URL = 'https://avatars.githubusercontent.com/u/47693479?v=4'

export function syncProfileFavicon(): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.href = GITHUB_AVATAR_URL
}
