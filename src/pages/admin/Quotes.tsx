import React, { useEffect, useState } from 'react';
import { getQuotes, QuoteSubmission, updateQuoteStatus, deleteQuote } from '@/services/db';
import { format } from 'date-fns';
import { Download, Search, CheckCircle, Clock, CheckCircle2, Trash2, FileText, X } from 'lucide-react';
import { Button } from '@/components/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Quotes = () => {
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedQuote, setSelectedQuote] = useState<QuoteSubmission | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: QuoteSubmission['status']) => {
    if (!id) return;
    await updateQuoteStatus(id, status);
    fetchQuotes(); // Refresh
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote? This action cannot be undone.')) {
      try {
        await deleteQuote(id);
        fetchQuotes();
      } catch (error) {
        console.error("Error deleting quote:", error);
        alert("Failed to delete quote. Please try again.");
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Service', 'Message', 'Status'];
    const csvContent = [
      headers.join(','),
      ...quotes.map(q => [
        format(q.createdAt, 'yyyy-MM-dd HH:mm'),
        `"${q.name}"`,
        `"${q.phone}"`,
        `"${q.email}"`,
        `"${q.service}"`,
        `"${q.message.replace(/"/g, '""')}"`,
        q.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `quotes_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Quote Requests - Lightsup Energy', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30);

    const tableColumn = ["Date", "Name", "Contact", "Service", "Status"];
    const tableRows = quotes.map(quote => [
      format(quote.createdAt, 'MMM d, yyyy'),
      quote.name,
      `${quote.email}\n${quote.phone}`,
      quote.service,
      quote.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [46, 42, 91] } // Dark Indigo
    });

    doc.save(`quotes_export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredQuotes = quotes.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Quote Requests</h1>
          <p className="text-gray-500">Manage incoming leads and inquiries.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <Button onClick={exportCSV} variant="outline" className="gap-2 flex-1 lg:flex-none justify-center">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button onClick={exportPDF} variant="outline" className="gap-2 flex-1 lg:flex-none justify-center">
            <FileText className="h-4 w-4" /> <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading quotes...</td></tr>
              ) : filteredQuotes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No quotes found.</td></tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {format(quote.createdAt, 'MMM d, yyyy')}
                      <br />
                      <span className="text-xs">{format(quote.createdAt, 'h:mm a')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{quote.name}</div>
                      <div className="text-gray-500 text-xs">{quote.email}</div>
                      <div className="text-gray-500 text-xs">{quote.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {quote.service}
                      {quote.systemDetails && (
                        <button 
                          onClick={() => setSelectedQuote(quote)}
                          className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                        >
                          View Calc
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={quote.message}>
                      {quote.message}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${quote.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                          quote.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {quote.status !== 'completed' && (
                          <button 
                            onClick={() => handleStatusUpdate(quote.id!, 'completed')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {quote.status === 'new' && (
                          <button 
                            onClick={() => handleStatusUpdate(quote.id!, 'contacted')}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                            title="Mark as Contacted"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(quote.id!)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Quote"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold font-display text-gray-900">
                Quote Details
              </h2>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Client Name</label>
                  <div className="font-medium">{selectedQuote.name}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <div className="font-medium">{format(selectedQuote.createdAt, 'PPP p')}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="font-medium">{selectedQuote.email}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <div className="font-medium">{selectedQuote.phone}</div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Message</label>
                <div className="bg-gray-50 p-4 rounded-lg mt-1 whitespace-pre-wrap text-sm">
                  {selectedQuote.message}
                </div>
              </div>

              {selectedQuote.systemDetails && (
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Calculator Results</label>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4">
                    {(() => {
                      try {
                        const details = JSON.parse(selectedQuote.systemDetails);
                        return (
                          <>
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
                              <div>
                                <div className="text-xs text-gray-500">Total Load</div>
                                <div className="font-bold">{details.results.totalLoad} W</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Daily Energy</div>
                                <div className="font-bold">{(details.results.dailyEnergy / 1000).toFixed(2)} kWh</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Inverter</div>
                                <div className="font-bold">{(details.results.inverterSize / 1000).toFixed(1)} kVA</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Batteries</div>
                                <div className="font-bold">{details.results.batteryCapacity} Ah</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Solar Panels</div>
                                <div className="font-bold">{details.results.panelCount} x 450W</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-2">Appliances List</div>
                              <ul className="list-disc pl-4 space-y-1">
                                {details.appliances.map((app: any, i: number) => (
                                  <li key={i}>
                                    {app.quantity}x {app.name} ({app.watts}W) - {app.hours}hrs/day
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        );
                      } catch (e) {
                        return <div>Error parsing details</div>;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <Button onClick={() => setSelectedQuote(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
