import { App } from '@slack/bolt';
import { DeskThing } from 'deskthing-server';

console.log("SlackThing Server Starting...");

let slackApp: App | null = null;
let currentBotToken: string = '';
let currentAppToken: string = '';

const startSlack = async (botToken: string, appToken: string) => {
    if (!botToken || !appToken) {
        console.warn("Missing Slack tokens. Skipping connection.");
        return;
    }

    if (slackApp) {
        try {
            await slackApp.stop();
            console.log("Stopped existing Slack app instance.");
        } catch (error) {
            console.error("Error stopping Slack app:", error);
        }
    }

    try {
        slackApp = new App({
            token: botToken,
            appToken: appToken,
            socketMode: true
        });

        // Register Event Listeners
        registerListeners(slackApp);

        await slackApp.start();
        console.log('⚡️ Slack app is running via Socket Mode!');
        DeskThing.sendDataToClient({ type: 'status', payload: 'Connected' });
    } catch (error) {
        console.error("Failed to start Slack app:", error);
        DeskThing.sendDataToClient({ type: 'status', payload: 'Error: Connection Failed' });
    }
};

const registerListeners = (app: App) => {
    // Listen for messages in DMs and Channels
    app.event('message', async ({ event, client, logger }) => {
        try {
            // Filter out bot messages or hidden subtypes if necessary
            // @ts-ignore - subtype might not exist on all message events
            if (event.subtype && event.subtype === 'bot_message') return;

            console.log("Received message:", event);

            // Fetch user info to get name and avatar
            // @ts-ignore - user property exists on message event
            const userId = event.user;
            let senderName = "Unknown";
            let senderAvatar = "";

            if (userId) {
                const userResult = await client.users.info({ user: userId });
                if (userResult.user) {
                    senderName = userResult.user.real_name || userResult.user.name || "Unknown";
                    senderAvatar = userResult.user.profile?.image_192 || "";
                }
            }

            // Determine channel type/name
            let channelName = event.channel;
             // If needed, fetch channel info to get a readable name
             // For now, we'll send the raw ID or a placeholder. 
             // Ideally we cache channel names.

            const notificationPayload = {
                id: event.event_ts,
                text: (event as any).text,
                sender: senderName,
                avatar: senderAvatar,
                channel: event.channel, // Channel ID
                timestamp: event.ts
            };

            // Send to DeskThing Client
            DeskThing.sendDataToClient({ type: 'message', payload: notificationPayload });

        } catch (error) {
            logger.error(error);
        }
    });

    app.event('app_mention', async ({ event, client, logger }) => {
         try {
             // Fetch user info
            const userId = event.user;
            let senderName = "Unknown";
            let senderAvatar = "";

            if (userId) {
                const userResult = await client.users.info({ user: userId });
                if (userResult.user) {
                    senderName = userResult.user.real_name || userResult.user.name || "Unknown";
                    senderAvatar = userResult.user.profile?.image_192 || "";
                }
            }

            const notificationPayload = {
                id: event.event_ts,
                text: event.text,
                sender: senderName,
                avatar: senderAvatar,
                channel: event.channel,
                timestamp: event.ts,
                isMention: true
            };

            DeskThing.sendDataToClient({ type: 'message', payload: notificationPayload });
        } catch (error) {
            logger.error(error);
        }
    });
};

// Handle Data from Client (e.g. Settings updates)
DeskThing.on('data', (data: any) => {
    if (data.type === 'settings') {
        const { botToken, appToken } = data.payload;
        if (botToken && appToken) {
            if (botToken !== currentBotToken || appToken !== currentAppToken) {
                currentBotToken = botToken;
                currentAppToken = appToken;
                startSlack(botToken, appToken);
            }
        }
    }
});

// Try to start with environment variables if available (dev mode)
const envBotToken = process.env.SLACK_BOT_TOKEN;
const envAppToken = process.env.SLACK_APP_TOKEN;

if (envBotToken && envAppToken) {
    currentBotToken = envBotToken;
    currentAppToken = envAppToken;
    startSlack(envBotToken, envAppToken);
}
