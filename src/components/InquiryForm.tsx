/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function InquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formData = new FormData(e.currentTarget);

      const response = await fetch('https://formspree.io/f/xpqgakrv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Formspree error response received:', errorData);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Formspree connection or execution exception:', err);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <div id="procapture-studio-inquiry-section" className="border border-white/10 bg-gradient-to-b from-[#0a0a0a] to-[#040404] p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
      <div className="flex items-start gap-4 justify-between flex-col md:flex-row pb-4 border-b border-white/5">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-500 font-bold flex items-center gap-1.5">
            <HelpCircle size={10} className="text-yellow-500" /> Direct Studio Consultation
          </span>
          <h3 className="text-lg md:text-xl font-bold font-sans text-white uppercase tracking-tight">
            Consult a Lighting Expert
          </h3>
          <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">
            Need custom package specifications or have unique courier/freight inquiries in Nigeria? Share your requirements and receive answers directly in your email.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} action="https://formspree.io/f/xpqgakrv" method="POST" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold font-mono uppercase text-white/40 tracking-wider">
            Full Name <span className="text-yellow-500">*</span>
          </label>
          <input
            type="text"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-2.5 text-xs bg-black border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 font-sans"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold font-mono uppercase text-white/40 tracking-wider">
            Email Address <span className="text-yellow-500">*</span>
          </label>
          <input
            type="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. johndoe@example.com"
            className="w-full px-4 py-2.5 text-xs bg-black border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 font-sans"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[10px] font-semibold font-mono uppercase text-white/40 tracking-wider">
            WhatsApp or Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +234 816 420 xxxx"
            className="w-full px-4 py-2.5 text-xs bg-black border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 font-mono"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-[10px] font-semibold font-mono uppercase text-white/40 tracking-wider">
            Inquiry or Specifications Message <span className="text-yellow-500">*</span>
          </label>
          <textarea
            required
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your studio setup needs (e.g. 'I need a quotation for 5 LED Panels including heavy duty stands and softboxes...')"
            className="w-full px-4 py-2.5 text-xs bg-black border border-white/10 rounded-xl text-white outline-none focus:border-yellow-500 font-sans resize-none leading-relaxed"
          />
        </div>

        {/* Form Messages */}
        <div className="md:col-span-2">
          {submitStatus === 'success' && (
            <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-emerald-400 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
              <span>
                <strong>Submission Received!</strong> Thank you, your lighting inquiry is being dispatched. Our team will read it and reply back to you very soon.
              </span>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="p-3.5 border border-rose-500/20 bg-rose-500/5 rounded-xl text-rose-400 text-xs font-sans flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-500" />
              <span>
                <strong>Dispatch Failed.</strong> There was a problem transmitting your inquiry template. Please check your network and try again.
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 disabled:bg-neutral-800 disabled:text-white/30 tracking-wider uppercase font-mono flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.15)]"
          >
            <Send size={12} />
            <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
