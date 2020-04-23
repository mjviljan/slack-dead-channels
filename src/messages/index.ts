import { WebAPICallResult } from '@slack/web-api'

export type Message = {
    type: string
    ts: string
}

export type LatestMessagesResult = WebAPICallResult & {
    messages?: Message[]
}

export interface MessageHistoryFetcher {
    readonly conversations: {
        history: (args?: any) => Promise<LatestMessagesResult>
    }
}

export default async function getChannelMessages(
    webClient: MessageHistoryFetcher,
    channelId: string,
): Promise<Message | undefined> {
    const response: LatestMessagesResult = await webClient.conversations.history({ channel: channelId, limit: 1 })
    if (!response.ok) {
        throw new Error(`Got a failure response from Slack, error ${response.error}`)
    }

    return response.messages ? response.messages[0] : undefined
}
