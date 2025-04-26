import { emailTranslations } from './emailTranslations.js'

export const VERIFICATION_EMAIL_TEMPLATE = (verificationCode, language = 'en') => {
  const t = emailTranslations[language] || emailTranslations.en
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.verifyEmailTitle} - Phansite</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1C2526; font-family: Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto;">
    <tr>
      <td style="background: #AB0000; padding: 20px; text-align: center; position: relative;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">${t.verifyEmailTitle}</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #000; padding: 30px 20px; border: 2px solid #AB0000; border-top: none;">
        <p style="color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.hello}</p>
        <p style="color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.thankYouMessage}</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 5px; color: #FFF; padding: 10px 20px; display: inline-block;">${verificationCode}</span>
        </div>
        <p style="color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.enterCodeMessage}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/verify-email" style="background-color: #F00; color: white; padding: 12px 20px; text-decoration: none; display: inline-block; border: 5px solid #000; outline: 5px solid #FFF; transform: skew(-10deg); transition: all 0.3s;">${t.verifyEmailButton}</a>
        </div>
        
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #BBBBBB;">${t.expiryMessage}</p>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #BBBBBB;">${t.ignoreMessage}</p>
        <p style="color: #FFFFFF; margin: 0; font-size: 16px; line-height: 1.6;">${t.regards}<br>${t.team}</p>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 20px; color: #BBBBBB; font-size: 12px;">
        <p style="margin: 0;">${t.footerContact}</p>
        <p style="margin: 5px 0 0;">${t.footerAutomated}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export const PASSWORD_RESET_REQUEST_TEMPLATE = (resetUrl, language = 'en') => {
  const t = emailTranslations[language] || emailTranslations.en
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.passwordResetTitle} - Phansite</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1C2526; font-family: Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto;">
    <tr>
        <td style="background: #AB0000; padding: 20px; text-align: center; position: relative;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">${t.passwordResetTitle}</h1>
        </td>
      </tr>
    <tr>
      <td style="background-color: #000; color: #FFFFFF; padding: 30px 20px; border: 2px solid #AB0000; border-top: none;">
        <p style=""color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.hello}</p>
        <p style=""color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.passwordResetMessage}</p>
        <p style=""color: #FFFFFF; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${t.resetPasswordInstruction}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #F00; color: white; padding: 12px 20px; text-decoration: none; display: inline-block; border: 5px solid #000; outline: 5px solid #FFF; transform: skew(-10deg); transition: all 0.3s;">${t.resetPasswordButton}</a>
        </div>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #BBBBBB;">${t.resetExpiryMessage}</p>
        <p style=""color: #FFFFFF; margin: 0; font-size: 16px; line-height: 1.6;">${t.regards}<br>${t.team}</p>
      </td>
    </tr>
    <tr>
      <td style="color: #FFFFFF; text-align: center; padding: 20px; color: #BBBBBB; font-size: 12px;">
        <p style="margin: 0;">${t.footerContact}</p>
        <p style="margin: 5px 0 0;">${t.footerAutomated}</p>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
