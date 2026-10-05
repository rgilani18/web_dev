const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const responseHeaders = {
  "Content-Type": "application/json",
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: responseHeaders,
  body: JSON.stringify(body),
});

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

exports.handler = async (event) => {
  try {
    const supabase = getSupabaseClient();

    if (event.httpMethod === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, data);
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      const { name, price, category } = body;

      if (!name || !category || typeof price !== "number" || Number.isNaN(price)) {
        return jsonResponse(400, { error: "name, price and category are required." });
      }

      const { data, error } = await supabase
        .from("products")
        .insert([{ name: name.trim(), price, category: category.trim() }])
        .select("id, name, price, category, created_at")
        .single();

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(201, data);
    }

    if (event.httpMethod === "DELETE") {
      const idFromQuery = event.queryStringParameters?.id;
      const idFromBody = event.body ? JSON.parse(event.body).id : undefined;
      const id = Number(idFromQuery ?? idFromBody);

      if (!Number.isInteger(id)) {
        return jsonResponse(400, { error: "A valid numeric product id is required." });
      }

      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { message: "Product deleted successfully." });
    }

    return jsonResponse(405, { error: "Method Not Allowed" });
  } catch (error) {
    return jsonResponse(500, { error: error.message || "Unexpected server error" });
  }
};
