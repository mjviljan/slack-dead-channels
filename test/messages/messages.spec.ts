import getChannelMessages, { MessageHistoryFetcher, LatestMessagesResult } from '../../src/messages'
import * as fakeMessage from './fakeMessage.json'

describe('Getting list of messages for channel', () => {
    const FAKE_CHANNEL_ID = 'CH4N3L'

    test('throws an error when response has a negative "ok" flag', async () => {
        try {
            await getChannelMessages(FakeWebClient.returningMessageList({ ok: false }), FAKE_CHANNEL_ID)
            fail('Should have thrown an error')
        } catch {
            // expected
        }
    })

    test('returns the (only) message returned by Slack', async () => {
        const response = await getChannelMessages(
            FakeWebClient.returningMessageList({ ok: true, messages: [fakeMessage] }),
            FAKE_CHANNEL_ID,
        )
        expect(response).toBe(fakeMessage)
    })

    test('returns undefined if Slack returns no messages', async () => {
        const response = await getChannelMessages(
            FakeWebClient.returningMessageList({ ok: true, messages: [] }),
            FAKE_CHANNEL_ID,
        )
        expect(response).toBeUndefined()
    })
})

class FakeWebClient implements MessageHistoryFetcher {
    static returningMessageList(response: LatestMessagesResult): FakeWebClient {
        return new FakeWebClient(response)
    }

    private constructor(private fakeMessageListing: LatestMessagesResult) {}

    get conversations() {
        return {
            history: () => Promise.resolve(this.fakeMessageListing),
        }
    }
}
