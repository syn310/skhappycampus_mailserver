const nodemailer = require('nodemailer');
const Email = require('email-templates');
const ejs = require('ejs');

const models = require('../../model/template/Template');

exports.send = (req,res) => {
  const templateNumber = req.params.templateNumber || '';

  if(!templateNumber.length){
    return res.status(400).json({"error":"incorrectKey : "+templateNumber});
  }  
  
  const mailOption = {
    host: "smtp.skhappycampus.com",
    port: 80,
    secure: false,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user:process.env.mail_user,
      pass:process.env.mail_password
    }
  };
  const transporter = nodemailer.createTransport(mailOption);

  const email = new Email({
    message: {
      from: process.env.mail_user,
      attachments: [],
    },
    transport: transporter,
    render: (view, locals) => {
      return new Promise((resolve, reject) => {
        // this example assumes that `template` returned
        // is an ejs-based template string
        // view = `${template}/html` or `${template}/subject` or `${template}/text`
        models.Template.findOne({
          where: {
            templateNumber : templateNumber,
          }
        }).then(template => {
          if (!template){
            return reject('err-01');
          }
          let html = ejs.render(template.dataValues.template, locals);
          html = email.juiceResources(html);
          resolve(html);
        }).catch(function (err) {
          console.log(err);
          return reject('err-02');
        });
      });
    },
    preview: false, // 별도로 false를 지정하지 않으면 실제 전송을 하지 않고 메일 생성 결과를 웹브라우저로 띄웁니다.
    send: true,     // 별도로 지정하지 않으면 보내지 않고 보냈다는 결과만 반환합니다.
  });

  const mailContents = {
    template: 'general',
    message: {
      subject: req.body.subject, // 메일 제목
      to: req.body.to,           // 받는 사람의 메일 주소
    },
    locals: {
      name: req.body.name,
      subject: req.body.subject,
      contents: req.body.contents,
    },
  };
  
  email.send(mailContents).then((info) => {
    //console.log(info)
    res.send(info);
  }).catch((err) => {
    console.log("error occurs while send mail : "+err)
    if (err == 'err-01'){
      res.status(404).send({"error":"Template Missing"});  
    }else if(err == 'err-02'){
      res.status(500).send({"error":"Template apply failed"});
    }else{
      res.status(500).send(err);
    }
  });  
  
}
