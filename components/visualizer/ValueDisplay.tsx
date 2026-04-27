"use client";

import { ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    if (typeof val === "string") return "text-green-500";
    if (typeof val === "number") return "text-blue-500";
    if (typeof val === "boolean") return "text-purple-500";
    if (val === null || val === undefined) return "text-gray-500";
    return "text-foreground";
  };

  const renderValue = (val: any) => {
    if (val === null) return "null";
    if (val === undefined) return "undefined";
    if (typeof val === "string") return `"${val}"`;
    return String(val);
  };

  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center gap-1 py-1 hover:bg-accent/50 rounded px-1 transition-colors group cursor-pointer"
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        onClick={() => isObject && setIsExpanded(!isExpanded)}
      >
        {isObject ? (
          isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />
        ) : (
          <div className="w-3" />
        )}
        
        <span className="font-mono text-xs font-semibold text-primary/80">{name}:</span>
        
        {!isObject ? (
          <span className={`font-mono text-xs ${getTypeColor(value)}`}>
            {renderValue(value)}
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            {isArray ? `Array(${Object.keys(value).length})` : `Object`}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isObject && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {Object.entries(value).map(([key, val]) => (
              <ValueDisplay key={key} name={key} value={val} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
