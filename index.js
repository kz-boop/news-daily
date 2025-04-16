import * as core from '@actions/core';
import { getHeadlines } from './utils/getHeadlines.js';
import { lockIssue, openIssue } from './utils/issue.js';
import { updateFeed } from './utils/feed.js';

const currentDate = new Date();
const headlinesCount = 30;

const headlinesContent = await getHeadlines(currentDate, headlinesCount);
if (!headlinesContent) {
    core.warning("Tidak ada context, Melewati pembuatan issue.");
    process.exit(1);
}
core.info(headlinesContent);

if (process.env.BRANCH_NAME === 'main') {
    const issueResponse = await openIssue({
        owner: 'kz-boop',
        repo: 'news-daily',
        title: `News Daily Top ${headlinesCount} @${currentDate.toISOString().slice(0, 10)}`,
        body: headlinesContent
    });

    const issueNumber = issueResponse.data.number;
    core.info(`Issue dibuat: ${issueNumber}`);

    await lockIssue({
        owner: 'kz-boop',
        repo: 'news-daily',
        issueNumber,
    });
}

await updateFeed();