const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RECAPTCHA_SECRET_KEY = '6LdbaeQqAAAAAF0woXtZD2cRNUyVtDSHDG7T4OOI';

app.post('/verify-captcha', async (req, res) => {
    const { captchaResponse } = req.body;

    if (!captchaResponse) {
        return res.status(400).send({ success: false, message: 'CAPTCHA не пройдена.' });
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`
        );

        if (response.data.success) {
            res.status(200).send({ success: true, redirectUrl: 'https://iptvgive.vercel.app' });
        } else {
            res.status(400).send({ success: false, message: 'Неверная CAPTCHA.' });
        }
    } catch (error) {
        console.error('Ошибка при проверке CAPTCHA:', error);
        res.status(500).send({ success: false, message: 'Ошибка сервера.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
