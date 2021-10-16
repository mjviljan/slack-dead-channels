# A bot for reporting inactive Slack channels

The program fetches the latest message¹ for each public channel in a Slack workspace and prints a report of all channels including their name and the time it's been since their latest message (in days), ordered from the most inactive channel to the most active.

It also reports all channels with less than 3 members as such channels could possibly be replaced with direct messages.

The program takes an optional parameter to limit the results of the first listing to only those channels that have been inactive for longer than the given amount of days.

Running the program with a limit parameter:
```
yarn start --limit 100
``` 
(or `yarn start -l 100` in short).

¹Note: The program fetches only the latest top-level post to each channel, so replies made in threads are not taken into account.
