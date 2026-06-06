/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  LineChart as ReLineChart, Line,
  PieChart as RePieChart, Pie, Cell,
  AreaChart, Area,
  RadialBarChart, RadialBar
} from 'recharts';
import { 
  CheckCircle2, 
  Circle, 
  Briefcase, 
  Wallet, 
  User, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Coffee,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  LayoutDashboard,
  CheckSquare,
  Menu,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  AlertCircle,
  Clock,
  DollarSign,
  Utensils,
  Trophy,
  LineChart,
  Droplets,
  Moon,
  Smartphone,
  Camera,
  PenLine,
  Flame,
  Target,
  Settings,
  Shield,
  Info,
  Link,
  Zap,
  Crown,
  Palette,
  Type,
  Maximize,
  Bell,
  Database,
  History,
  Download,
  Upload,
  RefreshCw,
  Bot,
  Lock,
  LogOut,
  Globe,
  MessageSquare,
  Map,
  Navigation,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Mic,
  Send,
  Volume2,
  MapPin,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Task, DailyPlan, Expense, Revenue, PaymentReminder, WorkVisit, FuturePlanning, CalendarEvent, RouteDestination, RouteHistory, AssistantCommand } from './types';

// Fix for Leaflet default icon issue
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const INITIAL_PLAN: DailyPlan = {
  date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  motivationalPhrase: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  priorityOne: "Fechar contrato estratégico FTD Educação",
  professional: {
    agenda: ["Reunião de alinhamento 09:00", "Visita técnica 14:00"],
    priorityTasks: [
      { id: '1', text: 'Revisar propostas de vendas públicas', completed: false, category: 'professional' },
      { id: '2', text: 'Follow-up com secretarias de educação', completed: false, category: 'professional' }
    ],
    salesGoals: "R$ 50.000,00 em novos contratos",
    networking: "Conectar com 3 novos diretores no LinkedIn",
    insights: "Focar no diferencial pedagógico da FTD",
    closingForecast: "24/04"
  },
  work: {
    scheduledVisits: [
      { id: 'v1', date: '2026-04-02', city: 'Rio de Janeiro', secretariat: 'SME Rio', contactName: 'Dra. Maria', subject: 'Adoção FTD 2026', result: 'Em negociação', observations: 'Reunião produtiva', nextSteps: 'Enviar proposta detalhada', lat: -22.9068, lng: -43.1729 }
    ],
    futurePlanning: [
      { id: 'f1', city: 'Niterói', secretariat: 'SME Niterói', priority: 'alta', lat: -22.8833, lng: -43.1036 },
      { id: 'f2', city: 'Duque de Caxias', secretariat: 'SME Caxias', priority: 'media', lat: -22.7858, lng: -43.3117 }
    ],
    history: [
      { id: 'h1', date: '2026-04-01', city: 'Maricá', secretariat: 'SME Maricá', contactName: 'João Silva', subject: 'Apresentação Material', result: 'Concluído', observations: 'Excelente recepção', nextSteps: 'Aguardar edital', lat: -22.9194, lng: -42.8186 },
      { id: 'h2', date: '2026-03-28', city: 'Rio de Janeiro', secretariat: 'SME Rio', contactName: 'Ana Paula', subject: 'Treinamento Professores', result: 'Concluído', observations: 'Muito engajamento', nextSteps: 'Enviar certificados', lat: -22.9068, lng: -43.1729 },
      { id: 'h3', date: '2026-03-25', city: 'Niterói', secretariat: 'SME Niterói', contactName: 'Carlos Rezende', subject: 'Renovação Contrato', result: 'Concluído', observations: 'Contrato assinado', nextSteps: 'Iniciar faturamento', lat: -22.8833, lng: -43.1036 }
    ],
    checklist: {
      reviewProposals: false,
      prepareMaterial: false,
      registerFeedback: false,
      scheduleFollowUp: false
    },
    routes: {
      currentDestinations: [],
      history: []
    },
    bidding: {
      notices: [
        { id: 'n1', number: '001/2026', agency: 'SME Rio de Janeiro', object: 'Aquisição de Material Didático', deadline: '2026-04-15', status: 'aberto' },
        { id: 'n2', number: '015/2026', agency: 'Prefeitura de Niterói', object: 'Treinamento de Professores', deadline: '2026-04-20', status: 'análise' }
      ],
      documents: [
        { id: 'd1', name: 'Certidão Negativa de Débitos', required: true, status: 'validado' },
        { id: 'd2', name: 'Atestado de Capacidade Técnica', required: true, status: 'pendente' },
        { id: 'd3', name: 'Contrato Social Atualizado', required: true, status: 'enviado' }
      ],
      participations: [
        { id: 'p1', noticeId: 'n1', type: 'eletrônico', strategicBids: 'Lance inicial: R$ 50.000,00. Margem de 15%.', result: 'Em andamento', date: '2026-04-10' }
      ],
      defenses: [],
      legislationNotes: "Focar nos artigos 25 e 75 da Lei 14.133/21 para dispensa e inexigibilidade.",
      costSheets: [
        { id: 'c1', name: 'Planilha Base - Serviços de Consultoria', items: [], totalValue: 0 }
      ],
      trainingProgress: 65,
      monitoring: {
        filters: {
          keywords: ['Educação', 'Secretaria de Educação'],
          categories: ['serviços educacionais', 'materiais pedagógicos', 'transporte escolar', 'merenda', 'tecnologia educacional'],
          locations: ['Rio de Janeiro', 'Niterói', 'São Gonçalo']
        },
        portals: {
          pncp: true,
          comprasGov: true,
          licitacoesE: false,
          portalComprasPublicas: true
        },
        alerts: {
          planner: true,
          email: true,
          whatsapp: true,
          telegram: false
        },
        monitoredNotices: [
          { id: 'm1', number: '044/2026', agency: 'SME Duque de Caxias', object: 'Aquisição de Tablets para alunos', deadline: '2026-05-10', status: 'aberto', source: 'PNCP', category: 'tecnologia educacional', location: 'Duque de Caxias' },
          { id: 'm2', number: '112/2026', agency: 'SME Maricá', object: 'Fornecimento de Merenda Escolar', deadline: '2026-05-15', status: 'análise', source: 'Compras.gov', category: 'merenda', location: 'Maricá' }
        ],
        history: [
          { id: 'h1', date: '2026-04-01', action: 'Edital Filtrado', noticeId: 'm1' }
        ],
        stats: {
          totalAnalyzed: 150,
          totalEducation: 45,
          monthlyGrowth: 12
        }
      }
    }
  },
  financial: {
    initialBalance: 0,
    expenses: [
      { id: 'e1', date: '2026-04-02', value: 150.00, category: 'Alimentação', observation: 'Almoço comercial' },
      { id: 'e2', date: '2026-04-02', value: 80.00, category: 'Transporte', observation: 'Combustível' },
      { id: 'e3', date: '2026-03-30', value: 1200.00, category: 'Outros', observation: 'Aluguel' },
      { id: 'e4', date: '2026-03-25', value: 350.00, category: 'Lazer/Família', observation: 'Cinema e Jantar' }
    ],
    revenues: [
      { id: 'r1', date: '2026-04-05', value: 5000.00, status: 'pendente', description: 'Comissão Contrato X' },
      { id: 'r2', date: '2026-04-01', value: 2500.00, status: 'recebido', description: 'Consultoria Mensal' }
    ],
    monthlyGoal: 50000.00,
    savingsGoalPercent: 20,
    manualRealized: 0,
    paymentReminders: [
      { id: 'p1', description: 'Internet', dueDate: '2026-04-05', status: 'pendente' },
      { id: 'p2', description: 'Seguro Carro', dueDate: '2026-04-10', status: 'pendente' },
      { id: 'p3', description: 'Condomínio', dueDate: '2026-04-01', status: 'pago' }
    ]
  },
  personal: {
    health: {
      exercises: "30 min de caminhada",
      hydration: 2,
      sleep: 7
    },
    leisureFamily: {
      plannedActivity: "Jantar com a família",
      qualityTimeNoPhone: true,
      specialMoments: "Conversa sobre as férias"
    },
    diary: "Hoje o dia começou bem...",
    bbqGastronomy: {
      shoppingList: ["Picanha", "Carvão", "Cerveja"],
      recipesSeasoning: "Sal grosso e alho",
      bbqSchedule: "Sábado às 13:00 com os amigos"
    },
    football: {
      lastGame: {
        result: "Flamengo 2 x 0 Fluminense",
        performance: "Domínio total, Arrascaeta deu aula."
      },
      nextGame: {
        date: "2026-04-05",
        opponent: "Vasco"
      },
      comments: "O time está encaixando bem com o novo esquema."
    },
    investments: {
      dailyContributions: 0,
      portfolio: {
        stocks: 40,
        funds: 30,
        fixedIncome: 30
      },
      monthlyGoal: 2000,
      financialInsight: "A constância é o segredo dos juros compostos."
    }
  },
  finalChecklist: {
    meetingsConfirmed: false,
    proposalsSent: false,
    expensesNoted: false,
    exerciseDone: false,
    leisureTimeDedicated: false
  },
  calendar: {
    events: [
      { id: 'ev1', title: 'Reunião FTD Educação', start: '2026-04-02T09:00:00', end: '2026-04-02T10:30:00', location: 'Escritório Central', status: 'concluido', source: 'planner' },
      { id: 'ev2', title: 'Visita Técnica SME Rio', start: '2026-04-02T14:00:00', end: '2026-04-02T16:00:00', location: 'Centro do Rio', status: 'pendente', source: 'planner' },
      { id: 'ev3', title: 'Webinar Novos Materiais', start: '2026-04-03T10:00:00', end: '2026-04-03T11:00:00', location: 'Online', status: 'pendente', source: 'planner' }
    ],
    googleTokens: null,
    lastSync: undefined
  },
  assistant: {
    history: []
  },
  settings: {
    visual: {
      theme: 'Light',
      accentColor: '#3b82f6',
      borderRadius: 24,
      fontFamily: 'Inter',
      layout: 'espaçado',
      showGoals: true
    },
    profile: {
      email: 'pedroduarte1@gmail.com',
      password: '21226900',
      twoFactorEnabled: false,
      notifications: {
        sound: true,
        popup: true,
        email: false
      }
    },
    system: {
      version: '3.1.0',
      dbStatus: 'online',
      storageType: 'Local Sync',
      changelog: [
        { version: '3.1.0', date: '2026-04-02', changes: ['Nova aba de Trabalho com Mapas', 'Integração com Google Maps', 'Melhorias de UI'] },
        { version: '3.0.0', date: '2026-03-15', changes: ['Lançamento do Planner V3', 'Módulo Financeiro Avançado'] }
      ]
    },
    integrations: {
      linkedin: true,
      googleCalendar: false,
      googleSyncPlannerToGoogle: true,
      googleSyncGoogleToPlanner: true,
      selectedCalendars: ['primary'],
      supabase: true,
      whatsappBusiness: true
    },
    advanced: {
      aiNotifications: true,
      automationRules: false
    }
  }
};

