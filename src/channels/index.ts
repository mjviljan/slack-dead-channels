import { ConversationsListArguments, WebAPICallResult } from '@slack/web-api'

export type Channel = {
    id: string
    name: string
    num_members: number
}

type ChannelFromApi = {
    id?: string
    name?: string
    num_members?: number
}

// This has to be done, thanks to Slack API returning objects with all properties optional...
const apiChannelToChannel = (original: ChannelFromApi): Channel | undefined => {
    if (!original.id || !original.name || !original.num_members) return undefined

    return {
        id: original.id,
        name: original.name,
        num_members: original.num_members,
    }
}

const properChannel = (chan: Channel | undefined): chan is Channel => chan !== undefined

export type ConversationsListResult = WebAPICallResult & {
    channels?: ChannelFromApi[]
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

    return response.channels.map(apiChannelToChannel).filter(properChannel)
}
