class EmailService {
    constructor() {
        this.serviceID = "service_wav07tx";
    }

    sendRegistrationConfirmation(email, code) {
        return emailjs.send(this.serviceID, "template_3bbi74j", { email: email, code: code });
    }

    sendSOSAlert(req, mapsLink, subjectType, urgencyHeader, targetEmail) {
        // targetEmail is optional, if missing, sends to 'inclusion.petropavl@gmail.com'
        const payload = {
            subject_type: subjectType,
            urgency_header: urgencyHeader,
            user_name: req.name,
            user_phone: req.phone,
            category: req.type,
            request_details: req.details + (req.gps_text || ''),
            google_maps_link: mapsLink
        };

        if (targetEmail) {
            payload.email = targetEmail;
        } else {
            payload.email = 'inclusion.petropavl@gmail.com';
        }

        return emailjs.send(this.serviceID, "template_wb5j0ce", payload);
    }

    sendVolunteerAlert(req, candidateEmail, candidateName, mapsLink, isSOS) {
        return emailjs.send(this.serviceID, "template_wb5j0ce", {
            subject_type: isSOS ? '🚨 SOS-ВЫЗОВ' : 'Новая заявка',
            urgency_header: isSOS ? 'ВНИМАНИЕ! СРОЧНЫЙ SOS-ЗАПРОС!' : 'Поступил новый запрос на помощь',
            email: candidateEmail,
            vol_name: candidateName,
            user_name: req.name,
            user_phone: req.phone,
            category: req.type,
            request_details: req.details + (req.gps_text || ''),
            google_maps_link: mapsLink
        });
    }
}
window.emailService = new EmailService();
