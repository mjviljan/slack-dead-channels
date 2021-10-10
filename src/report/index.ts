import { WebClient } from '@slack/web-api'

import getChannels, { Channel } from '../channels'
import getChannelMessages, { Message } from '../messages'

const DAY_IN_SECS = 60 * 60 * 24

const hasLessThan3Members = (channel: Channel): boolean => channel.num_members < 3

const byLastActivity = (channel1: ChannelWithActivityTimestamp, channel2: ChannelWithActivityTimestamp) => {
    if (!channel1.latestTimestamp) return -1 // channel 1 has never had messages

    if (!channel2.latestTimestamp) return 1 // channel 2 has never had messages

    return channel1.latestTimestamp - channel2.latestTimestamp
}

const byMemberCount = (channel1: Channel, channel2: Channel) => channel1.num_members - channel2.num_members

const timestampToString = (timestamp: number | undefined): string => {
    if (!timestamp) return 'never'

    const now = new Date().getTime() / 1000
    const daysSinceActive = Math.floor((now - timestamp) / DAY_IN_SECS)

    return daysSinceActive ? daysSinceActive + ' days' : 'today'
}

const toActivityReportRow = (acc: string, chan: ChannelWithActivityTimestamp): string =>
    acc + `${chan.name} (${timestampToString(chan.latestTimestamp)})\n`

const toMemberCountReportRow = (acc: string, chan: Channel): string => acc + `${chan.name} (${chan.num_members})\n`

export type ChannelWithActivityTimestamp = {
    name: string
    latestTimestamp?: number
}

export const listChannelsByInactiveDays = (channels: ChannelWithActivityTimestamp[]): string => {
    const channelReport = channels.sort(byLastActivity).reduce(toActivityReportRow, '')

    return 'Channels ordered by inactivity\n' + '------------------------------\n' + channelReport
}

export const listSmallChannels = (channels: Channel[]): string => {
    const channelReport: string = channels
        .filter(hasLessThan3Members)
        .sort(byMemberCount)
        .reduce(toMemberCountReportRow, '')

    return channelReport
        ? 'Channels with less than 3 members:\n----------------------------------\n' + channelReport
        : 'There are no channels with less than 3 members.\n'
}

export default async function reportChannelsByActivity(apiClient: WebClient): Promise<string> {
    const channels = await getChannels(apiClient)

    const channelsWithTimestamps = await Promise.all(
        channels.map(async (c: Channel): Promise<ChannelWithActivityTimestamp> => {
            const latestMessage: Message | undefined = await getChannelMessages(apiClient, c.id)

            if (!latestMessage) {
                return c
            }

            const latestTimestamp: number = parseInt(latestMessage.ts)
            return { ...c, latestTimestamp }
        }),
    )

    return listChannelsByInactiveDays(channelsWithTimestamps) + '\n' + listSmallChannels(channels)
}
