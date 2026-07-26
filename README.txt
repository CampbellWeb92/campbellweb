CAMPBELLWEB QUICK ENQUIRY FORM — RELIABILITY FIX

WHY IT WAS STILL FAILING
- The live form was still posting to the visible email-address endpoint.
- The FormSubmit activation email supplied a confirmed random endpoint specifically for this form.
- The form also still had JavaScript changing the submit button during submission, adding an unnecessary failure point.
- FormSubmit's default CAPTCHA can prevent completion if the visitor does not finish the external challenge.

WHAT WAS CHANGED
1. The form action now uses the confirmed FormSubmit endpoint supplied in the activation email.
2. Added _captcha=false so the form submits directly without an external CAPTCHA page.
3. Added _url=https://campbellweb.co.za/ so FormSubmit can identify the exact website source.
4. Kept the redirect to https://campbellweb.co.za/thank-you.html.
5. Removed JavaScript interception from the enquiry form. It now uses a plain, reliable HTML POST.

HOW TO PUBLISH
1. Rename the supplied file to index.html if your upload system changes its name.
2. Replace the live root index.html with this fixed index.html.
3. Upload thank-you.html into the same root folder.
4. Wait a few minutes, then refresh the live site with Ctrl+F5.
5. Test only from https://campbellweb.co.za/ — FormSubmit may reject pages opened directly from your computer as file:// pages.
6. Complete all required fields and tick the privacy checkbox.
7. Check Inbox, Updates, Promotions and Spam for the subject: New CampbellWeb website enquiry.

IMPORTANT
Do not change the FormSubmit action endpoint unless you intentionally create and activate a new form endpoint.
