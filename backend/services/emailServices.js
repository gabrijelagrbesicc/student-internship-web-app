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

const sendStatusChangeEmail = async ({
    to,
    studentIme,
    prijavaId,
    stariStatus,
    noviStatus,
    nazivPozicije,
}) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP nije konfiguriran.");
        return;
    }

    const transporter = createTransporter();
    const stari = statusLabels[stariStatus] || stariStatus;
    const novi = statusLabels[noviStatus] || noviStatus;

    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to,
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
        `,
    });

    console.log("E-mail poslan na:", to);
};

module.exports = { sendStatusChangeEmail };