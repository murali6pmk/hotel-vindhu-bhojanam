
import { ShoppingCart, X, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import { type MenuItem } from '../lib/api';

export type CartItem = {
  item: MenuItem;
  qty: number;
};

interface Props {
  cart: CartItem[];
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onClose: () => void;
}

export default function OrderCart({ cart, onUpdateQty, onRemove, onCheckout, onClose }: Props) {
  const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        className="w-full max-w-md h-full flex flex-col"
        style={{ background: 'linear-gradient(180deg, #1a0f06, #0d0804)', borderLeft: '1px solid rgba(212,160,23,0.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
              <ShoppingCart size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-playfair text-gold font-bold text-lg">Your Order</h2>
              <p className="text-cream/50 text-xs">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
            </div>
          </div>
          <button onClick={onClose} className="text-cream/50 hover:text-cream transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-cream/50">Your cart is empty</p>
              <p className="text-cream/30 text-sm mt-1">Add items from the menu</p>
            </div>
          ) : (
            cart.map(({ item, qty }) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-white/10"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <img src={item.img} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-medium text-sm truncate">{item.name}</p>
                  <p className="text-gold text-sm font-bold">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onUpdateQty(item.id, qty - 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(232,102,10,0.2)', border: '1px solid rgba(232,102,10,0.4)' }}>
                    <Minus size={12} className="text-saffron" />
                  </button>
                  <span className="text-cream font-bold w-5 text-center">{qty}</span>
                  <button onClick={() => onUpdateQty(item.id, qty + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: 'rgba(232,102,10,0.2)', border: '1px solid rgba(232,102,10,0.4)' }}>
                    <Plus size={12} className="text-saffron" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-gold font-bold text-sm">₹{item.price * qty}</p>
                  <button onClick={() => onRemove(item.id)} className="text-red-400/50 hover:text-red-400 mt-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t space-y-4" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
            <div className="flex justify-between items-center">
              <span className="text-cream/70">Subtotal</span>
              <span className="text-gold font-bold text-xl">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="px-3 py-2 rounded-xl text-xs text-cream/50 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              🍃 Fresh & made to order · Dine-in & Takeaway
            </div>
            <button onClick={onCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.4)' }}>
              Proceed to Pay ₹{total.toLocaleString('en-IN')}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
