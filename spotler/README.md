# Spotler plugin

Spotler plugin, previously FlowMailer, is a plugin to automate sending emails through Valtimo

## Creating Spotler credentials
Log in to your spotler account at https://login.flowmailer.net/login.html.

Next, go to settings > sources & API. Click on `API` in the table and press the `Create API credentials` button.

Enter the required information and click `Add API credentials`.

The page will now show credential information. Note down the Client ID, Account ID and Client Secret



## Configuring the plugin
Create your plugin configuration in Admin > Plugins. Press the `Configure Plugin` button in the top right and choose spotler from the list of plugins.

Come up with a configuration ID and configuration name.

Fill in the Client ID, Account ID and Client Secret, which were created in the previous paragraph and save the configuration



## Configuring the action
Make sure you already have a BPMN process configured where you want the email to be sent from.

Navigate to Admin > Form links Plugin and select your process from the list. Click on the Service Task where you want to send an e-mail.

This will show a popup where you can select the plugin configuration that was created previously. Next, select the `Send an Email` action.

In the last page you can configure the details for the email.

If you want to reference variables from the process, you can use the `pv:` prefix. For instance, getting the subject from the process could be configured as `pv:subject`.
