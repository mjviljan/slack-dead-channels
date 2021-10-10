import { WebClient } from '@slack/web-api'
import { config as readEnvConfig } from 'dotenv'

import reportChannelsByActivity from './report'

readEnvConfig()
const token = process.env.SLACK_TOKEN

if (!token) {
    throw new Error("No Slack token found, can't access the Slack API")
}

;(async () => {
    console.log('Fetching channel info...')
    const apiClient = new WebClient(token)
    console.log(await reportChannelsByActivity(apiClient))
})()
