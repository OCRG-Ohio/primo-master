/** @type {import('@sveltejs/kit').ServerLoad} */
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { supabase, getSession } }) => {

  const {data:symbol} = await supabase.from('symbols').select('index').limit(1) 

  // Check for database misconfigurations
  if (url.pathname !== '/update-notice' && url.pathname !== '/auth') {

    // Ensure symbols have an index column (v2.0.0--beta.15)
    if (!symbol) {
      redirect(303, '/update-notice?alert=missing-symbol-index');
    }
    
  } else if (url.pathname === '/update-notice') {
    if (
      symbol && url.searchParams.get('alert') === 'missing-symbol-index' 
    ) {
      redirect(303, '/');
    }
  }

  return {
    session: await getSession(),
  }
}