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
})
