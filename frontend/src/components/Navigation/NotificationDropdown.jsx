import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useNotificationStore } from '@/stores/notification.store';

export function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { notifications, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotificationStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-[var(--color-success)]" />;
      case 'warning':
        return <ShieldAlert size={16} className="text-[var(--color-warning)]" />;
      case 'error':
        return <AlertCircle size={16} className="text-[var(--color-error)]" />;
      default:
        return <Info size={16} className="text-[var(--color-primary)]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 12px)',
            width: 340,
            maxHeight: 480,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface-el)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={15} className="text-[var(--text-muted)]" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
            </div>
            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-primary)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  <Check size={12} /> Mark read
                </button>
                <button
                  onClick={clearAll}
                  style={{
                    background: 'none', border: 'none', color: 'var(--color-error)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  <Trash2 size={11} /> Clear
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: 13 }}>
                <Bell size={24} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <p>All caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: n.read ? 'transparent' : 'var(--bg-hover)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    position: 'relative',
                  }}
                >
                  {/* Read/Unread dot indicator */}
                  {!n.read && (
                    <div style={{
                      position: 'absolute', left: 6, top: 16, width: 6, height: 6,
                      borderRadius: '50%', background: 'var(--color-primary)'
                    }} />
                  )}

                  <div style={{ flexShrink: 0, paddingTop: 2 }}>{getIcon(n.type)}</div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <p style={{ fontSize: 13, fontWeight: n.read ? 600 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {n.title}
                      </p>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8 }}>
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                      {n.message}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                    style={{
                      background: 'none', border: 'none', color: 'var(--text-xmuted)',
                      cursor: 'pointer', opacity: 0.6, alignSelf: 'center', padding: 4
                    }}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
