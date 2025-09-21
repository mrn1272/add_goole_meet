# Add Google Meet Link to Calendar invites
This script can be used to add Google Meet to Calendar invites, when created in 3-party calendar apps, like Apple Calendar.

The script will and an Google Meet Link to an Calendar Invite, if you write "Google Meet" in the Location of the meeting.
The script will set the visiblity to "Private" in Google calendar if your meeting title start with "Private:"

This script has only been tested using Apple Calendar.

1. Go to https://script.google.com.
2. Create a new project.
3. Paste the code.
4. Click Serives in the left menu
5. Add Google Calendar API
6. Click Triggers in the left menu, look for the alarm clock
7. Click Add Trigger, with the following options:
8.   Choose which function to run: checkForNewEvents
9.   Choose which deployment should run: Head
10.   Select event source: From calendar
11.   Enter calendar details: Calendar updated
12.   Calendar owner email: your@email
