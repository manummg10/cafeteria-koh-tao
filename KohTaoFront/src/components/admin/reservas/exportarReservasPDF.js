import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoKohTao from '../../../assets/logo.png';
import { formatearFecha } from './mesas';

export function exportarReservasPDF(reservas) {
  const doc = new jsPDF();

  doc.addImage(logoKohTao, 'PNG', 24, 19, 35, 35);
  doc.setFontSize(42);
  doc.text('Reservas', doc.internal.pageSize.getWidth() / 2, 48, { align: 'center' });

  autoTable(doc, {
    startY: 55,
    head: [['Mesa', 'Cliente', 'Personas', 'Fecha', 'Teléfono']],
    body: reservas.map(r => [r.idMesa, r.cliente, r.personas, formatearFecha(r.fechaHora), r.telefono || '-']),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [74, 51, 25] },
  });

  doc.save('reservas-koh-tao.pdf');
}
