const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendStatusChangeEmail = async (studentEmail, applicationId, newStatus, positionName) => {
    const statusMessages = {
        'odobreno': 'Vaša prijava je odobrena!',
        'u_tijeku': 'Vaša studentska praksa je započela.',
        'zavrseno': 'Praksa je završena. Molimo Vas da predate završno izvješće.',
        'odbijeno': 'Nažalost, Vaša prijava je odbijena.',
        'u_obradi': 'Vaša prijava je u obradi.'
    };

    try {
        await transporter.sendMail({
            from: `"Studentska Praksa" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: `Promjena statusa prijave #${applicationId}`,
            html: `
                <h2>Poštovani,</h2>
                <p>Status Vaše prijave za poziciju <strong>${positionName}</strong> je promijenjen na: <strong>${newStatus}</strong></p>
                <p>${statusMessages[newStatus] || 'Status je uspješno ažuriran.'}</p>
                <p><a href="http://localhost:5173/applications/${applicationId}">Pogledajte detalje prijave</a></p>
                <hr>
                <p>Srdačan pozdrav,<br>Tim Studentske Prakse</p>
            `
        });
        console.log(`✅ Email poslan na: ${studentEmail}`);
    } catch (error) {
        console.error("❌ Greška pri slanju emaila:", error.message);
    }
};

module.exports = { sendStatusChangeEmail };