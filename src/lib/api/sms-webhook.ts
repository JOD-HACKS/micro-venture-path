// SMS Webhook Handler - Mock implementation for testing
// In production, this would be implemented as an API route

export interface SMSWebhookPayload {
  From: string;
  Body: string;
  MessageSid: string;
  AccountSid: string;
  MessagingServiceSid?: string;
  NumMedia: string;
  ProfileName?: string;
  SmsMessageSid: string;
  SmsSid: string;
  SmsStatus: string;
  To: string;
  ApiVersion: string;
}

export interface ParsedSMSApplication {
  command: string;
  projectId: string;
  message?: string;
  isValid: boolean;
  errors: string[];
}

/**
 * Parse SMS application format: "APPLY <PROJECT_ID> <OPTIONAL_MESSAGE>"
 */
export function parseSMSApplication(smsBody: string): ParsedSMSApplication {
  const result: ParsedSMSApplication = {
    command: '',
    projectId: '',
    message: '',
    isValid: false,
    errors: []
  };

  const trimmedBody = smsBody.trim();
  const parts = trimmedBody.split(' ');

  if (parts.length < 2) {
    result.errors.push('Invalid format. Use: APPLY <PROJECT_ID> <OPTIONAL_MESSAGE>');
    return result;
  }

  const command = parts[0].toUpperCase();
  if (command !== 'APPLY') {
    result.errors.push('Command must be APPLY');
    return result;
  }

  const projectId = parts[1];
  if (!projectId || projectId.length < 1) {
    result.errors.push('Project ID is required');
    return result;
  }

  result.command = command;
  result.projectId = projectId;
  result.message = parts.slice(2).join(' ') || 'Applied via SMS';
  result.isValid = true;

  return result;
}

/**
 * Mock SMS webhook handler - simulates Twilio/Gupshup webhook
 */
export async function handleSMSWebhook(payload: SMSWebhookPayload): Promise<{
  success: boolean;
  applicationId?: string;
  error?: string;
  responseMessage: string;
}> {
  try {
    console.log('SMS Webhook received:', payload);

    // Parse the SMS body
    const parsed = parseSMSApplication(payload.Body);
    
    if (!parsed.isValid) {
      return {
        success: false,
        error: parsed.errors.join(', '),
        responseMessage: `Error: ${parsed.errors.join(', ')}. Format: APPLY <PROJECT_ID> <MESSAGE>`
      };
    }

    // TODO: Validate project exists
    // const project = await db.getProject(parsed.projectId);
    // if (!project) {
    //   return {
    //     success: false,
    //     error: 'Project not found',
    //     responseMessage: `Project ${parsed.projectId} not found. Please check the project ID.`
    //   };
    // }

    // TODO: Create application in database
    // const application = await db.createApplicationFromSMS({
    //   phone: payload.From,
    //   message: parsed.message,
    //   projectId: parsed.projectId
    // });

    // Mock application creation
    const mockApplicationId = `app_sms_${Date.now()}`;
    
    console.log('SMS Application created:', {
      id: mockApplicationId,
      projectId: parsed.projectId,
      phone: payload.From,
      message: parsed.message
    });

    return {
      success: true,
      applicationId: mockApplicationId,
      responseMessage: `✅ Application submitted for project ${parsed.projectId}! Reference: ${mockApplicationId}. You'll receive updates on this number.`
    };

  } catch (error) {
    console.error('SMS Webhook error:', error);
    return {
      success: false,
      error: 'Internal server error',
      responseMessage: 'Sorry, there was an error processing your application. Please try again later.'
    };
  }
}

/**
 * Generate TwiML response for SMS reply
 */
export function generateTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}

/**
 * Test SMS webhook with sample payloads
 */
export const sampleSMSPayloads = {
  validApplication: {
    From: '+919876543210',
    Body: 'APPLY 1 I am interested in this rural e-commerce project. I have experience in React Native.',
    MessageSid: 'SM1234567890abcdef1234567890abcdef',
    AccountSid: 'AC1234567890abcdef1234567890abcdef',
    NumMedia: '0',
    SmsMessageSid: 'SM1234567890abcdef1234567890abcdef',
    SmsSid: 'SM1234567890abcdef1234567890abcdef',
    SmsStatus: 'received',
    To: '+919876543210',
    ApiVersion: '2010-04-01'
  } as SMSWebhookPayload,

  invalidFormat: {
    From: '+919876543210',
    Body: 'Hello, I want to apply',
    MessageSid: 'SM1234567890abcdef1234567890abcdef',
    AccountSid: 'AC1234567890abcdef1234567890abcdef',
    NumMedia: '0',
    SmsMessageSid: 'SM1234567890abcdef1234567890abcdef',
    SmsSid: 'SM1234567890abcdef1234567890abcdef',
    SmsStatus: 'received',
    To: '+919876543210',
    ApiVersion: '2010-04-01'
  } as SMSWebhookPayload,

  minimalApplication: {
    From: '+919876543210',
    Body: 'APPLY 2',
    MessageSid: 'SM1234567890abcdef1234567890abcdef',
    AccountSid: 'AC1234567890abcdef1234567890abcdef',
    NumMedia: '0',
    SmsMessageSid: 'SM1234567890abcdef1234567890abcdef',
    SmsSid: 'SM1234567890abcdef1234567890abcdef',
    SmsStatus: 'received',
    To: '+919876543210',
    ApiVersion: '2010-04-01'
  } as SMSWebhookPayload
};