const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ваш секретный ключ от Google reCAPTCHA
const RECAPTCHA_SECRET_KEY = '6LesceEqAAAAAL85Lw7HM3A0qqkOROY-OjvD0_Tf';

// Маршрут для проверки CAPTCHA
app.post('/verify-captcha', async (req, res) => {
    const { captchaResponse } = req.body;

    if (!captchaResponse) {
        return res.status(400).send({ success: false, message: 'CAPTCHA не пройдена.' });
    }

    try {
        // Отправляем запрос к Google reCAPTCHA для проверки
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`
        );

        if (response.data.success) {
            // Если CAPTCHA пройдена, перенаправляем на целевую страницу
            res.status(200).send({ success: true, redirectUrl: 'https://ваш-сайт.com/контент' });
        } else {
            res.status(400).send({ success: false, message: 'Неверная CAPTCHA.' });
        }
    } catch (error) {
        console.error('Ошибка при проверке CAPTCHA:', error);
        res.status(500).send({ success: false, message: 'Ошибка сервера.' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});