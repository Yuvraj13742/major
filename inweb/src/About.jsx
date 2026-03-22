import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, ArrowLeft, Terminal, Server, FolderLock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './index.css';

function About() {
  return (
    <div className="app-container">
      <motion.div 
        className="glass-panel about-panel"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ padding: '2rem', maxWidth: '800px', width: '90%', margin: '0 auto', textAlign: 'left', overflowY: 'auto', maxHeight: '85vh' }}
      >
        <div className="header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Info className="icon main-icon" style={{ width: '40px', height: '40px' }} />
            <h1 style={{ margin: 0, fontSize: '2rem' }}>About Vault<span className="accent">X</span></h1>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <ArrowLeft size={18} />
            Back to App
          </Link>
        </div>

        <div className="about-content" style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          <motion.section 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={24} className="accent" />
              What is VaultX?
            </h2>
            <p>
              VaultX is a high-performance Hybrid Web Application designed for secure file encryption and decryption. 
              It provides a user-friendly web interface while leveraging a powerful, multithreaded native Java engine 
              to process your files securely and efficiently at the block level.
            </p>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            style={{ marginBottom: '2rem' }}
          >
            <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderLock size={24} className="accent" />
              How to Use
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>1. Upload:</strong> Select a deeply nested folder (for encryption) or a .zip archive (for decryption).</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>2. Set a Key:</strong> Enter a numeric passcode. (Remember this key—you'll need the exact same key to decrypt!).</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>3. Process:</strong> Click the Vault It / Unlock It button.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>4. Download:</strong> The server will return a secure .zip archive containing your processed files.</li>
            </ul>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
          >
            <h2 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={24} className="accent" />
              How It Works (Under the Hood)
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              This project is an excellent demonstration of core Operating System concepts combined with modern web stacks:
            </p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginTop: 0 }}>⚙️ Multithreading & Concurrency</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                The Java backend uses a Thread Pool synchronized with your CPU cores, driven by a Producer-Consumer 
                task queue to maximize processing speed without thrashing the CPU.
              </p>

              <h4 style={{ color: 'var(--text-primary)' }}>🚀 Process Management</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                The lightweight Node.js API acts as an orchestrator, spawning isolated Java child processes 
                (via <code>fork/exec</code> paradigms) to delegate heavy lifting. Node communicates with Java via 
                IPC streams and Exit Codes.
              </p>

              <h4 style={{ color: 'var(--text-primary)' }}>💾 Direct Memory I/O</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>
                Files are never loaded fully into RAM (preventing Out-Of-Memory crashes). Instead, Java uses 
                <code>RandomAccessFile</code> pointers to read and modify disk bytes <strong>in-place</strong>, 
                while Node asynchronously pipes the zipped result straight down the network socket.
              </p>
            </div>
          </motion.section>
        </div>
      </motion.div>

      {/* Background Animated Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
}

export default About;
