import {
  GITHUB_DEFAULT_BRANCH,
  GITHUB_REPO_NAME,
  GITHUB_REPO_OWNER,
} from '../../../../lib/profile'

interface GitHubCommit {
  commit?: {
    committer?: {
      date?: string | null
    } | null
  } | null
}

let cachedCommitDate: string | null | undefined
let pendingCommitRequest: Promise<string | null> | null = null

function buildCommitUrl(): string {
  const url = new URL(
    `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits`,
  )
  url.searchParams.set('per_page', '1')
  url.searchParams.set('sha', GITHUB_DEFAULT_BRANCH)
  return url.toString()
}

async function requestLatestCommitDate(): Promise<string | null> {
  const response = await fetch(buildCommitUrl(), {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`deploy-status: GitHub request failed with ${response.status}`)
  }

  const data = (await response.json()) as GitHubCommit[]
  return data[0]?.commit?.committer?.date ?? null
}

export async function loadLatestDeployCommitDate(): Promise<string | null> {
  if (cachedCommitDate !== undefined) return cachedCommitDate
  if (!pendingCommitRequest) {
    pendingCommitRequest = requestLatestCommitDate()
      .then((date) => {
        cachedCommitDate = date
        return date
      })
      .finally(() => {
        pendingCommitRequest = null
      })
  }

  return pendingCommitRequest
}