type TabId = 'dashboard' | 'professional' | 'work' | 'financial' | 'prestacao-de-contas' | 'personal' | 'calendar' | 'routes' | 'final' | 'settings' | 'assistant';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('pedroduarte1@gmail.com');
  const [password, setPassword] = useState('21226900');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          // O usuário já foi criado pelo auto-cadastro, mas a flag de confirmação do Supabase 
          // ainda está marcada como pendente no registro antigo.
          setError('Este usuário já está cadastrado no banco do Supabase, mas seu e-mail ficou marcado anteriormente como não confirmado. Para liberar agora, acesse a aba "Authentication -> Users" no Supabase, clique nos três pontinhos ao lado do seu e-mail pedroduarte1@gmail.com e escolha "Confirm User".');
          return;
        }

        if (authError.message.includes('Invalid login credentials') && email === 'pedroduarte1@gmail.com' && password === '21226900') {
          // Tenta realizar o cadastro da conta padrão se não existir
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: 'Pedro Henrique'
              }
            }
          });
          if (signUpError) {
            throw new Error(signUpError.message);
          }
          
          setError('Cadastro automático realizado para pedroduarte1@gmail.com. Por favor, confirme o e-mail na sua caixa de entrada ou desative a confirmação de e-mail nas configurações do Supabase (Auth -> Providers -> Email -> Confirm email).');
          return;
        } else {
          throw new Error(authError.message);
        }
      } else {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-200">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Bem-vindo Pedro Henrique</h1>
          <p className="text-slate-500 font-medium">Entre para gerenciar seus projetos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Senha</label>
            <input 
              type="password" 
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => alert('Funcionalidade de recuperação de senha em desenvolvimento.')}
            className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-all"
          >
            Esqueceu sua senha? <span className="text-blue-600">Recuperar acesso</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthTotalDays - i),
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [activeWorkSubTab, setActiveWorkSubTab] = useState<'visitas' | 'licitacoes'>('visitas');
  const [activeBiddingSubTab, setActiveBiddingSubTab] = useState<'gestao' | 'monitoramento'>('gestao');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plan, setPlan] = useState<DailyPlan>(() => {
    const saved = localStorage.getItem('pedro_planner_data_v3');
    if (!saved) return INITIAL_PLAN;
    
    try {
      const parsed = JSON.parse(saved);
      // Ensure we merge nested objects to avoid missing fields from new updates
      return {
        ...INITIAL_PLAN,
        ...parsed,
        settings: {
          ...INITIAL_PLAN.settings,
          ...(parsed.settings || {}),
          profile: {
            ...INITIAL_PLAN.settings.profile,
            ...(parsed.settings?.profile || {})
          }
        },
        professional: { ...INITIAL_PLAN.professional, ...(parsed.professional || {}) },
        work: { 
          ...INITIAL_PLAN.work, 
          ...(parsed.work || {}),
          bidding: {
            ...INITIAL_PLAN.work.bidding,
            ...(parsed.work?.bidding || {}),
            monitoring: {
              ...INITIAL_PLAN.work.bidding.monitoring,
              ...(parsed.work?.bidding?.monitoring || {})
            }
          }
        },
        financial: { ...INITIAL_PLAN.financial, ...(parsed.financial || {}) },
        personal: { 
          ...INITIAL_PLAN.personal, 
          ...(typeof parsed.personal === 'object' ? parsed.personal : {}) 
        },
        finalChecklist: { ...INITIAL_PLAN.finalChecklist, ...(parsed.finalChecklist || {}) },
        calendar: { ...INITIAL_PLAN.calendar, ...(parsed.calendar || {}) },
        assistant: { ...INITIAL_PLAN.assistant, ...(parsed.assistant || {}) }
      };
    } catch (e) {
      return INITIAL_PLAN;
    }
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  const [newDestination, setNewDestination] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [receipts, setReceipts] = useState<{ id: string; url: string; date: string }[]>(() => {
    try {
      const saved = localStorage.getItem('pedro_receipts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);

  // Estados para os modais financeiros
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [financialValue, setFinancialValue] = useState('');
  const [financialCategory, setFinancialCategory] = useState('');
  const [financialObservation, setFinancialObservation] = useState('');
  const [financialDate, setFinancialDate] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'mes' | 'ano'>('mes');
  
  // Estados para o modal de Agenda Profissional
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
  const [agendaCity, setAgendaCity] = useState('');
  const [agendaSecretariat, setAgendaSecretariat] = useState('');
  const [agendaDate, setAgendaDate] = useState('');
  const [agendaTime, setAgendaTime] = useState('');
  const [agendaObservations, setAgendaObservations] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditVisitId, setActiveEditVisitId] = useState('');
  
  // Estados para criação de nova rota a partir de visita
  const [criarNovaRota, setCriarNovaRota] = useState(false);
  const [origemRota, setOrigemRota] = useState('');
  const [destinoRota, setDestinoRota] = useState('');


  // Estados para o modal de Planejamento Futuro
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [planningTitle, setPlanningTitle] = useState('');
  const [planningDescription, setPlanningDescription] = useState('');
  const [planningDate, setPlanningDate] = useState('');
  const [isPlanningEditMode, setIsPlanningEditMode] = useState(false);
  const [activeEditPlanningId, setActiveEditPlanningId] = useState('');



  // Estados para o modal de Conclusão de Visita
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [activeCompleteVisitId, setActiveCompleteVisitId] = useState('');
  const [visitResult, setVisitResult] = useState('');
  const [visitObservations, setVisitObservations] = useState('');
  const [visitNextSteps, setVisitNextSteps] = useState('');

  // Estados para Anotações (Diário Pessoal)
  interface Anotacao {
    id: string;
    titulo: string;
    conteudo: string;
    data?: string;
  }

  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(() => {
    try {
      const saved = localStorage.getItem('anotacoes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [anotacaoEditando, setAnotacaoEditando] = useState<Anotacao | null>(null);
  const [tituloAnotacao, setTituloAnotacao] = useState('');
  const [conteudoAnotacao, setConteudoAnotacao] = useState('');

  // Estados para o modal de eventos do Calendário
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventos, setEventos] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('eventos');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [local, setLocal] = useState('');
  const [anotacoesEvento, setAnotacoesEvento] = useState('');

  // Estados para o calendário visual
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Estados para geolocalização e clima
  const [localizacao, setLocalizacao] = useState<{ latitude: number; longitude: number } | null>(null);
  const [clima, setClima] = useState<{ temperatura: number; condicao: string } | null>(null);
  const [cidade, setCidade] = useState<string>('');
  const [itensSelecionados, setItensSelecionados] = useState<any[]>([]);
  const [isModalDiaAberto, setIsModalDiaAberto] = useState<boolean>(false);





  const fetchUserData = async (userId: string) => {
    try {
      // 1. Carregar perfil / configurações
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);

      const profile = profileData && profileData.length > 0 ? profileData[0] : null;

      // Se não houver perfil no Supabase, criamos o perfil inicial para o usuário
      if (!profile) {
        await supabase.from('profiles').insert([{
          id: userId,
          theme: plan.settings.visual.theme,
          accent_color: plan.settings.visual.accentColor,
          border_radius: plan.settings.visual.borderRadius,
          font_family: plan.settings.visual.fontFamily,
          layout: plan.settings.visual.layout,
          show_goals: plan.settings.visual.showGoals
        }]);
      }

      // 2. Carregar tarefas
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      // 3. Carregar transações financeiras
      const { data: financialData } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', userId);

      // 4. Carregar lembretes de pagamento
      const { data: remindersData } = await supabase
        .from('payment_reminders')
        .select('*')
        .eq('user_id', userId);

      // 5. Carregar visitas
      const { data: visitsData } = await supabase
        .from('work_visits')
        .select('*')
        .eq('user_id', userId);

      // 6. Carregar histórico de rotas
      const { data: routesData } = await supabase
        .from('route_history')
        .select('*')
        .eq('user_id', userId);

      // 7. Carregar recibos / comprovantes
      const { data: receiptsData } = await supabase
        .from('receipts')
        .select('*')
        .eq('user_id', userId);

      setPlan(prev => {
        const priorityTasks = tasksData ? tasksData.map((t: any) => ({
          id: t.id,
          text: t.text,
          completed: t.completed,
          category: t.category
        })) : prev.professional.priorityTasks;

        const expenses = financialData ? financialData.filter((f: any) => f.type === 'expense').map((e: any) => ({
          id: e.id,
          date: e.date,
          value: Number(e.value),
          category: e.category,
          observation: e.observation || ''
        })) : prev.financial.expenses;

        const revenues = financialData ? financialData.filter((f: any) => f.type === 'revenue').map((r: any) => ({
          id: r.id,
          date: r.date,
          value: Number(r.value),
          status: r.status,
          description: r.category
        })) : prev.financial.revenues;

        const paymentReminders = remindersData ? remindersData.map((r: any) => ({
          id: r.id,
          description: r.description,
          dueDate: r.due_date,
          status: r.status
        })) : prev.financial.paymentReminders;

        const scheduledVisits = visitsData ? visitsData.filter((v: any) => !v.is_future_planning && v.result !== 'Concluído').map((v: any) => ({
          id: v.id,
          date: v.date,
          city: v.city,
          secretariat: v.secretariat,
          contactName: v.contact_name || '',
          subject: v.subject || '',
          result: v.result || '',
          observations: v.observations || '',
          nextSteps: v.next_steps || '',
          lat: v.lat ? Number(v.lat) : undefined,
          lng: v.lng ? Number(v.lng) : undefined,
          route_origin: v.route_origin || '',
          route_destination: v.route_destination || ''
        })) : prev.work.scheduledVisits;

        const historyVisits = visitsData ? visitsData.filter((v: any) => !v.is_future_planning && v.result === 'Concluído').map((v: any) => ({
          id: v.id,
          date: v.date,
          city: v.city,
          secretariat: v.secretariat,
          contactName: v.contact_name || '',
          subject: v.subject || '',
          result: v.result || '',
          observations: v.observations || '',
          nextSteps: v.next_steps || '',
          lat: v.lat ? Number(v.lat) : undefined,
          lng: v.lng ? Number(v.lng) : undefined,
          route_origin: v.route_origin || '',
          route_destination: v.route_destination || ''
        })) : prev.work.history;

        const futurePlanning = visitsData ? visitsData.filter((v: any) => v.is_future_planning).map((v: any) => ({
          id: v.id,
          city: v.city,
          secretariat: v.secretariat,
          priority: v.priority,
          scheduledDate: v.date,
          lat: v.lat ? Number(v.lat) : undefined,
          lng: v.lng ? Number(v.lng) : undefined
        })) : prev.work.futurePlanning;


        const routesHistory = routesData ? routesData.map((r: any) => ({
          id: r.id,
          date: r.created_at || r.date,
          name: r.name,
          destinations: r.destinations,
          googleMapsUrl: r.google_maps_url
        })) : prev.work.routes.history;

        const settings = profile ? {
          ...prev.settings,
          visual: {
            theme: profile.theme || prev.settings.visual.theme,
            accentColor: profile.accent_color || prev.settings.visual.accentColor,
            borderRadius: profile.border_radius || prev.settings.visual.borderRadius,
            fontFamily: profile.font_family || prev.settings.visual.fontFamily,
            layout: profile.layout || prev.settings.visual.layout,
            showGoals: profile.show_goals !== undefined ? profile.show_goals : prev.settings.visual.showGoals
          }
        } : prev.settings;

        const personal = profile ? {
          ...prev.personal,
          health: {
            exercises: profile.health_exercises || prev.personal.health.exercises,
            hydration: Number(profile.health_hydration || prev.personal.health.hydration),
            sleep: Number(profile.health_sleep || prev.personal.health.sleep)
          },
          diary: profile.diary || prev.personal.diary,
          bbqGastronomy: {
            shoppingList: profile.bbq_shopping_list || prev.personal.bbqGastronomy.shoppingList,
            recipesSeasoning: profile.bbq_recipes || prev.personal.bbqGastronomy.recipesSeasoning,
            bbqSchedule: profile.bbq_schedule || prev.personal.bbqGastronomy.bbqSchedule
          },
          football: {
            lastGame: {
              result: profile.football_last_game_result || prev.personal.football.lastGame.result,
              performance: profile.football_last_game_performance || prev.personal.football.lastGame.performance
            },
            nextGame: {
              date: profile.football_next_game_date || prev.personal.football.nextGame.date,
              opponent: profile.football_next_game_opponent || prev.personal.football.nextGame.opponent
            },
            comments: profile.football_comments || prev.personal.football.comments
          },
          investments: {
            dailyContributions: Number(profile.investments_daily_contributions || prev.personal.investments.dailyContributions),
            portfolio: {
              stocks: Number(profile.investments_stocks || prev.personal.investments.portfolio.stocks),
              funds: Number(profile.investments_funds || prev.personal.investments.portfolio.funds),
              fixedIncome: Number(profile.investments_fixed_income || prev.personal.investments.portfolio.fixedIncome)
            },
            monthlyGoal: Number(profile.investments_monthly_goal || prev.personal.investments.monthlyGoal),
            financialInsight: profile.investments_insight || prev.personal.investments.financialInsight
          }
        } : prev.personal;

        return {
          ...prev,
          settings,
          personal,
          professional: {
            ...prev.professional,
            priorityTasks
          },
          work: {
            ...prev.work,
            scheduledVisits,
            history: historyVisits,
            futurePlanning,
            routes: {
              ...prev.work.routes,
              history: routesHistory
            }
          },
          financial: {
            ...prev.financial,
            expenses,
            revenues,
            paymentReminders
          }
        };
      });

      if (receiptsData) {
        setReceipts(receiptsData.map((r: any) => ({
          id: r.id,
          url: r.image_url,
          date: r.date
        })));
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('pedro_receipts', JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem('pedro_planner_data_v3', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    const eventosSalvos = JSON.parse(localStorage.getItem('eventos') || '[]');
    setEventos(eventosSalvos);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erro ao obter geolocalização:", error);
          setLocalizacao({
            latitude: -22.9068,
            longitude: -43.1729
          });
        },
        { timeout: 5000 }
      );
    } else {
      setLocalizacao({
        latitude: -22.9068,
        longitude: -43.1729
      });
    }
  }, []);

  useEffect(() => {
    if (localizacao) {
      const fetchWeather = async () => {
        try {
          const apiKey = process.env.OPENWEATHER_API_KEY || "";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${localizacao.latitude}&lon=${localizacao.longitude}&units=metric&lang=pt_br&appid=${apiKey}`
          );
          if (!response.ok) {
            const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${localizacao.latitude}&longitude=${localizacao.longitude}&current=temperature_2m,weather_code`;
            const meteoRes = await fetch(meteoUrl);
            const meteoData = await meteoRes.json();
            const weatherCodes: Record<number, string> = {
              0: "Céu limpo",
              1: "Principalmente limpo", 2: "Parcialmente nublado", 3: "Encoberto",
              45: "Nevoeiro", 48: "Nevoeiro com depósito de gelo",
              51: "Chuvisco leve", 53: "Chuvisco moderado", 55: "Chuvisco denso",
              61: "Chuva leve", 63: "Chuva moderada", 65: "Chuva forte",
              71: "Neve leve", 73: "Neve moderada", 75: "Neve forte",
              77: "Granizo",
              80: "Pancadas de chuva leves", 81: "Pancadas de chuva moderadas", 82: "Pancadas de chuva violentas",
              95: "Trovoada leve ou moderada", 96: "Trovoada com granizo leve", 99: "Trovoada com granizo forte"
            };
            setClima({
              temperatura: Math.round(meteoData.current.temperature_2m),
              condicao: weatherCodes[meteoData.current.weather_code] || "Desconhecido"
            });
            return;
          }
          const data = await response.json();
          setClima({
            temperatura: Math.round(data.main.temp),
            condicao: data.weather[0].description,
          });
        } catch (error) {
          console.error("Erro ao obter clima:", error);
        }
      };
      fetchWeather();
    }
  }, [localizacao]);

  useEffect(() => {
    if (localizacao) {
      const fetchCidade = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${localizacao.latitude}&lon=${localizacao.longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          setCidade(data.address.city || data.address.town || data.address.village || data.address.municipality || data.address.state_district || "Cidade não identificada");
        } catch (error) {
          console.error("Erro ao obter nome da cidade:", error);
        }
      };
      fetchCidade();
    }
  }, [localizacao]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const tokens = event.data.tokens;
        setPlan(prev => ({
          ...prev,
          calendar: {
            ...prev.calendar,
            googleTokens: tokens,
            lastSync: new Date().toISOString()
          }
        }));
        syncGoogleCalendar(tokens);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (plan.calendar.googleTokens && plan.settings.integrations.googleSyncGoogleToPlanner) {
      const fetchEvents = async () => {
        try {
          const response = await fetch('/api/calendar/events/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: plan.calendar.googleTokens })
          });
          const googleEvents = await response.json();
          
          if (Array.isArray(googleEvents)) {
            const formattedEvents: CalendarEvent[] = googleEvents.map((ge: any) => ({
              id: ge.id,
              title: ge.summary,
              description: ge.description || '',
              location: ge.location || '',
              start: ge.start.dateTime || ge.start.date,
              end: ge.end.dateTime || ge.end.date,
              source: 'google'
            }));

            setPlan(prev => {
              const existingIds = new Set(prev.calendar.events.map(e => e.id));
              const newEvents = formattedEvents.filter(e => !existingIds.has(e.id));
              return {
                ...prev,
                calendar: {
                  ...prev.calendar,
                  events: [...prev.calendar.events, ...newEvents]
                }
              };
            });
          }
        } catch (error) {
          console.error('Error fetching Google events:', error);
        }
      };
      fetchEvents();
    }
  }, [plan.calendar.googleTokens, plan.settings.integrations.googleSyncGoogleToPlanner]);

  const syncGoogleCalendar = async (tokens = plan.calendar.googleTokens) => {
    if (!tokens) return;
    
    try {
      const response = await fetch('/api/calendar/events/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens })
      });
      
      if (response.ok) {
        const googleEvents = await response.json();
        const formattedEvents = googleEvents.map((ge: any) => ({
          id: ge.id,
          title: ge.summary,
          start: ge.start.dateTime || ge.start.date,
          end: ge.end.dateTime || ge.end.date,
          description: ge.description,
          location: ge.location,
          source: 'google' as const,
          googleEventId: ge.id
        }));

        setPlan(prev => {
          // Keep local events, update/add google events
          const localEvents = prev.calendar.events.filter(e => e.source === 'planner');
          return {
            ...prev,
            calendar: {
              ...prev.calendar,
              events: [...localEvents, ...formattedEvents],
              lastSync: new Date().toISOString()
            }
          };
        });
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  const loginGoogle = handleGoogleAuth;

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id' | 'source'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      source: 'planner'
    };
    
    setPlan(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: [...prev.calendar.events, newEvent]
      }
    }));

    // If connected to Google, sync it
    if (plan.calendar.googleTokens) {
      fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: plan.calendar.googleTokens, 
          event: {
            summary: newEvent.title,
            description: newEvent.description,
            location: newEvent.location,
            start: { dateTime: newEvent.start },
            end: { dateTime: newEvent.end }
          }
        })
      }).then(res => res.json()).then(ge => {
        setPlan(prev => ({
          ...prev,
          calendar: {
            ...prev.calendar,
            events: prev.calendar.events.map(e => e.id === newEvent.id ? { ...e, googleEventId: ge.id } : e)
          }
        }));
      });
    }
  };

  const deleteCalendarEvent = async (id: string) => {
    const event = plan.calendar.events.find(e => e.id === id);
    if (!event) return;

    if (event.source === 'google' || event.googleEventId) {
      if (plan.calendar.googleTokens) {
        await fetch('/api/calendar/events/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tokens: plan.calendar.googleTokens, 
            eventId: event.googleEventId || event.id 
          })
        });
      }
    }

    setPlan(prev => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        events: prev.calendar.events.filter(e => e.id !== id)
      }
    }));
  };

  // Apply Visual Settings
  const themeColors = {
    'Light': { bg: '#f8fafc', card: '#ffffff', text: '#1e293b', border: '#f1f5f9', sidebar: '#ffffff' },
    'Dark': { bg: '#0f172a', card: '#1e293b', text: '#f8fafc', border: '#334155', sidebar: '#1e293b' },
    'Deep Black': { bg: '#000000', card: '#111111', text: '#ffffff', border: '#222222', sidebar: '#000000' },
    'Navy Blue': { bg: '#0a192f', card: '#112240', text: '#ccd6f6', border: '#233554', sidebar: '#112240' }
  };

  const currentTheme = themeColors[plan.settings.visual.theme] || themeColors['Light'];

  const dynamicStyles = `
    :root {
      --accent-color: ${plan.settings.visual.accentColor};
      --bg-color: ${currentTheme.bg};
      --card-bg: ${currentTheme.card};
      --card-bg-rgb: ${hexToRgb(currentTheme.card)};
      --text-color: ${currentTheme.text};
      --border-color: ${currentTheme.border};
      --sidebar-bg: ${currentTheme.sidebar};
      --border-radius: ${plan.settings.visual.borderRadius}px;
      --font-family: '${plan.settings.visual.fontFamily}', sans-serif;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: var(--font-family);
    }
    .card-custom {
      background-color: var(--card-bg);
      border-radius: var(--border-radius);
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .text-accent { color: var(--accent-color); }
    .bg-accent { background-color: var(--accent-color); }
    .border-accent { border-color: var(--accent-color); }
    .layout-spacing { gap: ${plan.settings.visual.layout === 'compacto' ? '1rem' : '2rem'}; }
  `;

  const toggleTask = async (taskId: string) => {
    // Obter o item atual para saber o novo estado
    const currentTask = plan.professional.priorityTasks.find(t => t.id === taskId);
    if (!currentTask) return;

    const newCompleted = !currentTask.completed;

    setPlan(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        priorityTasks: prev.professional.priorityTasks.map(t => 
          t.id === taskId ? { ...t, completed: newCompleted } : t
        )
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('tasks')
          .update({ completed: newCompleted })
          .eq('id', taskId)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa no Supabase:', err);
    }
  };

  const addTask = async (category: 'professional') => {
    // Temporariamente desativado para remover o window.prompt()
    return;
  };

  const addExpense = async (value: number, category: any, observation: string) => {
    if (!value || !category) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const dateStr = new Date().toISOString().split('T')[0];
    const newExpense: Expense = {
      id: newId,
      date: dateStr,
      value,
      category,
      observation: observation || ""
    };

    setPlan(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        expenses: [...prev.financial.expenses, newExpense]
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('financial_transactions')
          .insert([{
            id: newId,
            user_id: session.user.id,
            type: 'expense',
            date: dateStr,
            value,
            category,
            observation: observation || ""
          }]);
      }
    } catch (err) {
      console.error('Erro ao adicionar despesa no Supabase:', err);
    }
  };

  const addRevenue = async (value: number, description: string, customDate?: string) => {
    if (!value || !description) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const dateStr = customDate || new Date().toISOString().split('T')[0];
    const newRevenue: Revenue = {
      id: newId,
      date: dateStr,
      value,
      status: 'pendente',
      description
    };

    setPlan(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        revenues: [...prev.financial.revenues, newRevenue]
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('financial_transactions')
          .insert([{
            id: newId,
            user_id: session.user.id,
            type: 'revenue',
            date: dateStr,
            value,
            category: description, // description is stored as category
            status: 'pendente'
          }]);
      }
    } catch (err) {
      console.error('Erro ao adicionar receita no Supabase:', err);
    }
  };


  const deleteExpense = async (id: string) => {
    if (!confirm("Deseja realmente excluir este registro?")) return;


    setPlan(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        expenses: prev.financial.expenses.filter(e => e.id !== id)
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('financial_transactions')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao deletar despesa no Supabase:', err);
    }
  };

  const deleteRevenue = async (id: string) => {
    if (!confirm("Deseja realmente excluir este registro?")) return;

    setPlan(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        revenues: prev.financial.revenues.filter(r => r.id !== id)
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('financial_transactions')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao deletar receita no Supabase:', err);
    }
  };

  const abrirAdicionarNota = () => {
    setTituloAnotacao('');
    setConteudoAnotacao('');
    setAnotacaoEditando(null);
    setModalAberto(true);
  };

  const editarAnotacao = (id: string) => {
    const anotacaoSelecionada = anotacoes.find(a => a.id === id);
    if (anotacaoSelecionada) {
      setAnotacaoEditando(anotacaoSelecionada);
      setTituloAnotacao(anotacaoSelecionada.titulo);
      setConteudoAnotacao(anotacaoSelecionada.conteudo);
      setModalAberto(true);
    }
  };

  const excluirAnotacao = (id: string) => {
    if (window.confirm("Deseja realmente excluir esta anotação?")) {
      const novasAnotacoes = anotacoes.filter(a => a.id !== id);
      setAnotacoes(novasAnotacoes);
      localStorage.setItem('anotacoes', JSON.stringify(novasAnotacoes));
    }
  };

  const salvarAnotacao = () => {
    if (!tituloAnotacao.trim() || !conteudoAnotacao.trim()) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
    }

    if (anotacaoEditando) {
      const novasAnotacoes = anotacoes.map(a => 
        a.id === anotacaoEditando.id ? { ...a, titulo: tituloAnotacao, conteudo: conteudoAnotacao } : a
      );
      setAnotacoes(novasAnotacoes);
      localStorage.setItem('anotacoes', JSON.stringify(novasAnotacoes));
    } else {
      const nova: Anotacao = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: tituloAnotacao,
        conteudo: conteudoAnotacao,
        data: new Date().toISOString().split('T')[0]
      };
      const novasAnotacoes = [...anotacoes, nova];
      setAnotacoes(novasAnotacoes);
      localStorage.setItem('anotacoes', JSON.stringify(novasAnotacoes));
    }

    setModalAberto(false);
    setTituloAnotacao('');
    setConteudoAnotacao('');
    setAnotacaoEditando(null);
  };

  const abrirModalEvento = () => {
    setTitulo('');
    setData('');
    setHoraInicio('');
    setHoraFim('');
    setLocal('');
    setAnotacoesEvento('');
    setIsEventModalOpen(true);
  };

  const criarEventoGoogle = async (evento: any) => {
    if (!plan.calendar.googleTokens) return;
    try {
      const startDateTime = evento.data && evento.horaInicio ? `${evento.data}T${evento.horaInicio}:00` : new Date().toISOString();
      const endDateTime = evento.data && evento.horaFim ? `${evento.data}T${evento.horaFim}:00` : (evento.data && evento.horaInicio ? `${evento.data}T${evento.horaInicio}:00` : new Date().toISOString());
      
      const response = await fetch('/api/calendar/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: plan.calendar.googleTokens, 
          event: {
            summary: evento.titulo,
            description: evento.anotacoes,
            location: evento.local,
            start: { dateTime: startDateTime },
            end: { dateTime: endDateTime }
          }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating event on Google Calendar:', error);
    }
  };

  const salvarEvento = async () => {
    if (!titulo || !data || !horaInicio) {
      alert("Preencha os campos obrigatórios antes de salvar.");
      return;
    }

    const novoEvento = {
      id: Date.now(),
      titulo,
      data,
      horaInicio,
      horaFim,
      local,
      anotacoes: anotacoesEvento
    };

    // Atualiza o estado local
    const eventosAtualizados = [...eventos, novoEvento];
    setEventos(eventosAtualizados);

    // Salva no localStorage
    localStorage.setItem('eventos', JSON.stringify(eventosAtualizados));

    // Se estiver usando Supabase, insere também no banco
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { error } = await supabase
          .from('work_visits')
          .insert([{
            id: String(novoEvento.id),
            user_id: session.user.id,
            date: novoEvento.data,
            city: novoEvento.local || 'Local',
            secretariat: 'Calendário',
            contact_name: '',
            subject: novoEvento.titulo,
            result: 'Concluído',
            observations: anotacoesEvento || 'Evento de Calendário',
            next_steps: '',
            is_future_planning: false
          }]);

        if (error) {
          console.error('Erro ao salvar evento:', error);
        } else {
          console.log('Evento salvo com sucesso');
        }
      }
    } catch (dbErr) {
      console.error('Erro de banco de dados ao salvar evento:', dbErr);
    }

    // Se estiver conectado ao Google, envia para o Google Calendar
    if (plan.calendar.googleTokens) {
      await criarEventoGoogle(novoEvento);
    }

    // Fecha o modal
    setIsEventModalOpen(false);
  };

  const abrirEventosOuAnotacoes = (data: Date) => {
    const eventosDoDia = [
      ...plan.calendar.events.map(e => ({
        id: e.id,
        titulo: e.title,
        data: e.start ? e.start.split('T')[0] : '',
        horaInicio: e.start ? e.start.split('T')[1]?.substring(0, 5) : '',
        horaFim: e.end ? e.end.split('T')[1]?.substring(0, 5) : '',
        local: e.location
      })),
      ...eventos.map(e => ({
        id: String(e.id),
        titulo: e.titulo,
        data: e.data,
        horaInicio: e.horaInicio,
        horaFim: e.horaFim,
        local: e.local
      }))
    ].filter((evento: any) => {
      return evento.data && new Date(evento.data + 'T00:00:00').toDateString() === data.toDateString();
    });

    const anotacoesDoDia = anotacoes.filter((anotacao: any) => {
      return anotacao.data && new Date(anotacao.data + 'T00:00:00').toDateString() === data.toDateString();
    });

    setItensSelecionados([
      ...eventosDoDia.map(e => ({ ...e, type: 'evento' })),
      ...anotacoesDoDia.map(a => ({ ...a, type: 'anotacao' }))
    ]);
    setIsModalDiaAberto(true);
  };

  const togglePaymentStatus = async (id: string) => {
    const reminder = plan.financial.paymentReminders.find(p => p.id === id);
    if (!reminder) return;

    const newStatus = reminder.status === 'pago' ? 'pendente' : 'pago';

    setPlan(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        paymentReminders: prev.financial.paymentReminders.map(p => 
          p.id === id ? { ...p, status: newStatus } : p
        )
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('payment_reminders')
          .update({ status: newStatus })
          .eq('id', id)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao atualizar status do pagamento no Supabase:', err);
    }
  };


  const handleAssistantCommand = async (input: string) => {
    if (!input.trim()) return;
    setAssistantLoading(true);
    const lowerInput = input.toLowerCase();

    // 1. Local Knowledge Base for Bidding (Licitações)
    const biddingKeywords = ['licitação', 'licitacao', 'edital', 'pregão', 'pregao', 'compras públicas', 'pncp', 'compras.gov', 'licitações-e', 'portal de compras'];
    const isBiddingQuery = biddingKeywords.some(kw => lowerInput.includes(kw));

    if (isBiddingQuery) {
      let response = "Olá Pedro! Identifiquei que você está procurando informações sobre licitações. Aqui estão os principais portais e orientações:\n\n";
      response += "1. **PNCP (pncp.gov.br)**: Portal obrigatório para todos os entes. Centraliza editais de todo o país.\n";
      response += "2. **Compras.gov.br**: Sistema federal, essencial para órgãos da União e muitos municípios.\n";
      response += "3. **Licitações-e (BB)**: Muito utilizado por prefeituras e empresas estatais.\n";
      response += "4. **Portal de Compras Públicas**: Grande capilaridade em estados e municípios.\n\n";
      response += "💡 **Dica da Raquel1**: Para o seu foco em **Educação**, recomendo filtrar por 'Merenda Escolar', 'Transporte Escolar' ou 'Secretaria de Educação' nestes portais.";

      const historyItem: AssistantCommand = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        command: input,
        response: response,
        actionExecuted: "Consulta Base Local (Licitações)",
        status: 'success'
      };

      setPlan(prev => ({
        ...prev,
        assistant: {
          ...prev.assistant,
          history: [historyItem, ...prev.assistant.history]
        }
      }));
      setAssistantInput('');
      setAssistantLoading(false);
      return;
    }

    // 2. Simple Local Command Parser (Regex)
    const taskMatch = lowerInput.match(/adicionar tarefa (.*)/i);
    const expenseMatch = lowerInput.match(/adicionar gasto de ([\d.,]+) em (.*)/i);
    const revenueMatch = lowerInput.match(/adicionar receita de ([\d.,]+) de (.*)/i);
    const visitMatch = lowerInput.match(/visita em (.*)/i);

    if (taskMatch || expenseMatch || revenueMatch || visitMatch) {
      let response = "";
      let actionExecuted = "";

      if (taskMatch) {
        const text = taskMatch[1];
        setPlan(prev => ({
          ...prev,
          professional: {
            ...prev.professional,
            priorityTasks: [...prev.professional.priorityTasks, {
              id: Math.random().toString(36).substr(2, 9),
              text: text.charAt(0).toUpperCase() + text.slice(1),
              completed: false,
              category: 'professional'
            }]
          }
        }));
        response = `Tarefa "${text}" adicionada com sucesso!`;
        actionExecuted = "ADD_TASK (Local)";
      } else if (expenseMatch) {
        const value = parseFloat(expenseMatch[1].replace(',', '.'));
        const category = expenseMatch[2];
        setPlan(prev => ({
          ...prev,
          financial: {
            ...prev.financial,
            expenses: [...prev.financial.expenses, {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString().split('T')[0],
              value,
              category: category.charAt(0).toUpperCase() + category.slice(1),
              observation: "Adicionado via Raquel1 (Local)"
            }]
          }
        }));
        response = `Gasto de R$ ${value.toFixed(2)} em ${category} registrado!`;
        actionExecuted = "ADD_EXPENSE (Local)";
      } else if (revenueMatch) {
        const value = parseFloat(revenueMatch[1].replace(',', '.'));
        const description = revenueMatch[2];
        setPlan(prev => ({
          ...prev,
          financial: {
            ...prev.financial,
            revenues: [...prev.financial.revenues, {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString().split('T')[0],
              value,
              status: 'pendente',
              description: description.charAt(0).toUpperCase() + description.slice(1)
            }]
          }
        }));
        response = `Receita de R$ ${value.toFixed(2)} de ${description} registrada como pendente.`;
        actionExecuted = "ADD_REVENUE (Local)";
      } else if (visitMatch) {
        const city = visitMatch[1];
        setPlan(prev => ({
          ...prev,
          work: {
            ...prev.work,
            scheduledVisits: [...prev.work.scheduledVisits, {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString().split('T')[0],
              city: city.charAt(0).toUpperCase() + city.slice(1),
              secretariat: "SME",
              status: 'agendado'
            }]
          }
        }));
        response = `Visita em ${city} agendada para hoje!`;
        actionExecuted = "ADD_WORK_VISIT (Local)";
      }

      const historyItem: AssistantCommand = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        command: input,
        response: response,
        actionExecuted,
        status: 'success'
      };

      setPlan(prev => ({
        ...prev,
        assistant: {
          ...prev.assistant,
          history: [historyItem, ...prev.assistant.history]
        }
      }));
      setAssistantInput('');
      setAssistantLoading(false);
      return;
    }

    // 3. Fallback to Gemini for complex commands
    const ASSISTANT_SYSTEM_PROMPT = `
      Você é a Raquel1, a assistente pessoal inteligente do Pedro Henrique.
      Seu objetivo é interpretar comandos de voz ou texto e transformá-los em ações estruturadas no sistema.

      Responda SEMPRE em formato JSON com a seguinte estrutura:
      {
        "response": "Sua resposta amigável confirmando a ação",
        "action": {
          "type": "ADD_TASK" | "ADD_EXPENSE" | "ADD_REVENUE" | "ADD_CALENDAR_EVENT" | "ADD_ROUTE_DESTINATION" | "UPDATE_HEALTH" | "ADD_WORK_VISIT",
          "payload": { ... dados da ação ... }
        }
      }

      Exemplos de payloads:
      - ADD_TASK: { "text": "Comprar pão", "category": "professional" }
      - ADD_EXPENSE: { "value": 50.5, "category": "Alimentação", "observation": "Jantar" }
      - ADD_REVENUE: { "value": 1000, "description": "Venda material" }
      - ADD_CALENDAR_EVENT: { "title": "Reunião", "start": "2026-04-02T10:00:00", "end": "2026-04-02T11:00:00", "location": "Escritório" }
      - ADD_ROUTE_DESTINATION: { "address": "Rua X, 123" }
      - UPDATE_HEALTH: { "hydration": 3, "sleep": 8 }
      - ADD_WORK_VISIT: { "city": "Rio de Janeiro", "secretariat": "SME", "date": "2026-04-05" }

      Se não entender ou não for uma ação, responda apenas com a mensagem amigável e action: null.
    `;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: ASSISTANT_SYSTEM_PROMPT,
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      let actionExecuted = result.action?.type;

      // Execute action if present
      if (result.action) {
        const { type, payload } = result.action;
        switch (type) {
          case 'ADD_TASK':
            setPlan(prev => ({
              ...prev,
              professional: {
                ...prev.professional,
                priorityTasks: [...prev.professional.priorityTasks, {
                  id: Math.random().toString(36).substr(2, 9),
                  text: payload.text,
                  completed: false,
                  category: payload.category || 'professional'
                }]
              }
            }));
            break;
          case 'ADD_EXPENSE':
            setPlan(prev => ({
              ...prev,
              financial: {
                ...prev.financial,
                expenses: [...prev.financial.expenses, {
                  id: Math.random().toString(36).substr(2, 9),
                  date: new Date().toISOString().split('T')[0],
                  value: payload.value,
                  category: payload.category || 'Outros',
                  observation: payload.observation || ""
                }]
              }
            }));
            break;
          case 'ADD_REVENUE':
            setPlan(prev => ({
              ...prev,
              financial: {
                ...prev.financial,
                revenues: [...prev.financial.revenues, {
                  id: Math.random().toString(36).substr(2, 9),
                  date: new Date().toISOString().split('T')[0],
                  value: payload.value,
                  status: 'pendente',
                  description: payload.description || "Receita via Raquel1"
                }]
              }
            }));
            break;
          case 'ADD_CALENDAR_EVENT':
            addCalendarEvent({
              title: payload.title,
              start: payload.start,
              end: payload.end,
              location: payload.location,
              description: "Adicionado via Raquel1"
            });
            break;
          case 'ADD_ROUTE_DESTINATION':
            setNewDestination(payload.address);
            // We can't easily call handleAddDestination here because it's an async function that uses state.
            // But we can simulate it or just add it to the list.
            const coords = await geocodeAddress(payload.address);
            const destination: RouteDestination = {
              id: Math.random().toString(36).substr(2, 9),
              address: payload.address,
              lat: coords?.lat,
              lng: coords?.lng,
              label: payload.address.split(',')[0]
            };
            setPlan(prev => ({
              ...prev,
              work: {
                ...prev.work,
                routes: {
                  ...prev.work.routes,
                  currentDestinations: [...prev.work.routes.currentDestinations, destination]
                }
              }
            }));
            setNewDestination('');
            break;
          case 'UPDATE_HEALTH':
            setPlan(prev => ({
              ...prev,
              personal: {
                ...prev.personal,
                health: {
                  ...prev.personal.health,
                  ...payload
                }
              }
            }));
            break;
          case 'ADD_WORK_VISIT':
            const visitCoords = await geocodeAddress(payload.city);
            setPlan(prev => ({
              ...prev,
              work: {
                ...prev.work,
                scheduledVisits: [...prev.work.scheduledVisits, {
                  id: Math.random().toString(36).substr(2, 9),
                  date: payload.date || new Date().toISOString().split('T')[0],
                  city: payload.city,
                  secretariat: payload.secretariat || "",
                  contactName: payload.contactName || "",
                  subject: payload.subject || "",
                  result: "Pendente",
                  observations: "",
                  nextSteps: "",
                  lat: visitCoords?.lat,
                  lng: visitCoords?.lng
                }]
              }
            }));
            break;
        }
      }

      // Update history
      const newHistoryItem: AssistantCommand = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        command: input,
        response: result.response || "Comando processado.",
        actionExecuted,
        status: 'success'
      };

      setPlan(prev => ({
        ...prev,
        assistant: {
          ...prev.assistant,
          history: [newHistoryItem, ...prev.assistant.history]
        }
      }));
      
      setAssistantInput('');
    } catch (error) {
      console.error("Erro no assistente:", error);
      const errorHistoryItem: AssistantCommand = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        command: input,
        response: "Desculpe, tive um problema ao processar seu pedido.",
        status: 'error'
      };
      setPlan(prev => ({
        ...prev,
        assistant: {
          ...prev.assistant,
          history: [errorHistoryItem, ...prev.assistant.history]
        }
      }));
    } finally {
      setAssistantLoading(false);
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAssistantInput(transcript);
      handleAssistantCommand(transcript);
    };
    recognition.start();
  };

  const generateAiInsight = async () => {
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um mentor de vendas para Pedro Henrique Duarte, consultor da FTD Educação. 
        Gere uma frase motivacional curta e um insight de vendas públicas para hoje. 
        Responda em formato JSON: { "phrase": "...", "insight": "..." }`,
        config: { responseMimeType: "application/json" }
      });
      
      const data = JSON.parse(response.text || "{}");
      if (data.phrase && data.insight) {
        setPlan(prev => ({
          ...prev,
          motivationalPhrase: data.phrase,
          professional: { ...prev.professional, insights: data.insight }
        }));
      }
    } catch (error) {
      console.error("Erro ao gerar insight:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleFinalCheck = (field: keyof DailyPlan['finalChecklist']) => {
    setPlan(prev => ({
      ...prev,
      finalChecklist: {
        ...prev.finalChecklist,
        [field]: !prev.finalChecklist[field]
      }
    }));
  };

  const toggleWorkChecklist = (field: keyof DailyPlan['work']['checklist']) => {
    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        checklist: {
          ...prev.work.checklist,
          [field]: !prev.work.checklist[field]
        }
      }
    }));
  };

  const addWorkVisit = async (
    city: string,
    secretariat: string,
    customDate?: string,
    observations?: string,
    criarNovaRota?: boolean,
    origemRota?: string,
    destinoRota?: string
  ) => {
    if (!city || !secretariat) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const dateStr = customDate || new Date().toISOString().split('T')[0];
    const newVisit: WorkVisit = {
      id: newId,
      date: dateStr,
      city,
      secretariat,
      contactName: "",
      subject: "",
      result: "",
      observations: observations || "",
      nextSteps: "",
      lat: undefined,
      lng: undefined,
      route_origin: criarNovaRota ? origemRota : '',
      route_destination: criarNovaRota ? destinoRota : ''
    };

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        scheduledVisits: [...prev.work.scheduledVisits, newVisit]
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .insert([{
            id: newId,
            user_id: session.user.id,
            date: dateStr,
            city,
            secretariat,
            contact_name: "",
            subject: "",
            result: "",
            observations: observations || "",
            next_steps: "",
            lat: null,
            lng: null,
            is_future_planning: false,
            route_origin: criarNovaRota ? origemRota : null,
            route_destination: criarNovaRota ? destinoRota : null
          }]);

        if (criarNovaRota && origemRota && destinoRota) {
          let dest1Coords = null;
          let dest2Coords = null;
          try {
            dest1Coords = await geocodeAddress(origemRota);
            dest2Coords = await geocodeAddress(destinoRota);
          } catch (e) {
            console.error(e);
          }

          const dest1: RouteDestination = {
            id: Math.random().toString(36).substr(2, 9),
            address: origemRota,
            lat: dest1Coords?.lat,
            lng: dest1Coords?.lng,
            label: origemRota.split(',')[0]
          };

          const dest2: RouteDestination = {
            id: Math.random().toString(36).substr(2, 9),
            address: destinoRota,
            lat: dest2Coords?.lat,
            lng: dest2Coords?.lng,
            label: destinoRota.split(',')[0]
          };

          const mapUrl = `https://www.google.com/maps/dir/${encodeURIComponent(origemRota)}/${encodeURIComponent(destinoRota)}`;
          const routeId = Math.random().toString(36).substr(2, 9);
          const routeDateStr = new Date().toISOString();
          const routeName = `Rota para ${city} - ${new Date().toLocaleDateString()}`;

          const historyItem: RouteHistory = {
            id: routeId,
            date: routeDateStr,
            name: routeName,
            destinations: [dest1, dest2],
            googleMapsUrl: mapUrl
          };

          setPlan(prev => ({
            ...prev,
            work: {
              ...prev.work,
              routes: {
                ...prev.work.routes,
                currentDestinations: [
                  ...prev.work.routes.currentDestinations,
                  dest1,
                  dest2
                ],
                history: [historyItem, ...prev.work.routes.history]
              }
            }
          }));


          await supabase
            .from('route_history')
            .insert([{
              id: routeId,
              user_id: session.user.id,
              name: routeName,
              destinations: [dest1, dest2],
              google_maps_url: mapUrl,
              date: routeDateStr
            }]);
        }
      }
    } catch (err) {
      console.error('Erro ao adicionar visita no Supabase:', err);
    }
  };


  const updateWorkVisit = async (visitId: string, city: string, secretariat: string, customDate?: string, observations?: string) => {
    if (!city || !secretariat) return;

    const dateStr = customDate || new Date().toISOString().split('T')[0];

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        scheduledVisits: prev.work.scheduledVisits.map(v => v.id === visitId ? { ...v, city, secretariat, date: dateStr, observations: observations || "" } : v)
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .update({
            city,
            secretariat,
            date: dateStr,
            observations: observations || ""
          })
          .eq('id', visitId)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao atualizar visita no Supabase:', err);
    }
  };

  const addFuturePlanning = async (title: string, description: string, dateStr: string) => {
    if (!title || !description) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const newPlanning: FuturePlanning = {
      id: newId,
      city: title,
      secretariat: description,
      priority: 'media',
      scheduledDate: dateStr || undefined
    };

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        futurePlanning: [...prev.work.futurePlanning, newPlanning]
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .insert([{
            id: newId,
            user_id: session.user.id,
            city: title,
            secretariat: description,
            date: dateStr || new Date().toISOString().split('T')[0],
            is_future_planning: true,
            priority: 'media',
            contact_name: "",
            subject: "",
            result: "",
            observations: "",
            next_steps: "",
            lat: null,
            lng: null
          }]);
      }
    } catch (err) {
      console.error('Erro ao adicionar planejamento no Supabase:', err);
    }
  };

  const updateFuturePlanning = async (planningId: string, title: string, description: string, dateStr: string) => {
    if (!title || !description) return;

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        futurePlanning: prev.work.futurePlanning.map(p => p.id === planningId ? { ...p, city: title, secretariat: description, scheduledDate: dateStr } : p)
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .update({
            city: title,
            secretariat: description,
            date: dateStr || new Date().toISOString().split('T')[0]
          })
          .eq('id', planningId)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao atualizar planejamento no Supabase:', err);
    }
  };

  const deleteFuturePlanning = async (planningId: string) => {
    if (!window.confirm("Deseja realmente excluir este planejamento?")) return;

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        futurePlanning: prev.work.futurePlanning.filter(p => p.id !== planningId)
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .delete()
          .eq('id', planningId)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao excluir planejamento no Supabase:', err);
    }
  };



  const openGoogleMapsRoute = () => {
    const points = [
      ...plan.work.history,
      ...plan.work.scheduledVisits,
      ...plan.work.futurePlanning
    ].filter(p => p.city).map(p => p.city);
    
    if (points.length === 0) return;
    
    const url = `https://www.google.com/maps/dir/${points.join('/')}`;
    window.open(url, '_blank');
  };

  const getMarkerIcon = (type: 'history' | 'scheduled' | 'future') => {
    const color = type === 'history' ? '#10b981' : type === 'scheduled' ? '#f59e0b' : '#ef4444';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  const completeVisit = async (visitId: string, result: string, observations: string, nextSteps: string) => {
    const visit = plan.work.scheduledVisits.find(v => v.id === visitId);
    if (!visit) return;

    const updatedVisit = { ...visit, result: result || "", observations: observations || "", nextSteps: nextSteps || "" };

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        scheduledVisits: prev.work.scheduledVisits.filter(v => v.id !== visitId),
        history: [updatedVisit, ...prev.work.history]
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .update({
            result: result || "",
            observations: observations || "",
            next_steps: nextSteps || "",
            is_future_planning: false
          })
          .eq('id', visitId)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao concluir visita no Supabase:', err);
    }
  };

  const deleteWorkVisit = async (id: string, type: 'scheduled' | 'history' | 'future') => {
    if (!confirm("Deseja realmente excluir este registro?")) return;
    
    setPlan(prev => {
      const newWork = { ...prev.work };
      if (type === 'scheduled') newWork.scheduledVisits = newWork.scheduledVisits.filter(v => v.id !== id);
      if (type === 'history') newWork.history = newWork.history.filter(v => v.id !== id);
      if (type === 'future') newWork.futurePlanning = newWork.futurePlanning.filter(v => v.id !== id);
      return { ...prev, work: newWork };
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('work_visits')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);
      }
    } catch (err) {
      console.error('Erro ao deletar visita no Supabase:', err);
    }
  };

  const updateCoordinates = async (id: string, type: 'scheduled' | 'history' | 'future') => {
    // Temporariamente desativado para remover o window.prompt()
    return;
  };


  const updateSettings = async (section: keyof DailyPlan['settings'], field: string, value: any) => {
    setPlan(prev => {
      const updated = {
        ...prev,
        settings: {
          ...prev.settings,
          [section]: {
            ...(prev.settings[section] as any),
            [field]: value
          }
        }
      };

      // Persistir no Supabase as configurações visuais se for a seção correspondente
      if (section === 'visual') {
        const visual = updated.settings.visual;
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            supabase
              .from('profiles')
              .update({
                theme: visual.theme,
                accent_color: visual.accentColor,
                border_radius: visual.borderRadius,
                font_family: visual.fontFamily,
                layout: visual.layout,
                show_goals: visual.showGoals
              })
              .eq('id', session.user.id)
              .then(({ error }) => {
                if (error) console.error('Erro ao salvar configurações no Supabase:', error);
              });
          }
        });
      }
      return updated;
    });
  };

  const updateProfessional = async (field: keyof DailyPlan['professional'], value: any) => {
    setPlan(prev => {
      const updated = {
        ...prev,
        professional: {
          ...prev.professional,
          [field]: value
        }
      };
      return updated;
    });
  };

  const updatePlanField = async (field: keyof DailyPlan, value: any) => {
    setPlan(prev => {
      const updated = {
        ...prev,
        [field]: value
      };

      // Campos do perfil como motivationalPhrase e priorityOne podem ser salvos no profiles
      if (field === 'motivationalPhrase' || field === 'priorityOne') {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const updates: any = {};
            if (field === 'motivationalPhrase') updates.motivational_phrase = value;
            if (field === 'priorityOne') updates.priority_one = value;
            
            supabase
              .from('profiles')
              .update(updates)
              .eq('id', session.user.id)
              .then(({ error }) => {
                if (error) console.error(`Erro ao salvar ${field} no Supabase:`, error);
              });
          }
        });
      }
      return updated;
    });
  };


  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'professional', label: 'Profissional', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'financial', label: 'Financeiro', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'prestacao-de-contas', label: 'Prestação de Contas', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50' },
    { id: 'personal', label: 'Pessoal', icon: User, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'calendar', label: 'Calendário', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'settings', label: 'Configurações', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  // Financial Calculations
  const dateObj = new Date();
  const mesAtual = dateObj.getMonth();
  const anoAtual = dateObj.getFullYear();

  const filtradosReceitas = plan.financial.revenues.filter((item) => {
    const dataItem = new Date(item.date);
    if (filtroPeriodo === 'mes') {
      return dataItem.getMonth() === mesAtual && dataItem.getFullYear() === anoAtual;
    } else {
      return dataItem.getFullYear() === anoAtual;
    }
  });

  const filtradosDespesas = plan.financial.expenses.filter((item) => {
    const dataItem = new Date(item.date);
    if (filtroPeriodo === 'mes') {
      return dataItem.getMonth() === mesAtual && dataItem.getFullYear() === anoAtual;
    } else {
      return dataItem.getFullYear() === anoAtual;
    }
  });

  const dailyInflows = filtradosReceitas
    .reduce((acc, r) => acc + r.value, 0);
  
  const dailyOutflows = filtradosDespesas
    .reduce((acc, e) => acc + e.value, 0);

  const projectedBalance = plan.financial.initialBalance + dailyInflows - dailyOutflows;

  const totalReceived = filtradosReceitas
    .filter(r => r.status === 'recebido')
    .reduce((acc, r) => acc + r.value, 0);

  const totalPending = filtradosReceitas
    .filter(r => r.status === 'pendente')
    .reduce((acc, r) => acc + r.value, 0);

  const savingsGoalValue = (totalReceived + totalPending) * (plan.financial.savingsGoalPercent / 100);
  const currentSavings = totalReceived * (plan.financial.savingsGoalPercent / 100);
  const savingsProgress = (currentSavings / (savingsGoalValue || 1)) * 100;

  const expenseByCategory = filtradosDespesas.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.value;
    return acc;
  }, {});

  const pieData = Object.keys(expenseByCategory).map(cat => ({
    name: cat,
    value: expenseByCategory[cat]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b'];

  const barData = [
    { name: 'Recebido', valor: totalReceived },
    { name: 'Pendente', valor: totalPending },
    { name: 'Despesas', valor: filtradosDespesas.reduce((acc, e) => acc + e.value, 0) }
  ];


  const getPaymentStatusColor = (reminder: PaymentReminder) => {
    if (reminder.status === 'pago') return 'bg-green-100 text-green-700 border-green-200';
    const today = new Date();
    const dueDate = new Date(reminder.dueDate);
    if (dueDate < today) return 'bg-red-100 text-red-700 border-red-200';
    const diffTime = Math.abs(dueDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const abrirCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setCameraStream(stream);
      setTimeout(() => {
        const videoElement = document.getElementById('receipt-video') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      setIsCameraActive(false);
    }
  };

  const fecharCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const salvarFoto = async (foto: string) => {
    try {
      const comprovantes = JSON.parse(localStorage.getItem('comprovantes') || '[]');
      comprovantes.push({ url: foto, data: new Date().toLocaleString() });
      localStorage.setItem('comprovantes', JSON.stringify(comprovantes));
    } catch (e) {
      console.error('Erro ao salvar no localStorage comprovantes:', e);
    }

    const newId = Math.random().toString(36).substr(2, 9);
    const dateStr = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newReceipt = {
      id: newId,
      url: foto,
      date: dateStr
    };
    setReceipts(prev => [newReceipt, ...prev]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('receipts')
          .insert([{
            id: newId,
            user_id: session.user.id,
            image_url: foto,
            date: dateStr
          }]);
      }
    } catch (err) {
      console.error('Erro ao salvar foto no Supabase:', err);
    }

    alert('✅ Foto salva com sucesso!');
  };

  const tirarFoto = async () => {
    const video = document.getElementById('receipt-video') as HTMLVideoElement;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/png');
      await salvarFoto(url);
      fecharCamera();
    }
  };

  const handleUploadNota = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const url = reader.result as string;
      const newId = Math.random().toString(36).substr(2, 9);
      const dateStr = new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newReceipt = {
        id: newId,
        url,
        date: dateStr
      };
      setReceipts(prev => [newReceipt, ...prev]);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('receipts')
            .insert([{
              id: newId,
              user_id: session.user.id,
              image_url: url,
              date: dateStr
            }]);
        }
      } catch (err) {
        console.error('Erro ao salvar upload de nota no Supabase:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const removerNota = async (id: string) => {
    if (confirm('Deseja realmente excluir esta nota fiscal?')) {
      setReceipts(prev => prev.filter(r => r.id !== id));

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase
            .from('receipts')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);
        }
      } catch (err) {
        console.error('Erro ao excluir nota fiscal do Supabase:', err);
      }
    }
  };

  const handleAddDestination = async () => {
    if (!newDestination.trim()) return;
    
    const coords = await geocodeAddress(newDestination);
    const destination: RouteDestination = {
      id: Math.random().toString(36).substr(2, 9),
      address: newDestination,
      lat: coords?.lat,
      lng: coords?.lng,
      label: newDestination.split(',')[0]
    };

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        routes: {
          ...prev.work.routes,
          currentDestinations: [...prev.work.routes.currentDestinations, destination]
        }
      }
    }));
    setNewDestination('');
  };

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const generateGoogleMapsUrl = (destinations: RouteDestination[]) => {
    if (destinations.length === 0) return '';
    const baseUrl = 'https://www.google.com/maps/dir/';
    const path = destinations.map(d => encodeURIComponent(d.address)).join('/');
    return `${baseUrl}${path}`;
  };

  const saveRouteToHistory = async () => {
    if (plan.work.routes.currentDestinations.length < 2) {
      alert("Adicione pelo menos 2 destinos para salvar uma rota.");
      return;
    }
    
    const name = `Rota ${new Date().toLocaleDateString()}`;

    const newId = Math.random().toString(36).substr(2, 9);
    const dateStr = new Date().toISOString();
    const mapUrl = generateGoogleMapsUrl(plan.work.routes.currentDestinations);
    const historyItem: RouteHistory = {
      id: newId,
      date: dateStr,
      name,
      destinations: [...plan.work.routes.currentDestinations],
      googleMapsUrl: mapUrl
    };

    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        routes: {
          ...prev.work.routes,
          history: [historyItem, ...prev.work.routes.history]
        }
      }
    }));

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('route_history')
          .insert([{
            id: newId,
            user_id: session.user.id,
            name,
            destinations: plan.work.routes.currentDestinations,
            google_maps_url: mapUrl,
            date: dateStr
          }]);
      }
    } catch (err) {
      console.error('Erro ao salvar rota no Supabase:', err);
    }
  };

  const excluirRota = async (id: string) => {
    if (confirm('Deseja realmente excluir esta rota?')) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { error } = await supabase
            .from('route_history')
            .delete()
            .eq('id', id)
            .eq('user_id', session.user.id);

          if (error) throw error;
        }

        setPlan(prev => ({
          ...prev,
          work: {
            ...prev.work,
            routes: {
              ...prev.work.routes,
              history: prev.work.routes.history.filter(h => h.id !== id)
            }
          }
        }));
        alert('✅ Rota excluída com sucesso!');
      } catch (err: any) {
        console.error('Erro ao excluir rota:', err.message || err);
        alert('❌ Falha ao excluir rota. Verifique a conexão com o Supabase.');
      }
    }
  };


  const moveDestination = (index: number, direction: 'up' | 'down') => {
    const newDestinations = [...plan.work.routes.currentDestinations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newDestinations.length) return;
    
    const temp = newDestinations[index];
    newDestinations[index] = newDestinations[targetIndex];
    newDestinations[targetIndex] = temp;
    
    setPlan(prev => ({
      ...prev,
      work: {
        ...prev.work,
        routes: {
          ...prev.work.routes,
          currentDestinations: newDestinations
        }
      }
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': {
        // 1. Work Visits Data
        const visitsByCity = [...plan.work.scheduledVisits, ...plan.work.history].reduce((acc: any, v) => {
          acc[v.city] = (acc[v.city] || 0) + 1;
          return acc;
        }, {});
        const workVisitsData = Object.keys(visitsByCity).map(city => ({ name: city, visits: visitsByCity[city] }));

        const workStatus = {
          concluido: plan.work.history.length,
          agendado: plan.work.scheduledVisits.length,
          pendente: plan.work.futurePlanning.length
        };

        // 2. Financial Data
        const expensesByCategory = plan.financial.expenses.reduce((acc: any, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.value;
          return acc;
        }, {});
        const financialPieData = Object.keys(expensesByCategory).map(cat => ({ name: cat, value: expensesByCategory[cat] }));

        const financialLineData = [
          { name: 'Jan', receita: 4000, despesa: 2400 },
          { name: 'Fev', receita: 3000, despesa: 1398 },
          { name: 'Mar', receita: 2000, despesa: 9800 },
          { name: 'Abr', receita: dailyInflows + plan.financial.revenues.reduce((acc, r) => acc + r.value, 0), despesa: dailyOutflows + plan.financial.expenses.reduce((acc, e) => acc + e.value, 0) },
        ];

        const totalRevenue = plan.financial.revenues.reduce((acc, r) => acc + r.value, 0);
        const totalExpense = plan.financial.expenses.reduce((acc, e) => acc + e.value, 0);
        const economyRate = totalRevenue > 0 ? Math.min(100, Math.round(((totalRevenue - totalExpense) / plan.financial.monthlyGoal) * 100)) : 0;

        // 2.1 Sales Progress
        const salesGoalValue = plan.financial.monthlyGoal || 50000;
        const currentSales = plan.financial.revenues.filter(r => r.status === 'recebido').reduce((acc, r) => acc + r.value, 0) + (plan.financial.manualRealized || 0);
        const salesPercentage = Math.min(100, Math.round((currentSales / salesGoalValue) * 100));
        const salesProgressData = [
          { name: 'Vendas', value: salesPercentage, fill: 'var(--accent-color)' }
        ];

        // 3. Calendar Data
        const productivityRate = plan.calendar.events.length > 0 ? Math.round((plan.calendar.events.filter(e => e.status === 'concluido').length / plan.calendar.events.length) * 100) : 85;

        // 4. Personal Data
        const personalPieData = [
          { name: 'Saúde', value: plan.personal.health.hydration * 10 },
          { name: 'Lazer', value: 30 },
          { name: 'Estudos', value: 20 },
          { name: 'Família', value: 40 }
        ];

        const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center w-fit gap-2 px-2.5 py-1 sm:px-4 sm:py-2 bg-slate-800/50 text-orange-400 rounded-xl border border-white/5 text-[9px] sm:text-xs font-bold shadow-sm">
                <Bot size={12} />
                Insights IA Ativos
              </div>
              <button 
                onClick={() => updateSettings('visual', 'showGoals', !plan.settings.visual.showGoals)}
                className="flex items-center gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl border border-white/5 bg-slate-800/50 text-orange-400 transition-all text-[9px] sm:text-xs font-bold shadow-sm hover:bg-slate-800"
              >
                <TrendingUp size={12} />
                {plan.settings.visual.showGoals ? 'Ocultar Metas' : 'Ver Metas'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* 1. Visitas de Trabalho */}
              <div className="card-custom p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-full flex-shrink-0 shadow-sm border border-indigo-100">
                      <Briefcase size={20} className="sm:size-[26px]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">Visitas de Trabalho</h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-100 text-green-700 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-wider">Concluído: {workStatus.concluido}</span>
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-wider">Agendado: {workStatus.agendado}</span>
                  </div>
                </div>
                
                <div className="h-[250px] w-full">
                  {workVisitsData && workVisitsData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={workVisitsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                        <ReTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                      </ReBarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium italic">"A intensidade das visitas no Rio de Janeiro está 20% acima da média mensal."</p>
              </div>

              {/* 2. Financeiro */}
              <div className="card-custom p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full flex-shrink-0 shadow-sm border border-emerald-100">
                      <Wallet size={18} className="sm:size-[22px]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">Financeiro</h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meta de Economia</p>
                    <p className="text-base sm:text-lg font-black text-emerald-600">{economyRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 h-[250px]">
                  <div className="w-full h-full">
                    {financialPieData && financialPieData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={financialPieData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {financialPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="w-full h-full">
                    {financialLineData && financialLineData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={financialLineData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <ReTooltip />
                          <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={3} dot={false} />
                        </ReLineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Metas e Performance */}
              {plan.settings.visual.showGoals && (
                <div className="card-custom p-6 space-y-6 lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-amber-50 text-amber-600 rounded-full flex-shrink-0 shadow-sm border border-amber-100">
                        <TrendingUp size={22} />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight">Metas e Performance Comercial</h2>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meta Mensal</p>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-lg font-black text-amber-600">R$</span>
                          <input 
                            type="number"
                            value={plan.financial.monthlyGoal}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setPlan(prev => ({
                                ...prev,
                                financial: {
                                  ...prev.financial,
                                  monthlyGoal: val
                                }
                              }));
                            }}
                            className="bg-transparent border-b border-dashed border-amber-600/50 text-lg font-black text-amber-600 w-24 text-right focus:outline-none focus:border-amber-600"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Realizado</p>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-lg font-black text-emerald-600">R$</span>
                          <input 
                            type="number"
                            value={plan.financial.manualRealized || 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setPlan(prev => ({
                                ...prev,
                                financial: {
                                  ...prev.financial,
                                  manualRealized: val
                                }
                              }));
                            }}
                            className="bg-transparent border-b border-dashed border-emerald-600/50 text-lg font-black text-emerald-600 w-24 text-right focus:outline-none focus:border-emerald-600"
                          />
                          <button
                            onClick={() => {
                              localStorage.setItem('pedro_planner_data_v3', JSON.stringify(plan));
                              alert('Valor realizado atualizado com sucesso!');
                            }}
                            className="ml-1 p-1.5 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Atualizar realizado"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="h-[200px] flex items-center justify-center relative">
                      {salesProgressData && salesProgressData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" 
                            cy="100%" 
                            innerRadius="80%" 
                            outerRadius="120%" 
                            barSize={20} 
                            data={salesProgressData} 
                            startAngle={180} 
                            endAngle={0}
                          >
                            <RadialBar
                              background
                              dataKey="value"
                              cornerRadius={10}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      )}
                      <div className="absolute bottom-4 text-center">
                        <p className="text-3xl font-black">{salesPercentage}%</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">da meta atingida</p>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider opacity-60">Status do Funil</span>
                          <span className="text-xs font-bold text-blue-500">Próximo de fechar</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${salesPercentage}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Diferença</p>
                          <p className="text-xl font-black text-red-500">R$ {(salesGoalValue - currentSales).toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Previsão Fechamento</p>
                          <input 
                            type="text"
                            value={plan.professional.closingForecast || ''}
                            onChange={(e) => setPlan(prev => ({
                              ...prev,
                              professional: {
                                ...prev.professional,
                                closingForecast: e.target.value
                              }
                            }))}
                            placeholder="Data..."
                            className="bg-transparent border-none focus:ring-0 p-0 text-xl font-black text-emerald-600 w-full outline-none"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          localStorage.setItem('pedro_planner_data_v3', JSON.stringify(plan));
                          alert('Meta e Previsão de Fechamento salvas com sucesso! A contagem foi iniciada.');
                        }}
                        className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md mt-2"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      >
                        <Save size={14} />
                        SALVAR METAS
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Agenda & Calendário */}
              <div className="card-custom p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full flex-shrink-0 shadow-sm border border-blue-100">
                      <Calendar size={22} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Agenda & Calendário</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-500" />
                    <span className="text-sm font-bold">{productivityRate}% Produtividade</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {plan.calendar.events.slice(0, 3).map((event, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 flex flex-col items-center justify-center bg-white rounded-lg border shadow-sm">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{new Date(event.start).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                        <span className="text-sm font-black">{new Date(event.start).getDate()}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-bold">{event.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{new Date(event.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {event.location}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${event.status === 'concluido' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    </div>
                  ))}
                  {plan.calendar.events.length === 0 && (
                    <div className="text-center py-10 text-gray-400 italic text-sm">Nenhum evento sincronizado recentemente.</div>
                  )}
                </div>
              </div>

              {/* 4. Histórico de Visitas */}
              <div className="card-custom p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 shadow-sm border" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}>
                    <History size={22} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Histórico de Visitas</h2>
                </div>

                <div className="overflow-x-auto -mx-6 px-6 max-h-[220px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-sm min-w-[400px]">
                    <thead>
                      <tr className="opacity-40 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Data</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Cidade/SME</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Resultado</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Próximos Passos</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {plan.work.history.map((visit) => (
                        <tr key={visit.id} className="hover:bg-black/5 transition-colors">
                          <td className="py-3 opacity-60 text-xs">{new Date(visit.date).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3">
                            <p className="font-bold text-xs">{visit.city}</p>
                            <p className="text-[9px] opacity-40">{visit.secretariat}</p>
                          </td>
                          <td className="py-3 opacity-60 text-xs">{visit.result}</td>
                          <td className="py-3 font-medium text-xs" style={{ color: 'var(--accent-color)' }}>{visit.nextSteps}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => deleteWorkVisit(visit.id, 'history')} className="p-1 opacity-40 hover:opacity-100 hover:text-red-600">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {plan.work.history.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center opacity-40 italic text-xs">Nenhum histórico registrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 5. Insights com IA */}
            <div className="card-custom p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl shadow-blue-900/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Insights Inteligentes</h2>
                  <p className="text-blue-300/60 text-xs font-bold uppercase tracking-widest">Análise de Dados em Tempo Real</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={18} className="text-green-400" />
                    <h3 className="font-bold text-sm">Otimização de Rotas</h3>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">"Suas visitas em Niterói podem ser agrupadas na próxima terça-feira para economizar 15% em combustível."</p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet size={18} className="text-amber-400" />
                    <h3 className="font-bold text-sm">Alerta Financeiro</h3>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">"Os gastos com 'Alimentação' estão 12% acima do planejado para esta semana. Considere reduzir jantares externos."</p>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={18} className="text-blue-400" />
                    <h3 className="font-bold text-sm">Pico de Produtividade</h3>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">"Você conclui 80% das suas tarefas complexas entre 09:00 e 11:00. Reserve esse horário para o novo projeto."</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
      case 'professional': {
        const allPoints = [
          ...plan.work.history.map(v => ({ ...v, type: 'history' as const })),
          ...plan.work.scheduledVisits.map(v => ({ ...v, type: 'scheduled' as const })),
          ...plan.work.futurePlanning.map(v => ({ ...v, type: 'future' as const })),
          ...plan.work.routes.currentDestinations.map(d => ({ ...d, secretariat: d.label || d.address, city: d.address, type: 'route' as const }))
        ].filter(p => p.lat && p.lng);

        const polylinePoints: [number, number][] = plan.work.routes.currentDestinations
          .filter(d => d.lat && d.lng)
          .map(d => [d.lat!, d.lng!]);

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
            {/* Nova Seção: Área de Trabalho e Visitas */}
            <section className="card-custom p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                  <Calendar size={24} />
                </div>
                <h2 className="text-2xl font-bold">Área de Trabalho e Visitas</h2>
              </div>

              {/* Mapa Interativo */}
              <div className="p-3 lg:p-4 overflow-hidden border rounded-2xl" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 px-2 lg:px-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                      <Globe size={20} />
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold">Mapa Interativo</h2>
                  </div>
                  <button 
                    onClick={() => window.open(generateGoogleMapsUrl(plan.work.routes.currentDestinations), '_blank')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
                    style={{ backgroundColor: 'var(--accent-color)', boxShadow: `0 10px 15px -3px ${plan.settings.visual.accentColor}33` }}
                  >
                    <Navigation size={14} />
                    GERAR ROTA NO GOOGLE MAPS
                  </button>
                </div>
                <div className="h-[300px] lg:h-[450px] w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                  <MapContainer center={[-22.9068, -43.1729]} zoom={9} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {allPoints.map((point) => (
                      <Marker 
                        key={point.id} 
                        position={[point.lat!, point.lng!]} 
                        icon={getMarkerIcon(point.type === 'route' ? 'scheduled' : point.type)}
                      >
                        <Popup>
                          <div className="p-1">
                            <h4 className="font-bold m-0" style={{ color: 'var(--accent-color)' }}>{point.secretariat}</h4>
                            <p className="text-[10px] opacity-60 m-0 mb-1">{point.city}</p>
                            {point.type === 'scheduled' && <p className="text-[10px] font-bold m-0 text-amber-600">Agendado</p>}
                            {point.type === 'history' && <p className="text-[10px] font-bold m-0 text-emerald-600">Concluído</p>}
                            {point.type === 'future' && <p className="text-[10px] font-bold m-0 text-red-600">Pendente</p>}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    {polylinePoints.length > 1 && (
                      <Polyline positions={polylinePoints} color={plan.settings.visual.accentColor} weight={3} dashArray="5, 10" />
                    )}
                  </MapContainer>
                </div>
                <div className="flex flex-wrap gap-4 lg:gap-6 mt-4 px-2 lg:px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold opacity-40 uppercase">Concluído</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold opacity-40 uppercase">Agendado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold opacity-40 uppercase">Pendente</span>
                  </div>
                </div>
              </div>

              {/* Cards de Visitas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Agenda de Visitas */}
                <div className="card-custom p-5 lg:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                        <Calendar size={20} />
                      </div>
                      <h2 className="text-xl font-bold">Agenda</h2>
                    </div>
                    <button onClick={() => {
                      setAgendaCity('');
                      setAgendaSecretariat('');
                      setAgendaDate('');
                      setAgendaTime('');
                      setAgendaObservations('');
                      setIsEditMode(false);
                      setCriarNovaRota(false);
                      setOrigemRota('');
                      setDestinoRota('');
                      setIsAgendaModalOpen(true);
                    }} className="p-2 text-white rounded-full hover:opacity-90 transition-colors" style={{ backgroundColor: 'var(--accent-color)' }}>
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {plan.work.scheduledVisits.length === 0 && (
                      <p className="opacity-40 text-sm italic text-center py-4">Nenhuma visita agendada.</p>
                    )}
                    {plan.work.scheduledVisits.map((visit) => (
                      <div key={visit.id} className="p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-sm">{visit.secretariat}</h3>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--accent-color)' }}>{visit.city}</p>
                          </div>
                          <button onClick={() => deleteWorkVisit(visit.id, 'scheduled')} className="p-1 opacity-40 hover:opacity-100 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                          <div className="text-[10px] opacity-60">
                            <span className="block font-bold uppercase">Horário</span>
                            <span>{visit.date.includes('T') ? new Date(visit.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Não definido'}</span>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <button 
                              onClick={() => {
                                setActiveCompleteVisitId(visit.id);
                                setVisitResult(visit.result || '');
                                setVisitObservations(visit.observations || '');
                                setVisitNextSteps(visit.nextSteps || '');
                                setIsCompleteModalOpen(true);
                              }}
                              className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-colors w-full text-center"
                              style={{ backgroundColor: 'var(--accent-color)' }}
                            >
                              CONCLUIR
                            </button>
                            <button 
                              onClick={() => {
                                setAgendaCity(visit.city);
                                setAgendaSecretariat(visit.secretariat);
                                const parts = visit.date.split('T');
                                setAgendaDate(parts[0] || '');
                                setAgendaTime(parts[1] ? parts[1].substring(0, 5) : '');
                                setAgendaObservations(visit.observations || '');
                                setActiveEditVisitId(visit.id);
                                setIsEditMode(true);
                                setIsAgendaModalOpen(true);
                              }}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-lg border hover:opacity-80 transition-colors w-full text-center"
                              style={{ borderColor: 'var(--border-color)', color: 'var(--text-color)', backgroundColor: 'transparent' }}
                            >
                              EDITAR
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isAgendaModalOpen && (
                  <div className="modal-agenda">
                    <div className="modal-conteudo">
                      <h3>{isEditMode ? 'Editar Visita' : 'Adicionar Visita'}</h3>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={agendaCity}
                        onChange={(e) => setAgendaCity(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Secretaria ou Local"
                        value={agendaSecretariat}
                        onChange={(e) => setAgendaSecretariat(e.target.value)}
                      />
                      <label className="label-data">Data da visita:</label>
                      <input
                        type="date"
                        value={agendaDate}
                        onChange={(e) => setAgendaDate(e.target.value)}
                      />
                      <label className="label-hora">Horário da visita:</label>
                      <input
                        type="time"
                        value={agendaTime}
                        onChange={(e) => setAgendaTime(e.target.value)}
                      />
                      <label className="label-observacoes">Observações:</label>
                      <textarea
                        placeholder="Escreva aqui suas observações..."
                        value={agendaObservations}
                        onChange={(e) => setAgendaObservations(e.target.value)}
                        rows={4}
                      />
                      
                      {!isEditMode && (
                        <div className="opcao-rota">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={criarNovaRota}
                              onChange={() => setCriarNovaRota(!criarNovaRota)}
                            />
                            Criar nova rota para esta visita
                          </label>

                          {criarNovaRota && (
                            <div className="nova-rota-campos">
                              <input
                                type="text"
                                placeholder="Origem da rota"
                                value={origemRota}
                                onChange={(e) => setOrigemRota(e.target.value)}
                              />
                              <input
                                type="text"
                                placeholder="Destino da rota"
                                value={destinoRota}
                                onChange={(e) => setDestinoRota(e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="modal-botoes">
                        <button onClick={() => {
                          let finalDateStr = '';
                          if (agendaDate) {
                            finalDateStr = agendaTime ? `${agendaDate}T${agendaTime}` : agendaDate;
                          }
                          if (isEditMode) {
                            updateWorkVisit(activeEditVisitId, agendaCity, agendaSecretariat, finalDateStr, agendaObservations);
                          } else {
                            addWorkVisit(agendaCity, agendaSecretariat, finalDateStr, agendaObservations, criarNovaRota, origemRota, destinoRota);
                          }
                          setIsAgendaModalOpen(false);
                          setIsEditMode(false);
                          setCriarNovaRota(false);
                          setOrigemRota('');
                          setDestinoRota('');
                        }}>Salvar</button>
                        <button onClick={() => {
                          setIsAgendaModalOpen(false);
                          setIsEditMode(false);
                          setCriarNovaRota(false);
                          setOrigemRota('');
                          setDestinoRota('');
                        }}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}


                {isPlanningModalOpen && (
                  <div className="modal-planejamento">
                    <div className="modal-conteudo">
                      <h3>{isPlanningEditMode ? 'Editar Planejamento' : 'Adicionar Planejamento'}</h3>
                      <input
                        type="text"
                        placeholder="Título do Planejamento"
                        value={planningTitle}
                        onChange={(e) => setPlanningTitle(e.target.value)}
                      />
                      <textarea
                        placeholder="Descrição"
                        value={planningDescription}
                        onChange={(e) => setPlanningDescription(e.target.value)}
                        rows={3}
                      />
                      <label className="label-data">Data prevista:</label>
                      <input
                        type="date"
                        value={planningDate}
                        onChange={(e) => setPlanningDate(e.target.value)}
                      />
                      <div className="modal-botoes">
                        <button onClick={() => {
                          if (isPlanningEditMode) {
                            updateFuturePlanning(activeEditPlanningId, planningTitle, planningDescription, planningDate);
                          } else {
                            addFuturePlanning(planningTitle, planningDescription, planningDate);
                          }
                          setIsPlanningModalOpen(false);
                          setIsPlanningEditMode(false);
                        }}>Salvar</button>
                        <button onClick={() => {
                          setIsPlanningModalOpen(false);
                          setIsPlanningEditMode(false);
                        }}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}


                {isCompleteModalOpen && (
                  <div className="modal-agenda">
                    <div className="modal-conteudo">
                      <h3>Concluir Visita</h3>
                      <input
                        type="text"
                        placeholder="Resultado da reunião"
                        value={visitResult}
                        onChange={(e) => setVisitResult(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Observações"
                        value={visitObservations}
                        onChange={(e) => setVisitObservations(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Próximos passos"
                        value={visitNextSteps}
                        onChange={(e) => setVisitNextSteps(e.target.value)}
                      />
                      <div className="modal-botoes">
                        <button onClick={() => {
                          completeVisit(activeCompleteVisitId, visitResult, visitObservations, visitNextSteps);
                          setIsCompleteModalOpen(false);
                        }}>Salvar</button>
                        <button onClick={() => setIsCompleteModalOpen(false)}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Destinos */}
                <div className="card-custom p-5 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                      <MapPin size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Destinos</h2>
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    <input 
                      type="text"
                      placeholder="Cidade ou Secretaria..."
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddDestination()}
                      className="flex-grow bg-black/5 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none"
                    />
                    <button 
                      onClick={handleAddDestination}
                      className="p-2.5 rounded-xl text-white hover:opacity-90 transition-all shadow-lg"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const rotasVisitas = [
                        ...plan.work.scheduledVisits,
                        ...plan.work.history
                      ].filter(v => v.route_origin && v.route_destination);

                      if (rotasVisitas.length === 0) {
                        return <p className="text-xs opacity-40 text-center py-8 italic">Adicione destinos para planejar sua rota.</p>;
                      }

                      return rotasVisitas.map((item) => {
                        const rota = {
                          origem: item.route_origin || 'Origem não definida',
                          destino: item.route_destination || 'Destino não definido'
                        };
                        return (
                          <div key={item.id} className="card-destino p-4 bg-black/5 rounded-2xl border border-transparent hover:border-accent/20 transition-all group flex justify-between items-start">
                            <div>
                              <h4>{rota.origem} → {rota.destino}</h4>
                              <p className="detalhes-rota">Rota criada automaticamente a partir da visita</p>
                            </div>
                            <button 
                              onClick={async () => {
                                const { error } = await supabase
                                  .from('work_visits')
                                  .delete()
                                  .eq('id', item.id);

                                if (error) {
                                  console.error('Erro ao excluir rota:', error);
                                } else {
                                  setPlan(prev => ({
                                    ...prev,
                                    work: {
                                      ...prev.work,
                                      scheduledVisits: prev.work.scheduledVisits.filter(v => v.id !== item.id),
                                      history: prev.work.history.filter(v => v.id !== item.id)
                                    }
                                  }));
                                }
                              }}
                              className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {plan.work.routes.currentDestinations.length > 0 && (
                    <button 
                      onClick={saveRouteToHistory}
                      className="w-full mt-6 flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-2xl text-xs font-bold opacity-60 hover:opacity-100 hover:border-accent hover:text-accent transition-all"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <Save size={16} />
                      SALVAR ROTA NO HISTÓRICO
                    </button>
                  )}
                </div>

                {/* Planejamento & Otimização */}
                <div className="space-y-6 lg:space-y-8">
                  <div className="card-custom p-5 lg:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                          <Target size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Planejamento</h2>
                      </div>
                      <button onClick={() => {
                        setPlanningTitle('');
                        setPlanningDescription('');
                        setPlanningDate('');
                        setIsPlanningModalOpen(true);
                      }} className="p-2 text-white rounded-full hover:opacity-90 transition-colors" style={{ backgroundColor: '#f59e0b' }}>
                        <Plus size={20} />
                      </button>

                    </div>
                    <div className="space-y-3">
                      {plan.work.futurePlanning.length === 0 && (
                        <p className="text-xs opacity-40 text-center py-4 italic">Nenhum planejamento futuro.</p>
                      )}
                      {plan.work.futurePlanning.map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm">{item.secretariat}</h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                              item.priority === 'alta' ? 'bg-red-100 text-red-600' : 
                              item.priority === 'media' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-[10px] opacity-60 mt-1">{item.city}</p>
                          {item.scheduledDate && (
                            <p className="text-[10px] opacity-60 mt-1">Data prevista: {item.scheduledDate}</p>
                          )}
                          <div className="botoes-planejamento">
                            <button className="botao-editar" onClick={() => {
                              setPlanningTitle(item.city);
                              setPlanningDescription(item.secretariat);
                              setPlanningDate(item.scheduledDate || '');
                              setActiveEditPlanningId(item.id);
                              setIsPlanningEditMode(true);
                              setIsPlanningModalOpen(true);
                            }}>Editar</button>
                            <button className="botao-excluir" onClick={() => deleteFuturePlanning(item.id)}>Excluir</button>
                          </div>
                        </div>
                      ))}

                    </div>
                    <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-2 mb-2 text-amber-700">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Sugestão de Otimização</span>
                      </div>
                      <p className="text-[10px] text-amber-800/70 leading-relaxed">
                        Para hoje, sugerimos iniciar por <span className="font-bold">SME Rio</span> e seguir para <span className="font-bold">Niterói</span> para evitar o tráfego da Ponte Rio-Niterói após as 16h.
                      </p>
                    </div>
                  </div>

                  <div className="card-custom p-5 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                        <CheckSquare size={20} />
                      </div>
                      <h2 className="text-xl font-bold">Checklist</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      {[
                        { id: 'reviewProposals', label: 'Revisar propostas' },
                        { id: 'prepareMaterial', label: 'Preparar material' },
                        { id: 'registerFeedback', label: 'Registrar feedback' },
                        { id: 'scheduleFollowUp', label: 'Agendar follow-up' },
                      ].map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => toggleWorkChecklist(item.id as keyof DailyPlan['work']['checklist'])}
                          className="flex items-center justify-between p-3 rounded-xl border group cursor-pointer transition-all"
                          style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}
                        >
                          <span className="text-xs font-bold opacity-70">{item.label}</span>
                          {plan.work.checklist[item.id as keyof DailyPlan['work']['checklist']] ? 
                            <CheckCircle2 className="text-emerald-500" size={18} /> : 
                            <Circle className="opacity-20 group-hover:opacity-100" size={18} style={{ color: 'var(--accent-color)' }} />
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico de Visitas e Rotas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="card-custom p-5 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-color)' }}>
                      <History size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Histórico de Visitas</h2>
                  </div>
                  <div className="overflow-x-auto -mx-5 lg:mx-0 px-5 lg:px-0">
                    <table className="w-full text-left text-sm min-w-[500px]">
                      <thead>
                        <tr className="opacity-40 border-b" style={{ borderColor: 'var(--border-color)' }}>
                          <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Data</th>
                          <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Cidade/SME</th>
                          <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Resultado</th>
                          <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Próximos Passos</th>
                          <th className="pb-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        {plan.work.history.map((visit) => (
                          <tr key={visit.id} className="hover:bg-black/5 transition-colors">
                            <td className="py-3 opacity-60 text-xs">{new Date(visit.date).toLocaleDateString('pt-BR')}</td>
                            <td className="py-3">
                              <p className="font-bold text-xs">{visit.city}</p>
                              <p className="text-[9px] opacity-40">{visit.secretariat}</p>
                            </td>
                            <td className="py-3 opacity-60 text-xs">{visit.result}</td>
                            <td className="py-3 font-medium text-xs" style={{ color: 'var(--accent-color)' }}>{visit.nextSteps}</td>
                            <td className="py-3 text-right">
                              <button onClick={() => deleteWorkVisit(visit.id, 'history')} className="p-1 opacity-40 hover:opacity-100 hover:text-red-600">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {plan.work.history.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center opacity-40 italic text-xs">Nenhum histórico registrado.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-custom p-5 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-color)' }}>
                      <Navigation size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Histórico de Rotas</h2>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {plan.work.routes.history.length === 0 && (
                      <p className="text-xs opacity-40 text-center py-8 italic">Nenhuma rota salva.</p>
                    )}
                    {plan.work.routes.history.map((item) => (
                      <div key={item.id} className="p-4 bg-black/5 rounded-2xl border border-transparent hover:border-accent/20 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-sm font-bold">{item.name}</h4>
                            <p className="text-[10px] opacity-40">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <button 
                            onClick={() => excluirRota(item.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mb-3">
                          <p className="cidade-nome">
                            {item.destinations.map(d => d.label || d.address.split(',')[0]).join(' → ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setPlan(prev => ({
                              ...prev,
                              work: {
                                ...prev.work,
                                routes: {
                                  ...prev.work.routes,
                                  currentDestinations: [...item.destinations]
                                }
                              }
                            }))}
                            className="flex-grow py-2 bg-white text-slate-600 rounded-xl text-[10px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                          >
                            REUSAR ROTA
                          </button>
                          <button 
                            onClick={() => window.open(item.googleMapsUrl, '_blank')}
                            className="p-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-all"
                          >
                            <Navigation size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 2. Área Profissional */}
              <div className="card-custom p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                    <Briefcase size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Área Profissional</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest mb-4">Agenda do Dia</h3>
                    <ul className="space-y-3">
                      {plan.professional.agenda.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-3 rounded-xl text-sm border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest">Tarefas Prioritárias</h3>
                      <button onClick={() => addTask('professional')} className="hover:opacity-70 p-1 rounded-full transition-colors" style={{ color: 'var(--accent-color)' }}>
                        <Plus size={18} />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {plan.professional.priorityTasks.map((task) => (
                        <li 
                          key={task.id} 
                          onClick={() => toggleTask(task.id)}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group border border-transparent"
                          style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        >
                          {task.completed ? 
                            <CheckCircle2 className="text-green-500 shrink-0" size={20} /> : 
                            <Circle className="opacity-30 group-hover:opacity-100 shrink-0" size={20} style={{ color: 'var(--accent-color)' }} />
                          }
                          <span className={`text-sm font-medium ${task.completed ? 'line-through opacity-40' : ''}`}>
                            {task.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Metas e Networking */}
              <div className="card-custom p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                    <Target size={24} />
                  </div>
                  <h2 className="text-2xl font-bold">Metas e Networking</h2>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: `${plan.settings.visual.accentColor}08`, borderColor: `${plan.settings.visual.accentColor}20` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={14} style={{ color: 'var(--accent-color)' }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-color)' }}>Meta de Vendas</span>
                    </div>
                    <input 
                      value={plan.professional.salesGoals} 
                      onChange={(e) => updateProfessional('salesGoals', e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-lg font-bold mt-1"
                      placeholder="Defina sua meta..."
                    />
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Link size={14} className="opacity-40" />
                      <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Networking LinkedIn</span>
                    </div>
                    <input 
                      value={plan.professional.networking} 
                      onChange={(e) => updateProfessional('networking', e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-lg font-bold mt-1"
                      placeholder="Contatos ou ações..."
                    />
                  </div>
                  <div className="p-6 rounded-2xl border-l-4" style={{ backgroundColor: '#fef3c715', borderColor: '#f59e0b' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Insight do Dia</span>
                    </div>
                    <textarea 
                      value={plan.professional.insights} 
                      onChange={(e) => updateProfessional('insights', e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm italic leading-relaxed font-medium resize-none"
                      rows={4}
                      placeholder="Insights e observações..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Gatilho de Prestação de Conta */}
            <div className="card-custom p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Wallet size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Prestação de Contas</h2>
                  <p className="text-xs opacity-50 font-medium">Envio e armazenamento de notas fiscais corporativas</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('prestacao-de-contas')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-lg"
                style={{ backgroundColor: 'var(--accent-color)', boxShadow: `0 10px 15px -3px ${plan.settings.visual.accentColor}33` }}
              >
                <Camera size={14} />
                ABRIR PRESTAÇÃO DE CONTAS
              </button>
            </div>
          </motion.div>
        );
      }

      case 'financial': {
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-white/5">
              <span className="text-xs font-bold text-slate-300">Filtrar Período:</span>
              <select 
                value={filtroPeriodo} 
                onChange={(e) => setFiltroPeriodo(e.target.value as any)}
                className="select-periodo"
              >
                <option value="mes">Mensal</option>
                <option value="ano">Anual</option>
              </select>
            </div>
            {/* Financial Dashboard */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plan.financial.initialBalance ? (
                <div className="card-custom p-6">
                  <div className="flex items-center gap-2 opacity-40 mb-2">
                    <DollarSign size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Saldo Inicial</span>
                  </div>
                  <p className="text-xl font-black">R$ {plan.financial.initialBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              ) : null}
              <div className="p-6 rounded-3xl shadow-sm border" style={{ backgroundColor: '#10b98115', borderColor: '#10b98130' }}>
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <ArrowUpCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Entradas Hoje</span>
                </div>
                <p className="text-xl font-black text-emerald-500">R$ {dailyInflows.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-6 rounded-3xl shadow-sm border" style={{ backgroundColor: '#f43f5e15', borderColor: '#f43f5e30' }}>
                <div className="flex items-center gap-2 text-rose-500 mb-2">
                  <ArrowDownCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Saídas Hoje</span>
                </div>
                <p className="text-xl font-black text-rose-500">R$ {dailyOutflows.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-6 rounded-3xl shadow-sm border" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, borderColor: `${plan.settings.visual.accentColor}30` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--accent-color)' }}>
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Saldo Projetado</span>
                </div>
                <p className="text-xl font-black" style={{ color: 'var(--accent-color)' }}>
                  R$ {plan.financial.initialBalance ? projectedBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expense Table */}
              <div className="card-custom p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f43f5e15', color: '#f43f5e' }}><ArrowDownCircle size={20} /></div>
                    <h2 className="text-xl font-bold">Controle de Gastos</h2>
                  </div>
                  <button onClick={() => {
                    setFinancialValue('');
                    setFinancialCategory('');
                    setFinancialObservation('');
                    setIsExpenseModalOpen(true);
                  }} className="p-2 text-white rounded-full hover:opacity-90 transition-colors" style={{ backgroundColor: '#f43f5e' }}>
                    <Plus size={20} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="opacity-40 border-b" style={{ borderColor: 'var(--border-color)' }}>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Data</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Valor</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Categoria</th>
                        <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Obs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {filtradosDespesas.map((exp) => (
                        <tr key={exp.id} className="hover:bg-black/5 transition-colors">
                          <td className="py-3 opacity-60">{new Date(exp.date).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 font-bold text-rose-500">R$ {exp.value.toFixed(2)}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-color)' }}>{exp.category}</span>
                          </td>
                          <td className="py-3 opacity-40 italic">{exp.observation}</td>
                          <td className="py-3 text-right">
                            <button className="botao-excluir" onClick={() => deleteExpense(exp.id)}>
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revenue & Goals */}
              <div className="space-y-8">
                <div className="card-custom p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#10b98115', color: '#10b981' }}><ArrowUpCircle size={20} /></div>
                      <h2 className="text-xl font-bold">Receitas & Comissões</h2>
                    </div>
                    <button onClick={() => {
                      setFinancialValue('');
                      setFinancialCategory('');
                      setFinancialDate('');
                      setIsRevenueModalOpen(true);
                    }} className="p-2 text-white rounded-full hover:opacity-90 transition-colors" style={{ backgroundColor: '#10b981' }}>
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-2xl border" style={{ backgroundColor: '#10b98108', borderColor: '#10b98120' }}>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Recebido no Mês</span>
                        <p className="text-lg font-black text-emerald-600">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl border" style={{ backgroundColor: '#10b98108', borderColor: '#10b98120' }}>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2 block">Lista de Receitas</span>
                      <ul className="space-y-2">
                        {filtradosReceitas.map(r => (
                          <li key={r.id} className="flex justify-between items-center text-sm">
                            <span className="opacity-70">{r.description} ({r.status})</span>
                            <div className="flex items-center gap-2">
                              <span className={r.status === 'recebido' ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'}>
                                R$ {r.value.toFixed(2)}
                              </span>
                              <button className="botao-excluir" onClick={() => deleteRevenue(r.id)}>
                                🗑️
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>


                <div className="card-custom p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}><PiggyBank size={20} /></div>
                    <h2 className="text-xl font-bold">Meta de Economia</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold opacity-60">
                      <span>Progresso (20% das Comissões)</span>
                      <span>{Math.round(savingsProgress)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${savingsProgress}%` }}
                        className="h-full"
                        style={{ backgroundColor: 'var(--accent-color)' }}
                      />
                    </div>
                    <div className="p-4 rounded-2xl border flex items-start gap-3" style={{ backgroundColor: `${plan.settings.visual.accentColor}08`, borderColor: `${plan.settings.visual.accentColor}20` }}>
                      <AlertCircle className="shrink-0" size={18} style={{ color: 'var(--accent-color)' }} />
                      <p className="text-xs leading-relaxed">
                        Sugestão: Se guardar <span className="font-bold">R$ {((savingsGoalValue - currentSavings) / 5).toFixed(2)}</span> hoje, você alcança a meta mais rápido.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Reminders */}
              <div className="card-custom p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}><Clock size={20} /></div>
                  <h2 className="text-xl font-bold">Lembretes</h2>
                </div>
                <ul className="space-y-3">
                  {plan.financial.paymentReminders.map((rem) => (
                    <li 
                      key={rem.id} 
                      onClick={() => togglePaymentStatus(rem.id)}
                      className={`flex justify-between items-center p-4 rounded-2xl border cursor-pointer transition-all ${getPaymentStatusColor(rem)}`}
                    >
                      <div>
                        <p className="font-bold text-sm">{rem.description}</p>
                        <p className="text-[10px] opacity-70">Vence em: {new Date(rem.dueDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                      {rem.status === 'pago' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charts */}
              <div className="lg:col-span-2 card-custom p-8">
                <h2 className="text-xl font-bold mb-8">Indicadores Visuais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[300px]">
                  <div>
                    <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest mb-4 text-center">Gastos por Categoria</h3>
                    {pieData && pieData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest mb-4 text-center">Fluxo Mensal</h3>
                    {barData && barData.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-color)', opacity: 0.5 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-color)', opacity: 0.5 }} />
                          <ReTooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)' }} />
                          <Bar dataKey="valor" radius={[10, 10, 0, 0]}>
                            {barData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>


            {/* Modal para Adicionar Receita */}
            {isRevenueModalOpen && (
              <div className="modal-financeiro">
                <div className="modal-conteudo">
                  <h3>Adicionar Receita</h3>
                  <input
                    type="number"
                    placeholder="Valor"
                    value={financialValue}
                    onChange={(e) => setFinancialValue(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Categoria / Descrição"
                    value={financialCategory}
                    onChange={(e) => setFinancialCategory(e.target.value)}
                  />
                  <label className="label-data">Data de recebimento ou a receber:</label>
                  <input
                    type="date"
                    value={financialDate}
                    onChange={(e) => setFinancialDate(e.target.value)}
                  />
                  <div className="modal-botoes">
                    <button onClick={async () => {
                      const val = parseFloat(financialValue || "0");
                      if (val > 0 && financialCategory.trim()) {
                        await addRevenue(val, financialCategory, financialDate);
                        setIsRevenueModalOpen(false);
                      } else {
                        alert("Por favor, preencha o valor e a categoria.");
                      }
                    }}>Salvar</button>
                    <button onClick={() => setIsRevenueModalOpen(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}


            {/* Modal para Adicionar Gasto */}
            {isExpenseModalOpen && (
              <div className="modal-financeiro">
                <div className="modal-conteudo">
                  <h3>Adicionar Gasto</h3>
                  <input
                    type="number"
                    placeholder="Valor"
                    value={financialValue}
                    onChange={(e) => setFinancialValue(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Categoria"
                    value={financialCategory}
                    onChange={(e) => setFinancialCategory(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Observações"
                    value={financialObservation}
                    onChange={(e) => setFinancialObservation(e.target.value)}
                  />
                  <div className="modal-botoes">
                    <button onClick={async () => {
                      const val = parseFloat(financialValue || "0");
                      if (val > 0 && financialCategory.trim()) {
                        await addExpense(val, financialCategory as any, financialObservation);
                        setIsExpenseModalOpen(false);
                      } else {
                        alert("Por favor, preencha o valor e a categoria.");
                      }
                    }}>Salvar</button>
                    <button onClick={() => setIsExpenseModalOpen(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      }
      case 'prestacao-de-contas': {
        const meses = [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const baixarComprovante = (url: string) => {
          const link = document.createElement('a');
          link.href = url;
          link.download = url.split('/').pop() || 'comprovante';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        const filteredReceipts = mesSelecionado !== null
          ? receipts.filter((nota) => {
              const parts = nota.date.split('/');
              if (parts.length >= 2) {
                const month = parseInt(parts[1], 10) - 1; // 0-indexed month
                return month === mesSelecionado;
              }
              return false;
            })
          : [];

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
            <div className="card-custom p-8 text-white" style={{ backgroundColor: '#1e1e2f' }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Prestação de Contas</h3>
                    <p className="text-xs text-slate-400 font-medium">Gerencie e envie comprovantes fiscais</p>
                  </div>
                </div>
                {mesSelecionado !== null && (
                  <button 
                    onClick={() => setMesSelecionado(null)} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                  >
                    ← Voltar para as Pastas
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {!isCameraActive ? (
                  <button 
                    onClick={abrirCamera}
                    className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl transition-all hover:bg-slate-800/30 group bg-transparent text-left cursor-pointer"
                  >
                    <Camera size={32} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Tirar Foto da Nota</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 bg-black/35 rounded-3xl border border-slate-800 w-full">
                    <video id="receipt-video" autoPlay playsInline className="w-full h-40 bg-black rounded-2xl object-cover"></video>
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={tirarFoto}
                        className="flex-grow py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg"
                      >
                        CAPTURAR
                      </button>
                      <button 
                        onClick={fecharCamera}
                        className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all"
                      >
                        CANCELAR
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-3xl transition-all hover:bg-slate-800/30 group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUploadNota} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload size={32} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Enviar Nota Fiscal</span>
                </div>
              </div>

              {mesSelecionado === null ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pastas Mensais</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {meses.map((mes, index) => {
                      const count = receipts.filter(nota => {
                        const parts = nota.date.split('/');
                        if (parts.length >= 2) {
                          const month = parseInt(parts[1], 10) - 1;
                          return month === index;
                        }
                        return false;
                      }).length;

                      return (
                        <div 
                          key={index} 
                          onClick={() => setMesSelecionado(index)} 
                          className="card-mes p-6 rounded-lg text-center cursor-pointer hover:bg-[#2a2a3d] transition"
                        >
                          <h4 className="text-lg font-bold text-white">{mes}</h4>
                          <p className="text-xs text-gray-400 mt-2">{count} {count === 1 ? 'comprovante' : 'comprovantes'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Galeria de Comprovantes - {meses[mesSelecionado]} ({filteredReceipts.length})
                  </h4>
                  
                  {filteredReceipts.length === 0 ? (
                    <div className="p-8 border border-slate-800 rounded-2xl text-center text-slate-500 italic text-xs">
                      Nenhum comprovante armazenado em {meses[mesSelecionado]}.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredReceipts.map((nota) => (
                        <div key={nota.id} className="relative group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all shadow-sm">
                          <img 
                            src={nota.url} 
                            alt="Comprovante Fiscal" 
                            className="w-full h-28 object-cover cursor-pointer hover:opacity-80 transition" 
                            onClick={() => baixarComprovante(nota.url)}
                          />
                          <div className="p-2 bg-slate-900/90 flex flex-col gap-1">
                            <span className="text-[9px] text-slate-400 font-medium">{nota.date}</span>
                          </div>
                          <button 
                            onClick={() => removerNota(nota.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      }
      case 'personal': {
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
            {/* Saúde e Bem-Estar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-custom p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#f43f5e15', color: '#f43f5e' }}><Heart size={20} /></div>
                  <h3 className="text-lg font-bold">Saúde</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Exercícios</label>
                    <input 
                      type="text"
                      value={plan.personal.health.exercises}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, health: { ...prev.personal.health, exercises: e.target.value } } }))}
                      className="w-full mt-1 text-sm font-medium p-3 rounded-xl border-none focus:ring-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1">
                        <Droplets size={10} /> Água (L)
                      </label>
                      <input 
                        type="number"
                        step="0.5"
                        value={plan.personal.health.hydration}
                        onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, health: { ...prev.personal.health, hydration: parseFloat(e.target.value) } } }))}
                        className="w-full mt-1 text-sm font-medium p-3 rounded-xl border-none focus:ring-2"
                        style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1">
                        <Moon size={10} /> Sono (h)
                      </label>
                      <input 
                        type="number"
                        value={plan.personal.health.sleep}
                        onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, health: { ...prev.personal.health, sleep: parseInt(e.target.value) } } }))}
                        className="w-full mt-1 text-sm font-medium p-3 rounded-xl border-none focus:ring-2"
                        style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lazer & Família */}
              <div className="card-custom p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}><Coffee size={20} /></div>
                  <h3 className="text-lg font-bold">Família</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Atividade</label>
                    <input 
                      type="text"
                      value={plan.personal.leisureFamily.plannedActivity}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, leisureFamily: { ...prev.personal.leisureFamily, plannedActivity: e.target.value } } }))}
                      className="w-full mt-1 text-sm font-medium p-3 rounded-xl border-none focus:ring-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                    />
                  </div>
                  <div 
                    onClick={() => setPlan(prev => ({ ...prev, personal: { ...prev.personal, leisureFamily: { ...prev.personal.leisureFamily, qualityTimeNoPhone: !prev.personal.leisureFamily.qualityTimeNoPhone } } }))}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${plan.personal.leisureFamily.qualityTimeNoPhone ? 'border-accent' : 'border-transparent opacity-40'}`}
                    style={{ backgroundColor: plan.personal.leisureFamily.qualityTimeNoPhone ? `${plan.settings.visual.accentColor}10` : 'rgba(0,0,0,0.02)' }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Smartphone size={14} /> Sem Celular
                    </span>
                    {plan.personal.leisureFamily.qualityTimeNoPhone ? <CheckCircle2 size={18} style={{ color: 'var(--accent-color)' }} /> : <Circle size={18} />}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1">
                      <Camera size={10} /> Momentos
                    </label>
                    <input 
                      type="text"
                      value={plan.personal.leisureFamily.specialMoments}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, leisureFamily: { ...prev.personal.leisureFamily, specialMoments: e.target.value } } }))}
                      className="w-full mt-1 text-sm font-medium p-3 rounded-xl border-none focus:ring-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Futebol (Flamengo) */}
              <div className="card-custom p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#ef444415', color: '#ef4444' }}><Trophy size={20} /></div>
                  <h3 className="text-lg font-bold">Flamengo</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl border" style={{ backgroundColor: '#ef444408', borderColor: '#ef444420' }}>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Último Jogo</span>
                    <p className="text-sm font-bold text-red-600">{plan.personal.football.lastGame.result}</p>
                    <p className="text-[10px] text-red-500 italic mt-1">{plan.personal.football.lastGame.performance}</p>
                  </div>
                  <div className="p-3 rounded-xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Próximo Jogo</span>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm font-bold">vs {plan.personal.football.nextGame.opponent}</p>
                      <p className="text-[10px] opacity-40">{new Date(plan.personal.football.nextGame.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <textarea 
                    value={plan.personal.football.comments}
                    onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, football: { ...prev.personal.football, comments: e.target.value } } }))}
                    className="w-full text-xs font-medium p-3 rounded-xl border-none focus:ring-2 resize-none h-16"
                    style={{ backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-color)' }}
                    placeholder="Comentários sobre o Mengão..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Diário Pessoal */}
              <div className="card-custom p-8">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}><PenLine size={24} /></div>
                    <h2 className="text-2xl font-bold">Diário Pessoal</h2>
                  </div>
                  <button 
                    onClick={abrirAdicionarNota}
                    className="px-4 py-2 text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:opacity-90 transition-all bg-accent"
                  >
                    <Plus size={16} /> Nova Anotação
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {anotacoes.length === 0 ? (
                    <p className="text-sm font-medium opacity-55 text-center py-8">Nenhuma anotação registrada. Clique em "Nova Anotação" para começar.</p>
                  ) : (
                    anotacoes.map((anotacao) => (
                      <div key={anotacao.id} className="card-anotacao p-4 rounded-2xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                        <h4 className="font-bold text-base">{anotacao.titulo}</h4>
                        <p className="text-sm mt-2 whitespace-pre-wrap opacity-80">{anotacao.conteudo}</p>
                        <div className="botoes-anotacao">
                          <button className="botao-editar" onClick={() => editarAnotacao(anotacao.id)}>Editar</button>
                          <button className="botao-excluir" onClick={() => excluirAnotacao(anotacao.id)}>Excluir</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Churrasco & Gastronomia */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Utensils size={24} /></div>
                  <h2 className="text-2xl font-bold text-gray-800">Churrasco & Gastronomia</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lista de Compras</label>
                      <button 
                        onClick={() => {
                          const novoItem = prompt("Digite o nome do novo item:");
                          if (novoItem && novoItem.trim() !== "") {
                            setPlan(prev => ({
                              ...prev,
                              personal: {
                                ...prev.personal,
                                bbqGastronomy: {
                                  ...prev.personal.bbqGastronomy,
                                  shoppingList: [...prev.personal.bbqGastronomy.shoppingList, novoItem.trim()]
                                }
                              }
                            }));
                          }
                        }}
                        className="text-orange-600 hover:bg-orange-50 p-1 rounded-full transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.personal.bbqGastronomy.shoppingList.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100 flex items-center gap-2">
                          {item}
                          <button 
                            onClick={() => setPlan(prev => ({ ...prev, personal: { ...prev.personal, bbqGastronomy: { ...prev.personal.bbqGastronomy, shoppingList: prev.personal.bbqGastronomy.shoppingList.filter((_, i) => i !== idx) } } }))}
                            className="hover:text-orange-900"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Flame size={10} /> Temperos & Receitas
                    </label>
                    <textarea 
                      value={plan.personal.bbqGastronomy.recipesSeasoning}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, bbqGastronomy: { ...prev.personal.bbqGastronomy, recipesSeasoning: e.target.value } } }))}
                      className="w-full mt-2 text-sm font-medium text-gray-700 bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-200 resize-none h-24"
                      placeholder="Ideias de temperos, acompanhamentos..."
                    />
                  </div>
                  <div className="bg-orange-600 p-4 rounded-2xl text-white shadow-lg shadow-orange-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Agenda de Churrascos</span>
                    <input 
                      type="text"
                      value={plan.personal.bbqGastronomy.bbqSchedule}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, bbqGastronomy: { ...prev.personal.bbqGastronomy, bbqSchedule: e.target.value } } }))}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-bold placeholder:text-white/50 mt-1"
                      placeholder="Quando será o próximo?"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Investimentos */}
            <div className="card-custom p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#10b98115', color: '#10b981' }}><LineChart size={24} /></div>
                <h2 className="text-2xl font-bold">Investimentos</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl border" style={{ backgroundColor: '#10b98108', borderColor: '#10b98120' }}>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Aporte do Dia</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-emerald-700">R$</span>
                      <input 
                        type="number"
                        value={plan.personal.investments.dailyContributions}
                        onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, investments: { ...prev.personal.investments, dailyContributions: parseFloat(e.target.value) } } }))}
                        className="bg-transparent border-none focus:ring-0 p-0 text-2xl font-black text-emerald-700 w-full"
                      />
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Meta Mensal</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold opacity-60">R$</span>
                      <input 
                        type="number"
                        value={plan.personal.investments.monthlyGoal}
                        onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, investments: { ...prev.personal.investments, monthlyGoal: parseFloat(e.target.value) } } }))}
                        className="bg-transparent border-none focus:ring-0 p-0 text-2xl font-black w-full"
                        style={{ color: 'var(--text-color)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                  <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest mb-6">Alocação de Carteira (%)</h3>
                  <div className="space-y-4">
                    {['stocks', 'funds', 'fixedIncome'].map((key) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-bold opacity-60 mb-1">
                          <span className="capitalize">{key === 'stocks' ? 'Ações' : key === 'funds' ? 'Fundos' : 'Renda Fixa'}</span>
                          <span>{plan.personal.investments.portfolio[key as keyof typeof plan.personal.investments.portfolio]}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={plan.personal.investments.portfolio[key as keyof typeof plan.personal.investments.portfolio]}
                          onChange={(e) => setPlan(prev => ({ 
                            ...prev, 
                            personal: { 
                              ...prev.personal, 
                              investments: { 
                                ...prev.personal.investments, 
                                portfolio: { 
                                  ...prev.personal.investments.portfolio, 
                                  [key]: parseInt(e.target.value) 
                                } 
                              } 
                            } 
                          }))}
                          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                          style={{ backgroundColor: 'rgba(0,0,0,0.05)', accentColor: 'var(--accent-color)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-600 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-center group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={16} className="text-emerald-200" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Insight Financeiro</span>
                    </div>
                    <textarea 
                      value={plan.personal.investments.financialInsight}
                      onChange={(e) => setPlan(prev => ({ ...prev, personal: { ...prev.personal, investments: { ...prev.personal.investments, financialInsight: e.target.value } } }))}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold leading-tight italic placeholder:text-white/30 resize-none h-20"
                      placeholder="Sua frase motivacional financeira..."
                    />
                  </div>
                  <TrendingUp className="absolute -bottom-4 -right-4 text-emerald-500/20 group-hover:scale-110 transition-transform duration-500" size={120} />
                </div>
              </div>

              {/* Investment Progress */}
              <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Progresso da Meta Mensal</span>
                  <span className="text-xs font-bold text-emerald-700">
                    {Math.min(100, Math.round((plan.personal.investments.dailyContributions / (plan.personal.investments.monthlyGoal || 1)) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-emerald-200/50 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (plan.personal.investments.dailyContributions / (plan.personal.investments.monthlyGoal || 1)) * 100)}%` }}
                    className="bg-emerald-600 h-full"
                  />
                </div>
                <p className="text-[10px] text-emerald-600 mt-2 font-medium">
                  {plan.personal.investments.dailyContributions >= plan.personal.investments.monthlyGoal 
                    ? "🚀 Meta atingida! Continue assim, Pedro!" 
                    : `Faltam R$ ${(plan.personal.investments.monthlyGoal - plan.personal.investments.dailyContributions).toLocaleString('pt-BR')} para sua meta.`}
                </p>
              </div>
            </div>

            {/* Modal para Adicionar/Editar Anotação */}
            {modalAberto && (
              <div className="modal-financeiro">
                <div className="modal-conteudo">
                  <h3>{anotacaoEditando ? 'Editar Anotação' : 'Nova Anotação'}</h3>
                  <input
                    type="text"
                    placeholder="Título"
                    value={tituloAnotacao}
                    onChange={(e) => setTituloAnotacao(e.target.value)}
                  />
                  <textarea
                    placeholder="Conteúdo..."
                    value={conteudoAnotacao}
                    onChange={(e) => setConteudoAnotacao(e.target.value)}
                    rows={6}
                    style={{ minHeight: '150px' }}
                  />
                  <div className="modal-botoes">
                    <button onClick={salvarAnotacao}>Salvar</button>
                    <button onClick={() => setModalAberto(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );
      }
      case 'calendar': {
        const mappedEventos = eventos.map(e => ({
          id: String(e.id),
          title: e.titulo,
          start: e.data && e.horaInicio ? `${e.data}T${e.horaInicio}:00` : new Date().toISOString(),
          end: e.data && e.horaFim ? `${e.data}T${e.horaFim}:00` : (e.data && e.horaInicio ? `${e.data}T${e.horaInicio}:00` : new Date().toISOString()),
          location: e.local,
          source: 'planner' as const
        }));
        const allEvents = [...plan.calendar.events, ...mappedEventos];
        const sortedEvents = allEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
            <div className="card-custom p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.settings.visual.accentColor}15`, color: 'var(--accent-color)' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Calendário Integrado</h2>
                    <p className="text-xs opacity-50 font-medium">Sincronização com Google Calendar</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex bg-black/5 p-1 rounded-xl">
                    {(['day', 'week', 'month'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setCalendarView(v)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${calendarView === v ? 'bg-white shadow-sm' : 'opacity-40'}`}
                        style={{ color: calendarView === v ? 'var(--accent-color)' : 'var(--text-color)' }}
                      >
                        {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
                      </button>
                    ))}
                  </div>

                  {!plan.calendar.googleTokens ? (
                    <button 
                      onClick={handleGoogleAuth}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <Globe size={16} className="text-blue-500" />
                      <span>Conectar Google</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => syncGoogleCalendar()}
                        className="p-2 bg-black/5 rounded-xl hover:bg-black/10 transition-all"
                        title="Sincronizar agora"
                      >
                        <RefreshCw size={16} className="opacity-60" />
                      </button>
                      <button 
                        onClick={() => setPlan(prev => ({ ...prev, calendar: { ...prev.calendar, googleTokens: null } }))}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                      >
                        <LogOut size={16} />
                        <span>Desconectar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {plan.calendar.googleTokens && plan.calendar.lastSync && (
                <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl w-fit">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Última sincronização: {new Date(plan.calendar.lastSync).toLocaleTimeString()}
                  </span>
                </div>
              )}

              <button onClick={loginGoogle} className="botao-google">
                🔄 Sincronizar Google Calendar
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">Eventos de Hoje</h3>
                    <button 
                      onClick={abrirModalEvento}
                      className="botao-adicionar p-2 rounded-xl flex items-center justify-center font-bold text-lg leading-none" 
                      style={{ backgroundColor: 'var(--accent-color)', color: 'white', width: '36px', height: '36px' }}
                    >
                      +
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sortedEvents.length === 0 ? (
                      <div className="p-12 border-2 border-dashed border-black/5 rounded-3xl flex flex-col items-center justify-center text-center">
                        <Calendar size={48} className="opacity-10 mb-4" />
                        <p className="text-sm font-bold opacity-30">Nenhum evento agendado para hoje.</p>
                      </div>
                    ) : (
                      sortedEvents.map((event) => (
                        <div 
                          key={event.id}
                          className="group flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-md"
                          style={{ backgroundColor: 'rgba(0,0,0,0.01)', borderColor: 'var(--border-color)' }}
                        >
                          <div className="flex flex-col items-center min-w-[60px] py-1 px-2 rounded-xl bg-black/5">
                            <span className="text-[10px] font-black opacity-40 uppercase">{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <div className="w-full h-[1px] bg-black/5 my-1" />
                            <span className="text-[10px] font-black opacity-40 uppercase">{new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg">{event.title}</h4>
                              <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded ${event.source === 'google' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {event.source === 'google' ? 'Google' : 'Planner'}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs opacity-50 mb-2">
                                <Globe size={12} />
                                <a 
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {event.location}
                                </a>
                              </div>
                            )}
                            {event.description && <p className="text-xs opacity-60 line-clamp-2">{event.description}</p>}
                          </div>

                          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            {event.source === 'google' && (
                              <a 
                                href={`https://calendar.google.com/calendar/u/0/r/eventedit/${event.googleEventId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                title="Abrir no Google Calendar"
                              >
                                <Globe size={14} />
                              </a>
                            )}
                            <button 
                              onClick={() => deleteCalendarEvent(event.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                              title="Excluir evento"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-3xl border" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderColor: 'var(--border-color)' }}>
                    <h3 className="text-xs font-bold opacity-40 uppercase tracking-widest mb-6">Resumo Semanal</h3>
                    <div className="space-y-4">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, i) => (
                        <div key={day} className="flex items-center gap-3">
                          <span className="text-[10px] font-black opacity-30 w-8">{day}</span>
                          <div className="flex-grow h-2 bg-black/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                backgroundColor: 'var(--accent-color)', 
                                width: `${Math.random() * 80 + 10}%`,
                                opacity: i === new Date().getDay() - 1 ? 1 : 0.3
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-center group" style={{ backgroundColor: 'var(--accent-color)' }}>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={16} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Dica de Produtividade</span>
                      </div>
                      <p className="text-lg font-bold leading-tight italic">
                        "Sincronize seu calendário para ter uma visão 360º do seu dia e evitar conflitos de agenda."
                      </p>
                    </div>
                    <Calendar className="absolute -bottom-4 -right-4 opacity-20 group-hover:scale-110 transition-transform duration-500" size={120} />
                  </div>
                </div>
              </div>
            </div>

            {/* Novo calendário visual */}
            <div className="calendario-visual">
              <div className="flex items-center justify-between mb-6">
                <h4>Visualização de Calendário</h4>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="p-2 bg-black/5 rounded-xl hover:bg-black/10 transition-all font-bold text-xs"
                    style={{ color: 'var(--text-color)' }}
                  >
                    &lt;
                  </button>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="p-2 bg-black/5 rounded-xl hover:bg-black/10 transition-all font-bold text-xs"
                    style={{ color: 'var(--text-color)' }}
                  >
                    &gt;
                  </button>
                </div>
              </div>

              <div className="grid-calendario">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                  <span key={d} className="dia-semana">{d}</span>
                ))}
                
                {getDaysInMonth(currentMonth).map((day, idx) => {
                  const isSelected = day.date.toDateString() === dataSelecionada.toDateString();
                  const isCurrentMonth = day.isCurrentMonth;
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const hasEvents = allEvents.some(event => {
                    const eventDate = new Date(event.start).toDateString();
                    return eventDate === day.date.toDateString();
                  });

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setDataSelecionada(day.date);
                        abrirEventosOuAnotacoes(day.date);
                      }}
                      className={`dia-calendario ${isSelected ? 'ativo' : ''} ${isToday ? 'hoje' : ''} ${!isCurrentMonth ? 'outro-mes' : ''} ${hasEvents ? 'dia-com-evento' : ''}`}
                    >
                      {day.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal para Adicionar Novo Evento */}
            {isEventModalOpen && (
              <div className="modal-evento">
                <div className="icone-agenda">🗓️</div>
                <h3>Adicionar Novo Evento</h3>
                <input 
                  type="text" 
                  placeholder="Título do evento" 
                  value={titulo} 
                  onChange={(e) => setTitulo(e.target.value)} 
                />
                <label className="label-data">Data</label>
                <input 
                  type="date" 
                  value={data} 
                  onChange={(e) => setData(e.target.value)} 
                />
                <label className="label-hora">Hora de Início</label>
                <input 
                  type="time" 
                  value={horaInicio} 
                  onChange={(e) => setHoraInicio(e.target.value)} 
                />
                <label className="label-hora">Hora de Fim</label>
                <input 
                  type="time" 
                  value={horaFim} 
                  onChange={(e) => setHoraFim(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Local" 
                  value={local} 
                  onChange={(e) => setLocal(e.target.value)} 
                />
                <textarea
                  placeholder="Anotações pessoais, ideias ou lembretes..."
                  value={anotacoesEvento}
                  onChange={(e) => setAnotacoesEvento(e.target.value)}
                  className="campo-anotacoes"
                />
                <div className="modal-botoes">
                  <button onClick={salvarEvento}>Salvar</button>
                  <button onClick={() => setIsEventModalOpen(false)}>Cancelar</button>
                </div>
              </div>
            )}

            {isModalDiaAberto && (
              <div className="modal-dia">
                <h3>Informações de {dataSelecionada.toLocaleDateString('pt-BR')}</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                  {itensSelecionados.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.6, fontSize: '13px', margin: '20px 0' }}>Nenhum evento ou anotação para este dia.</p>
                  ) : (
                    itensSelecionados.map((item) => (
                      <div key={item.id} className="card-dia">
                        <h4>{item.titulo}</h4>
                        {item.type === 'evento' ? (
                          <>
                            {item.horaInicio && <p><strong>Horário:</strong> {item.horaInicio} {item.horaFim ? ` - ${item.horaFim}` : ''}</p>}
                            {item.local && <p><strong>Local:</strong> {item.local}</p>}
                          </>
                        ) : (
                          <p><strong>Anotação:</strong> {item.conteudo}</p>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="modal-botoes" style={{ gap: '10px' }}>
                  <button 
                    onClick={() => {
                      setIsModalDiaAberto(false);
                      const formattedDate = dataSelecionada.getFullYear() + '-' + String(dataSelecionada.getMonth() + 1).padStart(2, '0') + '-' + String(dataSelecionada.getDate()).padStart(2, '0');
                      setData(formattedDate);
                      setTitulo('');
                      setHoraInicio('');
                      setHoraFim('');
                      setLocal('');
                      setIsEventModalOpen(true);
                    }}
                    style={{ backgroundColor: 'var(--accent-color)' }}
                  >
                    Adicionar Evento
                  </button>
                  <button onClick={() => setIsModalDiaAberto(false)}>Fechar</button>
                </div>
              </div>
            )}
          </motion.div>
        );
      }

      case 'settings': {
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Settings size={24} /></div>
              <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
            </div>
            <p className="text-gray-500 text-sm">Personalize sua experiência e gerencie sua conta.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Personalização Visual */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Palette size={20} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-800">Personalização Visual</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tema de Fundo</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Light', 'Dark', 'Deep Black', 'Navy Blue'].map((t) => (
                        <button
                          key={t}
                          onClick={() => updateSettings('visual', 'theme', t)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            plan.settings.visual.theme === t 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                              : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Cor de Destaque</label>
                    <div className="flex flex-wrap gap-3">
                      {['#3b82f6', '#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'].map((color) => (
                        <button
                          key={color}
                          onClick={() => updateSettings('visual', 'accentColor', color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            plan.settings.visual.accentColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arredondamento dos Cards</label>
                      <span className="text-xs font-bold text-gray-600">{plan.settings.visual.borderRadius}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      value={plan.settings.visual.borderRadius}
                      onChange={(e) => updateSettings('visual', 'borderRadius', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Fonte do Sistema</label>
                      <select 
                        value={plan.settings.visual.fontFamily}
                        onChange={(e) => updateSettings('visual', 'fontFamily', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Inter">Inter (Padrão)</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Outfit">Outfit</option>
                        <option value="JetBrains Mono">JetBrains Mono</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Layout</label>
                      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button 
                          onClick={() => updateSettings('visual', 'layout', 'compacto')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${plan.settings.visual.layout === 'compacto' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                          COMPACTO
                        </button>
                        <button 
                          onClick={() => updateSettings('visual', 'layout', 'espaçado')}
                          className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${plan.settings.visual.layout === 'espaçado' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                          ESPAÇADO
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <TrendingUp size={18} className="text-amber-500" />
                        <span className="text-xs font-bold text-gray-700">Exibir Metas no Dashboard</span>
                      </div>
                      <button 
                        onClick={() => updateSettings('visual', 'showGoals', !plan.settings.visual.showGoals)}
                        className={`w-10 h-5 rounded-full transition-all relative ${plan.settings.visual.showGoals ? 'bg-amber-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${plan.settings.visual.showGoals ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Perfil e Segurança */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={20} className="text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-800">Perfil e Segurança</h3>
                </div>

                <div className="space-y-8">
                  {/* 1. Segurança Avançada */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1. Segurança Avançada</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Shield size={18} className="text-emerald-500" />
                          <span className="text-xs font-bold text-gray-700">Autenticação 2FA</span>
                        </div>
                        <button 
                          onClick={() => updateSettings('profile', 'twoFactorEnabled', !plan.settings.profile.twoFactorEnabled)}
                          className={`w-10 h-5 rounded-full transition-all relative ${plan.settings.profile.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${plan.settings.profile.twoFactorEnabled ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <button className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-all">
                        <RefreshCw size={14} /> ATUALIZAR SENHA
                      </button>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Controle de Notificações</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['popup', 'email', 'sound'].map((type) => (
                          <button
                            key={type}
                            onClick={() => updateSettings('profile', 'notifications', { ...plan.settings.profile.notifications, [type]: !plan.settings.profile.notifications[type as keyof typeof plan.settings.profile.notifications] })}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                              plan.settings.profile.notifications[type as keyof typeof plan.settings.profile.notifications]
                                ? 'bg-white border-blue-200 text-blue-600 shadow-sm'
                                : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            {type === 'popup' ? <Maximize size={16} /> : type === 'email' ? <Link size={16} /> : <Bell size={16} />}
                            <span className="text-[9px] font-bold uppercase">{type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if(confirm("Deseja realmente encerrar a sessão?")) {
                          // In a real app, this would clear session. Here we just reset to initial state.
                          setPlan(INITIAL_PLAN);
                          setActiveTab('professional');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold hover:bg-red-100 transition-all"
                    >
                      <LogOut size={18} /> ENCERRAR SESSÃO ATUAL
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Informações do Sistema */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Info size={20} className="text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-800">Informações do Sistema</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Versão</p>
                      <p className="text-lg font-black text-indigo-900">v{plan.settings.system.version}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Status DB</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-lg font-black text-emerald-900 uppercase">{plan.settings.system.dbStatus}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Armazenamento</span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{plan.settings.system.storageType}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[15%]" />
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2">1.2MB de 10MB utilizados (Local Cache)</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Changelog Recente</label>
                    <div className="space-y-3">
                      {plan.settings.system.changelog.map((log, i) => (
                        <div key={i} className="border-l-2 border-indigo-100 pl-4 py-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-800">v{log.version}</span>
                            <span className="text-[9px] text-gray-400">{log.date}</span>
                          </div>
                          <ul className="space-y-0.5">
                            {log.changes.map((change, j) => (
                              <li key={j} className="text-[10px] text-gray-500 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-indigo-300" /> {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Outras Integrações */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Link size={20} className="text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-800">Outras Integrações</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'linkedin', label: 'LinkedIn', icon: Globe, color: 'text-blue-700', bg: 'bg-blue-50' },
                    { id: 'supabase', label: 'Supabase DB', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { id: 'whatsappBusiness', label: 'WhatsApp Biz', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
                  ].map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}><item.icon size={18} /></div>
                        <span className="text-xs font-bold text-gray-700">{item.label}</span>
                      </div>
                      <button 
                        onClick={() => updateSettings('integrations', item.id, !plan.settings.integrations[item.id as keyof DailyPlan['settings']['integrations']])}
                        className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${
                          plan.settings.integrations[item.id as keyof DailyPlan['settings']['integrations']]
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                      >
                        {plan.settings.integrations[item.id as keyof DailyPlan['settings']['integrations']] ? 'ATIVO' : 'CONECTAR'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Configurações Avançadas */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={20} className="text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">Configurações Avançadas</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-3">
                      <Bot size={18} className="text-orange-600" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">Notificações Inteligentes IA</p>
                        <p className="text-[10px] text-gray-400">Insights proativos baseados no seu dia.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => updateSettings('advanced', 'aiNotifications', !plan.settings.advanced.aiNotifications)}
                      className={`w-10 h-5 rounded-full transition-all relative ${plan.settings.advanced.aiNotifications ? 'bg-orange-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${plan.settings.advanced.aiNotifications ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all group">
                      <Download size={20} className="text-gray-400 group-hover:text-blue-600" />
                      <span className="text-[10px] font-bold text-gray-600">EXPORTAR BACKUP</span>
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm("Isso limpará todos os dados do dia atual. Continuar?")) {
                          setPlan({ ...INITIAL_PLAN, date: plan.date });
                        }
                      }}
                      className="flex flex-col items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-all group"
                    >
                      <RefreshCw size={20} className="text-red-400 group-hover:text-red-600" />
                      <span className="text-[10px] font-bold text-red-600">RESETAR PLANNER</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Área Premium */}
              <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-400 text-slate-900 rounded-lg"><Crown size={20} /></div>
                    <h3 className="text-lg font-bold text-white">Área Premium</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <LineChart size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Estatísticas Avançadas</p>
                        <p className="text-[10px] text-slate-400">Análise mensal de performance e ROI.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Insights Personalizados IA</p>
                        <p className="text-[10px] text-slate-400">Mentoria exclusiva para vendas públicas.</p>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-amber-400 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20">
                      UPGRADE PARA PRO
                    </button>
                  </div>
                </div>
                <Crown size={150} className="absolute -bottom-10 -right-10 text-slate-800 opacity-50" />
              </div>
            </div>
          </motion.div>
        );
      }
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex transition-colors duration-500 relative overflow-x-hidden" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}>
      <style>{dynamicStyles}</style>
      
      {/* Sidebar Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[1200] w-72 border-r transform transition-all duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: 'var(--accent-color)', boxShadow: `0 10px 15px -3px ${plan.settings.visual.accentColor}33` }}
            >
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none" style={{ color: 'var(--text-color)' }}>PEDRO</h1>
              <p className="text-[10px] font-bold tracking-widest uppercase opacity-60" style={{ color: 'var(--accent-color)' }}>Planner Diário</p>
            </div>
          </div>

          <nav className="flex-grow space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'shadow-sm' 
                    : 'opacity-40 hover:opacity-100 hover:bg-black/5'
                }`}
                style={{ 
                  backgroundColor: activeTab === tab.id ? `${plan.settings.visual.accentColor}15` : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-color)'
                }}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-color)' }} />
                )}
              </button>
            ))}
          </nav>

          {localizacao && (
            <div className="mt-6 mb-6 p-4 rounded-2xl bg-black/5 border border-white/5 text-xs">
              <div className="flex items-center gap-2 mb-2 font-bold opacity-60">
                <MapPin size={14} style={{ color: 'var(--accent-color)' }} />
                <span>Sua Localização</span>
              </div>
              {cidade && <p className="opacity-90 font-bold mb-1 text-sm">{cidade}</p>}
              <p className="opacity-80 font-medium mb-3">Lat: {localizacao.latitude.toFixed(4)}, Lon: {localizacao.longitude.toFixed(4)}</p>
              {clima && (
                <div className="painel-clima">
                  <p><strong>Tempo agora:</strong></p>
                  <p>{clima.temperatura}°C - {clima.condicao}</p>
                </div>
              )}
            </div>
          )}


          <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button 
              onClick={() => {
                if(confirm("Deseja resetar o planner para um novo dia?")) {
                  setPlan({
                    ...INITIAL_PLAN,
                    date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  });
                  setActiveTab('professional');
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl opacity-40 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm"
              style={{ color: 'var(--text-color)' }}
            >
              <Trash2 size={18} />
              <span>Resetar Dia</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Mobile Header */}
        <header 
          className="lg:hidden border-b p-4 flex items-center justify-between sticky top-0 z-[1050] backdrop-blur-md"
          style={{ backgroundColor: 'rgba(var(--card-bg-rgb), 0.8)', borderColor: 'var(--border-color)' }}
        >
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 opacity-60 hover:opacity-100 transition-all">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-sm">
              <LayoutDashboard size={18} />
            </div>
            <span className="font-black text-sm tracking-tight" style={{ color: 'var(--text-color)' }}>PEDRO DUARTE</span>
          </div>
          <div className="w-10" />
        </header>

        <div className={`p-3 sm:p-6 md:p-10 max-w-6xl mx-auto flex flex-col ${plan.settings.visual.layout === 'compacto' ? 'gap-4' : 'gap-3.5 sm:gap-6 md:gap-10'}`}>
          {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-full sm:w-auto">
                <div className="flex items-center gap-1 opacity-50 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest mb-1">
                    <Calendar size={10} className="sm:size-[12px]" />
                    <span className="uppercase">{plan.date}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                </div>
              </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
        </div>
      </main>

      {/* Floating Assistant (Raquel1) */}
      <div className="fixed bottom-8 right-8 z-[5000] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-[2rem] shadow-2xl border border-fuchsia-100 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[600px]"
            >
              {/* Header */}
              <div className="p-6 bg-fuchsia-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm leading-none">Raquel1</h3>
                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest mt-1">Online</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAssistantOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {plan.assistant.history.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-fuchsia-100 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 italic">Olá Pedro! Como posso te ajudar hoje?</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {plan.assistant.history.slice(0, 10).map((item) => (
                      <div key={item.id} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-slate-100">
                            <p className="text-xs font-bold text-slate-700">{item.command}</p>
                          </div>
                        </div>
                        {/* Bot Response */}
                        <div className="flex justify-start items-start gap-2">
                          <div className="w-6 h-6 rounded-lg bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center shrink-0 mt-1">
                            <Bot size={14} />
                          </div>
                          <div className="max-w-[80%] bg-fuchsia-600 p-3 rounded-2xl rounded-tl-none shadow-md text-white">
                            <p className="text-xs font-medium leading-relaxed">{item.response}</p>
                            {item.actionExecuted && (
                              <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1">
                                <Zap size={10} className="text-amber-300" />
                                <span className="text-[9px] font-black uppercase tracking-tighter text-amber-300">Ação: {item.actionExecuted}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                  <input
                    type="text"
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAssistantCommand(assistantInput);
                      }
                    }}
                    placeholder="Digite seu comando..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-4 pr-24 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button 
                      onClick={startSpeechRecognition}
                      className="p-2 text-slate-400 hover:text-fuchsia-600 transition-all"
                    >
                      <Mic size={18} />
                    </button>
                    <button 
                      onClick={() => handleAssistantCommand(assistantInput)}
                      disabled={assistantLoading || !assistantInput.trim()}
                      className="p-2 bg-fuchsia-600 text-white rounded-xl hover:bg-fuchsia-700 transition-all disabled:opacity-50"
                    >
                      {assistantLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAssistantOpen(!isAssistantOpen)}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative group ${isAssistantOpen ? 'bg-slate-900 text-white' : 'bg-fuchsia-600 text-white'}`}
          style={{ boxShadow: isAssistantOpen ? '0 20px 25px -5px rgb(0 0 0 / 0.1)' : '0 20px 25px -5px rgba(192, 38, 211, 0.3)' }}
        >
          {isAssistantOpen ? <X size={28} /> : <Bot size={28} />}
          {!isAssistantOpen && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-ping" />
            </div>
          )}
          <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
            Falar com Raquel1
          </div>
        </motion.button>
      </div>
    </div>
  );
}
