import * as fakeChannels from './fakeChannels.json'
import { ChannelWithActivityTimestamp, listChannelsByInactiveDays, listSmallChannels } from '../../src/report'

const DAY_IN_SECS = 60 * 60 * 24

describe('Reporting channels by activity', () => {
    test('lists channels by inactive days in decremental order', () => {
        const now = new Date().getTime() / 1000
        const channelsWithTimestamps: ChannelWithActivityTimestamp[] = [
            {
                name: 'channel_uno',
                latestTimestamp: now,
            },
            {
                name: 'channel_dos',
                latestTimestamp: now - 25 * DAY_IN_SECS - 123, // some offset to test Math.floor
            },
            {
                name: 'channel_tres',
                latestTimestamp: now - 450 * DAY_IN_SECS,
            },
            {
                name: 'channel_cuatro',
                latestTimestamp: undefined,
            },
        ]

        const expectedReport =
            'Channels ordered by inactivity\n' +
            '------------------------------\n' +
            'channel_cuatro (never)\n' +
            'channel_tres (450 days)\n' +
            'channel_dos (25 days)\n' +
            'channel_uno (today)\n'
        const report = listChannelsByInactiveDays(channelsWithTimestamps)

        expect(report).toEqual(expectedReport)
    })

    test('lists small (with less than 3 members) channels by member count in incremental order', () => {
        const expectedReport =
            'Channels with less than 3 members:\n' +
            '----------------------------------\n' +
            'totally_dead (0)\n' +
            'private_fun (1)\n' +
            'lone_rider (1)\n' +
            'three_is_a_crowd (2)\n'
        const report = listSmallChannels(fakeChannels)

        expect(report).toEqual(expectedReport)
    })

    test('shows a message instead of a channel list if there are no channels with less than 3 members', () => {
        const expectedReport = 'There are no channels with less than 3 members.\n'

        const bigChannels = fakeChannels.filter((c) => c.num_members >= 3)
        const report = listSmallChannels(bigChannels)

        expect(report).toEqual(expectedReport)
    })
})
