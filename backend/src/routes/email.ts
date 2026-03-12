import { Router } from 'express';
import { Resend } from 'resend';

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

const resend = new Resend(process.env.RESEND_API_KEY!);
const router = Router();

// Välkomstmejl
router.post('/send-welcome-email', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: 'Missing to or name' });
  }

  try {
    const html = `
      <h1>Välkommen!</h1>
      <p>Tack för att du använder DinnerWise.</p>
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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: [to],
      subject: `Välkommen till DinnerWise!`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till värd
router.post('/send-host-email', async (req, res) => {
  const { restaurant, date, event, participants, eventId, name, slug } =
    req.body;

  if (
    !restaurant ||
    !date ||
    !event ||
    !participants ||
    !eventId ||
    !name ||
    !slug
  ) {
    return res.status(400).json({
      error:
        'Missing restaurant, date, event, participants, eventId, name or slug',
    });
  }

  try {
    const bookingUrl = `http://localhost:5173/`;
    const formattedDate = formatDate(date);
    const html = `
      <h1>Ditt event är bokat, ${name}</h1>
      <p>Du har nu bokat ditt event ${event} (ID: ${eventId}) den ${formattedDate} med ${participants} deltagare.</p>
      <p>Bokningen ska först godkännas av ${restaurant}, sedan kan du se ditt event på DinnerWise.</p>
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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: 'jessicaagren@hotmail.com',
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
router.post('/send-restaurant-booking-email', async (req, res) => {
  const { restaurant, date, event, participants, eventId, name, slug } =
    req.body;

  if (
    !restaurant ||
    !date ||
    !event ||
    !participants ||
    !eventId ||
    !name ||
    !slug
  ) {
    return res.status(400).json({
      error:
        'Missing restaurant, date, event, participants, eventId, name or slug',
    });
  }

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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: 'jessicaagren@hotmail.com',
      subject: `Inkommande bokning från DinnerWise`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till deltagare
router.post('/send-booking-email', async (req, res) => {
  const { restaurant, date, startTime, event, path } = req.body;

  if (!restaurant || !date || !startTime || !event || !path) {
    return res
      .status(400)
      .json({ error: 'Missing restaurant, date, event or path' });
  }

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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: 'jessicaagren@hotmail.com',
      subject: `Bokningsbekräftelse för ${event}`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Bokningsmejl till väntelistedeltagare
router.post('/send-waitlist-email', async (req, res) => {
  const { restaurant, date, startTime, event, path } = req.body;

  if (!restaurant || !date || !startTime || !event || !path) {
    return res
      .status(400)
      .json({ error: 'Missing restaurant, date, event or path' });
  }

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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: 'jessicaagren@hotmail.com',
      subject: `Tack för ditt intresse`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// Delning på mejl
router.post('/send-share-email', async (req, res) => {
  const { to, name, event, path, emailMessage } = req.body;

  if (!to || !name || !event || !path || !emailMessage) {
    return res
      .status(400)
      .json({ error: 'Missing to, name, event, path or emailMessage' });
  }

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

    const data = await resend.emails.send({
      from: 'DinnerWise <onboarding@resend.dev>',
      to: [to],
      subject: `Vill du med på event?`,
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
