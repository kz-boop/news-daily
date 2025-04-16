import { Octokit } from "@octokit/core"
import { createActionAuth } from "@octokit/auth-action"

export const openIssue = async ({ owner, repo, title, body }) => {
  const octokit = new Octokit({ authStrategy: createActionAuth })

  try {
    console.log('Membuka issue...')
    const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      title,
      body,
    })
    console.log('Issue berhasil di buka....')
    return response
  } catch (error) {
    console.error('Gagal membuka issue:', error)
    throw error
  }
}

export const getIssues = async ({ owner, repo, take }) => {
  const octokit = new Octokit()
  const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
    owner,
    repo,
    per_page: take
  })
  return response.data
}

export const lockIssue = async ({ owner, repo, issueNumber }) => {
  const octokit = new Octokit({ authStrategy: createActionAuth })
  
  await octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/lock', {
    owner,
    repo,
    issue_number: issueNumber,
    lock_reason: 'resolved'
  })
}