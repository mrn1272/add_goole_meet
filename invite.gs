function checkForNewEvents() {
  const calendarId = 'primary';
  const now = new Date();
  const minutesFromLastUpdate = 5;
  const updatedMin = new Date(now.getTime() - minutesFromLastUpdate * 60000);
  const events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
    updatedMin: updatedMin.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 10,
  });

  if (events.items && events.items.length > 0) {
    for (let i = 0; i < events.items.length; i++) {
      let event = events.items[i];
      const title = event.summary || "(No title)";
      const eventId = event.id;

      Logger.log(`▶ Processing: "${title}" (ID: ${eventId})`);

      // Skip: cancelled or all-day events
      if (event.status === 'cancelled') {
        Logger.log("↳ Skipped: Event is cancelled");
        continue;
      }

      if (event.start.date) {
        Logger.log("↳ Skipped: All-day event");
        continue;
      }

      // Skip: no guests or wrong location
      if (!event.attendees) {
        Logger.log("↳ Not updated: No attendees");
        continue;
      }

      if (!event.location || !event.location.toLowerCase().includes("google meet")) {
        Logger.log("↳ Not updated: Location does not mention 'Google Meet'");
        continue;
      }

      // Skip: already has Google Meet
      if (event.conferenceData) {
        Logger.log("↳ Skipped: Google Meet already added");
        continue;
      }

      // Skip: already handled by script
      if (
        event.extendedProperties &&
        event.extendedProperties.private &&
        event.extendedProperties.private.scriptHandled === "true"
      ) {
        Logger.log("↳ Skipped: Already processed by script");
        continue;
      }

      // Add Google Meet + mark as handled
      event.conferenceData = {
        createRequest: {
          requestId: Utilities.getUuid(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };

      event.extendedProperties = event.extendedProperties || {};
      event.extendedProperties.private = event.extendedProperties.private || {};
      event.extendedProperties.private.scriptHandled = "true";

      try {
        const updatedEvent = Calendar.Events.update(event, calendarId, event.id, {
          conferenceDataVersion: 1,
          sendUpdates: 'all',
        });

        Logger.log("Google Meet added and marked as handled");
      } catch (e) {
        Logger.log("!! Error while updating event: " + e.toString());
      }
    }
  } else {
    Logger.log("No relevant events found.");
  }
}
