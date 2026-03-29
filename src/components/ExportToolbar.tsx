import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Download, Check } from 'lucide-react';

interface ExportToolbarProps {
  content: string;
  filename?: string;
  exportType?: 'html' | 'text';
}

export default function ExportToolbar({ content, filename = "nexus-export", exportType = "text" }: ExportToolbarProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Handle Export/Download File
  const handleExport = () => {
    // Determine MIME type and file extension based on exportType
    const isHtml = exportType === 'html';
    const mimeType = isHtml ? 'text/html' : 'text/plain';
    const extension = isHtml ? '.html' : '.txt';

    // Create a Blob from the content
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}${extension}`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md dark:bg-slate-900 dark:border-slate-800">
      
      {/* Copy Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none transition-colors"
      >
        {isCopied ? (
          <><Check className="w-4 h-4 text-emerald-500" /> Copied!</>
        ) : (
          <><Copy className="w-4 h-4" /> Copy Text</>
        )}
      </motion.button>

      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
      >
        <Download className="w-4 h-4" /> 
        Export {exportType === 'html' ? 'HTML' : 'TXT'}
      </motion.button>
      
    </div>
  );
}
