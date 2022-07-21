const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

function createProductsTable(data, path, pdfName) {
  let doc = new PDFDocument({ size: 'A4', margin: 50 });

  generateHeader(doc);
  generateProductsTable(doc, data);
  generateFooter(doc);

  doc.end();

  // save pdf
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  doc.pipe(fs.createWriteStream(`${path}/${pdfName}`));
}

function generateHeader(doc) {
  doc
    .fillColor('black')
    .fontSize(14)
    .text('Daily report of created products', 0, 50, { align: 'center' })
    .text(`Date: ${moment(new Date()).format('Do MMMM YYYY')}`, 0, 70, { align: 'center' });
}

function generateProductsTable(doc, data) {
  let i;
  const dataTableTop = 170;

  doc.font('Helvetica-Bold');
  generateTableRow(doc, dataTableTop, 'Id', 'Title', 'Description', 'Price EGP');
  generateHr(doc, dataTableTop + 20);
  doc.font('Helvetica');

  // loop through the data items and generate a row for each
  for (i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const position = dataTableTop + (i + 1) * 35;

    generateTableRow(doc, position, item._id, item.productTitle, item.productDesc, formatCurrency(item.productPrice));
    generateHr(doc, position + 30);
  }

  // total
  const total = data.items.reduce((total, item) => total + item.productPrice, 0);
  generateTableRow(doc, dataTableTop + (i + 1) * 40, '', '', 'Total', formatCurrency(total));
}

function generateFooter(doc) {
  doc.fontSize(10).text('The end of the document', 50, 780, { align: 'center', width: 500 });
}

function generateTableRow(doc, y, id, title, description, price) {
  doc
    .fontSize(10)
    .text(id, 50, y, { width: 90 })
    .text(title, 150, y, { width: 90 })
    .text(description, 200, y, { width: 120 })
    .text(price, 370, y, { width: 90 });
}

function generateHr(doc, y) {
  // generate a line using the given y position
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  return parseInt(amount).toFixed(2);
}

module.exports = {
  createProductsTable,
};
