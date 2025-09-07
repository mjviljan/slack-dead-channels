# A bot for reporting inactive Slack channels

The program fetches the latest message¹ for each public channel in a Slack workspace and prints a report of all channels including their name and the time it's been since their latest message (in days), ordered from the most inactive channel to the most active.

It also reports all channels with less than 3 members as such channels could possibly be replaced with direct messages.

## Configuration

You need to create and install a new app to your Slack workspace following these steps:
- Create a new app on the [app page](https://api.slack.com/apps)
- Under "OAuth & Permissions", add the user token scopes `channels:history` and `channels:read`
- Install the app to your workspace
- Add a User OAuth Token
- Rename/copy the file `.env.template` as `.env`, and add your newly-created token as the value of `SLACK_TOKEN`

## Running the program

You can run the program by running the following command in the terminal in the project root: 
```shell
yarn start
``` 

### Limiting the output

By default the program lists all public channels in the workspace, reporting the number of inactive days for each (as well as all the channels with less than 3 members).

However, you can run the program with an optional parameter to limit the results of the first listing to only those channels that have been inactive for longer than the given amount of days.

Run the program and only list channels (in the inactivity listing) that have been quiet for at least 100 days:
```shell
yarn start --limit 100
``` 
(or `yarn start -l 100` in short).

¹Note: The program fetches only the latest top-level post to each channel, so replies made in threads are not taken into account.

## Possible issues

If the Slack organization has plenty of channels, fetching their latest activity with numerous calls to Slack's API may fail because of rate limiting on the API's end.

It's possible the API has changed and there would be a better way to get the needed info nowadays, but if not, the best way to get around the limitation is to limit the number of channels to fetch in the code. (There's no parameter for that.)
