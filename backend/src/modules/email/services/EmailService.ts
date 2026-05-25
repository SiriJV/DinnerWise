import { Resend } from 'resend';
import { ApiError } from '../../../shared/errors/ApiError.js';

export class EmailService {
  private resend: Resend | null;
  private brandName?: string;
  private contactEmail?: string;
  private newsLetterEmail?: string;

  constructor() {
    this.brandName = process.env.BRAND_NAME;
    this.contactEmail = process.env.CONTACT_EMAIL;
    this.newsLetterEmail = process.env.NEWSLETTER_EMAIL;

    if (!this.contactEmail) {
      throw new Error('CONTACT_EMAIL is not defined');
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    this.resend = resendApiKey ? new Resend(resendApiKey) : null;
  }

  isConfigured() {
    return !!this.resend;
  }

  private checkRequiredFields(obj: any, fields: string[]): void {
    for (const field of fields) {
      if (!obj[field]) {
        throw ApiError.badRequest(`Faltet ${field} saknas`);
      }
    }
  }

  private checkAllFieldsRequired(obj: any): void {
    this.checkRequiredFields(obj, Object.keys(obj));
  }

  private formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  async sendWelcomeEmail(payload: { to: string }) {
    if (!payload.to) {
      throw ApiError.badRequest('Mottagare saknas');
    }

    const html = `
      <h1>Valkommen!</h1>
      <p>Tack for att du anvander ${this.brandName}.</p>
      <a href="http://localhost:5173/"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Ga till hemsidan
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [payload.to],
      subject: `Valkommen till ${this.brandName}!`,
      html,
    });

    return { success: true, data };
  }

  async sendHostEmail(payload: any) {
    this.checkRequiredFields(payload, [
      'restaurant',
      'date',
      'event',
      'participants',
      'eventId',
      'name',
    ]);

    const { restaurant, date, event, participants, eventId, name, to } = payload;
    const bookingUrl = 'http://localhost:5173/';
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Ditt event ar bokat, ${name}</h1>
      <p>Du har nu bokat ditt event ${event} (ID: ${eventId}) den ${formattedDate} med ${participants} deltagare.</p>
      <p>Bokningen ska forst godkannas av ${restaurant}, sedan kan du se ditt event pa ${this.brandName}.</p>
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

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: 'Ditt event ar bokat!',
      html,
    });

    return { success: true, data };
  }

  async sendRestaurantBookingEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, event, participants, eventId, name, slug, to } = payload;
    const bookingUrl = `http://localhost:5173/bokningshantering/${slug}?eventId=${eventId}`;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Inkommande bokning, ${restaurant}</h1>
      <p>Du har en inkommande bokning den ${formattedDate} for eventet ${event} (ID: ${eventId}) med ${participants} deltagare.</p>
      <p>Bokningen ar gjord av ${name}.</p>
      <a href="${bookingUrl}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Godkann eller avvisa bokning har
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: `Inkommande bokning fran ${this.brandName}`,
      html,
    });

    return { success: true, data };
  }

  async sendConfirmationEmailToHost(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, event, participants, eventId, name, path, to } = payload;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Ditt event ar bekratftat av restaurangen, ${name}!</h1>
      <p>Ditt event ${event} (ID: ${eventId}) den ${formattedDate} med ${participants} deltagare ar bekratftat av restaurangen ${restaurant}.</p>
      <p>Nu syns ditt event pa ${this.brandName}!</p>
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

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: 'Ditt event ar bokat!',
      html,
    });

    return { success: true, data };
  }

  async sendBookingEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, startTime, event, path, to } = payload;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Hurra! Du ar anmald till ${event}!</h1>
      <p>Du ar anmald till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} pa ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Las mer om eventet har
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: `Bokningsbekraftelse for ${event}`,
      html,
    });

    return { success: true, data };
  }

  async sendBookingEmailToHost(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, startTime, event, path, name, to } = payload;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Hurra! En ny deltagare ar anmald till ${event}!</h1>
      <p>${name} ar anmald till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} pa ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Se eventet har      
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: `Ny anmalan till ${event}`,
      html,
    });

    return { success: true, data };
  }

  async sendWaitlistEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, startTime, event, path, to } = payload;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>Tack for ditt intresse for ${event}.</h1>
      <p>Du ar nu uppskriven pa vantelista till ${event}, ${formattedDate}, kl. ${startTime.slice(0, 5)} pa ${restaurant}.</p>
      <p>Vi kontaktar dig om en plats blir ledig.</p>
      <p>Hor garna av dig om du har nagra fragor eller ar intresserad av ett annat event.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Las mer om eventet har
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: 'Tack for ditt intresse',
      html,
    });

    return { success: true, data };
  }

  async sendWaitlistEmailToHost(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { restaurant, date, startTime, event, path, name, to } = payload;
    const formattedDate = this.formatDate(date);
    const html = `
      <h1>En ny deltagare har skrivit upp sig pa vantelista till ${event}!</h1>
      <p>${name} har skrivit upp sig pa vantelista till ${event} ${formattedDate}, kl. ${startTime.slice(0, 5)} pa ${restaurant}.</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Se eventet har      
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: `Ny person pa vantelista till ${event}`,
      html,
    });

    return { success: true, data };
  }

  async sendFeedbackEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { event, path, name, to } = payload;
    const html = `
      <h1>Hej, ${name}! </h1>
      <p>Du var nyss pa ${event}, och vi hoppas att du hade ett givande mote.</p>
      <p>Nu behover vi dina asikter kring eventet, varden och bokningsprocessen for att kunna forbattrra upplevelsen framover.</p>
      <p>Tack sa mycket for att du hjalper oss att bli battre!</p>
      <a href="${path}"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
        Ge feedback har
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: `Vi behover din feedback pa ${event}`,
      html,
    });

    return { success: true, data };
  }

  async sendShareEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { to, event, path, emailMessage } = payload;
    const html = `
      <h1>Din van vill ga pa ${event} med dig</h1>
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
         Ga till eventet
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.contactEmail}>`,
      to: [to],
      subject: 'Vill du med pa event?',
      html,
    });

    return { success: true, data };
  }

  async sendNewsletterConfirmationEmail(payload: any) {
    this.checkAllFieldsRequired(payload);

    const { to, name } = payload;
    const html = `
      <h1>Hej, ${name}!</h1>
      <p>Tack for att du har skrivit upp dig pa vart nyhetsbrev! Nu far du de senaste uppdateringarna, vara basta tips och exklusiva erbjudanden direkt i din inkorg!</p>
      <a href="http://localhost:5173/"
         style="
          display:inline-block;
          padding:10px 20px;
          background:#e84132;
          color:white;
          text-decoration:none;
          border-radius:6px;
         ">
         Ga till ${this.brandName}
      </a>
    `;

    const data = await this.resend!.emails.send({
      from: `${this.brandName} <${this.newsLetterEmail}>`,
      to: [to],
      subject: 'Tack for att du vill ha nyhetsbrev fran oss! ',
      html,
    });

    return { success: true, data };
  }
}
