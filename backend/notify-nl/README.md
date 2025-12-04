# NotifyNL plugin

The NotifyNL plugin integrates the NotifyNL service into Valtimo, allowing users to send e-mails and SMS or physical letters directly from a Valtimo process.

## Capabilities

This plugin has six actions:

1. Send E-mail: Send an email via NotifyNL
2. Send SMS: Send an SMS via NotifyNL
3. Send Letter: Send a physical letter to someone's address
4. Get Template: Retrieves a template by ID
5. Get All Templates: Retrieves all templates or filter a specific type
6. Get Message: Retrieves a message by ID found in the NotifyNL admin panel

---

# Plugin Setup Guide

Follow these steps to set up the plugin properly:

### Step 1: Create a NotifyNL Account

Go to [NotifyNL Website](https://admin.notifynl.nl/) and create an account and log in.

### Step 2: Generate an API Token

1. Go to your **API Integration**.
2. Click on the **API Keys** tab.
3. Click on the **Create an API key** button.
4. Give your token a **name**.
5. Set a **key type**.
6. Click **Continue** to create your token.

> **Important:** Copy the token and store it safely. You won't be able to see it again.

---

### Step 3: Configure in Valtimo

1. Go to **Valtimo** and open the **Plugins** tab.
2. Search for the **NotifyNL Plugin** and click on it.
3. Paste the token into the API key field.
4. Click **Save** to store your configuration.

---

### Step 4: Start Using the Plugin

1. Go to the **NotifyNL Case** under the tab **cases**.
2. Start a new **case**.
3. Select the **process** you want to start.
4. Fill in the **recipient** you want to message.
5. Click **Submit** to send your message to the recipient.
