export type PlanId = 'individual' | 'team' | 'company';
export type SubscriptionStatus = 'active' | 'pending' | 'past_due' | 'canceled';

export type PlanDefinition = {
  id: PlanId;
  name: string;
  priceCents: number;
  description: string;
  maxUsers: number;
  features: string[];
};

export const plans: Record<PlanId, PlanDefinition> = {
  individual: {
    id: 'individual',
    name: 'AEED Individual',
    priceCents: 6990,
    description: 'Para um profissional conduzir melhor cada conversa.',
    maxUsers: 1,
    features: ['Respostas AEED', 'IA', 'Treinamento', 'Histórico e favoritos'],
  },
  team: {
    id: 'team',
    name: 'AEED Equipe',
    priceCents: 24990,
    description: 'Para equipes que precisam de uma rotina compartilhada.',
    maxUsers: 5,
    features: ['Tudo do Individual', 'Configuração da empresa', 'Relatórios básicos', 'Suporte por e-mail'],
  },
  company: {
    id: 'company',
    name: 'AEED Empresa',
    priceCents: 59790,
    description: 'Para operações com gestão e acompanhamento completo.',
    maxUsers: 15,
    features: ['Tudo do Equipe', 'Relatórios completos', 'Painel de gestão', 'Suporte por e-mail'],
  },
};

export const planOrder: PlanId[] = ['individual', 'team', 'company'];

export function canUsePlanFeature(plan: PlanId, feature: 'company' | 'team' | 'reports' | 'training' | 'history') {
  if (feature === 'training' || feature === 'history') return true;
  if (feature === 'company' || feature === 'team' || feature === 'reports') return plan !== 'individual';
  return true;
}

export function planLabel(plan: PlanId) {
  return plans[plan]?.name || plans.individual.name;
}
