import { WebClient } from '@slack/web-api'
import { config as readEnvConfig } from 'dotenv'

import reportChannelsByActivity from './report'

readEnvConfig()
const token = process.env.SLACK_TOKEN

if (!token) {
    throw new Error("No Slack token found, can't access the Slack API")
}

class IllegalArgumentError extends Error {}

const getLimitFromArgs = (args: string[]): number | undefined => {
    // no additional arguments given, use no limit
    if (args.length == 2) {
        return undefined
    }
    // possibly a limit parameter given, check validity
    if (args.length == 4) {
        if (args[2] === '--limit' || args[2] === '-l') {
            const dayLimit = parseInt(args[3], 10)
            if (!Number.isNaN(dayLimit)) {
                return dayLimit
            }
        }
    }

    throw new IllegalArgumentError('Illegal arguments')
}

const printUsage = () => {
    console.log('Illegal arguments given.\n')
    console.log('Usage:')
    console.log('  yarn start [--limit <limit> | -l <limit>]')
}

;(async (args: string[]) => {
    try {
        const limit = getLimitFromArgs(args)
        const apiClient = new WebClient(token)
        console.log('Fetching channel info...')
        console.log(await reportChannelsByActivity(apiClient, limit))
    } catch (e) {
        if (e instanceof IllegalArgumentError) {
            printUsage()
            process.exit(-1)
        }

        throw e
    }
})(process.argv)
