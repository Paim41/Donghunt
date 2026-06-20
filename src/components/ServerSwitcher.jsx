import { motion } from 'framer-motion';

// Switches the active streaming server without a page reload.
export default function ServerSwitcher({ servers = [], active = 0, onChange }) {
  if (!servers.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {servers.map((s, i) => (
        <motion.button
          key={`${s.name}-${i}`}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(i)}
          className={`rounded-lg px-3 py-1.5 text-sm transition ${
            i === active
              ? 'bg-primary text-white shadow-glow'
              : 'glass text-gray-200 hover:bg-white/10'
          }`}
        >
          {s.name}
        </motion.button>
      ))}
    </div>
  );
}
