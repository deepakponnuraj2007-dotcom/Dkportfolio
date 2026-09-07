import React, { useState } from 'react';
import { X, Mail, Copy, Check, Send, Github, Linkedin, Instagram } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface SayHiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SayHiModal: React.FC<SayHiModalProps> = ({ isOpen, onClose }) => {
  const { personalInfo } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] text-black border-2 border-black rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
            Let&apos;s Connect
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black mt-1">
            Say hi to {personalInfo.name}.
          </h2>
          <p className="text-sm text-neutral-600 mt-1.5 font-sans leading-relaxed">
            Interested in collaboration, internship opportunities, or discussing computer science & engineering? Drop a note below!
          </p>
        </div>

        {/* Direct Email Card */}
        <div className="flex items-center justify-between p-3.5 bg-black/5 rounded-xl border border-black/15 mb-6">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-black text-white rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs text-neutral-500 font-mono">DIRECT INBOX</p>
              <p className="text-sm font-semibold font-mono text-black truncate">
                {personalInfo.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-all active:scale-95 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Message Form */}
        {submitted ? (
          <div className="py-8 text-center bg-black/5 rounded-xl border border-black/10">
            <div className="w-12 h-12 mx-auto mb-3 bg-black text-white rounded-full flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-black">Message Received!</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Thank you for reaching out. Deepak will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">YOUR NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 text-sm bg-white border border-black/20 rounded-lg focus:outline-hidden focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-600 mb-1">YOUR EMAIL</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-black/20 rounded-lg focus:outline-hidden focus:border-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-600 mb-1">MESSAGE</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${personalInfo.name}, let's discuss a software engineering opportunity...`}
                className="w-full px-3 py-2 text-sm bg-white border border-black/20 rounded-lg focus:outline-hidden focus:border-black transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-neutral-700">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-black/10 transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-black/10 transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.instagram || 'https://instagram.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-md hover:bg-black/10 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
