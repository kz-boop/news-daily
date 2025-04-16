import core from "@actions/core"
import { EOL } from "os"
import { exit } from "process"

function replaceGithubLinks(value) {
    return value.replace(/https?:\/\/(www\.)?github.com\//g, 'https://togithub.com/')
}

function escapeHTML(value) {
    return value.replace(/[&<>'"]/g, tag => ({
        '&': '&amp',
        '<': '&lt',
        '>': '&gt',
        "'": '&#39',
        '"': '&quot'
    }[tag] || tag))
}

export const getHeadlines = async (date, take) => {
    try {
        const endTime = Math.round(date.getTime() / 1000)
        const startTime = endTime - (25 * 60 * 60)
        core.notice(`Tanggal dari ${new Date(startTime * 1000)} ke ${new Date(endTime * 1000)}`)
        
        const url = `https://hn.algolia.com/api/v1/search?hitsPerPage=${take}&numericFilters=created_at_i>${startTime},created_at_i<${endTime}`
        const data = await fetch(url).then(res => res.json())

        if (!data?.hits?.length) {
            core.error('Tidak ada hasil dari API.')
            exit(1)
        }

        return data.hits.slice(0, take).map((item, index) => {
            const { title, url: itemUrl, points, objectID, num_comments } = item
            const commentsUrl = `https://news.ycombinator.com/item?id=${objectID}`
            const displayUrl = itemUrl ? replaceGithubLinks(itemUrl) : commentsUrl
            const titleWithLink = `[**${escapeHTML(title)}**](${displayUrl})`
            const commentsInfo = `[${num_comments} komentar ${points} poin](${commentsUrl})`
            return `${index + 1}. ${titleWithLink} - ${commentsInfo}`
        }).join(EOL)
    } catch (error) {
        console.error('Terjadi kesalahan:', error)
        throw error
    }
}