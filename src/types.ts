export interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'professional' | 'financial' | 'personal' | 'final';
}

export interface Expense {
  id: string;
  date: string;
  value: number;
  category: 'Alimentação' | 'Transporte' | 'Lazer/Família' | 'Outros';
  observation: string;
}

export interface Revenue {
  id: string;
  date: string;
  value: number;
  status: 'pendente' | 'recebido';
  description: string;
}

export interface PaymentReminder {
  id: string;
  description: string;
  dueDate: string;
  status: 'pago' | 'pendente';
}

export interface WorkVisit {
  id: string;
  date: string;
  city: string;
  secretariat: string;
  contactName: string;
  subject: string;
  result: string;
  observations: string;
  nextSteps: string;
  lat?: number;
  lng?: number;
  route_origin?: string;
  route_destination?: string;
}

export interface FuturePlanning {
  id: string;
  city: string;
  secretariat: string;
  priority: 'baixa' | 'media' | 'alta';
  scheduledDate?: string;
  lat?: number;
  lng?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  source: 'planner' | 'google';
  status?: 'pendente' | 'concluido' | 'cancelado';
  category?: 'trabalho' | 'pessoal' | 'outro';
  googleEventId?: string;
}

export interface RouteDestination {
  id: string;
  address: string;
  lat?: number;
  lng?: number;
  label?: string;
  visitInfo?: {
    date: string;
    contact: string;
    observations: string;
  };
}

export interface RouteHistory {
  id: string;
  date: string;
  name: string;
  destinations: RouteDestination[];
  googleMapsUrl: string;
}

export interface AssistantCommand {
  id: string;
  timestamp: string;
  command: string;
  response: string;
  actionExecuted?: string;
  status: 'success' | 'error';
}

export interface BiddingNotice {
  id: string;
  number: string;
  agency: string;
  object: string;
  deadline: string;
  status: 'aberto' | 'análise' | 'participação' | 'concluído';
}

export interface BiddingDocument {
  id: string;
  name: string;
  required: boolean;
  status: 'pendente' | 'enviado' | 'validado';
  fileUrl?: string;
}

export interface BiddingParticipation {
  id: string;
  noticeId: string;
  type: 'presencial' | 'eletrônico';
  strategicBids: string;
  result: string;
  date: string;
}

export interface BiddingDefense {
  id: string;
  noticeId: string;
  type: 'impugnação' | 'recurso' | 'contrarrazão';
  notes: string;
  date: string;
}

export interface BiddingCostItem {
  id: string;
  description: string;
  baseValue: number;
  taxes: number;
  charges: number;
  total: number;
}

export interface BiddingCostSheet {
  id: string;
  name: string;
  items: BiddingCostItem[];
  totalValue: number;
}

export interface BiddingMonitoringNotice {
  id: string;
  number: string;
  agency: string;
  object: string;
  deadline: string;
  status: string;
  source: string;
  category: string;
  location: string;
}

export interface BiddingMonitoring {
  filters: {
    keywords: string[];
    categories: string[];
    locations: string[];
  };
  portals: {
    pncp: boolean;
    comprasGov: boolean;
    licitacoesE: boolean;
    portalComprasPublicas: boolean;
  };
  alerts: {
    planner: boolean;
    email: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
  monitoredNotices: BiddingMonitoringNotice[];
  history: {
    id: string;
    date: string;
    action: string;
    noticeId: string;
  }[];
  stats: {
    totalAnalyzed: number;
    totalEducation: number;
    monthlyGrowth: number;
  };
}

export interface BiddingArea {
  notices: BiddingNotice[];
  documents: BiddingDocument[];
  participations: BiddingParticipation[];
  defenses: BiddingDefense[];
  legislationNotes: string;
  costSheets: BiddingCostSheet[];
  trainingProgress: number;
  monitoring: BiddingMonitoring;
}

export interface DailyPlan {
  date: string;
  motivationalPhrase: string;
  priorityOne: string;
  professional: {
    agenda: string[];
    priorityTasks: Task[];
    salesGoals: string;
    networking: string;
    insights: string;
    closingForecast?: string;
  };
  work: {
    scheduledVisits: WorkVisit[];
    futurePlanning: FuturePlanning[];
    history: WorkVisit[];
    checklist: {
      reviewProposals: boolean;
      prepareMaterial: boolean;
      registerFeedback: boolean;
      scheduleFollowUp: boolean;
    };
    routes: {
      currentDestinations: RouteDestination[];
      history: RouteHistory[];
    };
    bidding: BiddingArea;
  };
  financial: {
    initialBalance: number;
    expenses: Expense[];
    revenues: Revenue[];
    monthlyGoal: number;
    savingsGoalPercent: number;
    paymentReminders: PaymentReminder[];
    manualRealized?: number;
  };
  personal: {
    health: {
      exercises: string;
      hydration: number;
      sleep: number;
    };
    leisureFamily: {
      plannedActivity: string;
      qualityTimeNoPhone: boolean;
      specialMoments: string;
    };
    diary: string;
    bbqGastronomy: {
      shoppingList: string[];
      recipesSeasoning: string;
      bbqSchedule: string;
    };
    football: {
      lastGame: {
        result: string;
        performance: string;
      };
      nextGame: {
        date: string;
        opponent: string;
      };
      comments: string;
    };
    investments: {
      dailyContributions: number;
      portfolio: {
        stocks: number;
        funds: number;
        fixedIncome: number;
      };
      monthlyGoal: number;
      financialInsight: string;
    };
  };
  finalChecklist: {
    meetingsConfirmed: boolean;
    proposalsSent: boolean;
    expensesNoted: boolean;
    exerciseDone: boolean;
    leisureTimeDedicated: boolean;
  };
  calendar: {
    events: CalendarEvent[];
    googleTokens?: any;
    lastSync?: string;
  };
  assistant: {
    history: AssistantCommand[];
  };
  settings: Settings;
}

export interface Settings {
  visual: {
    theme: 'Light' | 'Dark' | 'Deep Black' | 'Navy Blue';
    accentColor: string;
    borderRadius: number;
    fontFamily: string;
    layout: 'compacto' | 'espaçado';
    showGoals: boolean;
  };
  profile: {
    email: string;
    password?: string;
    twoFactorEnabled: boolean;
    notifications: {
      sound: boolean;
      popup: boolean;
      email: boolean;
    };
  };
  system: {
    version: string;
    dbStatus: 'online' | 'offline';
    storageType: 'Local Sync' | 'Cloud Sync';
    changelog: { version: string; date: string; changes: string[] }[];
  };
  integrations: {
    linkedin: boolean;
    googleCalendar: boolean;
    googleSyncPlannerToGoogle: boolean;
    googleSyncGoogleToPlanner: boolean;
    selectedCalendars: string[];
    supabase: boolean;
    whatsappBusiness: boolean;
  };
  advanced: {
    aiNotifications: boolean;
    automationRules: boolean;
  };
}
