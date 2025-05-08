import PDFDocument from 'pdfkit'; // npm install pdfkit
import path from 'path';
import fs from 'fs';

export const generatePDFReport = async (
  rapport,
  filePath = path.join('public', 'reports', 'rapport.pdf'),
) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: true });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc
      .fontSize(20)
      .fillColor('#000')
      .text("Rapport d'Évaluation", { align: 'center' })
      .moveDown(2);

    // Ici on suppose que le rapport contient UNE seule compétence
    const [competence] = Object.keys(rapport);
    doc
      .fontSize(16)
      .fillColor('blue')
      .text(`Compétence : ${competence}`)
      .moveDown(0.5);

    rapport[competence].forEach((e) => {
      doc
        .fontSize(12)
        .fillColor('black')
        .text(`Indicateur : ${e.indicateur}`)
        .text(`Note : ${e.note}`)
        .text(`Commentaire : ${e.commentaire}`)
        .text(`Évaluateur : ${e.evaluateur} (${e.role})`)
        .text(`Date : ${new Date(e.date).toLocaleString('fr-FR')}`)
        .moveDown();
    });

    doc.end();

    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
  });
};

export const createPDF = async (badgeData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const fileName = `badge_${Date.now()}.pdf`;
    const filePath = path.join('public', 'badges', fileName);

    // Créer le dossier s’il n’existe pas
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // HEADER
    doc
      .fontSize(24)
      .fillColor('#2E86C1')
      .text('Attestation de Compétence', { align: 'center' })
      .moveDown();

    // Corps
    doc
      .fontSize(16)
      .fillColor('black')
      .text('Ce badge certifie que :', { align: 'center' })
      .moveDown()
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('badgeData.studentName', { align: 'center' })
      .moveDown()
      .font('Helvetica')
      .fontSize(16)
      .text('a démontré un excellent niveau dans la compétence :', {
        align: 'center',
      })
      .moveDown()
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('badgeData.competence', { align: 'center' })
      .moveDown()
      .font('Helvetica')
      .text(`Note obtenue : ${badgeData.note} / 5`, { align: 'center' })
      .moveDown()
      .text(`Commentaire : "${badgeData.commentaire}"`, {
        align: 'center',
        italic: true,
      })
      .moveDown()
      .text(`Évalué par : ${badgeData.evaluateur}`, { align: 'center' })
      .moveDown()
      .text(`Date : ${badgeData.date}`, { align: 'center' });

    // Pied de page
    doc
      .moveDown(4)
      .fontSize(10)
      .fillColor('gray')
      .text('Ce badge peut être partagé sur LinkedIn ou dans un portfolio.', {
        align: 'center',
      });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', (err) => reject(err));
  });
};
