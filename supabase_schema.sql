-- 1. Tabela profiles (Configurações e Perfil do Usuário)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'Light',
    accent_color TEXT DEFAULT '#3b82f6',
    border_radius INTEGER DEFAULT 24,
    font_family TEXT DEFAULT 'Inter',
    layout TEXT DEFAULT 'espaçado',
    show_goals BOOLEAN DEFAULT TRUE,
    motivational_phrase TEXT DEFAULT 'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
    priority_one TEXT DEFAULT 'Fechar contrato estratégico FTD Educação',
    
    -- Campos Pessoais
    health_exercises TEXT DEFAULT '30 min de caminhada',
    health_hydration NUMERIC DEFAULT 2,
    health_sleep NUMERIC DEFAULT 7,
    diary TEXT DEFAULT 'Hoje o dia começou bem...',
    bbq_shopping_list TEXT[] DEFAULT ARRAY['Picanha', 'Carvão', 'Cerveja'],
    bbq_recipes TEXT DEFAULT 'Sal grosso e alho',
    bbq_schedule TEXT DEFAULT 'Sábado às 13:00 com os amigos',
    football_last_game_result TEXT DEFAULT 'Flamengo 2 x 0 Fluminense',
    football_last_game_performance TEXT DEFAULT 'Domínio total, Arrascaeta deu aula.',
    football_next_game_date TEXT DEFAULT '2026-04-05',
    football_next_game_opponent TEXT DEFAULT 'Vasco',
    football_comments TEXT DEFAULT 'O time está encaixando bem com o novo esquema.',
    investments_daily_contributions NUMERIC DEFAULT 0,
    investments_stocks NUMERIC DEFAULT 40,
    investments_funds NUMERIC DEFAULT 30,
    investments_fixed_income NUMERIC DEFAULT 30,
    investments_monthly_goal NUMERIC DEFAULT 2000,
    investments_insight TEXT DEFAULT 'A constância é o segredo dos juros compostos.',
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS e criar políticas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Tabela tasks (Tarefas)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'professional',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own tasks" ON public.tasks 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Tabela financial_transactions (Receitas e Despesas)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'expense' ou 'revenue'
    date TEXT NOT NULL,
    value NUMERIC NOT NULL,
    category TEXT NOT NULL, -- ou descrição
    observation TEXT DEFAULT '',
    status TEXT DEFAULT 'recebido', -- 'pendente' ou 'recebido' (usado para receitas)
    lembrete TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own transactions" ON public.financial_transactions 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Tabela payment_reminders (Lembretes de Pagamento)
CREATE TABLE IF NOT EXISTS public.payment_reminders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT DEFAULT 'pendente', -- 'pago' ou 'pendente'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own reminders" ON public.payment_reminders 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Tabela work_visits (Visitas e Planejamento)
CREATE TABLE IF NOT EXISTS public.work_visits (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date TEXT NOT NULL,
    city TEXT NOT NULL,
    secretariat TEXT NOT NULL,
    contact_name TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    result TEXT DEFAULT '',
    observations TEXT DEFAULT '',
    next_steps TEXT DEFAULT '',
    lat NUMERIC,
    lng NUMERIC,
    priority TEXT DEFAULT 'media', -- 'baixa', 'media', 'alta' (usado em futurePlanning)
    is_future_planning BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.work_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own visits" ON public.work_visits 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Tabela route_history (Histórico de Rotas)
CREATE TABLE IF NOT EXISTS public.route_history (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    destinations JSONB NOT NULL, -- Array contendo os destinos
    google_maps_url TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.route_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own routes" ON public.route_history 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. Tabela receipts (Comprovantes / Prestação de Contas)
CREATE TABLE IF NOT EXISTS public.receipts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL, -- String contendo a imagem Base64
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can perform all actions on own receipts" ON public.receipts 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
