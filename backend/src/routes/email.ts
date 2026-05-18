import { Router } from 'express';
import { Resend } from 'resend';

const brandName = process.env.BRAND_NAME;
const contactEmail = process.env.CONTACT_EMAIL;
const newsLetterEmail = process.env.NEWSLETTER_EMAIL;

if (!contactEmail) {
  throw new Error('CONTACT_EMAIL is not defined');
}
// Centralized error handling for required fields in email routes
function checkAllFieldsRequired(obj: any, res: any): boolean {
  for (const field of Object.keys(obj)) {
    if (!obj[field]) {
      res.status(400).json({ error: `Missing ${field}` });
      return false;
    }
  }
  return true;
}
// Helper for sending missing field error in email routes
function checkRequiredFields(obj: any, fields: string[], res: any): boolean {
  for (const field of fields) {
    if (!obj[field]) {
      res.status(400).json({ error: `Missing ${field}` });
      return false;
    }
  }
  return true;
}

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Initialize Resend only if API key is provided
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const router = Router();
const devEmail = 'jessicaagren@hotmail.com';

// Middleware to check if Resend is configured
const checkResendConfigured = (req: any, res: any, next: any) => {
  if (!resend) {
    return res.status(503).json({ 
      error: 'Email service is not configured. Set RESEND_API_KEY in .env' 
    });
  }
  next();
};

// Välkomstmejl
router.post('/send-welcome-email', checkResendConfigured, async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Missing to' });
  }

  try {
    const html = `
      <h1>Välkommen!</h1>
      <p>Tack för att du använder ${brandName}.</p>
      <a href="http://localhost:5173/"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Gå till hemsidan
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Välkommen till ${brandName}!`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till värd
router.post('/send-host-email', checkResendConfigured, async (req, res) => {
  const { restaurant, date, event, participants, eventId, name, to } = req.body;
  if (
    !checkRequiredFields(
      req.body,
      ['restaurant', 'date', 'event', 'participants', 'eventId', 'name'],
      res,
    )
  )
    return;

  try {
    const bookingUrl = `http://localhost:5173/`;
    const formattedDate = formatDate(date);
    const html = `
      <h1>Ditt event är bokat, ${name}</h1>
      <p>Du har nu bokat ditt event ${event} (ID: ${eventId}) den ${formattedDate} med ${participants} deltagare.</p>
      <p>Bokningen ska först godkännas av ${restaurant}, sedan kan du se ditt event på ${brandName}.</p>
      <a href="${bookingUrl}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
        Se ditt event     
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Ditt event är bokat!`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till restaurang
router.post('/send-restaurant-booking-email', checkResendConfigured, async (req, res) => {
  const { restaurant, date, event, participants, eventId, name, slug, to } =
    req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const bookingUrl = `http://localhost:5173/bokningshantering/${slug}?eventId=${eventId}`;
    const formattedDate = formatDate(date);
    const html = `
      <h1>Inkommande bokning, ${restaurant}</h1>
      <p>Du har en inkommande bokning den ${formattedDate} för eventet ${event} (ID: ${eventId}) med ${participants} deltagare.</p>
      <p>Bokningen är gjord av ${name}.</p>
      <a href="${bookingUrl}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Godkänn eller avvisa bokning här
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Inkommande bokning från ${brandName}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bekräftelsemejl till värd
router.post('/send-confirmation-email-to-host', checkResendConfigured, async (req, res) => {
  const { restaurant, date, event, participants, eventId, name, path, to } =
    req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const formattedDate = formatDate(date);
    const html = `
      <h1>Ditt event är bekräftat av restaurangen, ${name}!</h1>
      <p>Ditt event ${event} (ID: ${eventId}) den ${formattedDate} med ${participants} deltagare är bekräftat av restaurangen ${restaurant}.</p>
      <p>Nu syns ditt event på ${brandName}!</p>
      <p>Dela event med <a href=${path}>${path}</a>.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
        Se ditt event     
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Ditt event är bokat!`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till deltagare
router.post('/send-booking-email', checkResendConfigured, async (req, res) => {
  const { restaurant, date, startTime, event, path, to } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const formattedDate = formatDate(date);
    const html = `
      <h1>Hurra! Du är anmäld till ${event}!</h1>
      <p>Du är anmäld till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} på ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Läs mer om eventet här
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      subject: `Bokningsbekräftelse för ${event}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till värd när deltagare anmält sig
router.post('/send-booking-email-to-host', checkResendConfigured, async (req, res) => {
  const { restaurant, date, startTime, event, path, name, to } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const formattedDate = formatDate(date);
    const html = `
      <h1>Hurra! En ny deltagare är anmäld till ${event}!</h1>
      <p>${name} är anmäld till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} på ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Se eventet här      
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Ny anmälan till ${event}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till väntelistedeltagare
router.post('/send-waitlist-email', checkResendConfigured, async (req, res) => {
  const { restaurant, date, startTime, event, path, to } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const formattedDate = formatDate(date);
    const html = `
      <h1>Tack för ditt intresse för ${event}.</h1>
      <p>Du är nu uppskriven på väntelista till ${event}, ${formattedDate}, kl. ${startTime.slice(0, 5)} på ${restaurant}.</p>
      <p>Vi kontaktar dig om en plats blir ledig.</p>
      <p>Hör gärna av dig om du har några frågor eller är intresserad av ett annat event.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Läs mer om eventet här
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Tack för ditt intresse`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till värd när deltagare skrivit upp sig på väntelista
router.post('/send-waitlist-email-to-host', checkResendConfigured, async (req, res) => {
  const { restaurant, date, startTime, event, path, name, to } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const formattedDate = formatDate(date);
    const html = `
      <h1>En ny deltagare har skrivit upp sig på väntelista till ${event}!</h1>
      <p>${name} har skrivit upp sig på väntelista till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} på ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Se eventet här      
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Ny person på väntelista till ${event}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Feedbackmejl till deltagare
router.post('/send-feedback-email', checkResendConfigured, async (req, res) => {
  const { event, path, name, to } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const html = `
      <h1>Hej, ${name}! </h1>
      <p>Du var nyss på ${event}, och vi hoppas att du hade ett givande möte.</p>
      <p>Nu behöver vi dina åsikter kring eventet, värden och bokningsprocessen för att kunna förbättra upplevelsen framöver.</p>
      <p>Tack så mycket för att du hjälper oss att bli bättre!</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
        Ge feedback här
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Vi behöver din feedback på ${event}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Delning på mejl
router.post('/send-share-email', checkResendConfigured, async (req, res) => {
  const { to, event, path, emailMessage } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const html = `
      <h1>Din vän vill gå på ${event} med dig</h1>
      <p>${emailMessage}</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Gå till eventet
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${contactEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Vill du med på event?`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bekräftelse på nyhetsbrev
router.post('/send-newsletter-confirmation-email', checkResendConfigured, async (req, res) => {
  const { to, name } = req.body;
  if (!checkAllFieldsRequired(req.body, res)) return;

  try {
    const html = `
      <h1>Hej, ${name}!</h1>
      <p>Tack för att du har skrivit upp dig på vårt nyhetsbrev! Nu får du de senaste uppdateringarna, våra bästa tips och exklusiva erbjudanden direkt i din inkorg!</p>
      <a href="http://localhost:5173/"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Gå till ${brandName}
      </a>
    `;

    const data = await resend!.emails.send({
      from: `${brandName} <${newsLetterEmail}>`,
      to: [to],
      // to: devEmail,
      subject: `Tack för att du vill ha nyhetsbrev från oss!`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
