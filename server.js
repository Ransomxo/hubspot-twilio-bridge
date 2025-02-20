const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const twilio = require('twilio');
const { Client } = require('@hubspot/api-client');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const hubspotClient = new Client({ apiKey: process.env.HUBSPOT_API_KEY });

// Endpoint to send SMS
app.post('/send-sms', (req, res) => {
    const { to, message } = req.body;

    twilioClient.messages
        .create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        })
        .then(message => res.status(200).send(`Message SID: ${message.sid}`))
        .catch(e => res.status(500).send(e.message));
});

// Endpoint to receive and log SMS in HubSpot
app.post('/webhook/sms', async (req, res) => {
    const { Body, From } = req.body;
    
    try {
        const result = await hubspotClient.crm.contacts.basicApi.create({ properties: { firstname: From, lastname: 'SMS User', phone: From, last_sms_received: Body } });
        console.log(`New contact created: ${result.id}`);
        res.status(200).send('SMS received and logged in HubSpot');
    } catch (error) {
        console.error('Failed to log SMS in HubSpot', error);
        res.status(500).send('Failed to log SMS');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
