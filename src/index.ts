import { WebClient } from '@slack/web-api'
import { config as readEnvConfig } from 'dotenv'

import getChannels from './listConversations'

readEnvConfig()
const token = process.env.SLACK_TOKEN

if (!token) {
    throw new Error("No Slack token found, can't access ")
}

const web = new WebClient(token)

;(async () => {
    await getChannels(web)
})()
