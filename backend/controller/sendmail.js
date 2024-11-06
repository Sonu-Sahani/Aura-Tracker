import nodemailer from 'nodemailer'
async function sendEmail(data,email){
    let transporter=nodemailer.createTransport({
        service:'gmail',//which service you are using it can be yahho,outlook,gmail
        auth:{
            user:'monojitbairagi0@gmail.com',//sender email
            pass:'maitrmgrfffhydfo'//app-specific password in order to make it search on https://www.youtube.com/watch?v=74QQfPrk4vE
        },
    });
    const mailOptions={
        from:'monojitbairagi0@gmail.com',//sender email address
        to:`${email}`,//receiver addressb 
        subject:"Task Reminder",//subject of emial
        text:`${data}`,//email text
    }
    
    //send email
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error) 
            {
                // console.log(error);
                console.log('harsh')
            }

        else{
            console.log('succskldkj')
            // console.log("Email send"+info.response);
        }
        
    })

}
function optGenerator() {
    let opt=Math.floor(Math.random()*9000+1000);
    console.log(opt);
    return opt;
} 
const sendmail={
    sendEmail,
    optGenerator
}

export default sendmail