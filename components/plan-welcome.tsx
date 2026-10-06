'use client';

import { Check, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { plans, planOrder, type PlanId } from '@/lib/plans';

export function PlanWelcome({ open, onClose, onChoose, signedIn = false }: {
  open: boolean;
  onClose: () => void;
  onChoose?: (plan: PlanId) => void;
  signedIn?: boolean;
}) {
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}>
    <DialogContent className="plan-welcome" showCloseButton={false}>
      <DialogHeader>
        <span className="auth-kicker">MÉTODO AEED · SEU PRÓXIMO PASSO</span>
        <DialogTitle>Atendimento com direção.<br/>Escolha seu plano.</DialogTitle>
        <DialogDescription>Uma conta para cada pessoa. Acesse pelo celular ou computador, com o método sempre por perto.</DialogDescription>
      </DialogHeader>
      <div className="welcome-plan-grid">
        {planOrder.map(id => {
          const option = plans[id];
          return <section key={id} className={'welcome-plan '+(id === 'team' ? 'featured' : '')}>
            <span className="welcome-plan-label">{id === 'team' ? 'PARA CRESCER EM EQUIPE' : id === 'individual' ? 'SEU ATENDIMENTO' : 'SUA OPERAÇÃO'}</span>
            <h2>{option.name}</h2>
            <p>{option.description}</p>
            <div className="welcome-price">{(option.priceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}<small>/mês</small></div>
            <span className="welcome-seats">{option.maxUsers === 1 ? '1 usuário' : `Até ${option.maxUsers} usuários`} · Sem implantação</span>
            <ul>{option.features.filter(feature => feature !== 'IA').map(feature => <li key={feature}><Check size={16}/>{feature}</li>)}</ul>
            <button className="primary wide" disabled={signedIn || !onChoose} onClick={() => onChoose?.(id)}>
              {signedIn ? 'Pagamento em preparação' : 'Escolher plano'}<ArrowRight size={16}/>
            </button>
          </section>;
        })}
      </div>
      <p className="welcome-payment-note">{signedIn ? 'Seu acesso precisa ser regularizado. O pagamento online ainda não está disponível.' : 'Escolha o plano para criar seu acesso de demonstração. A cobrança online está em preparação; nenhum valor será cobrado nesta etapa.'} As orientações estão disponíveis no modo guiado.</p>
      <div className="welcome-footer"><a href="/planos">Comparar todos os recursos</a><button className="text-button" onClick={onClose}>{signedIn ? 'Voltar ao painel' : 'Já tenho uma conta · Entrar'}<ArrowRight size={16}/></button></div>
    </DialogContent>
  </Dialog>;
}
