import List from "../model/List.model.js";
import nodemailer from 'nodemailer'
export const unsubscribe = async(req,res)=>{
    try{
    const {ListId,email}=req.params;
    const list = await List.findById(ListId);

    if (!list) {
        return res.status(404).json({ error: 'List not found' });
    }
    const user = list.data.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user.issubscribe = false;
    await list.save();

    res.status(200).send('You have been unsubscribed successfully.');
} catch (err) {
    res.status(500).json({ error: err.message });
}
}





export const SendMail = async (req, res) => {
    try {
        const listId = req.params.listId;
        
        const list = await List.findById(listId);

        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const emailSubject = "Welcome to MathonGo!";
        const emailBodyTemplate = `
            Hey [listName]!
            
            Thank you for signing up with your email [email]. We have received your city as [city].
            
            Team MathonGo.`;

        for (const item of list.data) {
            if (!item.issubscribe) continue; 

            let personalizedBody = emailBodyTemplate
                .replace('[listName]', item.listName)
                .replace('[email]', item.email)
                .replace('[city]', item.city);

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: item.email,
                subject: emailSubject,
                text: personalizedBody
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
