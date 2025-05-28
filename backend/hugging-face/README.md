# Hugging face plugin

For chatting with an AI agents on Hugging Face.

## Capabilities

This plugin has two actions:

1. Give Summary: Summarizes the given text.
2. Chat: Chat with the AI agent.

---

# Plugin Setup Guide

Follow these steps to set up the plugin properly:

---

### Step 1: Create a Hugging Face Account

Go to [https://huggingface.co](https://huggingface.co) and create a free account.

### Step 2: Generate an API Token

1. Go to your **profile settings**.
2. Click on the **"Access Tokens"** tab.
3. Click on the **"Create new token"** button.
4. Give your token a **name** and select the **scopes** (we recommend selecting **fine-grained**).
5. Optionally set an **expiration date** and **permissions**.
6. Click **"Create token"** to create your token.

> **Important:** Copy the token and store it safely. You won't be able to see it again later.

---

### Step 3: Configure in Valtimo

1. Go to **Valtimo** and open the **Plugins** tab.
2. Search for the **Smart Task Plugins** with **(autodeployed)** behind it and click on it.
3. Paste the token you copied earlier into the **Token** field.
4. Click **"Save"** to store your configuration.
5. Repeat this for the other plugin **Smart Task Plugin** so all processes are Executable.

---

### Step 4: Start Using the Plugin

1. Go to the **Autodeployed Case** under the tab **cases**.
2. Start a new **case**.
3. Select the **process** you want to start (e.g., **pingpong**).
4. Fill in the **question** you want to ask.
5. Click **"Submit"** to send your question to the AI agent.
6. **Enjoy your conversation** with the AI agent!
--- 
### File-to-Text Plugin Configuration

To use the **File-to-Text** plugin action, you’ll need to:

1. Create a **Mistral** account by visiting [https://mistral.ai](https://mistral.ai) and clicking ***Try the API**.
2. Generate an **API key** from your account settings.

> The process is nearly identical to the Hugging Face API key generation:
>
> * Navigate to your **profile settings**.
> * Go to the **API Keys** section.
> * Click **“Create new key”**, provide a name and an optional expiration date and create the new key.
> * Copy and store the key securely—you won’t be able to view it again later.

3. Return to the **File-to-Text Plugin** configuration in **Valtimo**.
4. Paste the generated API key into the plugin’s **Token** field.
5. Click **“Save”** to finalize the configuration.
