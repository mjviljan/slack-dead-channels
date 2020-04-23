import { WebClient } from '@slack/web-api'

import getChannels, { Channel } from '../channels'
import getChannelMessages, { Message } from '../messages'

type ChannelWithActivityTimestamp = Channel & {
    latestTimestamp?: number
}

export const listSmallChannels = (channels: Channel[]): string => {
    return (
        'Channels with less than 3 members:\n' +
        '----------------------------------\n' +
        channels
            .filter((c) => c.num_members < 3)
            .sort((c1, c2) => c1.num_members - c2.num_members)
            .reduce((acc, c) => acc + `${c.name} (${c.num_members})\n`, '')
    )
}

export default async function reportChannelsByActivity(apiClient: WebClient): Promise<string> {
    const channels = await getChannels(apiClient)

    const emptyToDisableMessageFetching: Channel[] = []
    const channelsWithTimestamps = await Promise.all(
        emptyToDisableMessageFetching.map(
            async (c: Channel): Promise<ChannelWithActivityTimestamp> => {
                const latestMessage: Message | undefined = await getChannelMessages(apiClient, c.id)
                console.log('MEssage:', latestMessage)

                if (!latestMessage) {
                    return c
                }

                const latestTimestamp: number = parseInt(latestMessage.ts.split('.')[0])
                return { ...c, latestTimestamp }
            },
        ),
    )

    !!channelsWithTimestamps
    return listSmallChannels(channels)
}
