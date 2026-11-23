/** Message shown when the contact form has no Web3Forms key configured. */
export function missingKeyMessage(isDev: boolean, email = ""): string {
  if (isDev) {
    return "Please add your VITE_WEB3FORMS_ACCESS_KEY in your .env file or Vercel Environment Variables to receive messages.";
  }
  return `The form is offline right now. Please email me directly at ${email}.`;
}
