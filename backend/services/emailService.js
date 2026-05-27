const nodemailer = require("nodemailer");

const statusLabels = {
    predano: "Predano",
    u_obradi: "U obradi",
    odobreno: "Odobreno",
    u_tijeku: "U tijeku",
    zavrseno: "Završeno",
    odbijeno: "Odbijeno",
};

const createTransporter = () => {
    if (process.env.GMAIL_REFRESH_TOKEN) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            },
        });
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const isEmailConfigured = () => {
    if (process.env.GMAIL_REFRESH_TOKEN) {
        return !!(
            process.env.GMAIL_USER &&
            process.env.GMAIL_CLIENT_ID &&
            process.env.GMAIL_CLIENT_SECRET
        );
    }
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
};

const getFromAddress = () => {
    return (
        process.env.MAIL_FROM ||
        process.env.GMAIL_USER ||
        process.env.SMTP_USER
    );
};

/** Ako je FORCE_EMAIL_TO u .env, svi mailovi idu tamo (npr. za test). */
const resolveRecipient = (originalTo) => {
    const forced = process.env.FORCE_EMAIL_TO?.trim();
    if (forced) {
        return {
            to: forced,
            originalTo:
                originalTo && originalTo !== forced ? originalTo : null,
        };
    }
    return { to: originalTo, originalTo: null };
};

const sendStatusChangeEmail = async ({
    to,
    studentIme,
    prijavaId,
    stariStatus,
    noviStatus,
    nazivPozicije,
}) => {
    if (!isEmailConfigured()) {
        console.warn("E-mail nije konfiguriran (provjeri .env).");
        return;
    }

    const { to: recipient, originalTo } = resolveRecipient(to);

    if (!recipient) {
        console.warn("Nema adrese primatelja.");
        return;
    }

    const transporter = createTransporter();
    const stari = statusLabels[stariStatus] || stariStatus;
    const novi = statusLabels[noviStatus] || noviStatus;

    const overrideNote = originalTo
        ? `<p><em>(Test: obavijest bi inače išla na ${originalTo})</em></p>`
        : "";

    await transporter.sendMail({
        from: getFromAddress(),
        to: recipient,
        subject: `Promjena statusa prijave prakse #${prijavaId}`,
        html: `
            <p>Poštovani/a ${studentIme},</p>
            <p>Status vaše prijave prakse je promijenjen.</p>
            <ul>
                <li><strong>Prijava:</strong> #${prijavaId}</li>
                <li><strong>Pozicija:</strong> ${nazivPozicije || "-"}</li>
                <li><strong>Stari status:</strong> ${stari}</li>
                <li><strong>Novi status:</strong> ${novi}</li>
            </ul>
            ${overrideNote}
            <p>Sustav za studentsku praksu</p>
        `,
    });

    if (originalTo) {
        console.log(
            `E-mail poslan na: ${recipient} (test mod – student: ${originalTo})`
        );
    } else {
        console.log("E-mail poslan na:", recipient);
    }
};

module.exports = { sendStatusChangeEmail };
