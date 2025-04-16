import * as core from '@actions/core'
import * as fs from 'fs'
import { Feed } from "feed"
import { getIssues } from "../utils/issue.js"
import { marked } from "marked"

export const updateFeed = async () => {
  const issues = await getIssues({
    owner: 'kz-boop',
    repo: 'news-daily',
    take: 30
  })

  const feed = new Feed({
    title: `News Daily Top 30`,
    description: "Ini adalah Top 30 News daily",
    link: "https://github.com/kz-boop/news-daily/issues/",
  })

  issues.forEach(issue => {
    feed.addItem({
      title: issue.title,
      id: issue.number.toString(),
      link: issue.html_url,
      content: marked.parse(issue.body),
      date: new Date(issue.updated_at),
    })
  })

  fs.writeFile('resnyo.xml', feed.rss2(), (error) => {
    if (error) core.error('Gagal membuat file:', error)
  })
}