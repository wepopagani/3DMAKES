import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Eye, Check, X, Download, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface QuoteRequest {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileDimensions?: { x: number; y: number; z: number };
  status: 'pending' | 'contacted' | 'quoted' | 'rejected';
  createdAt: Timestamp;
  userId?: string;
  hasAccount: boolean;
  notes?: string;
}

const AdminQuoteRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Carica le richieste
  useEffect(() => {
    fetchRequests();
  }, []);

  // Filtra le richieste quando cambia la ricerca
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const filtered = requests.filter(req => 
        req.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.cognome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  }, [searchQuery, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const requestsData: QuoteRequest[] = [];
      snapshot.forEach((doc) => {
        requestsData.push({
          id: doc.id,
          ...doc.data()
        } as QuoteRequest);
      });
      
      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error) {
      console.error('Errore durante il caricamento delle richieste:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le richieste di preventivo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: string, newStatus: QuoteRequest['status']) => {
    try {
      await updateDoc(doc(db, 'quoteRequests', requestId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      toast({
        title: "Stato aggiornato",
        description: "Lo stato della richiesta è stato aggiornato con successo",
      });
      
      fetchRequests();
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato",
        variant: "destructive",
      });
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'quoteRequests', requestId));
      
      toast({
        title: "Richiesta eliminata",
        description: "La richiesta è stata eliminata con successo",
      });
      
      fetchRequests();
    } catch (error) {
      console.error('Errore durante l\'eliminazione:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la richiesta",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: QuoteRequest['status']) => {
    const statusConfig = {
      pending: { label: 'In attesa', variant: 'secondary' as const },
      contacted: { label: 'Contattato', variant: 'default' as const },
      quoted: { label: 'Preventivo inviato', variant: 'default' as const },
      rejected: { label: 'Rifiutato', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const openDetails = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle>Richieste di Preventivo</CardTitle>
              <CardDescription>
                Gestisci le richieste di preventivo ricevute
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Cerca richieste..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={fetchRequests} variant="outline">
                Aggiorna
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery ? 'Nessuna richiesta trovata' : 'Nessuna richiesta di preventivo'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {request.nome} {request.cognome}
                          </span>
                          {request.hasAccount && (
                            <Badge variant="outline" className="w-fit mt-1 text-xs">
                              Ha un account
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.telefono}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate max-w-[150px]">
                            {request.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetails(request)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizza dettagli
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(request.fileUrl, '_blank')}>
                              <Download className="h-4 w-4 mr-2" />
                              Scarica file
                            </DropdownMenuItem>
                            {request.status === 'pending' && (
                              <DropdownMenuItem onClick={() => updateStatus(request.id, 'contacted')}>
                                <Check className="h-4 w-4 mr-2" />
                                Segna come contattato
                              </DropdownMenuItem>
                            )}
                            {request.status === 'contacted' && (
                              <DropdownMenuItem onClick={() => updateStatus(request.id, 'quoted')}>
                                <Check className="h-4 w-4 mr-2" />
                                Preventivo inviato
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => updateStatus(request.id, 'rejected')}>
                              <X className="h-4 w-4 mr-2" />
                              Rifiuta
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteRequest(request.id)}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Elimina
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog dettagli richiesta */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli richiesta preventivo</DialogTitle>
            <DialogDescription>
              Richiesta di {selectedRequest?.nome} {selectedRequest?.cognome}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Nome</Label>
                  <p className="mt-1">{selectedRequest.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Cognome</Label>
                  <p className="mt-1">{selectedRequest.cognome}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Email</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Telefono</Label>
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={`tel:${selectedRequest.telefono}`} className="text-blue-600 hover:underline">
                      {selectedRequest.telefono}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">File</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>{selectedRequest.fileName}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedRequest.fileUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Scarica
                  </Button>
                </div>
              </div>

              {selectedRequest.fileDimensions && (
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Dimensioni del modello</Label>
                  <p className="mt-1">
                    {selectedRequest.fileDimensions.x.toFixed(2)} × 
                    {selectedRequest.fileDimensions.y.toFixed(2)} × 
                    {selectedRequest.fileDimensions.z.toFixed(2)} mm
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-semibold text-gray-600">Data richiesta</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{formatDate(selectedRequest.createdAt)}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Stato</Label>
                <div className="mt-2">
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Account utente</Label>
                <p className="mt-1">
                  {selectedRequest.hasAccount ? '✅ L\'utente ha un account' : '❌ L\'utente non ha un account'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Chiudi
            </Button>
            {selectedRequest && (
              <>
                <Button 
                  onClick={() => window.open(`mailto:${selectedRequest.email}`, '_blank')}
                  variant="outline"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Invia Email
                </Button>
                <Button onClick={() => {
                  if (selectedRequest.status === 'pending') {
                    updateStatus(selectedRequest.id, 'contacted');
                  } else if (selectedRequest.status === 'contacted') {
                    updateStatus(selectedRequest.id, 'quoted');
                  }
                  setIsDetailsOpen(false);
                }}>
                  {selectedRequest.status === 'pending' ? 'Segna come contattato' : 'Preventivo inviato'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuoteRequests;

