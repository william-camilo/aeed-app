import Image from 'next/image';
import { Check, ArrowRight, MessageSquare, ChartNoAxesCombined, Building2, Smartphone, Monitor } from 'lucide-react';
import { plans, planOrder } from '@/lib/plans';

const mobileScreens = [
  { step: '01', title: 'Tela inicial', detail: 'Escolha a situação do atendimento.', icon: MessageSquare, accent: 'Abertura' },
  { step: '02', title: 'Contexto', detail: 'Conte o canal, o momento e o que o cliente disse.', icon: Smartphone, accent: 'Entendimento' },
  { step: '03', title: 'Análise AEED', detail: 'Receba uma estratégia organizada pelo método.', icon: Check, accent: 'Explicação' },
  { step: '04', title: 'Resposta pronta', detail: 'Revise, adapte e copie uma sugestão natural.', icon: ArrowRight, accent: 'Direcionamento' },
  { step: '05', title: 'Treinamento', detail: 'Pratique situações e acompanhe seu histórico.', icon: ChartNoAxesCombined, accent: 'Evolução' },
];

const webPanels = [
  { title: 'Configuração da empresa', text: 'Cadastre serviços, diferenciais e condições para personalizar as sugestões.', icon: Building2 },
  { title: 'Histórico e favoritos', text: 'Consulte atendimentos analisados e recupere respostas salvas.', icon: MessageSquare },
  { title: 'Relatórios e evolução', text: 'Acompanhe os indicadores e a evolução da equipe de acordo com o plano.', icon: ChartNoAxesCombined },
];

const features: Record<string, string[]> = {
  individual: ['1 usuário', 'Respostas e análise AEED com IA', 'Treinamento individual', 'Histórico e favoritos', 'Acesso pelo celular e navegador'],
  team: ['Até 5 usuários', 'Tudo do Individual', 'Configuração da empresa', 'Gestão da equipe', 'Relatórios básicos', 'Suporte por e-mail'],
  company: ['Até 15 usuários', 'Tudo do Equipe', 'Configuração e gestão da empresa', 'Relatórios completos e evolução', 'Acompanhamento da equipe', 'Suporte por e-mail'],
};

function money(cents: number) { return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); }

export default function PlansPage() {
  return <main className="plans-presentation">
    <header className="plans-header"><a href="/"><Image src="/aeed-logo.png" alt="AEED na prática" width={210} height={62} priority /></a><a className="plans-login" href="/">Acessar minha conta <ArrowRight size={16}/></a></header>
    <section className="presentation-hero"><span className="presentation-kicker">MÉTODO AEED · NA PRÁTICA</span><h1>Conversas melhores.<br/><em>Resultados que se acompanham.</em></h1><p>Orientação AEED no celular e uma área web para organizar o atendimento e desenvolver a equipe.</p><div className="presentation-device-labels"><span><Smartphone size={17}/> Aplicativo para celular</span><span><Monitor size={17}/> Aplicação web</span></div>
      <div className="mobile-preview-grid">{mobileScreens.map(({step,title,detail,icon:Icon,accent})=><article className="phone-preview" key={step}><div className="phone-preview-top"><span>9:41</span><span>●●●</span></div><div className="phone-preview-logo">AEED <small>NA PRÁTICA</small></div><div className="phone-step">{step}</div><h3>{title}</h3><p>{detail}</p><div className="phone-preview-action"><Icon size={16}/><span>{accent}</span><ArrowRight size={14}/></div><div className="phone-preview-bottom"><i/><i/><i/><i/></div></article>)}</div>
    </section>
    <section className="web-presentation"><div className="section-heading"><span className="presentation-kicker">NA APLICAÇÃO WEB</span><h2>Visão para cada etapa do atendimento</h2><p>O espaço de gestão acompanha o plano escolhido e as permissões da conta.</p></div><div className="web-preview-grid">{webPanels.map(({title,text,icon:Icon},i)=><article className="web-preview" key={title}><div className="web-preview-sidebar"><b>AEED</b><span className={i===0?'active':''}>Minha empresa</span><span className={i===1?'active':''}>Histórico</span><span className={i===2?'active':''}>Relatórios</span></div><div className="web-preview-content"><div className="web-preview-topline">Meu espaço <span>Conta AEED</span></div><Icon size={25}/><h3>{title}</h3><p>{text}</p><div className="web-preview-bars"><i/><i/><i/></div></div></article>)}</div></section>
    <section className="pricing-presentation"><div className="section-heading"><span className="presentation-kicker">PLANOS MENSAIS</span><h2>Escolha o acesso que combina com sua rotina</h2><p>Todos os planos sem custo de implantação.</p></div><div className="pricing-card-grid">{planOrder.map((id,index)=><article className={`pricing-card plan-${id}`} key={id}><span className="plan-overline">{index===0?'PROFISSIONAL':index===1?'EQUIPE':'GESTÃO COMPLETA'}</span><h3>{plans[id].name}</h3><p className="pricing-description">{plans[id].description}</p><div className="pricing-price"><strong>R$ {money(plans[id].priceCents)}</strong><span>/mês</span></div><div className="setup-free"><Check size={15}/> Sem custo de implantação</div><ul>{features[id].map(feature=><li key={feature}><Check size={16}/>{feature}</li>)}</ul><a href="/?cadastro=1" className="pricing-cta">Começar agora <ArrowRight size={16}/></a></article>)}</div></section>
    <section className="implementation-presentation"><div className="implementation-icon"><Building2 size={25}/></div><div><span className="presentation-kicker">IMPLANTAÇÃO AEED</span><h2>Comece sem taxa de implantação</h2><p>O valor mensal já está apresentado em cada plano. A configuração inicial da conta faz parte do início da assinatura.</p></div><strong>R$ 0,00</strong></section>
    <footer className="plans-footer">AEED na prática · Método Abertura, Entendimento, Explicação e Direcionamento</footer>
  </main>;
}
