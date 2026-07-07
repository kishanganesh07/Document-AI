import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw, Monitor, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';








export function DocumentPreview({ html, isLoading, error, onRefresh, onDownload }) {
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
        onDownload={onDownload}
        isFullscreen={fullscreen} />
      

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-[var(--bg-app)] p-4">
        {isLoading ?
        <PreviewSkeleton /> :
        error ?
        <PreviewError message={error} onRetry={onRefresh} /> :
        !html ?
        <PreviewEmpty /> :

        <div className="flex justify-center items-start min-h-full py-8 px-4">
            <div
            className="origin-top transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            
              {/* A4 paper */}
              <div
              className="bg-white rounded-md transition-shadow"
              style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                padding: '20mm',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15), 0 0 10px rgba(0,0,0,0.05)'
              }}>
              
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











function PreviewToolbar({ zoom, onZoomIn, onZoomOut, onReset, onFullscreen, onRefresh, onDownload, isFullscreen }) {
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
        <div className="w-px h-4 bg-[var(--border)] mx-2" />
        <button
          onClick={onFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded shadow-sm transition-colors"
        >
          <Maximize2 size={12} />
          {isFullscreen ? 'Exit Full Screen' : 'See in Full Screen'}
        </button>
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-[var(--color-success)] hover:opacity-90 rounded shadow-sm transition-opacity ml-1"
          >
            <Download size={12} />
            Download PDF
          </button>
        )}
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
      <div className="bg-white rounded-sm mx-auto p-16 flex flex-col" style={{ width: '210mm', minHeight: '297mm', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        {/* Header: Logo and Title */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">D</span>
            </div>
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded mb-1 animate-pulse" />
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse ml-auto" />
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse ml-auto" />
          </div>
        </div>

        {/* Address Blocks */}
        <div className="flex justify-between mb-12">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-300 rounded mb-4" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-3 w-16 bg-gray-300 rounded mb-4 ml-auto" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse ml-auto" />
            <div className="h-3 w-40 bg-gray-100 rounded animate-pulse ml-auto" />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-gray-300 pb-2 mb-4">
          <div className="col-span-6 h-3 w-20 bg-gray-300 rounded" />
          <div className="col-span-2 h-3 w-12 bg-gray-300 rounded" />
          <div className="col-span-2 h-3 w-12 bg-gray-300 rounded" />
          <div className="col-span-2 h-3 w-16 bg-gray-300 rounded ml-auto" />
        </div>

        {/* Table Rows */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-12 gap-4 items-center border-b border-gray-100 pb-4">
              <div className="col-span-6 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="col-span-2 h-4 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-2 h-4 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-2 h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-1/3 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
            <div className="flex justify-between pt-1">
              <div className="h-4 w-20 bg-gray-300 rounded" />
              <div className="h-5 w-24 bg-gray-300 rounded" />
            </div>
          </div>
        </div>

        {/* Footer / Signature */}
        <div className="mt-auto pt-16 flex justify-between items-end border-t border-gray-200">
          <div className="space-y-2">
            <div className="h-3 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
          <div className="space-y-2 text-center">
            <div className="h-12 w-32 bg-gray-100 rounded mx-auto" />
            <div className="h-3 w-32 bg-gray-300 rounded mx-auto" />
          </div>
        </div>

      </div>
    </div>
  );
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