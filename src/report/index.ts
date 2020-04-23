import { WebClient } from '@slack/web-api'

import getChannels, { Channel } from '../channels'
import getChannelMessages, { Message } from '../messages'

type ChannelWithActivityTimestamp = Channel & {
    latestTimestamp?: number
}

const hasLessThan3Members = (channel: Channel): boolean => channel.num_members < 3

const byMemberCount = (channel1: Channel, channel2: Channel) => channel1.num_members - channel2.num_members

const toReportRow = (acc: string, channel: Channel): string => acc + `${channel.name} (${channel.num_members})\n`

export const listSmallChannels = (channels: Channel[]): string => {
    const channelReport: string = channels.filter(hasLessThan3Members).sort(byMemberCount).reduce(toReportRow, '')

    return channelReport
        ? 'Channels with less than 3 members:\n----------------------------------\n' + channelReport
        : 'There are no channels with less than 3 members.\n'
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
