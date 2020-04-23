import { WebClient } from '@slack/web-api'

import getChannels, { Channel } from '../channels'
import getChannelMessages, { Message } from '../messages'

type ChannelWithActivityTimestamp = Channel & {
    latestTimestamp?: number
}

export default async function reportChannelsByActivity(apiClient: WebClient): Promise<string> {
    const channels = await getChannels(apiClient)

    const channels2 = channels.slice(0, 2)
    const channelsWithTimestamps = await Promise.all(
        channels2.map(
            async (c: Channel): Promise<ChannelWithActivityTimestamp> => {
                const latestMessage: Message | undefined = await getChannelMessages(apiClient, c.id)

                if (!latestMessage) {
                    return c
                }

                const latestTimestamp: number = parseInt(latestMessage.ts.split('.')[0])
                return { ...c, latestTimestamp }
            },
        ),
    )

    return JSON.stringify(channelsWithTimestamps)
}
