import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { db, storage } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, where, doc, getDoc, deleteDoc, Timestamp, setDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { ModelViewerPreventivo } from './ModelViewer';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ADMIN_EMAIL } from '../config/app-config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from 'firebase/app';
import 'firebase/storage';

interface FileInfo {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  userId: string;
  userName?: string;
  userEmail?: string;
  thumbnailUrl?: string;
  uploadedByAdmin?: boolean;
}

interface UserProfileData {
  id?: string;
  nome: string;
  cognome: string;
  telefono: string;
  indirizzo: string;
  citta: string;
  cap: string;
  email: string;
  createdAt?: Date;
  lastLogin?: Date;
  unreadMessages?: number;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
}

// Lista di email di amministratori (da modificare con le email degli amministratori reali)
const ADMIN_EMAILS = [ADMIN_EMAIL];

// Aggiungo le interfacce per la chat
interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'admin';
  read: boolean;
}

interface ChatMetadata {
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadAdmin: number;
  unreadUser: number;
  active: boolean;
  userName: string;
}

interface User {
  id: string;
  email: string;
  nome?: string;
  cognome?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  // Aggiungo proprietà per la chat
  unreadMessages?: number;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
}

const AdminPanel: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  
  const [allFiles, setAllFiles] = useState<FileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [filter, setFilter] = useState<'all' | 'images' | '3d'>('all');
  
  // Stati per la gestione dei profili utente
  const [allUsers, setAllUsers] = useState<(UserProfileData & {id: string})[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'users'>('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfileData | null>(null);
  const [userFiles, setUserFiles] = useState<FileInfo[]>([]);

  // Nuovi stati per la gestione dell'eliminazione dei file
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');
  
  // Stati per la modifica dei dati cliente
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editedUserData, setEditedUserData] = useState<UserProfileData | null>(null);
  const [isSavingUser, setIsSavingUser] = useState(false);
  
  // Stati per la selezione multipla dei file
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectAllFiles, setSelectAllFiles] = useState(false);
  const [multipleFilesToDelete, setMultipleFilesToDelete] = useState<string[]>([]);
  const [isDeletingMultipleFiles, setIsDeletingMultipleFiles] = useState(false);
  
  // Stati per il visualizzatore 3D
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>('');
  const [showModelViewer, setShowModelViewer] = useState<boolean>(false);
  
  // Nuovi stati per la gestione del caricamento di file
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stati per la gestione della chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatMetadata, setChatMetadata] = useState<ChatMetadata | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Aggiungi questa variabile di stato all'inizio del componente con gli altri stati
  const [uploadTask, setUploadTask] = useState<any>(null);

  // Verifica se l'utente corrente è un amministratore
  useEffect(() => {
    if (currentUser && ADMIN_EMAILS.includes(currentUser.email || '')) {
      setIsAdmin(true);
    } else {
      // Reindirizza gli utenti non amministratori
      navigate('/user-panel');
    }
  }, [currentUser, navigate]);

  // Effettua il logout e reindirizza l'utente
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  };

  // Carica tutti i file da Firestore
  const fetchAllFiles = async () => {
    if (!currentUser || !isAdmin) return;
    
    setLoadingFiles(true);
    
    try {
      const filesQuery = query(
        collection(db, 'files'),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(filesQuery);
      
      const files: FileInfo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          name: data.originalName || data.name,
          type: data.type,
          url: data.url,
          uploadedAt: data.uploadedAt.toDate(),
          userId: data.userId,
          userName: data.userName || 'Utente ' + data.userId.substring(0, 5),
          userEmail: data.userEmail,
          thumbnailUrl: data.thumbnailUrl
        });
      });
      
      setAllFiles(files);
    } catch (error) {
      console.error('Errore durante il recupero dei file:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Carica tutti gli utenti da Firestore
  const fetchAllUsers = async () => {
    if (!currentUser || !isAdmin) return;
    
    setLoadingUsers(true);
    
    try {
      const usersQuery = query(
        collection(db, 'users')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      
      const users: (UserProfileData & {id: string})[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as UserProfileData;
        
        // Gestione corretta per le date di Firestore
        let createdAt: Date | undefined = undefined;
        let lastLogin: Date | undefined = undefined;
        
        if (data.createdAt && typeof data.createdAt === 'object' && 'seconds' in data.createdAt) {
          createdAt = new Date((data.createdAt.seconds as number) * 1000);
        }
        
        if (data.lastLogin && typeof data.lastLogin === 'object' && 'seconds' in data.lastLogin) {
          lastLogin = new Date((data.lastLogin.seconds as number) * 1000);
        }
        
        users.push({
          id: doc.id,
          ...data,
          createdAt,
          lastLogin
        });
      });
      
      setAllUsers(users);
    } catch (error) {
      console.error('Errore durante il recupero degli utenti:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Carica i dettagli di un utente specifico
  const fetchUserDetails = async (userId: string) => {
    if (!userId) return;
    
    setUserDetails(null);
    setUserFiles([]);
    
    try {
      // Carica i dati dell'utente
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUserDetails({ 
          id: userDoc.id, 
          ...userDoc.data() as Omit<UserProfileData, 'id'> 
        } as UserProfileData);
      } else {
        console.log('Utente non trovato!');
      }
      
      // Carica i file dell'utente
      const filesQuery = query(
        collection(db, 'files'),
        where('userId', '==', userId),
        orderBy('uploadedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(filesQuery);
      const files: FileInfo[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          name: data.originalName || data.name,
          type: data.type,
          url: data.url,
          thumbnailUrl: data.thumbnailUrl,
          uploadedAt: data.uploadedAt.toDate(),
          userId: data.userId,
          uploadedByAdmin: data.uploadedByAdmin || false
        });
      });
      
      setUserFiles(files);
    } catch (error) {
      console.error('Errore nel recupero dei dati utente:', error);
    }
  };

  // Carica i file e gli utenti quando il componente viene montato
  useEffect(() => {
    if (isAdmin) {
      fetchAllFiles();
      fetchAllUsers();
    }
  }, [isAdmin]);

  // Carica i dettagli dell'utente quando viene selezionato
  useEffect(() => {
    if (selectedUser) {
      fetchUserDetails(selectedUser.id);
    } else {
      setUserDetails(null);
      setUserFiles([]);
      setIsEditingUser(false);
      setEditedUserData(null);
    }
  }, [selectedUser]);

  // Funzione per formattare la data
  const formatDate = (date?: Date | any) => {
    if (!date) return 'Data non disponibile';
    
    // Verifica se è un timestamp Firestore e convertilo in Date
    if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
      date = new Date(date.seconds * 1000);
    }
    
    // Verifica che sia effettivamente un oggetto Date valido
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.warn('Formato data non valido:', date);
      return 'Data non valida';
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
    
    const isYesterday = date.getDate() === yesterday.getDate() &&
                       date.getMonth() === yesterday.getMonth() &&
                       date.getFullYear() === yesterday.getFullYear();
    
    if (isToday) {
      return `Oggi ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (isYesterday) {
      return `Ieri ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  // Filtra i file in base al tipo selezionato
  const filteredFiles = filter === 'all' 
    ? allFiles 
    : allFiles.filter(file => file.type === filter);

  // Filtra gli utenti in base al termine di ricerca
  const filteredUsers = allUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nome?.toLowerCase().includes(searchLower) ||
      user.cognome?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.telefono?.toLowerCase().includes(searchLower) ||
      user.indirizzo?.toLowerCase().includes(searchLower)
    );
  });

  // Funzione per eliminare un file
  const handleDeleteFile = async (fileId: string, storagePath?: string) => {
    if (!currentUser || !isAdmin) return;
    
    setIsDeletingFile(true);
    
    try {
      // 1. Elimina dal database Firestore
      await deleteDoc(doc(db, 'files', fileId));
      
      // 2. Elimina dal Firebase Storage se abbiamo il percorso
      if (storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef).catch(err => {
          console.log("Errore nell'eliminazione del file Storage:", err);
        });
      } else {
        // Se non abbiamo il percorso diretto, proviamo a dedurlo dall'URL
        const fileToDelete = [...allFiles, ...userFiles].find(f => f.id === fileId);
        if (fileToDelete?.url) {
          const storageRefPath = fileToDelete.url.split('?')[0].split('/o/')[1];
          if (storageRefPath) {
            const decodedPath = decodeURIComponent(storageRefPath);
            const storageRef = ref(storage, decodedPath);
            await deleteObject(storageRef).catch(err => {
              console.log("Errore nell'eliminazione del file Storage:", err);
            });
          }
        }
      }
      
      // 3. Aggiorna la lista dei file
      if (selectedUser) {
        setUserFiles(userFiles.filter(f => f.id !== fileId));
      } else {
        setAllFiles(allFiles.filter(f => f.id !== fileId));
      }
      
      setActionSuccess("File eliminato con successo!");
      setTimeout(() => setActionSuccess(""), 3000);
      
    } catch (error: any) {
      console.error("Errore nell'eliminazione del file:", error);
      setUploadError(`Errore durante l'eliminazione: ${error.message || 'Errore sconosciuto'}`);
      setTimeout(() => setUploadError(""), 5000);
    } finally {
      setIsDeletingFile(false);
      setFileToDelete(null);
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
      
      // Camera con proporzioni quadrate e campo visivo ampio per catturare l'intero modello
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
      // Posizione iniziale della camera (verrà regolata in base al modello)
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);
      
      // Usiamo alpha: true per supportare la trasparenza
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true 
      });
      // Dimensione dell'anteprima
      renderer.setSize(400, 400);
      renderer.setPixelRatio(window.devicePixelRatio);
      
      // Miglioramento dell'illuminazione per far risaltare meglio il modello
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);
      
      // Luce direzionale primaria (luce chiave)
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight1.position.set(1, 2, 1);
      scene.add(directionalLight1);
      
      // Luce direzionale secondaria (luce di riempimento)
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight2.position.set(-1, 0.5, -1);
      scene.add(directionalLight2);
      
      // Luce dall'alto per evidenziare i dettagli superiori
      const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
      topLight.position.set(0, 4, 0);
      scene.add(topLight);
      
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
            // Materiale migliorato per il modello con colore rosso caratteristico di 3DMAKES
            const material = new THREE.MeshStandardMaterial({ 
              color: 0xb92b27, 
              roughness: 0.4, 
              metalness: 0.2,
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
              
              // Adatta la camera per inquadrare tutto il modello con un margine ridotto
              const size = new THREE.Vector3();
              boundingBox.getSize(size);
              const maxDim = Math.max(size.x, size.y, size.z);
              
              // Calcola una distanza ottimale in base alle dimensioni del modello
              // Fattore di scala più basso per riempire meglio l'area visibile
              camera.position.z = maxDim * 1.2;
              camera.position.y = maxDim * 0.5;
              camera.position.x = maxDim * 0.5;
              camera.lookAt(0, 0, 0);
            }
            
            scene.add(mesh);
            
            // Ruotiamo il modello per una vista 3/4 più interessante
            mesh.rotation.x = -Math.PI / 8;  // Leggera inclinazione verticale
            mesh.rotation.y = Math.PI / 3.5; // Rotazione orizzontale per vista 3/4
            
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
                  roughness: 0.4, 
                  metalness: 0.2,
                  flatShading: false
                });
              }
            });
            
            // Centro il modello e calcolo la vista ottimale
            const box = new THREE.Box3().setFromObject(object);
            const center = new THREE.Vector3();
            box.getCenter(center);
            object.position.copy(center.negate());
            
            // Adatta la camera per inquadrare meglio tutto il modello
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Calcola una distanza ottimale in base alle dimensioni del modello
            camera.position.z = maxDim * 1.2;
            camera.position.y = maxDim * 0.5;
            camera.position.x = maxDim * 0.5;
            camera.lookAt(0, 0, 0);
            
            scene.add(object);
            
            // Ruotiamo il modello per una vista 3/4 più interessante
            object.rotation.x = -Math.PI / 8;  // Leggera inclinazione verticale
            object.rotation.y = Math.PI / 3.5; // Rotazione orizzontale per vista 3/4
            
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
            
            // Opzionale: applica materiale rosso ai mesh del modello GLTF
            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({ 
                  color: 0xb92b27, 
                  roughness: 0.4, 
                  metalness: 0.2,
                  flatShading: false
                });
              }
            });
            
            // Adatta la camera per inquadrare tutto il modello
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Calcola una distanza ottimale in base alle dimensioni del modello
            camera.position.z = maxDim * 1.2;
            camera.position.y = maxDim * 0.5;
            camera.position.x = maxDim * 0.5;
            camera.lookAt(0, 0, 0);
            
            scene.add(gltf.scene);
            
            // Ruotiamo il modello per una vista 3/4 più interessante
            gltf.scene.rotation.x = -Math.PI / 8;  // Leggera inclinazione verticale
            gltf.scene.rotation.y = Math.PI / 3.5; // Rotazione orizzontale per vista 3/4
            
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

  // Carica il file per l'utente selezionato
  const handleUploadForUser = async () => {
    if (!file || !currentUser || !isAdmin || !selectedUser || !userDetails) return;
    
    // Assicuriamoci di avere l'ID dell'utente
    const userId = typeof selectedUser === 'string' ? selectedUser : selectedUser.id;
    
    setUploadLoading(true);
    setUploadError('');
    setActionSuccess('');
    setUploadProgress(0);
    
    try {
      console.log("Inizio processo di caricamento file per utente...");
      // Ottieni il nome e cognome dell'utente selezionato
      const userFullName = `${userDetails.nome} ${userDetails.cognome}`;
      
      // Crea un nome file sicuro con timestamp per evitare conflitti
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const safeFileName = `admin_upload_${timestamp}.${fileExtension}`;
      
      // Percorso per lo storage
      const storagePath = `files/${userId}/${safeFileName}`;
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
          const thumbnailPath = `thumbnails/${userId}/${timestamp}_thumb.png`;
          const thumbnailRef = ref(storage, thumbnailPath);
          await uploadBytesResumable(thumbnailRef, thumbnailFile);
          thumbnailUrl = await getDownloadURL(thumbnailRef);
          console.log("Anteprima generata e caricata:", thumbnailUrl);
        }
      }
      
      try {
        console.log("Creazione riferimento Storage...");
        // Carica il file su Firebase Storage
        const storageRef = ref(storage, storagePath);
        console.log("Inizio upload...");
        const uploadTask = uploadBytesResumable(storageRef, file);
        setUploadTask(uploadTask); // Salva il riferimento all'uploadTask
        
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
                             (file.type.includes('3d') || ['obj', 'stl', 'gltf'].includes(fileExtension?.toLowerCase() || '')) ? '3d' : 'other';
              
              console.log("Salvataggio informazioni file in Firestore...");
              
              // Salva le informazioni del file in Firestore
              const docRef = await addDoc(collection(db, 'files'), {
                name: file.name, // Utilizziamo il nome originale del file per visualizzazione
                originalName: file.name,
                type: fileType,
                url: downloadURL,
                storagePath,
                uploadedAt: Timestamp.now(),
                userId: userId, // Assicuriamoci di usare l'ID corretto
                userEmail: userDetails.email,
                userName: userFullName,
                uploadedByAdmin: true,
                thumbnailUrl: thumbnailUrl
              });
              
              console.log("File salvato con successo in Firestore con ID:", docRef.id);
              
              // Resetta l'interfaccia di caricamento
              resetUploadInterface();
              setActionSuccess('File caricato con successo per l\'utente!');
              
              // Aggiorna la lista dei file dell'utente
              await fetchUserDetails(userId);
              
            } catch (firestoreError: any) {
              console.error("Errore nel salvataggio in Firestore:", firestoreError);
              setUploadError(`Errore database: ${firestoreError.code || 'unknown'} - ${firestoreError.message || 'Errore sconosciuto'}`);
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
  
  // Resetta l'interfaccia di caricamento
  const resetUploadInterface = () => {
    setSelectedFiles([]); // Reset dell'array di file selezionati
    
    setFilePreview(null);
    setUploadLoading(false);
    setUploadProgress(0);
    setUploadError('');
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Inizia la modifica dei dati cliente
  const handleStartEditUser = () => {
    if (userDetails) {
      setEditedUserData({...userDetails});
      setIsEditingUser(true);
    }
  };
  
  // Annulla la modifica
  const handleCancelEditUser = () => {
    setIsEditingUser(false);
    setEditedUserData(null);
  };
  
  // Aggiorna i dati dell'utente
  const handleUpdateUserData = async () => {
    if (!selectedUser || !editedUserData || isSavingUser) return;
    
    // Assicuriamoci di avere l'ID dell'utente
    const userId = typeof selectedUser === 'string' ? selectedUser : selectedUser.id;
    
    setIsSavingUser(true);
    setActionSuccess('');
    
    try {
      // Aggiorna i dati utente in Firestore
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        ...editedUserData,
        // Mantieni le date originali
        ...(userDetails?.createdAt && { createdAt: Timestamp.fromDate(userDetails.createdAt) }),
        ...(userDetails?.lastLogin && { lastLogin: Timestamp.fromDate(userDetails.lastLogin) })
      }, { merge: true });
      
      setActionSuccess('Dati utente aggiornati con successo!');
      
      // Aggiorna la visualizzazione dei dettagli
      fetchUserDetails(userId);
      
      // Resetta lo stato di modifica
      setIsEditingUser(false);
    } catch (error: any) {
      console.error('Errore durante l\'aggiornamento dei dati utente:', error);
      setUploadError(`Errore durante l'aggiornamento: ${error.message || 'Errore sconosciuto'}`);
    } finally {
      setIsSavingUser(false);
    }
  };

  // Funzione per gestire la selezione di un singolo file
  const handleSelectFile = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
      setSelectAllFiles(false);
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };
  
  // Funzione per gestire la selezione/deselezione di tutti i file
  const handleSelectAllFiles = () => {
    const newSelectAllFiles = !selectAllFiles;
    setSelectAllFiles(newSelectAllFiles);
    
    if (newSelectAllFiles) {
      // Seleziona tutti i file nell'elenco corrente (dipende dalla scheda attiva)
      if (activeTab === 'files') {
        setSelectedFiles(filteredFiles.map(file => file.id));
      } else if (selectedUser) {
        setSelectedFiles(userFiles.map(file => file.id));
      }
    } else {
      // Deseleziona tutti i file
      setSelectedFiles([]);
    }
  };
  
  // Funzione per eliminare più file
  const handleDeleteMultipleFiles = async () => {
    if (!currentUser || !isAdmin || selectedFiles.length === 0) return;
    
    setIsDeletingMultipleFiles(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      // Elimina ogni file selezionato
      for (const fileId of selectedFiles) {
        try {
          // 1. Elimina dal database Firestore
          await deleteDoc(doc(db, 'files', fileId));
          
          // 2. Elimina dal Firebase Storage
          const fileToDelete = [...allFiles, ...userFiles].find(f => f.id === fileId);
          if (fileToDelete?.url) {
            const storageRefPath = fileToDelete.url.split('?')[0].split('/o/')[1];
            if (storageRefPath) {
              const decodedPath = decodeURIComponent(storageRefPath);
              const storageRef = ref(storage, decodedPath);
              await deleteObject(storageRef).catch(err => {
                console.log("Errore nell'eliminazione del file Storage:", err);
              });
            }
          }
          
          successCount++;
        } catch (error) {
          console.error(`Errore nell'eliminazione del file ${fileId}:`, error);
          errorCount++;
        }
      }
      
      // 3. Aggiorna le liste dei file
      if (selectedUser) {
        setUserFiles(userFiles.filter(f => !selectedFiles.includes(f.id)));
      } else {
        setAllFiles(allFiles.filter(f => !selectedFiles.includes(f.id)));
      }
      
      // 4. Mostra messaggio di successo
      setActionSuccess(`${successCount} file eliminati con successo${errorCount > 0 ? ` (${errorCount} errori)` : ''}!`);
      setTimeout(() => setActionSuccess(""), 3000);
      
      // 5. Resetta la selezione
      setSelectedFiles([]);
      setSelectAllFiles(false);
      
    } catch (error: any) {
      console.error("Errore nell'eliminazione multipla dei file:", error);
      setUploadError(`Errore durante l'eliminazione: ${error.message || 'Errore sconosciuto'}`);
      setTimeout(() => setUploadError(""), 5000);
    } finally {
      setIsDeletingMultipleFiles(false);
      setMultipleFilesToDelete([]);
    }
  };
  
  // Funzione per scaricare più file
  const handleDownloadMultipleFiles = () => {
    // Per ogni file selezionato, avvia il download
    selectedFiles.forEach(fileId => {
      const fileToDownload = [...allFiles, ...userFiles].find(f => f.id === fileId);
      if (fileToDownload) {
        // Crea un link temporaneo per il download
        const link = document.createElement('a');
        link.href = fileToDownload.url;
        link.download = fileToDownload.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    // Mostra messaggio di successo
    setActionSuccess(`Download di ${selectedFiles.length} file avviato!`);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  // Funzione per preparare e mostrare il visualizzatore 3D
  const handlePreviewModel = async (fileInfo: FileInfo) => {
    try {
      // Solo per i file di tipo 3D
      if (fileInfo.type !== '3d') return;
      
      // Ottieni il tipo di file dalla URL o dal nome
      const fileName = fileInfo.name.toLowerCase();
      const fileExtension = fileName.split('.').pop() || '';
      let fileType = '';
      
      if (fileExtension === 'stl') {
        fileType = 'stl';
      } else if (fileExtension === 'obj') {
        fileType = 'obj';
      } else {
        console.error('Tipo di file non supportato:', fileExtension);
        return;
      }
      
      // Scarica il file dal server
      const response = await fetch(fileInfo.url);
      const blob = await response.blob();
      const file = new File([blob], fileInfo.name, { type: 'application/octet-stream' });
      
      // Imposta gli stati per il visualizzatore
      setPreviewFile(file);
      setPreviewFileType(fileType);
      setPreviewURL(fileInfo.url);
      setShowModelViewer(true);
    } catch (error) {
      console.error('Errore durante la preparazione del modello:', error);
    }
  };

  // Funzione per caricare i messaggi della chat dell'utente selezionato
  const fetchUserMessages = useCallback(async () => {
    if (!selectedUser?.id) return;
    
    setLoadingMessages(true);
    
    try {
      // Carica i metadati della chat
      const metadataRef = doc(db, `chats/${selectedUser.id}/metadata/info`);
      const metadataSnap = await getDoc(metadataRef);
      
      if (metadataSnap.exists()) {
        const metaData = metadataSnap.data();
        setChatMetadata({
          lastMessage: metaData.lastMessage || '',
          lastMessageTimestamp: metaData.lastMessageTimestamp?.toDate() || new Date(),
          unreadAdmin: metaData.unreadAdmin || 0,
          unreadUser: metaData.unreadUser || 0,
          active: metaData.active !== false, // default a true
          userName: metaData.userName || selectedUser.nome || selectedUser.email || 'Utente'
        });
      } else {
        // Se non esiste, inizializza un nuovo documento di metadati
        setChatMetadata({
          lastMessage: '',
          lastMessageTimestamp: new Date(),
          unreadAdmin: 0,
          unreadUser: 0,
          active: true,
          userName: selectedUser.nome ? `${selectedUser.nome} ${selectedUser.cognome || ''}`.trim() : (selectedUser.email || 'Utente')
        });
      }
      
      // Carica i messaggi
      const chatRef = collection(db, `chats/${selectedUser.id}/messages`);
      const q = query(chatRef, orderBy('timestamp', 'asc'));
      
      const querySnapshot = await getDocs(q);
      
      const chatMessages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        try {
          // Assicuriamoci che la data sia convertita correttamente
          const timestamp = data.timestamp && typeof data.timestamp.toDate === 'function' 
            ? data.timestamp.toDate() 
            : new Date();
          
          chatMessages.push({
            id: doc.id,
            text: data.text || '',
            timestamp: timestamp,
            sender: data.sender || 'user',
            read: !!data.read
          });
        } catch (err) {
          console.error('Errore nella conversione della data per il messaggio:', err);
        }
      });
      
      setMessages(chatMessages);
      
      // Aggiorna lo stato di lettura dei messaggi
      const unreadMessages = querySnapshot.docs.filter(
        doc => doc.data().sender === 'user' && !doc.data().read
      );
      
      // Marca i messaggi come letti
      const updatePromises = unreadMessages.map(doc => 
        updateDoc(doc.ref, { read: true })
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(updatePromises);
        
        // Aggiorna i metadati della chat
        await updateDoc(metadataRef, { unreadAdmin: 0 }).catch(() => {
          // Se il documento non esiste, lo creiamo
          setDoc(metadataRef, { 
            unreadAdmin: 0, 
            unreadUser: 0,
            lastMessage: chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].text : '',
            lastMessageTimestamp: Timestamp.now(),
            active: true,
            userName: selectedUser.nome ? `${selectedUser.nome} ${selectedUser.cognome || ''}`.trim() : (selectedUser.email || 'Utente')
          });
        });
      }
      
    } catch (error) {
      console.error('Errore nel recupero dei messaggi:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedUser]);

  // Funzione per inviare un messaggio come admin
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser?.id) return;
    
    try {
      // Riferimento alla collezione dei messaggi
      const chatRef = collection(db, `chats/${selectedUser.id}/messages`);
      
      // Riferimento ai metadati
      const metadataRef = doc(db, `chats/${selectedUser.id}/metadata/info`);
      
      // Nuovo messaggio
      const messageData = {
        text: newMessage.trim(),
        timestamp: Timestamp.now(),
        sender: 'admin' as const,
        read: false
      };
      
      // Aggiunge il messaggio
      await addDoc(chatRef, messageData);
      
      // Aggiorna i metadati
      await updateDoc(metadataRef, {
        lastMessage: newMessage.trim(),
        lastMessageTimestamp: Timestamp.now(),
        unreadUser: increment(1)
      }).catch(() => {
        // Se il documento non esiste, lo creiamo
        setDoc(metadataRef, {
          lastMessage: newMessage.trim(),
          lastMessageTimestamp: Timestamp.now(),
          unreadAdmin: 0,
          unreadUser: 1,
          active: true,
          userName: selectedUser.nome ? `${selectedUser.nome} ${selectedUser.cognome || ''}`.trim() : (selectedUser.email || 'Utente')
        });
      });
      
      // Resetta l'input
      setNewMessage('');
      
      // Ricarica i messaggi
      await fetchUserMessages();
    } catch (error) {
      console.error('Errore nell\'invio del messaggio:', error);
    }
  };

  // Funzione per caricare i contatori dei messaggi non letti per tutti gli utenti
  const fetchChatMetadataForUsers = useCallback(async () => {
    if (!allUsers.length) return;
    
    try {
      const userChatData = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const metadataRef = doc(db, `chats/${user.id}/metadata/info`);
            const metadataSnap = await getDoc(metadataRef);
            
            if (metadataSnap.exists()) {
              const data = metadataSnap.data();
              let timestamp;
              
              try {
                // Gestiamo correttamente il timestamp
                timestamp = data.lastMessageTimestamp && typeof data.lastMessageTimestamp.toDate === 'function'
                  ? data.lastMessageTimestamp.toDate()
                  : new Date();
              } catch (err) {
                console.warn('Errore nella conversione del timestamp:', err);
                timestamp = new Date();
              }
              
              return {
                userId: user.id,
                unreadAdmin: data.unreadAdmin || 0,
                lastMessage: data.lastMessage || '',
                lastMessageTimestamp: timestamp
              };
            }
            
            return { userId: user.id, unreadAdmin: 0, lastMessage: '', lastMessageTimestamp: new Date() };
          } catch (error) {
            console.error(`Errore nel recupero dei metadati della chat per l'utente ${user.id}:`, error);
            return { userId: user.id, unreadAdmin: 0, lastMessage: '', lastMessageTimestamp: new Date() };
          }
        })
      );
      
      // Aggiorna lo stato degli utenti con i dati della chat
      setAllUsers(prevUsers => 
        prevUsers.map(user => {
          const chatData = userChatData.find(data => data.userId === user.id);
          return {
            ...user,
            unreadMessages: chatData?.unreadAdmin || 0,
            lastMessage: chatData?.lastMessage || '',
            lastMessageTimestamp: chatData?.lastMessageTimestamp
          };
        })
      );
      
    } catch (error) {
      console.error('Errore nel recupero dei metadati delle chat:', error);
    }
  }, [allUsers]);

  // Sostituisci questa funzione per gestire correttamente il tipo User
  const handleUserClick = async (userId: string) => {
    // Trova l'utente selezionato dall'array di utenti
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      // Converti il profilo utente in un oggetto User
      setSelectedUser({
        id: user.id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        telefono: user.telefono,
        indirizzo: user.indirizzo,
        citta: user.citta,
        cap: user.cap,
        unreadMessages: user.unreadMessages,
        lastMessage: user.lastMessage,
        lastMessageTimestamp: user.lastMessageTimestamp
      });
      
      // Carica i file dell'utente selezionato
      await fetchUserDetails(userId);
    }
  };

  // Aggiungi gli useEffect per la gestione della chat
  // Scroll automatico ai nuovi messaggi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Carica i messaggi e configura il listener quando viene selezionato un utente
  useEffect(() => {
    if (selectedUser?.id && activeTab === 'users') {
      fetchUserMessages();
      
      // Configura un listener in tempo reale per i messaggi
      const chatRef = collection(db, `chats/${selectedUser.id}/messages`);
      const q = query(chatRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        // Verifica se ci sono nuovi messaggi
        if (!snapshot.empty) {
          fetchUserMessages();
        }
      });
      
      // Configura un listener per i metadati della chat
      const metadataRef = doc(db, `chats/${selectedUser.id}/metadata/info`);
      const metadataUnsubscribe = onSnapshot(metadataRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setChatMetadata({
            lastMessage: data.lastMessage || '',
            lastMessageTimestamp: data.lastMessageTimestamp?.toDate() || new Date(),
            unreadAdmin: data.unreadAdmin || 0,
            unreadUser: data.unreadUser || 0,
            active: data.active !== false,
            userName: data.userName || selectedUser.nome || selectedUser.email || 'Utente'
          });
        }
      });
      
      // Pulisci i listener quando cambia l'utente selezionato
      return () => {
        unsubscribe();
        metadataUnsubscribe();
      };
    }
  }, [selectedUser, activeTab, fetchUserMessages]);

  // Carica i metadati delle chat quando vengono caricati gli utenti
  useEffect(() => {
    if (allUsers.length > 0 && activeTab === 'users') {
      fetchChatMetadataForUsers();
    }
  }, [allUsers, activeTab, fetchChatMetadataForUsers]);

  // Aggiungi questa funzione con le altre funzioni di gestione
  const handleCancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setUploadLoading(false);
      setUploadProgress(0);
      setUploadError('');
      // Mostra un messaggio all'utente
      toast.info('Caricamento annullato');
    }
  };

  if (!isAdmin) {
    return null; // Non mostrare nulla mentre reindirizza
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pannello Amministratore</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              {currentUser?.email} (Admin)
            </span>
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
        {actionSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-500">
            {actionSuccess}
          </div>
        )}
        
        {uploadError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
            {uploadError}
          </div>
        )}
      
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto no-scrollbar">
          <button
            className={`px-6 py-3 font-medium transition-all duration-200 flex items-center ${
              activeTab === 'files'
                ? 'text-white border-b-2 border-red-500 bg-gray-800/40'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
            }`}
            onClick={() => setActiveTab('files')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            File Caricati
          </button>
          <button
            className={`px-6 py-3 font-medium transition-all duration-200 flex items-center ${
              activeTab === 'users'
                ? 'text-white border-b-2 border-red-500 bg-gray-800/40'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Clienti
          </button>
        </div>

        {/* Files Tab */}
        {activeTab === 'files' && (
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold mb-4 md:mb-0">File caricati da tutti gli utenti</h2>
              
              <div className="flex items-center gap-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Tutti
                  </button>
                  <button
                    onClick={() => setFilter('images')}
                    className={`px-4 py-2 rounded-md ${
                      filter === 'images'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Immagini
                  </button>
                  <button
                    onClick={() => setFilter('3d')}
                    className={`px-4 py-2 rounded-md ${
                      filter === '3d'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Oggetti 3D
                  </button>
                </div>
              </div>
            </div>

            {/* Files List */}
            <div className="p-6 bg-gray-800 rounded-lg">
              {/* Controlli per selezione multipla */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectAllFiles}
                    onChange={handleSelectAllFiles}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm text-gray-300">
                    Seleziona tutti
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadMultipleFiles}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Scarica ({selectedFiles.length})
                    </button>
                    <button
                      onClick={() => setMultipleFilesToDelete(selectedFiles)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Elimina ({selectedFiles.length})
                    </button>
                  </div>
                )}
              </div>
            
              {loadingFiles ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin mr-3"></div>
                  <p className="text-gray-400">Caricamento file...</p>
                </div>
              ) : filteredFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nessun file trovato.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFiles.map((fileInfo) => (
                    <div key={fileInfo.id} className={`p-4 bg-gray-700 rounded-lg ${selectedFiles.includes(fileInfo.id) ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(fileInfo.id)}
                          onChange={() => handleSelectFile(fileInfo.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                        />
                        <span className="text-xs text-gray-400">ID: {fileInfo.id.substring(0, 6)}...</span>
                      </div>
                      <div className="mb-3">
                        {fileInfo.type === 'image' ? (
                          <img 
                            src={fileInfo.url} 
                            alt={fileInfo.name} 
                            className="w-full h-40 object-cover rounded-md"
                          />
                        ) : fileInfo.type === '3d' ? (
                          fileInfo.thumbnailUrl && fileInfo.thumbnailUrl.length > 5 ? (
                            <img 
                              src={fileInfo.thumbnailUrl} 
                              alt={fileInfo.name} 
                              className="w-full h-40 object-contain p-2 bg-gray-800 rounded-md"
                            />
                          ) : (
                            <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-800 rounded-md">
                              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                                <path d="M12 22L3 17V7L12 2L21 7V17L12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span className="text-red-500 font-medium mt-2">MODELLO 3D</span>
                            </div>
                          )
                        ) : (
                          <div className="w-full h-40 flex items-center justify-center bg-gray-800 rounded-md">
                            <span className="text-4xl">
                              📄
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium truncate" title={fileInfo.name}>
                        {fileInfo.name}
                      </h3>
                      <div className="space-y-1 mt-2">
                        <p className="text-sm text-gray-400 flex items-center">
                          <span className="w-24 inline-block font-medium">Utente:</span>
                          <span className="overflow-hidden text-ellipsis">{fileInfo.userName}</span>
                        </p>
                        <p className="text-sm text-gray-400 flex items-center">
                          <span className="w-24 inline-block font-medium">Email:</span>
                          <span className="overflow-hidden text-ellipsis">{fileInfo.userEmail}</span>
                        </p>
                        <p className="text-sm text-gray-400 flex items-center">
                          <span className="w-24 inline-block font-medium">Data:</span>
                          <span>{formatDate(fileInfo.uploadedAt)}</span>
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={fileInfo.url}
                          download={fileInfo.name}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Scarica
                        </a>
                        {fileInfo.type === '3d' && (
                          <button
                            onClick={() => handlePreviewModel(fileInfo)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex-1 flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                            Vista 3D
                          </button>
                        )}
                        <button
                          onClick={() => setFileToDelete(fileInfo.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cerca cliente per nome, email, telefono..."
                    className="w-full bg-gray-700 p-3 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                {selectedUser && (
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-white"
                  >
                    ← Torna alla lista
                  </button>
                )}
              </div>
            </div>

            {/* User List */}
            {!selectedUser ? (
              <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Elenco Clienti</h2>
                
                {loadingUsers ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin mr-3"></div>
                    <p className="text-gray-400">Caricamento clienti...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nessun cliente trovato.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-750 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-700">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Nome</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Email</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Telefono</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Registrato il</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Azioni</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700">
                            <td className="py-3 px-4">
                              {user.nome} {user.cognome}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {user.email}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {user.telefono || 'N/D'}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm"
                              >
                                Dettagli
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Details */}
                {userDetails ? (
                  <>
                    <div className="p-6 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Dettagli Cliente</h2>
                        {!isEditingUser ? (
                          <button
                            onClick={handleStartEditUser}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifica
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={handleUpdateUserData}
                              disabled={isSavingUser}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm flex items-center disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {isSavingUser ? 'Salvataggio...' : 'Salva'}
                            </button>
                            <button
                              onClick={handleCancelEditUser}
                              disabled={isSavingUser}
                              className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-md text-white text-sm flex items-center disabled:opacity-50"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Annulla
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {!isEditingUser ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-400">Informazioni Personali</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-400 text-sm">Nome Completo</p>
                                <p className="font-medium">{userDetails.nome} {userDetails.cognome}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="font-medium">{userDetails.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Telefono</p>
                                <p className="font-medium">{userDetails.telefono || 'Non specificato'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-400">Indirizzo</h3>
                            <p className="whitespace-pre-line">{userDetails.indirizzo}</p>
                            <div className="flex flex-col mt-2">
                              <p><span className="text-gray-400 text-sm">Città:</span> {userDetails.citta || 'Non specificata'}</p>
                              <p><span className="text-gray-400 text-sm">CAP:</span> {userDetails.cap || 'Non specificato'}</p>
                            </div>
                            
                            <h3 className="text-lg font-medium mb-4 mt-6 text-blue-400">Date</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-400 text-sm">Data Registrazione</p>
                                <p>{formatDate(userDetails.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-sm">Ultimo Accesso</p>
                                <p>{formatDate(userDetails.lastLogin)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Form per modificare i dati utente
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-400">Informazioni Personali</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Nome</label>
                                <input
                                  type="text"
                                  value={editedUserData?.nome || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, nome: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Cognome</label>
                                <input
                                  type="text"
                                  value={editedUserData?.cognome || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, cognome: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Email</label>
                                <input
                                  type="email"
                                  value={editedUserData?.email || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, email: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Telefono</label>
                                <input
                                  type="tel"
                                  value={editedUserData?.telefono || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, telefono: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4 text-blue-400">Indirizzo</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Indirizzo</label>
                                <textarea
                                  value={editedUserData?.indirizzo || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, indirizzo: e.target.value})}
                                  rows={3}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                ></textarea>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Città</label>
                                <input
                                  type="text"
                                  value={editedUserData?.citta || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, citta: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">CAP</label>
                                <input
                                  type="text"
                                  value={editedUserData?.cap || ''}
                                  onChange={(e) => setEditedUserData({...editedUserData!, cap: e.target.value})}
                                  className="w-full bg-gray-700 p-2 mt-1 rounded-md text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload File for User */}
                    <div className="p-6 bg-gray-800 rounded-lg">
                      <h2 className="text-xl font-semibold mb-4">Carica File per {userDetails.nome} {userDetails.cognome}</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Seleziona un file da caricare per questo cliente
                          </label>
                          <div 
                            className="w-full h-32 border-2 border-dashed border-gray-500 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-700"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-400">Carica un file o trascinalo qui</p>
                            <p className="text-xs text-gray-500 mt-1">Tutti i tipi di file supportati</p>
                            <input 
                              ref={fileInputRef}
                              type="file"
                              onChange={handleFileChange}
                              className="hidden"
                              accept="*/*"
                            />
                          </div>
                          
                          {/* Barra di progresso */}
                          {uploadLoading && (
                            <div className="mt-4">
                              <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${uploadProgress}%` }}
                                >
                                  {/* Nessuna percentuale all'interno della barra */}
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Caricamento in corso...</span>
                                <span>{uploadProgress}% completato</span>
                              </div>
                              <button 
                                onClick={handleCancelUpload}
                                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center justify-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Annulla caricamento
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Anteprima file */}
                        <div className="col-span-1 flex flex-col">
                          <span className="block text-sm font-medium text-gray-300 mb-2">Anteprima</span>
                          <div className="flex-1 bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                            {filePreview ? (
                              <img src={filePreview} alt="Anteprima" className="max-h-32 max-w-full object-contain" />
                            ) : file ? (
                              <div className="text-center p-4">
                                <span className="text-3xl mb-2">📄</span>
                                <p className="text-xs text-gray-400 truncate max-w-[120px]">{file.name}</p>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">Nessun file selezionato</p>
                            )}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={handleUploadForUser}
                              disabled={!file || uploadLoading}
                              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {uploadLoading ? (
                                <>
                                  <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </>
                              ) : (
                                'Carica File'
                              )}
                            </button>
                            <button
                              onClick={resetUploadInterface}
                              disabled={!file || uploadLoading}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* User Files */}
                    <div className="p-6 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">File del Cliente</h2>
                        
                        {/* Controlli per selezione multipla (sezione file utente) */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="select-all-user-files"
                              checked={selectAllFiles}
                              onChange={handleSelectAllFiles}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <label htmlFor="select-all-user-files" className="ml-2 text-sm text-gray-300">
                              Seleziona tutti
                            </label>
                          </div>
                          
                          {selectedFiles.length > 0 && (
                            <div className="flex gap-2">
                              <button
                                onClick={handleDownloadMultipleFiles}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Scarica ({selectedFiles.length})
                              </button>
                              <button
                                onClick={() => setMultipleFilesToDelete(selectedFiles)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Elimina ({selectedFiles.length})
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {userFiles.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Questo cliente non ha ancora caricato file.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userFiles.map((fileInfo) => (
                            <div key={fileInfo.id} className={`p-4 bg-gray-700 rounded-lg ${selectedFiles.includes(fileInfo.id) ? 'ring-2 ring-blue-500' : ''}`}>
                              <div className="flex justify-between items-start mb-3">
                                <input
                                  type="checkbox"
                                  checked={selectedFiles.includes(fileInfo.id)}
                                  onChange={() => handleSelectFile(fileInfo.id)}
                                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                                />
                                <span className="text-xs text-gray-400">ID: {fileInfo.id.substring(0, 6)}...</span>
                              </div>
                              <div className="mb-3">
                                {fileInfo.type === 'image' ? (
                                  <img 
                                    src={fileInfo.url} 
                                    alt={fileInfo.name} 
                                    className="w-full h-40 object-cover rounded-md"
                                  />
                                ) : fileInfo.type === '3d' ? (
                                  fileInfo.thumbnailUrl && fileInfo.thumbnailUrl.length > 5 ? (
                                    <img 
                                      src={fileInfo.thumbnailUrl} 
                                      alt={fileInfo.name} 
                                      className="w-full h-40 object-contain p-2 bg-gray-800 rounded-md"
                                    />
                                  ) : (
                                    <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-800 rounded-md">
                                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                                        <path d="M12 22L3 17V7L12 2L21 7V17L12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                      <span className="text-red-500 font-medium mt-2">MODELLO 3D</span>
                                    </div>
                                  )
                                ) : (
                                  <div className="w-full h-40 flex items-center justify-center bg-gray-800 rounded-md">
                                    <span className="text-4xl">
                                      📄
                                    </span>
                                  </div>
                                )}
                              </div>
                              <h3 className="font-medium truncate" title={fileInfo.name}>
                                {fileInfo.name}
                              </h3>
                              <div className="space-y-1 mt-2">
                                <p className="text-sm text-gray-400 flex items-center">
                                  <span className="w-24 inline-block font-medium">Utente:</span>
                                  <span className="overflow-hidden text-ellipsis">{fileInfo.userName}</span>
                                </p>
                                <p className="text-sm text-gray-400 flex items-center">
                                  <span className="w-24 inline-block font-medium">Email:</span>
                                  <span className="overflow-hidden text-ellipsis">{fileInfo.userEmail}</span>
                                </p>
                                <p className="text-sm text-gray-400 flex items-center">
                                  <span className="w-24 inline-block font-medium">Data:</span>
                                  <span>{formatDate(fileInfo.uploadedAt)}</span>
                                </p>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <a
                                  href={fileInfo.url}
                                  download={fileInfo.name}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  Scarica
                                </a>
                                {fileInfo.type === '3d' && (
                                  <button
                                    onClick={() => handlePreviewModel(fileInfo)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex-1 flex items-center justify-center"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                    Vista 3D
                                  </button>
                                )}
                                <button
                                  onClick={() => setFileToDelete(fileInfo.id)}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Elimina
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-2 border-gray-500 border-t-white rounded-full animate-spin mr-3"></div>
                    <p className="text-gray-400">Caricamento dettagli cliente...</p>
                  </div>
                )}

                {/* Sezione Chat */}
                {userDetails && (
                  <div className="p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Chat con {userDetails.nome} {userDetails.cognome}</h2>
                    
                    <div className="bg-gray-750 rounded-lg h-[400px] flex flex-col">
                      {/* Area messaggi */}
                      <div className="flex-grow overflow-y-auto p-4">
                        {loadingMessages ? (
                          <div className="flex justify-center items-center h-full">
                            <div className="w-6 h-6 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                            <p className="ml-2 text-gray-400">Caricamento messaggi...</p>
                          </div>
                        ) : messages.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-400 mb-2">Nessun messaggio.</p>
                            <p className="text-gray-500 text-sm">Inizia la conversazione con questo cliente!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                    message.sender === 'admin' 
                                      ? 'bg-blue-600 text-white rounded-tr-none' 
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
                      <div className="p-3 border-t border-gray-700 bg-gray-750">
                        <div className="flex rounded-lg overflow-hidden shadow-lg ring-1 ring-gray-600 focus-within:ring-red-500 transition-all duration-200">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Scrivi un messaggio..."
                            className="flex-grow bg-gray-700 p-3 focus:outline-none text-white"
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
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
                  >
                    ← Torna all'elenco clienti
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
      
      {/* Modale di conferma eliminazione multipla */}
      {multipleFilesToDelete.length > 0 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold">Conferma eliminazione multipla</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">
                Sei sicuro di voler eliminare {multipleFilesToDelete.length} file? Questa operazione non può essere annullata.
              </p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setMultipleFilesToDelete([])}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  disabled={isDeletingMultipleFiles}
                >
                  Annulla
                </button>
                <button 
                  onClick={handleDeleteMultipleFiles}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  disabled={isDeletingMultipleFiles}
                >
                  {isDeletingMultipleFiles ? 'Eliminazione...' : 'Elimina tutti'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visualizzatore 3D Modal */}
      {showModelViewer && previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 bg-gray-800">
              <h3 className="text-xl font-medium">Visualizzatore 3D</h3>
              <button 
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setShowModelViewer(false);
                  setPreviewFile(null);
                  setPreviewURL(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 relative">
              <ModelViewerPreventivo 
                file={previewFile} 
                fileType={previewFileType}
                uploadPrompt="Caricamento del modello..."
              />
            </div>
            {previewURL && (
              <div className="p-4 bg-gray-800 flex justify-end">
                <a
                  href={previewURL}
                  download
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Scarica File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 