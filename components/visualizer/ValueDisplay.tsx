"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Braces, List } from "lucide-react";
import { useState } from "react";

interface ValueDisplayProps {
  name: string;
  value: any;
  depth?: number;
}

export function ValueDisplay({ name, value, depth = 0 }: ValueDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);

  const getTypeColor = (val: any) => {
    if (val === null) return "text-red-400";
    if (typeof val === "number") return "text-amber-400";
    if (typeof val === "string") return "text-emerald-400";
    if (typeof val === "boolean") return "text-blue-400";
    return "text-purple-400";
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
      style={{ marginLeft: depth > 0 ? "1.5rem" : "0" }}
    >
      <div className="flex items-start gap-2 py-1.5 px-2 rounded-md hover:bg-primary/5 transition-colors group">
        {isObject && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-0.5 p-0.5 hover:bg-primary/10 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        )}
        
        {!isObject && <div className="w-4" />}

        <div className="flex flex-wrap items-center gap-x-2 font-mono text-sm">
          <span className="text-foreground/70 font-semibold">{name}:</span>
          
          {isObject ? (
            <span className="flex items-center gap-1.5 text-muted-foreground italic text-[11px]">
              {isArray ? <List className="h-3 w-3" /> : <Braces className="h-3 w-3" />}
              {isArray ? `Array(${Object.keys(value).length})` : "Object"}
            </span>
          ) : (
            <motion.span 
              key={JSON.stringify(value)}
              initial={{ scale: 1.2, color: "#fff" }}
              animate={{ scale: 1, color: "inherit" }}
              transition={{ duration: 0.3 }}
              className={`${getTypeColor(value)} font-bold`}
            >
              {typeof value === "string" ? `"${value}"` : String(value)}
            </motion.span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isObject && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-primary/10 ml-3 pl-1"
          >
            {Object.entries(value).map(([key, val]) => (
              <ValueDisplay key={key} name={key} value={val} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
