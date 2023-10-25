import axios from 'axios';

export const handler = async (event) => {

  for (const record of event.Records) {
    // Check if the event is an insert event to the DynamoDB table
    if (record.eventName === 'INSERT' && record.eventSourceARN.includes('table/new-users')) {
      const email = record.dynamodb.NewImage.email.S; // Extract email from new item
      const firstName = record.dynamodb.NewImage.first_name ? record.dynamodb.NewImage.first_name.S : '';
      const companyId = record.dynamodb.NewImage.company_id.S

      // Construct message payload for the new endpoint
      const payload = {
        email: email,
        first_name: firstName,
        company_name: 'Plannly Health',
        company_id: companyId,
      };

      try {
        // Send a POST request to the endpoint
        await axios.post('https://plannly-send-email.up.railway.app/invite', payload);
        console.log(`Email invite sent to ${email}`);
      } catch (error) {
        console.error(`Failed to send email invite to ${email}. Error:`, error);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify(event) };
};
