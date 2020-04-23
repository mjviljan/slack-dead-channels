import * as fakeChannels from './fakeChannels.json'
import { listSmallChannels } from '../../src/report'

describe('Reporting channels by activity', () => {
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
