import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, updateQty, removeFromCart, totalItems, totalPrice, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/70" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
        style={{ background: 'linear-gradient(180deg, #1a0f06 0%, #0d0804 100%)', borderLeft: '1px solid rgba(212,160,23,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} className="text-saffron" />
            <h2 className="font-playfair text-gold text-xl font-bold">Your Cart</h2>
            {totalItems > 0 && (
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#e8660a' }}>{totalItems}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-cream/60 hover:text-cream transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-cream/40">
              <ShoppingBag size={48} />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm">Add items from the menu</p>
              <button onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                Browse Menu
              </button>
            </div>
          ) : (
            cart.map(({ item, qty }) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl border border-white/10"
                style={{ background: 'rgba(44,26,14,0.6)' }}>
                <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-saffron/70 text-xs">{item.telugu}</p>
                  <p className="text-gold font-bold mt-1">₹{item.price} × {qty} = <span className="text-saffron">₹{item.price * qty}</span></p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, qty - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                      style={{ background: 'rgba(232,102,10,0.3)', border: '1px solid rgba(232,102,10,0.5)' }}>
                      <Minus size={12} />
                    </button>
                    <span className="text-cream font-bold w-5 text-center">{qty}</span>
                    <button onClick={() => updateQty(item.id, qty + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                      style={{ background: 'rgba(232,102,10,0.3)', border: '1px solid rgba(232,102,10,0.5)' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
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
              <span className="text-cream/70">Subtotal ({totalItems} items)</span>
              <span className="text-gold font-bold text-xl">₹{totalPrice}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate('/checkout'); }}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.4)' }}
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
