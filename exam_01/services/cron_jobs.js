const schedule = require('node-schedule');
const moment = require('moment');
const { createProductsTable } = require('./pdf.js');
const userModel = require('../DB/model/user_model.js');
const productModel = require('../DB/model/product_model.js');
const sendEmail = require('./email.js');
const path = require('path');

function cornJobs() {
  console.log('~ cornJobs');

  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(0, 5)];
  rule.hour = 23;
  rule.minute = 59;
  rule.second = 59;

  const sendCreatedProductsPdf = async () => {
    const today = moment().format('YYYY-MM-DD');

    const products = await productModel
      .find({
        createdAt: { $gte: today },
        isDeleted: false,
      })
      .select('_id productTitle productDesc productPrice');

    const admins = await userModel
      .find({
        isDeleted: false,
        emailConfirmed: true,
        blocked: false,
        role: 'admin',
      })
      .select('email');

    const pdfPath = path.join(__dirname, `../uploads/pdf`);
    const pdfName = `${today}_products.pdf`;

    if (products.length > 0 && admins.length > 0) {
      createProductsTable({ items: products }, pdfPath, pdfName);

      const adminsEmails = admins.map(admin => admin.email);
      const adminsEmailsWithComma = adminsEmails.join(',');

      sendEmail(
        adminsEmailsWithComma,
        'Daily report of created products',
        `Please find the daily report of created products attached.`,
        {
          path: `${pdfPath}/${pdfName}`,
        },
      );
    } else {
      console.log(`No products to send today ${today}`);
    }
  };

  schedule.scheduleJob(rule, sendCreatedProductsPdf);
}

module.exports = cornJobs;
