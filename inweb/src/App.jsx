import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderLock, FolderOpen, UploadCloud, Loader2, KeyRound } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './About';
import './index.css';

function Home() {
  const [files, setFiles] = useState([]);
  const [passwordKey, setPasswordKey] = useState("1");
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState('ENCRYPT');
  const [decryptMode, setDecryptMode] = useState('FOLDER');
  const fileInputRef = useRef(null);

  const handleFolderSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);

    const formData = new FormData();
    formData.append('key', passwordKey);
    files.forEach(file => {
      // Pass the webkitRelativePath so the backend can reconstruct the folder structure inside the zip
      formData.append('files', file, file.webkitRelativePath || file.name);
    });

    try {
      const endpoint = mode === 'ENCRYPT' ? '/api/encrypt' : '/api/decrypt';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = mode === 'ENCRYPT' ? 'encrypted-vault.zip' : 'decrypted-vault.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to process files. Check console.");
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server.");
    } finally {
      setProcessing(false);
      setFiles([]);
    }
  };

  return (
    <div className="app-container">
      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="header" style={{ position: 'relative' }}>
          <motion.div
            animate={{ rotate: mode === 'ENCRYPT' ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {mode === 'ENCRYPT' ? <FolderLock className="icon main-icon" /> : <FolderOpen className="icon main-icon" />}
          </motion.div>
          <h1>Vault<span className="accent">X</span></h1>
          <p>High-Performance Folder Engine</p>
          <Link to="/about" style={{ position: 'absolute', top: '0', right: '0', textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            About
          </Link>
        </div>

        <div className="controls">
          <div className="toggle-group">
            <button 
              className={mode === 'ENCRYPT' ? 'active encrypt' : ''} 
              onClick={() => { setMode('ENCRYPT'); setFiles([]); }}
            >
              Encrypt
            </button>
            <button 
              className={mode === 'DECRYPT' ? 'active decrypt' : ''} 
              onClick={() => { setMode('DECRYPT'); setFiles([]); }}
            >
              Decrypt
            </button>
          </div>

          <AnimatePresence>
            {mode === 'DECRYPT' && (
              <motion.div 
                className="toggle-group sub-toggle"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: -8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <button 
                  className={decryptMode === 'FOLDER' ? 'active decrypt sub' : ''} 
                  onClick={() => { setDecryptMode('FOLDER'); setFiles([]); }}
                >
                  Extracted Folder
                </button>
                <button 
                  className={decryptMode === 'ZIP' ? 'active decrypt sub' : ''} 
                  onClick={() => { setDecryptMode('ZIP'); setFiles([]); }}
                >
                  .zip Archive
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="key-input-container">
            <KeyRound className="key-icon" />
            <input 
              type="number" 
              value={passwordKey}
              onChange={(e) => setPasswordKey(e.target.value)}
              placeholder="Numeric Key (e.g. 1)"
              className="key-input"
            />
          </div>
        </div>

        <motion.div 
          className="drop-zone"
          whileHover={{ scale: 1.02, borderColor: mode === 'ENCRYPT' ? "rgba(138, 43, 226, 0.8)" : "rgba(59, 130, 246, 0.8)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
        >
          <AnimatePresence mode="wait">
            {files.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="drop-content"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <UploadCloud className="upload-icon" />
                </motion.div>
                <h3>Click to select a {mode === 'ENCRYPT' || decryptMode === 'FOLDER' ? 'Folder' : '.zip File'}</h3>
                <p>Supports {mode === 'ENCRYPT' || decryptMode === 'FOLDER' ? 'deeply nested directories' : 'encrypted Vault archives'}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="filled"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="drop-content filled"
              >
                <FolderLock className="upload-icon success" />
                <h3>{files.length} files selected</h3>
                <p>Ready for {mode.toLowerCase()}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <input 
            type="file" 
            {...(mode === 'ENCRYPT' || decryptMode === 'FOLDER' ? { webkitdirectory: "true", directory: "true", multiple: true } : { accept: ".zip" })}
            ref={fileInputRef} 
            onChange={handleFolderSelect} 
            style={{ display: 'none' }}
          />
        </motion.div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.button 
              className={`process-btn ${mode.toLowerCase()}`}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 50, marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              onClick={handleProcess}
              disabled={processing}
            >
              {processing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                  <Loader2 />
                </motion.div>
              ) : (
                <>
                  {mode === 'ENCRYPT' ? <FolderLock /> : <FolderOpen />}
                  <span>{mode === 'ENCRYPT' ? 'Vault It!' : 'Unlock It!'}</span>
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background Animated Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
