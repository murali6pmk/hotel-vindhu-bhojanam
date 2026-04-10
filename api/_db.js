import { createClient } from '@supabase/supabase-js';

let supabase = null;

export function getSupabase() {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY not set');
  supabase = createClient(url, key);
  return supabase;
}

export async function seedDefaults() {
  const db = getSupabase();

  // Seed credentials if empty
  const { count: credCount } = await db.from('credentials').select('*', { count: 'exact', head: true });
  if (credCount === 0) {
    await db.from('credentials').insert({
      username: 'admin', password: 'vindhu@2025',
      owner_name: 'Hotel Vindhu Bhojanam', email: 'vindhu@gmail.com'
    });
  }

  // Seed menu items if empty
  const { count: menuCount } = await db.from('menu_items').select('*', { count: 'exact', head: true });
  if (menuCount === 0) {
    await db.from('menu_items').insert([
      { id:'m1', name:'Vindhu Bhojanam Thali', telugu:'విందు భోజనం థాలీ', price:120, description:'Full traditional Andhra meal with rice, sambar, rasam, curries, pickle & papad', img:'/images/food1.jpg', popular:true, category:'meals', available:true },
      { id:'m2', name:'Mini Meals', telugu:'మినీ మీల్స్', price:70, description:'Rice with 2 curries, sambar, rasam and curd', img:'/images/food4.jpg', popular:false, category:'meals', available:true },
      { id:'m3', name:'Special Biryani Thali', telugu:'బిర్యానీ థాలీ', price:150, description:'Fragrant biryani with raita, gravy and dessert', img:'/images/food4.jpg', popular:true, category:'meals', available:true },
      { id:'m4', name:'Curd Rice', telugu:'పెరుగు అన్నం', price:40, description:'Cooling curd rice with pickle and papad', img:'/images/food1.jpg', popular:false, category:'meals', available:true },
      { id:'t1', name:'Idli Sambar', telugu:'ఇడ్లీ సాంబార్', price:40, description:'Soft steamed idlis with hot sambar and chutneys', img:'/images/food5.jpg', popular:true, category:'tiffin', available:true },
      { id:'t2', name:'Vada Sambar', telugu:'వడ సాంబార్', price:35, description:'Crispy medu vada with sambar and coconut chutney', img:'/images/food5.jpg', popular:false, category:'tiffin', available:true },
      { id:'t3', name:'Upma', telugu:'ఉప్మా', price:25, description:'Classic semolina upma with vegetables and cashews', img:'/images/food1.jpg', popular:false, category:'tiffin', available:true },
      { id:'t4', name:'Pesarattu', telugu:'పెసరట్టు', price:45, description:'Green moong dal dosa with ginger chutney', img:'/images/food2.jpg', popular:true, category:'tiffin', available:true },
      { id:'d1', name:'Paneer Dosa', telugu:'పన్నీర్ దోస', price:80, description:'Crispy dosa stuffed with spiced paneer filling', img:'/images/food3.jpg', popular:true, category:'dosa', available:true },
      { id:'d2', name:'Masala Dosa', telugu:'మసాలా దోస', price:60, description:'Golden crispy dosa with spiced potato masala', img:'/images/food2.jpg', popular:true, category:'dosa', available:true },
      { id:'d3', name:'Plain Dosa', telugu:'సాదా దోస', price:35, description:'Classic thin crispy dosa with sambar and chutney', img:'/images/food2.jpg', popular:false, category:'dosa', available:true },
      { id:'d4', name:'Rava Dosa', telugu:'రవ్వ దోస', price:55, description:'Lacy semolina dosa with onion and green chilli', img:'/images/food3.jpg', popular:false, category:'dosa', available:true },
      { id:'b1', name:'Filter Coffee', telugu:'ఫిల్టర్ కాఫీ', price:20, description:'Traditional South Indian filter coffee in brass tumbler', img:'/images/food6.jpg', popular:true, category:'beverages', available:true },
      { id:'b2', name:'Masala Chai', telugu:'మసాలా చాయ్', price:15, description:'Spiced ginger tea with cardamom and tulsi', img:'/images/food6.jpg', popular:false, category:'beverages', available:true },
      { id:'b3', name:'Buttermilk', telugu:'మజ్జిగ', price:20, description:'Chilled spiced buttermilk with curry leaves', img:'/images/food1.jpg', popular:false, category:'beverages', available:true },
      { id:'b4', name:'Fresh Lime Soda', telugu:'నిమ్మకాయ సోడా', price:30, description:'Sweet or salted fresh lime with soda', img:'/images/food6.jpg', popular:false, category:'beverages', available:true },
    ]);
  }

  // Seed settings if empty
  const { count: settingsCount } = await db.from('settings').select('*', { count: 'exact', head: true }).catch(() => ({ count: 0 }));
  if (!settingsCount || settingsCount === 0) {
    await db.from('settings').insert({ upi_id: '', upi_name: 'Hotel Vindhu Bhojanam', upi_note: 'Pay for your food order' }).catch(() => {});
  }
}

export function toMenuItem(r) {
  return { id:r.id, name:r.name, telugu:r.telugu, price:Number(r.price), desc:r.description, img:r.img, popular:Boolean(r.popular), category:r.category, available:Boolean(r.available) };
}

export function toOrder(r) {
  return {
    id:r.id, customerName:r.customer_name, customerPhone:r.customer_phone,
    tableNo:r.table_no, items:r.items||[], total:Number(r.total),
    status:r.status, paymentStatus:r.payment_status, paymentMethod:r.payment_method,
    notes:r.notes, createdAt:r.created_at, updatedAt:r.updated_at,
  };
}
