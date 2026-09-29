import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoKohTao from '../../../assets/logo.png';
import { formatearFecha } from '../../../utils/fecha';
import { euros } from './estados';

export function exportarEncargosPDF(encargos, titulo = 'Encargos') {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.addImage(logoKohTao, 'PNG', 14, 10, 28, 28);
  doc.setFontSize(28);
  doc.text(titulo, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

  autoTable(doc, {
    startY: 44,
    head: [['Recogida', 'Cliente', 'Teléfono', 'Productos', 'Notas', 'Total', 'Estado']],
    body: encargos.map(e => [
      formatearFecha(e.fechaRecogida),
      e.cliente,
      e.telefono,
      e.lineas.map(l => `${l.cantidad}× ${l.nombre}`).join('\n') || '-',
      e.notas || '-',
      e.lineas.length ? euros(e.total) : 'A convenir',
      e.estado,
    ]),
    styles: { fontSize: 9, valign: 'top' },
    columnStyles: { 3: { cellWidth: 60 }, 4: { cellWidth: 60 } },
    headStyles: { fillColor: [74, 51, 25] },
  });

  doc.save('encargos-koh-tao.pdf');
}
