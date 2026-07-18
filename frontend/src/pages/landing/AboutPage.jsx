import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, Brain, Zap, CheckCircle2, ChevronRight, 
  ArrowLeft, Users, Trophy, Sparkles 
} from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';

export function AboutPage() {
  const { theme } = useUIStore();

  const team = [
    { name: 'Kishan Ganesh', role: 'Founder & Lead AI Engineer', desc: 'Ex-Google, building the next generation of document automation.' },
    { name: 'Deepu S', role: 'Lead Architect', desc: 'Crafting highly scaleable, secure enterprise software patterns.' }
  ];

  return (
    <div className="lp-root" style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Floating dynamic glow background (Landing design language) */}
      <div className="lp-particle-bg" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div className="lp-orb lp-orb-1" style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-subtle) 0%, transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(90px)' }} />
        <div className="lp-orb lp-orb-2" style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, var(--color-info-bg) 0%, transparent 70%)', bottom: '10%', left: '-100px', filter: 'blur(90px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: '120px 24px 80px' }}>
        
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <header style={{ marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Our Mission
            </span>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 12, marginBottom: 24 }}>
              Redefining Document Intelligence with <em>Generative AI</em>.
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 700 }}>
              DocuFlow was founded to bridge the gap between unstructured text and structured execution. We build tools that help teams design, generate, and verify critical documents seamlessly.
            </p>
          </motion.div>
        </header>

        {/* Bento Core Values Grid */}
        <section style={{ marginBottom: 100 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em' }}>
            Core Pillars
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: 32, borderRadius: 20, backdropFilter: 'blur(12px)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContainer: 'center', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} style={{ color: 'var(--color-primary)' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Semantic Accuracy</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Harnessing large language models to accurately extract structured details, validation rules, and schema mappings from natural language.
              </p>
            </div>

            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: 32, borderRadius: 20, backdropFilter: 'blur(12px)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Shield size={20} style={{ color: 'var(--color-info)' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Absolute Trust</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Every single document generated on DocuFlow comes with verifiable cryptographic QR checksums to prevent tampering and ensure authority.
              </p>
            </div>

            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: 32, borderRadius: 20, backdropFilter: 'blur(12px)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Zap size={20} style={{ color: 'var(--color-warning)' }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Frictionless Speed</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Cut out back-and-forth drafts. Build complete templates, auto-fill client data, and export compliant files in seconds.
              </p>
            </div>

          </div>
        </section>

        {/* Team Section */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 32, letterSpacing: '-0.02em' }}>
            The Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {team.map((member) => (
              <div key={member.name} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: 32, borderRadius: 24, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={20} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{member.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: 12 }}>
                    {member.role}
                  </span>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 40, textAlign: 'center', color: 'var(--text-xmuted)', fontSize: 12 }}>
          © {new Date().getFullYear()} DocuFlow. Built for high-velocity teams.
        </footer>

      </div>
    </div>
  );
}
