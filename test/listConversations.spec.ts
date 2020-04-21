import getChannels, { ConversationFetcher } from '../src/listConversations'
import { WebAPICallResult } from '@slack/web-api'
import * as fakeChannels from './fakeChannelListing.json'

describe('Getting list of channels', () => {
    test('throws an error when response has a negative "ok" flag', async () => {
        try {
            await getChannels(FakeWebClient.returningChannelList({ ok: false }))
            fail('Should have thrown an error')
        } catch {
            // expected
        }
    })

    test('throws an error when response has no channel listing', async () => {
        try {
            await getChannels(FakeWebClient.returningChannelList({ ok: true }))
            fail('Should have thrown an error')
        } catch {
            // expected
        }
    })

    test('returns correct number of results when response has channels', async () => {
        const response = await getChannels(
            FakeWebClient.returningChannelList({
                ok: true,
                channels: fakeChannels,
            }),
        )
        expect(response.length).toBe(2)
    })
})

class FakeWebClient implements ConversationFetcher {
    static returningChannelList(response: WebAPICallResult): FakeWebClient {
        return new FakeWebClient(response)
    }

    private constructor(private fakeChannelListing: WebAPICallResult) {}

    get conversations() {
        return {
            list: () => Promise.resolve(this.fakeChannelListing),
        }
    }
}
