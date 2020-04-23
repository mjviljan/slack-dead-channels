import { ConversationsListArguments, WebAPICallResult } from '@slack/web-api'

export type Channel = {
    id: string
    name: string
    num_members: number
}

export type ConversationsListResult = WebAPICallResult & {
    channels?: Channel[]
}

export interface ConversationFetcher {
    readonly conversations: {
        list: (args?: ConversationsListArguments) => Promise<ConversationsListResult>
    }
}

export default async function getChannels(webClient: ConversationFetcher): Promise<Channel[]> {
    const response: ConversationsListResult = await webClient.conversations.list({
        exclude_archived: true,
        limit: 1000, // avoid pagination; 1000 is the maximum value
    })

    if (!response.ok) {
        throw new Error(`Got a failure response from Slack, error ${response.error}`)
    }
    if (!response.channels) {
        throw new Error('Response from Slack is malformed and has no channel data')
    }

    return response.channels
}
