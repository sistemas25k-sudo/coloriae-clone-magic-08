import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerData, total } = await req.json();

    // Preparar dados para API de pagamento
    const valorCents = Math.round(total * 100);
    const cpf = customerData.cpf.replace(/\D/g, '');
    const customerName = customerData.nome || 'Usuário Desconhecido';
    const telefone = customerData.celular || '21965152545';
    const email = customerData.email || `${cpf}@gmail.com`;

    const chavePublica = Deno.env.get("NOVA_ERA_PUBLIC_KEY");
    const chaveSecreta = Deno.env.get("NOVA_ERA_SECRET_KEY");
    
    if (!chavePublica || !chaveSecreta) {
      throw new Error("Chaves de API não configuradas");
    }

    const auth = btoa(`${chavePublica}:${chaveSecreta}`);

    const paymentData = {
      amount: valorCents,
      paymentMethod: "pix",
      customer: {
        name: customerName,
        email: email,
        document: {
          number: cpf,
          type: "cpf"
        },
        phone: telefone,
        externalRef: `ref-${cpf}`
      },
      pix: {
        expiresInDays: 1
      },
      items: [
        {
          title: "COLORIAÊ - Livro Infantil",
          unitPrice: valorCents,
          quantity: 1,
          tangible: false
        }
      ]
    };

    // Chamar API de pagamento
    const paymentResponse = await fetch('https://api.novaera-pagamentos.com/api/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!paymentResponse.ok) {
      throw new Error(`Erro na API: ${paymentResponse.status}`);
    }

    const apiResponse = await paymentResponse.json();

    return new Response(JSON.stringify(apiResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});