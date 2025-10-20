# NotifyNL plugin

This plugin integrates the NotifyNL service into Valtimo, allowing users to send e-mails and SMS directly from Valtimo processes.

## Capabilities

This plugin has two actions:

1. Send email: Send an email via NotifyNL
2. Send SMS: Send an SMS via NotifyNL

---

# Plugin Setup Guide

Follow these steps to set up the plugin properly:

---

### Step 1: Create a NotifyNL Account

Go to [notifynl website](https://admin.notifynl.nl/) and create an account and log in.

### Step 2: Generate an API Token

1. Go to your **API Integration**.
2. Click on the **"API Keys"** tab.
3. Click on the **"Create an API key"** button.
4. Give your token a **name**.
5. Set an **key type**.
6. Click **"Continue"** to create your token.

> **Important:** Copy the token and store it safely. You won't be able to see it again.

---

### Step 3: Configure in Valtimo

1. Go to **Valtimo** and open the **Plugins** tab.
2. Search for the **NotifyNL Plugin** and click on it.
3. The token created by NotifyNL contains three parts, first the token name, the second five columns are the service, and the last 5 columns are the token. <br>
For example if your token is: apikey-11a22da9-ece8-4b8e-a7de-c80f16be3ccf-a7613925-c526-485d-9a25-1b23ef8d85b9
    - Token Name: apikey
    - Service: 11a22da9-ece8-4b8e-a7de-c80f16be3ccf
    - Key: c80f16be3ccf-a7613925-c526-485d-9a25-1b23ef8d85b9
4. Click **"Save"** to store your configuration.

---

### Step 4: Start Using the Plugin

1. Go to the **NotifyNL Case** under the tab **cases**.
2. Start a new **case**.
3. Select the **process** you want to start.
4. Fill in the **recipient** you want to message.
5. Click **"Submit"** to send your message to the recipient.
---
