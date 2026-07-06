import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';








export function DocumentPreview({ html, isLoading, error, onRefresh }) {
  const [zoom, setZoom] = useState(85);
  const [fullscreen, setFullscreen] = useState(false);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 40));
  const resetZoom = () => setZoom(85);

  return (
    <div className={cn(
      'flex flex-col h-full',
      fullscreen && 'fixed inset-0 z-40 bg-[var(--bg-app)]'
    )}>
      {/* Toolbar */}
      <PreviewToolbar
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        onFullscreen={() => setFullscreen((f) => !f)}
        onRefresh={onRefresh}
        isFullscreen={fullscreen} />
      

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-[var(--bg-app)] p-4">
        {isLoading ?
        <PreviewSkeleton /> :
        error ?
        <PreviewError message={error} onRetry={onRefresh} /> :
        !html ?
        <PreviewEmpty /> :

        <div className="flex justify-center items-start min-h-full">
            <div
            className="origin-top transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            
              {/* A4 paper */}
              <div
              className="bg-white shadow-doc rounded-sm"
              style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
              
                <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="w-full h-full" />
              
              </div>
            </div>
          </div>
        }
      </div>
    </div>);

}











function PreviewToolbar({ zoom, onZoomIn, onZoomOut, onReset, onFullscreen, onRefresh, isFullscreen }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-surface)] shrink-0">
      <div className="flex items-center gap-1">
        <Monitor size={13} className="text-[var(--text-muted)]" />
        <span className="text-xs font-medium text-[var(--text-secondary)]">Live Preview</span>
      </div>

      <div className="flex items-center gap-1">
        {onRefresh &&
        <ToolbarBtn onClick={onRefresh} title="Refresh preview">
            <RefreshCw size={13} />
          </ToolbarBtn>
        }
        <ToolbarBtn onClick={onZoomOut} title="Zoom out">
          <ZoomOut size={13} />
        </ToolbarBtn>
        <button
          onClick={onReset}
          className="px-2 py-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors font-medium tabular-nums">
          
          {zoom}%
        </button>
        <ToolbarBtn onClick={onZoomIn} title="Zoom in">
          <ZoomIn size={13} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <ToolbarBtn onClick={onFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          <Maximize2 size={13} />
        </ToolbarBtn>
      </div>
    </div>);

}

function ToolbarBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
      
      {children}
    </button>);

}

function PreviewSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-doc rounded-sm mx-auto p-16 space-y-6" style={{ width: '210mm', minHeight: '297mm' }}>
        <div className="flex justify-between items-start">
          <Skeleton className="h-8 w-32 bg-gray-100" />
          <Skeleton className="h-6 w-40 bg-gray-100" />
        </div>
        <div className="space-y-2 mt-8">
          <Skeleton className="h-4 w-48 bg-gray-100" />
          <Skeleton className="h-3 w-32 bg-gray-100" />
        </div>
        <div className="space-y-2 mt-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full bg-gray-100" />)}
        </div>
        <div className="flex justify-end mt-8">
          <Skeleton className="h-16 w-48 bg-gray-100" />
        </div>
      </div>
    </div>);

}

function PreviewEmpty() {
  return (
    <div className="flex items-center justify-center h-full min-h-64">
      <div className="text-center">
        <div className="w-16 h-20 border-2 border-dashed border-[var(--border)] rounded mx-auto mb-3 flex items-center justify-center">
          <Monitor size={20} className="text-[var(--text-xmuted)]" />
        </div>
        <p className="text-sm text-[var(--text-muted)]">Preview will appear here</p>
        <p className="text-xs text-[var(--text-xmuted)] mt-1">Start filling in document details</p>
      </div>
    </div>);

}

function PreviewError({ message, onRetry }) {
  return (
    <div className="flex items-center justify-center h-full min-h-64">
      <div className="text-center">
        <p className="text-sm text-[var(--color-error)] mb-1">Preview couldn't be generated</p>
        <p className="text-xs text-[var(--text-muted)] mb-3">{message}</p>
        {onRetry &&
        <button onClick={onRetry} className="text-xs text-[var(--color-primary)] hover:underline">
            Retry
          </button>
        }
      </div>
    </div>);

}