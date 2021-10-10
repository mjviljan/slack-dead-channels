import { WebAPICallResult } from '@slack/web-api'

export type Message = {
    type: string
    ts: string
}

type MessageFromAPI = {
    type?: string
    ts?: string
}

// This has to be done, thanks to Slack API returning objects with all properties optional...
const apiMessageToMessage = (original: MessageFromAPI): Message | undefined => {
    if (!original.type || !original.ts) return undefined

    return {
        type: original.type,
        ts: original.ts,
    }
}

export type LatestMessagesResult = WebAPICallResult & {
    messages?: MessageFromAPI[]
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

    return response.messages && response.messages.length > 0 ? apiMessageToMessage(response.messages[0]) : undefined
}
