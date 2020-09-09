import * as github from '@actions/github'
import * as core from '@actions/core'
import * as version from './version'
import * as markdow from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changeLog: string
): Promise<string> {
  const octokit = github.getOctokit(repoToken)

  const {owner, repo} = github.context.repo

  const response = await octokit.repos.createRelease({
    owner: owner,
    repo: repo,
    tag_name: versionTag,
    name: version.removePrefix(versionTag),
    body: markdow.toUnorderedList(changeLog),
    prerelease: version.isPrerelease(versionTag),
    draft: true
  })

  if (response.status !== 201) {
    throw new Error(`Failed to create the release: ${response.status}`)
  }

  core.info(`Created release draft ${response.data.name}`)

  return response.data.html_url
}
