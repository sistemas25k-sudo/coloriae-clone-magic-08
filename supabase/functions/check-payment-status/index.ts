import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();

    const chavePublica = Deno.env.get("NOVA_ERA_PUBLIC_KEY");
    const chaveSecreta = Deno.env.get("NOVA_ERA_SECRET_KEY");
    
    if (!chavePublica || !chaveSecreta) {
      throw new Error("Chaves de API não configuradas");
    }

    const auth = btoa(`${chavePublica}:${chaveSecreta}`);

    const response = await fetch(`https://api.novaera-pagamentos.com/api/v1/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      status: data.data?.status || 'pending'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      status: 'pending',
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});