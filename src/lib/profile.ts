export const PROFILE_NAME = 'Felipe Augustos'
export const GITHUB_AVATAR_URL = 'https://avatars.githubusercontent.com/u/47693479?v=4'
export const GITHUB_REPO_OWNER = 'userAugustos'
export const GITHUB_REPO_NAME = 'me'
export const GITHUB_DEFAULT_BRANCH = 'master'

export function syncProfileFavicon(): void {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.href = GITHUB_AVATAR_URL
}
