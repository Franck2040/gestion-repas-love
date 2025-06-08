
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openRouterApiKey = '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';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    if (!openRouterApiKey) {
      return new Response(JSON.stringify({ 
        response: "L'IA n'est pas configurée. Veuillez configurer la clé API." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client to get user context
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user profile and some context
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: dishes } = await supabase
      .from('dishes')
      .select('name, description')
      .eq('author_id', userId)
      .limit(5);

    const { data: mealPlans } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .gte('planned_date', new Date().toISOString().split('T')[0])
      .limit(5);

    const { data: inventory } = await supabase
      .from('inventory')
      .select('quantity, ingredient:ingredients(name)')
      .eq('user_id', userId)
      .limit(10);

    const contextInfo = {
      userName: profile?.first_name || 'Utilisateur',
      userDishes: dishes?.length || 0,
      upcomingMeals: mealPlans?.length || 0,
      recentDishes: dishes?.map(d => d.name).join(', ') || 'Aucun plat enregistré',
      inventoryItems: inventory?.map(item => `${item.ingredient?.name}: ${item.quantity}`).join(', ') || 'Inventaire vide'
    };

    const systemPrompt = `Tu es un assistant culinaire IA spécialisé dans la gestion des repas et la planification alimentaire. Tu aides ${contextInfo.userName} avec son application de gestion des repas.

Contexte utilisateur:
- Nom: ${contextInfo.userName}
- Plats créés: ${contextInfo.userDishes}
- Repas planifiés: ${contextInfo.upcomingMeals}
- Plats récents: ${contextInfo.recentDishes}
- Inventaire: ${contextInfo.inventoryItems}

Tu peux aider avec:
1. Planification des repas et création de menus
2. Suggestions de recettes basées sur les ingrédients disponibles
3. Conseils nutritionnels et équilibrage alimentaire
4. Gestion des stocks et listes de courses
5. Aide à la cuisson et techniques culinaires
6. Conseils pour éviter le gaspillage alimentaire
7. Adaptation des recettes selon les allergies et restrictions alimentaires
8. Suggestions de plats selon le budget et les préférences
9. Aide à la planification des achats sur le marketplace
10. Conseils pour optimiser l'inventaire

Réponds toujours en français, sois amical, pratique et concis. Adapte tes réponses au contexte de l'utilisateur et propose des solutions concrètes.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Gestion des Plats App'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur API OpenRouter');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ 
      response: "Désolé, je rencontre des difficultés techniques. Pouvez-vous réessayer ?" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
