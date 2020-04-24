# A bot for reporting inactive Slack channels

The bot fetches the latest message¹ for each public channel in a Slack workspace and prints a report of all channels including their name and the time of their latest message, ordered from the most inactive channel to the most active.

It also reports all channels with less than 3 members as such channels could possibly be replaced with direct messages.

¹Note: The bot fetches only the latest top-level post to each channel, so replies made in threads are not taken into account.

(Also, it's not really _a bot_ yet, just a program you can run locally...)
