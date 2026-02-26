# EmailJS Template Configuration

To ensure your emails are sent correctly, please create a new template in your EmailJS dashboard with the following settings:

## Template Settings

1.  **Subject**: `New Solar Quote Request from {{to_name}}`
2.  **To Email**: YOUR_EMAIL_ADDRESS (e.g., `adamsromeo163@gmail.com`)
    *   *This ensures YOU receive the lead notification.*
    *   *If you want the customer to also receive a copy, add `{{to_email}}` in the BCC field.*
3.  **From Name**: `Lightsup Energy`
4.  **From Email**: (Your verified sender email)
5.  **Reply To**: `{{to_email}}`

## Email Content (HTML)

Copy and paste the following into the HTML editor of your template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #00A3E0;">Solar Quote Confirmation</h2>
    <p>Hello {{to_name}},</p>
    <p>Thank you for contacting Lightsup Energy Solutions. We have received your request and will get back to you shortly.</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1D1D42;">Request Details</h3>
        <pre style="white-space: pre-wrap; font-family: inherit; color: #555;">{{message}}</pre>
    </div>
    
    <p>If you have any urgent questions, please call us at <strong>07036791927</strong>.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
        &copy; 2024 Lightsup Energy Solutions. All rights reserved.
    </p>
</div>
```

## Final Step

After creating the template:
1.  Copy the **Template ID** (e.g., `template_abc123`).
2.  Open `src/config/email.ts` in your project.
3.  Replace `'template_default'` with your new Template ID.
