import { ENV } from "../lib/env.js";
import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendEmail = async (receiverEmail, receiverName, clientURL)=>{
    receiverEmail = ENV.RECIEVER_EMAIL; // RESEND is on testing and we can send email to only our own mail id so harcoded this variable
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: [receiverEmail],
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(receiverName, clientURL)
    });

    if(error){
        console.error("Failed to send email: ", error);
        throw new Error("Falied to send welcome Email");
    }

    console.log("Welcome Email send sucessfully: ", data);
}