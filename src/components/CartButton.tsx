import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartButton() {
  const { totalItems, totalPrice, setIsOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold shadow-2xl transition-all hover:scale-105"
      style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 30px rgba(232,102,10,0.5)' }}
    >
      <div className="relative">
        <ShoppingBag size={22} />
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-saffron text-xs font-bold flex items-center justify-center">
          {totalItems}
        </span>
      </div>
      <div className="text-left">
        <div className="text-xs opacity-80">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
        <div className="text-sm">₹{totalPrice}</div>
      </div>
    </button>
  );
}
