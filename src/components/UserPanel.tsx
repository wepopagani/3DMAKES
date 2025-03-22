import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { storage, db } from '../firebase/config';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  updateDoc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  increment
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ModelViewer, { ModelViewerPreventivo } from './ModelViewer';
// Import Three.js per la generazione delle anteprime
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { ADMIN_EMAIL } from '../config/app-config';

// Creazione di un componente separato per il visualizzatore 3D
const StandaloneModelViewer = ({ file, fileType }: { file: File, fileType: string }) => {
  if (!file) return null;
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ModelViewerPreventivo file={file} fileType={fileType} />
    </div>
  );
};

// Memoizzare i componenti pesanti per migliorare le prestazioni
const MemoizedModelViewer = memo(StandaloneModelViewer);

interface FileInfo {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string; // URL dell'anteprima per i modelli 3D
  uploadedAt: Date;
  userId: string;
}

interface UserProfileData {
  nome: string;
  cognome: string;
  telefono: string;
  indirizzo: string;
  email: string;
}

// Interfacce per la chat
interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'admin';
  read: boolean;
}

const UserPanel: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const [userFiles, setUserFiles] = useState<FileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'uploads' | 'impostazioni' | 'chat'>('uploads');

  const [previewModelId, setPreviewModelId] = useState<string | null>(null);
  const [previewModelFile, setPreviewModelFile] = useState<File | null>(null);
  const [previewModelType, setPreviewModelType] = useState<string>('stl');
  
  // Stato per le impostazioni dell'account
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [nuovaEmail, setNuovaEmail] = useState<string>('');
  const [passwordAttuale, setPasswordAttuale] = useState<string>('');
  const [nuovaPassword, setNuovaPassword] = useState<string>('');
  const [confermaPassword, setConfermaPassword] = useState<string>('');
  const [nuovoTelefono, setNuovoTelefono] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<string>('');
  const [updateError, setUpdateError] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  
  // Stato per i dati del profilo utente
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Aggiungiamo stato per mostrare le conferme di eliminazione file
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

  // Stati per la chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Aggiungi questi stati all'inizio del componente
  const [showFullScreenImage, setShowFullScreenImage] = useState<boolean>(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string>('');

  // Aggiungi questi stati all'inizio del componente
  const [fileToRename, setFileToRename] = useState<FileInfo | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Verifica se l'utente corrente è un amministratore e reindirizza
  useEffect(() => {
    if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      navigate('/admin-panel');
    }
  }, [currentUser, navigate]);

  // Resettiamo l'interfaccia di caricamento
  const resetUploadInterface = () => {
    setFile(null);
    setFilePreview(null);
    setUploadProgress(0);
    setUploadLoading(false);
    // Nascondiamo il messaggio di successo dopo 3 secondi
    setTimeout(() => {
      setUploadSuccess('');
    }, 3000);
  };

  // Effettua il logout e reindirizza l'utente
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Gestione del caricamento del file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Crea un'anteprima per i file immagine
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Gestisce il drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Crea un'anteprima per i file immagine
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Aggiungiamo un effetto che si occupa di reindirizzare l'utente se non è autenticato
  useEffect(() => {
    if (!currentUser) {
      // Se l'utente non è autenticato, reindirizza alla pagina di login
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Funzione per generare un'anteprima del modello 3D
  const generateModelThumbnail = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !['stl', 'obj', 'gltf'].includes(fileExtension)) {
        resolve(null);
        return;
      }

      // Creiamo una scena Three.js temporanea per il rendering
      const scene = new THREE.Scene();
      // Impostiamo lo sfondo trasparente
      scene.background = null;
      
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
      camera.position.set(0, 3, 10);
      camera.lookAt(0, 0, 0);
      
      // Usiamo alpha: true per supportare la trasparenza
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true 
      });
      renderer.setSize(300, 300);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Miglioramento dell'illuminazione per far risaltare meglio il modello
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight1.position.set(1, 1, 1);
      scene.add(directionalLight1);
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight2.position.set(-1, 0.5, -1);
      scene.add(directionalLight2);
      
      // Elemento DOM temporaneo per il rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.appendChild(renderer.domElement);
      document.body.appendChild(container);
      
      // Carica il modello in base al tipo di file
      const url = URL.createObjectURL(file);
      
      try {
        if (fileExtension === 'stl') {
          const loader = new STLLoader();
          loader.load(url, (geometry) => {
            const material = new THREE.MeshStandardMaterial({ 
              color: 0xb92b27, 
              roughness: 0.5, 
              metalness: 0.3,
              flatShading: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            
            // Centro il modello e imposto una vista ottimale
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;
            if (boundingBox) {
              const center = new THREE.Vector3();
              boundingBox.getCenter(center);
              mesh.position.copy(center.negate());
              
              // Adatta la camera per inquadrare tutto il modello con un po' di margine
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              camera.position.z = maxDim * 2;
              // Aggiungiamo un po' di altezza per una vista dall'alto
              camera.position.y = maxDim * 0.8;
            }
            
            scene.add(mesh);
            
            // Ruotiamo il modello per una vista più interessante
            mesh.rotation.x = -Math.PI / 6;  // Meno inclinazione verticale
            mesh.rotation.y = Math.PI / 3;   // Più rotazione orizzontale
            
            // Renderizziamo e catturiamo l'immagine
            renderer.render(scene, camera);
            
            // Salviamo l'immagine come PNG con canale alpha
            const dataUrl = renderer.domElement.toDataURL('image/png');
            
            // Pulizia
            URL.revokeObjectURL(url);
            document.body.removeChild(container);
            
            resolve(dataUrl);
          });
        } else if (fileExtension === 'obj') {
          const loader = new OBJLoader();
          loader.load(url, (object) => {
            // Applica un materiale standard a tutti i componenti
            object.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({ 
                  color: 0xb92b27, 
                  roughness: 0.5, 
                  metalness: 0.3,
                  flatShading: false
                });
              }
            });
            
            // Centro il modello e calcolo la vista ottimale
            const box = new THREE.Box3().setFromObject(object);
            const center = new THREE.Vector3();
            box.getCenter(center);
            object.position.copy(center.negate());
            
            // Adatta la camera per inquadrare tutto il modello con un margine
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 2;
            camera.position.y = maxDim * 0.8;
            
            scene.add(object);
            
            // Ruotiamo il modello per una vista più interessante
            object.rotation.x = -Math.PI / 6;  // Meno inclinazione verticale
            object.rotation.y = Math.PI / 3;   // Più rotazione orizzontale
            
            // Renderizziamo e catturiamo l'immagine
            renderer.render(scene, camera);
            
            // Salviamo l'immagine come PNG con canale alpha
            const dataUrl = renderer.domElement.toDataURL('image/png');
            
            // Pulizia
            URL.revokeObjectURL(url);
            document.body.removeChild(container);
            
            resolve(dataUrl);
          });
        } else if (fileExtension === 'gltf') {
          const loader = new GLTFLoader();
          loader.load(url, (gltf) => {
            // Centro il modello e calcolo la vista ottimale
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = new THREE.Vector3();
            box.getCenter(center);
            gltf.scene.position.copy(center.negate());
            
            // Adatta la camera per inquadrare tutto il modello con un margine
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            camera.position.z = maxDim * 2;
            camera.position.y = maxDim * 0.8;
            
            scene.add(gltf.scene);
            
            // Ruotiamo il modello per una vista più interessante
            gltf.scene.rotation.x = -Math.PI / 6;  // Meno inclinazione verticale
            gltf.scene.rotation.y = Math.PI / 3;   // Più rotazione orizzontale
            
            // Renderizziamo e catturiamo l'immagine
            renderer.render(scene, camera);
            
            // Salviamo l'immagine come PNG con canale alpha
            const dataUrl = renderer.domElement.toDataURL('image/png');
            
            // Pulizia
            URL.revokeObjectURL(url);
            document.body.removeChild(container);
            
            resolve(dataUrl);
          });
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("Errore nella generazione dell'anteprima:", error);
        URL.revokeObjectURL(url);
        if (container.parentNode) {
          document.body.removeChild(container);
        }
        resolve(null);
      }
    });
  };

  // Carica il file su Firebase Storage
  const handleUpload = async () => {
    if (!file || !currentUser) return;
    
    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');
    setUploadProgress(0);
    
    try {
      console.log("Inizio processo di caricamento file...");
      // Ottieni l'email dell'utente in un formato sicuro per i percorsi
      const userEmail = currentUser.email || 'unknown';
      const safeEmail = userEmail.replace(/[.#$[\]]/g, '_');
      
      // Crea un nome file sicuro con timestamp per evitare conflitti
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const safeFileName = `${safeEmail}_${timestamp}.${fileExtension}`;
      
      // Percorso semplificato per lo storage
      const storagePath = `files/${currentUser.uid}/${safeFileName}`;
      console.log("Percorso file:", storagePath);
      
      // Per i modelli 3D, proviamo a generare un'anteprima
      let thumbnailUrl: string | null = null;
      if (fileExtension && ['stl', 'obj', 'gltf'].includes(fileExtension.toLowerCase())) {
        console.log("Generazione anteprima per modello 3D...");
        const thumbnailDataUrl = await generateModelThumbnail(file);
        
        if (thumbnailDataUrl) {
          // Converti il dataURL in un file
          const res = await fetch(thumbnailDataUrl);
          const thumbnailBlob = await res.blob();
          const thumbnailFile = new File([thumbnailBlob], `thumb_${safeFileName.replace(`.${fileExtension}`, '.png')}`, { type: 'image/png' });
          
          // Carica la miniatura su Firebase Storage
          const thumbnailPath = `thumbnails/${currentUser.uid}/${timestamp}_thumb.png`;
          const thumbnailRef = ref(storage, thumbnailPath);
          await uploadBytesResumable(thumbnailRef, thumbnailFile);
          thumbnailUrl = await getDownloadURL(thumbnailRef);
          console.log("Anteprima generata e caricata:", thumbnailUrl);
        }
      }
      
      try {
        // Carica il file su Firebase Storage con monitoraggio del progresso
        console.log("Creazione riferimento Storage...");
        const storageRef = ref(storage, storagePath);
        console.log("Inizio upload...");
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Monitora il progresso dell'upload
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
            console.log(`Progresso: ${progress}%`);
          },
          (error) => {
            console.error('Errore durante il caricamento:', error);
            setUploadError(`Errore caricamento: ${error.code} - ${error.message}`);
            setUploadLoading(false);
          },
          async () => {
            // Upload completato con successo
            console.log("Upload completato, ottenimento URL...");
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("URL ottenuto:", downloadURL);
              
              // Determina il tipo di file
              const fileType = file.type.startsWith('image/') ? 'image' : 
                              file.type.includes('3d') || fileExtension === 'obj' || fileExtension === 'stl' || fileExtension === 'gltf' ? '3d' : 'other';
              
              console.log("Salvataggio informazioni file in Firestore...");
              
              try {
                // Salva le informazioni del file in Firestore
                const docRef = await addDoc(collection(db, 'files'), {
                  name: safeFileName,
                  originalName: file.name,
                  type: fileType,
                  url: downloadURL,
                  thumbnailUrl: thumbnailUrl, // Aggiungiamo l'URL dell'anteprima se disponibile
                  storagePath,
                  uploadedAt: Timestamp.now(),
                  userId: currentUser.uid,
                  userEmail: userEmail
                });
                
                console.log("File salvato con successo in Firestore con ID:", docRef.id);
                setUploadSuccess('File caricato con successo!');
                
                // Resetta l'interfaccia di caricamento
                resetUploadInterface();
                
                // Aggiorna la lista dei file
                fetchUserFiles();
              } catch (firestoreError: any) {
                console.error("Errore nel salvataggio in Firestore:", firestoreError);
                setUploadError(`Errore database: ${firestoreError.code || 'unknown'} - ${firestoreError.message || 'Errore sconosciuto'}`);
                setUploadLoading(false);
              }
            } catch (urlError: any) {
              console.error("Errore nel recupero dell'URL:", urlError);
              setUploadError(`Errore URL: ${urlError.code || 'unknown'} - ${urlError.message || 'Errore sconosciuto'}`);
              setUploadLoading(false);
            }
          }
        );
      } catch (storageError: any) {
        console.error("Errore nell'inizializzazione dello storage:", storageError);
        setUploadError(`Errore storage: ${storageError.code || 'unknown'} - ${storageError.message || 'Errore sconosciuto'}`);
        setUploadLoading(false);
      }
    } catch (error: any) {
      console.error('Errore generale durante il caricamento:', error);
      setUploadError(`Si è verificato un errore imprevisto: ${error.message || 'Errore sconosciuto'}`);
      setUploadLoading(false);
    }
  };

  // Carica i file dell'utente da Firestore - ottimizzato
  const fetchUserFiles = useCallback(async () => {
    if (!currentUser) return;
    
    setLoadingFiles(true);
    
    try {
      // Query ottimizzata
      const filesQuery = query(
        collection(db, 'files'),
        where('userId', '==', currentUser.uid),
        orderBy('uploadedAt', 'desc'),
        limit(50) // Limita a 50 file per migliorare le prestazioni
      );
      
      const querySnapshot = await getDocs(filesQuery);
      
      const files: FileInfo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          name: data.originalName || data.name, // Uso il nome originale se disponibile
          type: data.type,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl || undefined,
          uploadedAt: data.uploadedAt.toDate(),
          userId: data.userId
        });
      });
      
      setUserFiles(files);
    } catch (error) {
      console.error('Errore durante il recupero dei file:', error);
    } finally {
      setLoadingFiles(false);
    }
  }, [currentUser]);

  // Aggiungiamo un effetto per ricaricare i file quando si cambia tab
  useEffect(() => {
    if (activeTab === 'uploads' && currentUser) {
      fetchUserFiles();
    }
  }, [activeTab, fetchUserFiles, currentUser]);

  // Funzione per formattare la data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Funzione per scaricare e visualizzare il modello
  const fetchAndPreviewModel = async (fileInfo: FileInfo) => {
    try {
      setPreviewModelId(fileInfo.id);
      setPreviewModelType(fileInfo.name.split('.').pop()?.toLowerCase() || 'stl');
      setPreviewModelFile(null);

      // Utilizziamo XMLHttpRequest per gestire meglio il CORS
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileInfo.url, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        if (this.status === 200) {
          const blob = this.response;
          const file = new File([blob], fileInfo.name, {
            type: 'application/octet-stream'
          });
          setPreviewModelFile(file);
        }
      };
      
      xhr.send();
    } catch (error) {
      console.error('Errore durante il download del modello:', error);
      setPreviewModelFile(null);
    }
  };

  // Determinare il tipo di file da visualizzare
  const getFileIcon = (fileType: string, fileName: string) => {
    if (fileType === 'image') return '🖼️';
    // Rimuoviamo l'icona del trofeo
    // Altrimenti cerca di indovinare il tipo dall'estensione
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return '📑';
    if (['doc', 'docx', 'txt'].includes(ext || '')) return '📝';
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return '📊';
    if (['zip', 'rar', '7z'].includes(ext || '')) return '🗜️';
    return '📄';
  };

  // Funzione per eliminare un file
  const handleDeleteFile = async (fileId: string) => {
    if (!currentUser) return;
    
    setIsDeletingFile(true);
    
    try {
      const fileToDelete = userFiles.find(f => f.id === fileId);
      if (!fileToDelete) {
        throw new Error('File non trovato');
      }
      
      // 1. Elimina dal database Firestore
      await deleteDoc(doc(db, 'files', fileId));
      
      // 2. Elimina dal Firebase Storage
      // Estrai il percorso dallo URL o usa il campo storagePath se disponibile
      const storageRefPath = fileToDelete.url.split('?')[0].split('/o/')[1];
      if (storageRefPath) {
        const decodedPath = decodeURIComponent(storageRefPath);
        const storageRef = ref(storage, decodedPath);
        await deleteObject(storageRef);
        
        // 3. Se esiste una thumbnail, eliminala
        if (fileToDelete.thumbnailUrl) {
          const thumbnailPath = fileToDelete.thumbnailUrl.split('?')[0].split('/o/')[1];
          if (thumbnailPath) {
            const decodedThumbPath = decodeURIComponent(thumbnailPath);
            const thumbRef = ref(storage, decodedThumbPath);
            await deleteObject(thumbRef).catch(err => {
              console.log("Errore nell'eliminazione della thumbnail, potrebbe non esistere", err);
            });
          }
        }
      }
      
      // 4. Aggiorna la lista dei file
      setUserFiles(userFiles.filter(f => f.id !== fileId));
      setFileToDelete(null);
      
      setUploadSuccess("File eliminato con successo!");
      setTimeout(() => {
        setUploadSuccess("");
      }, 3000);
      
    } catch (error: any) {
      console.error("Errore nell'eliminazione del file:", error);
      setUploadError(`Errore durante l'eliminazione: ${error.message || 'Errore sconosciuto'}`);
      setTimeout(() => {
        setUploadError("");
      }, 5000);
    } finally {
      setIsDeletingFile(false);
    }
  };
  
  // Funzione per aggiornare le informazioni dell'account
  const handleUpdateAccount = async (type: 'email' | 'telefono' | 'password') => {
    if (!currentUser) return;
    
    setUpdateError('');
    setUpdateSuccess('');
    
    try {
      if (type === 'email' && nuovaEmail) {
        if (!passwordAttuale) {
          setUpdateError('È necessaria la password attuale per aggiornare l\'email');
          return;
        }
        
        setIsUpdating(true);
        
        try {
          // 1. Creare la credenziale con l'email corrente e la password
          const credential = EmailAuthProvider.credential(
            currentUser.email || '',
            passwordAttuale
          );
          
          // 2. Riautenticare l'utente
          await reauthenticateWithCredential(currentUser, credential);
          
          // 3. Aggiornare l'email
          await updateEmail(currentUser, nuovaEmail);
          
          // 4. Aggiornare lo stato locale
          setEmail(nuovaEmail);
          setNuovaEmail('');
          setPasswordAttuale('');
          setUpdateSuccess('Email aggiornata con successo!');
        } catch (error: any) {
          if (error.code === 'auth/wrong-password') {
            throw new Error('Password non corretta. Riprova.');
          } else if (error.code === 'auth/requires-recent-login') {
            throw new Error('Per motivi di sicurezza, effettua nuovamente il login e riprova.');
          } else if (error.code === 'auth/email-already-in-use') {
            throw new Error('Questa email è già utilizzata da un altro account.');
          } else {
            throw new Error(`Errore nell'aggiornamento email: ${error.message}`);
          }
        }
      } else if (type === 'telefono' && nuovoTelefono) {
        // In un'applicazione reale, qui andresti ad aggiornare il numero di telefono
        // Questo richiederebbe una verifica (SMS) che non implementeremo in questo esempio
        // Per ora, solo simuliamo che sia stato aggiornato
        setTelefono(nuovoTelefono);
        setNuovoTelefono('');
        setUpdateSuccess('Numero di telefono aggiornato!');
      } else if (type === 'password') {
        if (!passwordAttuale) {
          setUpdateError('È necessaria la password attuale per aggiornare la password');
          return;
        }
        
        if (!nuovaPassword || nuovaPassword !== confermaPassword) {
          setUpdateError('Le password non corrispondono');
          return;
        }
        
        if (nuovaPassword.length < 6) {
          setUpdateError('La password deve contenere almeno 6 caratteri');
          return;
        }
        
        setIsChangingPassword(true);
        
        try {
          // 1. Creare la credenziale con l'email corrente e la password attuale
          const credential = EmailAuthProvider.credential(
            currentUser.email || '',
            passwordAttuale
          );
          
          // 2. Riautenticare l'utente
          await reauthenticateWithCredential(currentUser, credential);
          
          // 3. Aggiornare la password
          await updatePassword(currentUser, nuovaPassword);
          
          // 4. Aggiornare lo stato locale
          setNuovaPassword('');
          setConfermaPassword('');
          setPasswordAttuale('');
          setUpdateSuccess('Password aggiornata con successo!');
        } catch (error: any) {
          if (error.code === 'auth/wrong-password') {
            throw new Error('Password attuale non corretta. Riprova.');
          } else if (error.code === 'auth/requires-recent-login') {
            throw new Error('Per motivi di sicurezza, effettua nuovamente il login e riprova.');
          } else {
            throw new Error(`Errore nell'aggiornamento della password: ${error.message}`);
          }
        }
      }
    } catch (error: any) {
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
      setIsChangingPassword(false);
    }
  };
  
  // Funzione per eliminare l'account
  const handleDeleteAccount = async () => {
    if (!currentUser || deleteConfirm !== currentUser.email) return;
    
    setIsDeleting(true);
    
    try {
      // 1. Eliminare tutti i file dell'utente
      const filesQuery = query(
        collection(db, 'files'),
        where('userId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(filesQuery);
      const deletePromises: Promise<void>[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const fileData = docSnapshot.data();
        
        // Elimina il documento Firestore
        deletePromises.push(deleteDoc(doc(db, 'files', docSnapshot.id)));
        
        // Elimina il file da Storage
        if (fileData.storagePath) {
          const fileRef = ref(storage, fileData.storagePath);
          deletePromises.push(deleteObject(fileRef).catch(err => {
            console.log("Errore nell'eliminazione del file Storage:", err);
          }));
        }
        
        // Elimina thumbnail se esiste
        if (fileData.thumbnailUrl) {
          const thumbnailPath = fileData.thumbnailUrl.split('?')[0].split('/o/')[1];
          if (thumbnailPath) {
            const decodedPath = decodeURIComponent(thumbnailPath);
            const thumbRef = ref(storage, decodedPath);
            deletePromises.push(deleteObject(thumbRef).catch(err => {
              console.log("Errore nell'eliminazione della thumbnail:", err);
            }));
          }
        }
      });
      
      // Esegui tutte le operazioni di eliminazione
      await Promise.all(deletePromises);
      
      // 2. Elimina l'account utente
      await currentUser.delete();
      
      // 3. Reindirizza alla pagina di login
      navigate('/login');
      
    } catch (error: any) {
      console.error('Errore durante l\'eliminazione dell\'account:', error);
      setUpdateError(`Errore: ${error.message || 'Errore sconosciuto'}`);
      setIsDeleting(false);
    }
  };
  
  // Carica le informazioni del profilo utente da Firestore
  const fetchUserProfile = useCallback(async () => {
    if (!currentUser) return;
    
    setLoadingProfile(true);
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as UserProfileData;
        setUserProfile(userData);
        setEmail(userData.email || currentUser.email || '');
        setTelefono(userData.telefono || '');
      } else {
        console.log("Nessun profilo utente trovato!");
        // Se non c'è un documento per l'utente, usiamo solo le informazioni da Firebase Auth
        setEmail(currentUser.email || '');
      }
    } catch (error) {
      console.error("Errore durante il recupero del profilo utente:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, [currentUser]);

  // Effetto per caricare i dati del profilo all'avvio
  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser, fetchUserProfile]);

  // Funzione per caricare i messaggi della chat
  const fetchMessages = useCallback(async () => {
    if (!currentUser) return;
    
    setLoadingMessages(true);
    
    try {
      // Riferimento alla collezione di messaggi dell'utente
      const chatRef = collection(db, `chats/${currentUser.uid}/messages`);
      const q = query(chatRef, orderBy('timestamp', 'asc'));
      
      const querySnapshot = await getDocs(q);
      
      const chatMessages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        chatMessages.push({
          id: doc.id,
          text: data.text,
          timestamp: data.timestamp.toDate(),
          sender: data.sender,
          read: data.read
        });
      });
      
      // Aggiorna i messaggi
      setMessages(chatMessages);
      
      // Aggiorna i metadati e marca i messaggi come letti in background
      const unreadMessages = querySnapshot.docs.filter(
        doc => doc.data().sender === 'admin' && !doc.data().read
      );
      
      // Marca i messaggi come letti
      const updatePromises = unreadMessages.map(doc => 
        updateDoc(doc.ref, { read: true })
      );
      
      await Promise.all(updatePromises);
      
      // Aggiorna i metadati della chat
      const metadataRef = doc(db, `chats/${currentUser.uid}/metadata/info`);
      await updateDoc(metadataRef, { unreadUser: 0 }).catch(() => {
        // Se il documento non esiste ancora, lo creiamo
        setDoc(metadataRef, { 
          unreadUser: 0, 
          unreadAdmin: 0,
          lastMessage: chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].text : '',
          lastMessageTimestamp: Timestamp.now(),
          active: true,
          userName: userProfile?.nome && userProfile?.cognome 
            ? `${userProfile.nome} ${userProfile.cognome}`
            : currentUser.email || 'Utente'
        });
      });
      
    } catch (error) {
      console.error('Errore nel recupero dei messaggi:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUser, userProfile]);

  // Funzione per scorrere in basso nella chat
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Scrolliamo direttamente alla posizione finale senza animazione
      // per prevenire il comportamento di scroll indesiderato
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Modifichiamo l'effetto per la gestione dei nuovi messaggi e dello scroll
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = document.querySelector('.message-item:last-child');
      if (lastMessage) {
        lastMessage.classList.add('message-new');
        setTimeout(() => {
          lastMessage.classList.remove('message-new');
        }, 500);
      }
      
      // Usiamo un setTimeout con priorità alta per assicurarci che avvenga dopo il rendering
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    }
  }, [messages, scrollToBottom]);

  // Effetto per monitorare il cambio di tab e caricare i messaggi
  useEffect(() => {
    if (activeTab === 'chat' && currentUser) {
      // Eseguiamo un caricamento iniziale dei messaggi
      fetchMessages();
      
      // Configura un listener in tempo reale per i messaggi
      const chatRef = collection(db, `chats/${currentUser.uid}/messages`);
      const q = query(chatRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let hasNewMessages = false;
        let isFromAdmin = false;
        
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            hasNewMessages = true;
            if (data.sender === 'admin') {
              isFromAdmin = true;
            }
          }
        });
        
        // Ricarica solo se ci sono nuovi messaggi dall'admin
        // I messaggi dell'utente vengono già gestiti con il metodo ottimistico
        if (hasNewMessages && isFromAdmin) {
          fetchMessages();
        }
      });
      
      // Puliamo il listener quando cambiamo tab
      return () => unsubscribe();
    }
  }, [activeTab, currentUser, fetchMessages]);

  // Funzione per inviare un messaggio
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    
    const messageText = newMessage.trim();
    
    // Resetta l'input prima dell'invio per migliorare la reattività
    setNewMessage('');
    
    // Manteniamo uno stato ottimistico aggiungendo subito il messaggio localmente
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      timestamp: new Date(),
      sender: 'user',
      read: false
    };
    
    // Aggiungiamo il messaggio localmente
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Facciamo lo scroll immediatamente dopo aver aggiunto il messaggio ottimistico
    setTimeout(() => {
      scrollToBottom();
    }, 0);
    
    try {
      // Riferimento alla collezione dei messaggi
      const chatRef = collection(db, `chats/${currentUser.uid}/messages`);
      
      // Riferimento ai metadati
      const metadataRef = doc(db, `chats/${currentUser.uid}/metadata/info`);
      
      // Nuovo messaggio
      const messageData = {
        text: messageText,
        timestamp: Timestamp.now(),
        sender: 'user' as const,
        read: false
      };
      
      // Aggiunge il messaggio
      await addDoc(chatRef, messageData);
      
      // Aggiorna i metadati
      await updateDoc(metadataRef, {
        lastMessage: messageText,
        lastMessageTimestamp: Timestamp.now(),
        unreadAdmin: increment(1)
      }).catch(() => {
        // Se il documento non esiste, lo creiamo
        setDoc(metadataRef, {
          lastMessage: messageText,
          lastMessageTimestamp: Timestamp.now(),
          unreadAdmin: 1,
          unreadUser: 0,
          active: true,
          userName: userProfile?.nome && userProfile?.cognome 
            ? `${userProfile.nome} ${userProfile.cognome}`
            : currentUser.email || 'Utente'
        });
      });
      
      // Ricarica i messaggi in background senza mostrare il caricamento
      const reloadMessages = async () => {
        try {
          // Riferimento alla collezione di messaggi dell'utente
          const chatRef = collection(db, `chats/${currentUser.uid}/messages`);
          const q = query(chatRef, orderBy('timestamp', 'asc'));
          
          const querySnapshot = await getDocs(q);
          
          const chatMessages: ChatMessage[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            chatMessages.push({
              id: doc.id,
              text: data.text,
              timestamp: data.timestamp.toDate(),
              sender: data.sender,
              read: data.read
            });
          });
          
          // Aggiorniamo i messaggi senza influenzare lo scroll
          setMessages(chatMessages);
          
          // Aggiorna i metadati e marca i messaggi come letti in background
          const unreadMessages = querySnapshot.docs.filter(
            doc => doc.data().sender === 'admin' && !doc.data().read
          );
          
          // Marca i messaggi come letti
          const updatePromises = unreadMessages.map(doc => 
            updateDoc(doc.ref, { read: true })
          );
          
          await Promise.all(updatePromises);
        } catch (error) {
          console.error('Errore nel recupero dei messaggi:', error);
        }
      };
      
      reloadMessages();
      
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
      // In caso di errore, rimuoviamo il messaggio ottimistico
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  };

  // Aggiungi questa funzione con le altre funzioni del componente
  const handleFullScreenImage = (imageUrl: string) => {
    setFullScreenImageUrl(imageUrl);
    setShowFullScreenImage(true);
  };

  // Aggiungi questa funzione per gestire il rename
  const handleRenameFile = async () => {
    if (!fileToRename || !newFileName.trim() || !currentUser) return;
    
    setIsRenaming(true);
    
    try {
      // Ottieni l'estensione del file originale
      const originalExtension = fileToRename.name.split('.').pop() || '';
      // Assicurati che il nuovo nome abbia la stessa estensione
      const newName = newFileName.endsWith(`.${originalExtension}`) 
        ? newFileName 
        : `${newFileName}.${originalExtension}`;

      // Aggiorna il documento in Firestore
      const fileRef = doc(db, 'files', fileToRename.id);
      await updateDoc(fileRef, {
        name: newName,
        originalName: newName
      });

      // Aggiorna la lista dei file localmente
      setUserFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileToRename.id 
            ? { ...file, name: newName } 
            : file
        )
      );

      setFileToRename(null);
      setNewFileName('');
      setUploadSuccess('File rinominato con successo!');
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => {
        setUploadSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Errore durante la ridenominazione:', error);
      setUploadError('Errore durante la ridenominazione del file');
      
      // Nascondi il messaggio di errore dopo 5 secondi
      setTimeout(() => {
        setUploadError('');
      }, 5000);
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pannello Utente</h1>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-gray-100 font-medium">
                {loadingProfile ? 'Caricamento...' : `Bentornato, ${userProfile?.nome || 'Utente'}`}
              </span>
              <span className="text-gray-400 text-sm">
                {currentUser?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'uploads'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('uploads')}
          >
            I Miei Files
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'chat'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'impostazioni'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('impostazioni')}
          >
            Impostazioni
          </button>
        </div>

        {/* File Upload Tab */}
        {activeTab === 'uploads' && (
          <div>
            {/* Upload Section */}
            <div className="mb-8 p-6 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Carica un Nuovo File</h2>
              
              {uploadError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
                  {uploadError}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-500">
                  {uploadSuccess}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seleziona un file (immagine o oggetto 3D)
                  </label>
                  <div 
                    className="w-full h-32 border-2 border-dashed border-gray-500 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors bg-gray-700"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-400">Carica un file o trascinalo qui</p>
                    <p className="text-xs text-gray-500 mt-1">Tutti i tipi di file supportati</p>
                    <input 
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="*/*"
                    />
                  </div>
                  
                  {/* Barra di progresso */}
                  {uploadLoading && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-red-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 text-right">{uploadProgress}% completato</p>
                    </div>
                  )}
                </div>
                
                {/* Anteprima file */}
                <div className="col-span-1 flex flex-col">
                  <span className="block text-sm font-medium text-gray-300 mb-2">Anteprima</span>
                  <div className="flex-1 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                    {filePreview ? (
                      <img src={filePreview} alt="Anteprima" className="max-h-32 max-w-full object-contain" />
                    ) : file && (file.name.endsWith('.stl') || file.name.endsWith('.obj') || file.name.endsWith('.gltf')) ? (
                      <div className="text-center p-4">
                        <p className="text-xs text-gray-400">Modello 3D</p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{file.name}</p>
                      </div>
                    ) : file ? (
                      <div className="text-center p-4">
                        <span className="text-3xl mb-2">📄</span>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]">{file.name}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Nessun file selezionato</p>
                    )}
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploadLoading}
                    className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                  >
                    {uploadLoading ? `Caricamento... ${uploadProgress}%` : 'Carica File'}
                  </button>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="p-6 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">I Miei File</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchUserFiles()}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                    disabled={loadingFiles}
                  >
                    {loadingFiles ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-white rounded-full animate-spin mr-2"></div>
                        Aggiornamento...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Aggiorna
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {loadingFiles ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                  <p className="ml-2 text-gray-400">Caricamento dei file...</p>
                </div>
              ) : userFiles.length === 0 ? (
                <div className="text-center py-8 bg-gray-750 rounded-lg">
                  <p className="text-gray-400 mb-2">Nessun file caricato.</p>
                  <p className="text-gray-500 text-sm">I file che carichi appariranno qui.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userFiles.map((fileInfo) => (
                    <div key={fileInfo.id} className="bg-gray-750 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-102 border border-transparent hover:border-gray-600">
                      {/* Anteprima/Icona */}
                      <div className="relative pb-[75%] bg-gray-700 overflow-hidden">
                        {fileInfo.type === 'image' ? (
                          <img 
                            src={fileInfo.url} 
                            alt={fileInfo.name} 
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : fileInfo.type === '3d' && fileInfo.thumbnailUrl ? (
                          <img 
                            src={fileInfo.thumbnailUrl} 
                            alt={fileInfo.name} 
                            className="absolute inset-0 w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                        ) : fileInfo.type === '3d' ? (
                          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            <p className="text-sm text-gray-400 text-center">
                              Modello 3D<br />
                              <span className="text-xs opacity-70">Nessuna anteprima</span>
                            </p>
                          </div>
                        ) : (
                          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                            <span className="text-5xl">
                              {getFileIcon(fileInfo.type, fileInfo.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Informazioni file */}
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate" title={fileInfo.name}>
                          {fileInfo.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(fileInfo.uploadedAt)}
                        </p>
                        
                        {/* Azioni file */}
                        <div className="flex mt-3 space-x-2">
                          <a
                            href={fileInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={fileInfo.name}
                            className="text-gray-300 hover:text-white px-2 py-1 bg-gray-700 rounded-md text-xs flex-1 text-center flex items-center justify-center"
                          >
                            Scarica
                          </a>
                          
                         
                          
                          {/* Aggiungi questo pulsante per le immagini */}
                          {fileInfo.type === 'image' && (
                            <button
                              onClick={() => handleFullScreenImage(fileInfo.url)}
                              className="text-white bg-red-600 hover:bg-blue-700 px-2 py-1 rounded-md text-xs flex-1 text-center"
                            >
                              Full Screen
                            </button>
                          )}
                          
                          {fileInfo.type === '3d' && (
                            <button
                              onClick={() => fetchAndPreviewModel(fileInfo)}
                              className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-xs flex-1 text-center"
                            >
                              Anteprima 3D
                            </button>
                          )}
                           {/* Aggiungi questo pulsante per rinominare */}
                          <button
                            onClick={() => {
                              setFileToRename(fileInfo);
                              setNewFileName(fileInfo.name);
                            }}
                            className="text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-xs flex items-center justify-center"
                            title="Rinomina file"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Pulsante elimina esistente */}
                          <button
                            onClick={() => setFileToDelete(fileInfo.id)}
                            className="text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md text-xs flex items-center justify-center"
                            title="Elimina file"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="p-6 bg-gray-800 rounded-lg flex flex-col h-[70vh]">
            <h2 className="text-xl font-semibold mb-4">Chat con il Supporto</h2>
            
            {/* Area messaggi */}
            <div className="flex-grow bg-gray-750 rounded-lg mb-4 overflow-y-auto p-4" ref={messagesContainerRef}>
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                  <p className="ml-2 text-gray-400">Caricamento messaggi...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">Nessun messaggio.</p>
                  <p className="text-gray-500 text-sm">Inizia la conversazione con il nostro team di supporto!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex message-item ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user' 
                            ? 'bg-red-600 text-white rounded-tr-none' 
                            : 'bg-gray-700 text-white rounded-tl-none'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {formatDate(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input messaggio */}
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrivi un messaggio..."
                className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-3 focus:outline-none focus:border-red-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-red-600 hover:bg-red-700 rounded-r-md px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Impostazioni Tab */}
        {activeTab === 'impostazioni' && (
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Impostazioni Account</h2>
            
            {updateSuccess && (
              <div className="mb-6 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-500">
                {updateSuccess}
              </div>
            )}
            
            {updateError && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
                {updateError}
              </div>
            )}
            
            <div className="space-y-8">
              {/* Sezione Email */}
              <div className="bg-gray-750 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Email</h3>
                <div className="mb-4">
                  <p className="mb-2 text-gray-300">Email attuale: <span className="text-white font-medium">{email}</span></p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      value={nuovaEmail} 
                      onChange={(e) => setNuovaEmail(e.target.value)}
                      placeholder="Nuova email" 
                      className="w-full bg-gray-700 p-2 rounded-md text-white"
                    />
                    <input 
                      type="password" 
                      value={passwordAttuale} 
                      onChange={(e) => setPasswordAttuale(e.target.value)}
                      placeholder="Password attuale (per conferma)" 
                      className="w-full bg-gray-700 p-2 rounded-md text-white"
                    />
                    <button
                      onClick={() => handleUpdateAccount('email')}
                      disabled={!nuovaEmail || !passwordAttuale || isUpdating}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Aggiornamento...' : 'Aggiorna Email'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sezione Password */}
              <div className="bg-gray-750 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Cambia Password</h3>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    value={passwordAttuale} 
                    onChange={(e) => setPasswordAttuale(e.target.value)}
                    placeholder="Password attuale" 
                    className="w-full bg-gray-700 p-2 rounded-md text-white"
                  />
                  <input 
                    type="password" 
                    value={nuovaPassword} 
                    onChange={(e) => setNuovaPassword(e.target.value)}
                    placeholder="Nuova password"
                    className="w-full bg-gray-700 p-2 rounded-md text-white"
                  />
                  <input 
                    type="password" 
                    value={confermaPassword} 
                    onChange={(e) => setConfermaPassword(e.target.value)}
                    placeholder="Conferma nuova password" 
                    className="w-full bg-gray-700 p-2 rounded-md text-white"
                  />
                  <button
                    onClick={() => handleUpdateAccount('password')}
                    disabled={!passwordAttuale || !nuovaPassword || !confermaPassword || nuovaPassword !== confermaPassword || isChangingPassword}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Aggiornamento...' : 'Cambia Password'}
                  </button>
                </div>
              </div>
              
              {/* Sezione Telefono */}
              <div className="bg-gray-750 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Numero di Telefono</h3>
                <div className="mb-4">
                  <p className="mb-2 text-gray-300">Telefono attuale: <span className="text-white font-medium">{telefono || 'Non impostato'}</span></p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="tel" 
                      value={nuovoTelefono} 
                      onChange={(e) => setNuovoTelefono(e.target.value)}
                      placeholder="Nuovo numero di telefono" 
                      className="flex-grow bg-gray-700 p-2 rounded-md text-white"
                    />
                    <button
                      onClick={() => handleUpdateAccount('telefono')}
                      disabled={!nuovoTelefono}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Aggiorna Telefono
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Elimina Account */}
              <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-red-400">Elimina Account</h3>
                <p className="text-gray-300 mb-4">
                  Questa operazione eliminerà definitivamente il tuo account e tutti i file associati. Questa azione non può essere annullata.
                </p>
                <div>
                  <p className="mb-2 text-sm text-gray-400">Inserisci la tua email per confermare:</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      value={deleteConfirm} 
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="Inserisci la tua email" 
                      className="flex-grow bg-gray-700 p-2 rounded-md text-white"
                    />
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirm !== email || isDeleting}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Eliminazione...' : 'Elimina Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {previewModelId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Anteprima 3D: {userFiles.find(f => f.id === previewModelId)?.name}
              </h3>
              <button 
                onClick={() => {
                  setPreviewModelId(null);
                  setPreviewModelFile(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="p-4" style={{height: '60vh', aspectRatio: '1/1', maxWidth: '60vh', margin: '0 auto'}}>
              {previewModelFile ? (
                <MemoizedModelViewer
                  file={previewModelFile}
                  fileType={previewModelType}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  {userFiles.find(f => f.id === previewModelId)?.thumbnailUrl ? (
                    <div className="text-center">
                      <div className="mb-4 max-w-md max-h-[40vh] overflow-hidden">
                        <img 
                          src={userFiles.find(f => f.id === previewModelId)?.thumbnailUrl} 
                          alt="Anteprima modello" 
                          className="max-h-full max-w-full object-contain mx-auto"
                        />
                      </div>
                      <p className="text-yellow-400 mb-2">
                        Impossibile caricare il modello 3D interattivo
                      </p>
                      <p className="text-gray-400 text-sm">
                        Visualizzazione dell'anteprima statica
                      </p>
                      <a 
                        href={userFiles.find(f => f.id === previewModelId)?.url}
                        download
                        className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-white"
                      >
                        Scarica modello
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
                      <p className="ml-3 text-gray-300">Caricamento del modello...</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale di conferma eliminazione file */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Conferma eliminazione</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Sei sicuro di voler eliminare questo file? Questa operazione non può essere annullata.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setFileToDelete(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  disabled={isDeletingFile}
                >
                  Annulla
                </button>
                <button 
                  onClick={() => handleDeleteFile(fileToDelete)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  disabled={isDeletingFile}
                >
                  {isDeletingFile ? 'Eliminazione...' : 'Elimina'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale per la visualizzazione dell'immagine a schermo intero */}
      {showFullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setShowFullScreenImage(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={fullScreenImageUrl} 
              alt="Full screen view" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullScreenImage(false);
              }}
              className="absolute top-4 right-4 bg-gray-800/50 hover:bg-gray-700 rounded-full p-2 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modale per rinominare il file */}
      {fileToRename && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Rinomina file</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nuovo nome file
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-red-500"
                  placeholder="Inserisci il nuovo nome"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setFileToRename(null);
                    setNewFileName('');
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  disabled={isRenaming}
                >
                  Annulla
                </button>
                <button 
                  onClick={handleRenameFile}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  disabled={isRenaming || !newFileName.trim()}
                >
                  {isRenaming ? 'Rinominando...' : 'Rinomina'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPanel; 