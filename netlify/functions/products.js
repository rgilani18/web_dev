const { createClient } = require('@supabase/supabase-js');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
};

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  return createClient(url, serviceRoleKey);
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    return response(500, { error: error.message });
  }

  try {
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,price,category,created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return response(200, { products: data });
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const name = body.name?.toString().trim();
      const category = body.category?.toString().trim();
      const price = Number(body.price);

      if (!name || !category || Number.isNaN(price) || price < 0) {
        return response(400, { error: 'Invalid product fields.' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ name, category, price }])
        .select('id,name,price,category,created_at')
        .single();

      if (error) throw error;
      return response(201, { product: data });
    }

    if (event.httpMethod === 'DELETE') {
      const productId = Number(event.queryStringParameters?.id);

      if (!productId || Number.isNaN(productId)) {
        return response(400, { error: 'Valid product id is required.' });
      }

      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;

      return response(200, { success: true });
    }

    return response(405, { error: 'Method not allowed.' });
  } catch (error) {
    return response(500, { error: error.message || 'Server error.' });
  }
};
