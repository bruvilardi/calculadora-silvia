import React, { useState } from 'react';
import { 
  Calculator,
  Heart,
  Home,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  Calendar,
  Coffee,
  Pencil
} from 'lucide-react';

const XP_REAL_RATE_ANNUAL = 0.05; // Rendimento real (IPCA + 5%)

export default function App() {
  // ==========================================
  // STATE: VARIÁVEIS FINANCEIRAS EDITÁVEIS
  // ==========================================
  const [xpBalance, setXpBalance] = useState(426269.44);
  const [fixedIncome, setFixedIncome] = useState(5362.58);
  const [baseHealthCost, setBaseHealthCost] = useState(1575.00);
  const [healthDF, setHealthDF] = useState(1400.00);
  const [basicBills, setBasicBills] = useState(1308.00);
  const [movingCostDF, setMovingCostDF] = useState(8000.00);
  
  const [workIncome, setWorkIncome] = useState(2660.00);
  const [rentIncome, setRentIncome] = useState(2000.00);
  const [kelvinCost, setKelvinCost] = useState(800.00);
  const [travelCost, setTravelCost] = useState(800.00);
  const [hobbiesCost, setHobbiesCost] = useState(700.00);

  const [rentSP, setRentSP] = useState(3500.00);
  const [condoSP, setCondoSP] = useState(300.00);
  const [coraCost, setCoraCost] = useState(7500.00);
  const [rentDF, setRentDF] = useState(3500.00);
  
  const [rentHelpSP, setRentHelpSP] = useState(3500.00);
  const [coraHelp, setCoraHelp] = useState(2000.00);

  // ==========================================
  // STATE: DECISÕES DE VIDA (TOGGLES)
  // ==========================================
  const [keepWorking, setKeepWorking] = useState(false);
  const [receiveRentHelpSP, setReceiveRentHelpSP] = useState(true);
  const [hasCoraHelp, setHasCoraHelp] = useState(false);
  const [receiveRent, setReceiveRent] = useState(true);
  const [dogCare, setDogCare] = useState(true);
  const [travel, setTravel] = useState(false);
  const [hobbies, setHobbies] = useState(false);

  // ==========================================
  // STATE: CENÁRIO DE MORADIA (1 a 4)
  // ==========================================
  const [scenario, setScenario] = useState(1);

  // ==========================================
  // DERIVANDO REGRAS DE NEGÓCIO
  // ==========================================
  const isScenario2 = scenario === 2;
  const actualReceiveRent = isScenario2 ? false : receiveRent; // Força false se for morar no próprio apê

  // Formatação de Moeda Básica
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Lógica Dinâmica de Custos Variáveis
  let currentXpBalance = xpBalance;
  let currentHealthCost = baseHealthCost;
  let housingCost = 0;
  let familyHelpIncome = 0;

  if (scenario === 1) {
    housingCost = rentSP;
    if (receiveRentHelpSP) familyHelpIncome += rentHelpSP;
  }
  else if (scenario === 2) {
    housingCost = condoSP;
  }
  else if (scenario === 3) {
    housingCost = coraCost;
    if (hasCoraHelp) familyHelpIncome += coraHelp;
  }
  else if (scenario === 4) {
    housingCost = rentDF;
    currentHealthCost = healthDF;
    currentXpBalance -= movingCostDF;
  }

  // Cálculo Total Final
  const totalIncome = fixedIncome + (keepWorking ? workIncome : 0) + (actualReceiveRent ? rentIncome : 0) + familyHelpIncome;
  const totalExpenses = currentHealthCost + basicBills + housingCost + (dogCare ? kelvinCost : 0) + (travel ? travelCost : 0) + (hobbies ? hobbiesCost : 0);
  const withdrawal = Math.max(0, totalExpenses - totalIncome);

  // ==========================================
  // MATEMÁTICA FINANCEIRA: ATÉ QUANDO DURA?
  // ==========================================
  const rateMonthly = Math.pow(1 + XP_REAL_RATE_ANNUAL, 1/12) - 1; 
  const safeYield = currentXpBalance * rateMonthly; 
  
  let finalAge = 0;
  let longevityText = "";
  let longevityHighlight = "";
  let thermoColor = "";
  let thermoBg = "";
  let thermoBarBg = "";
  let thermoWidth = "w-full";

  if (withdrawal === 0) {
    finalAge = 999;
    longevityHighlight = "Para sempre 🌟";
    longevityText = "Você não precisa mexer na reserva. O seu patrimônio continuará crescendo intacto!";
  } else if (withdrawal <= safeYield) {
    finalAge = 999;
    longevityHighlight = "Para sempre 🌟";
    longevityText = "O resgate é menor que o rendimento (IPCA + 5%). O dinheiro nunca acaba e o patrimônio cresce.";
  } else {
    // Fórmula NPER: n = -log(1 - (PV * i) / PMT) / log(1 + i)
    const months = -Math.log(1 - (currentXpBalance * rateMonthly) / withdrawal) / Math.log(1 + rateMonthly);
    finalAge = Math.floor(71 + (months / 12));

    if (finalAge >= 100) {
      longevityHighlight = "Mais de 100 anos 🌟";
      longevityText = "Com muita folga! Sua reserva garante esse padrão de vida por toda a vida.";
    } else {
      longevityHighlight = `Até os ${finalAge} anos 🕊️`;
      longevityText = "Baseado na projeção da XP, este é o tempo que sua reserva cobre o seu custo de vida.";
    }
  }

  // Estilização baseada na Idade Final
  if (finalAge >= 95) {
    thermoColor = "text-teal-900";
    thermoBg = "bg-teal-50 border-teal-200";
    thermoBarBg = "bg-teal-500";
    thermoWidth = "w-1/3";
  } else if (finalAge >= 90) {
    thermoColor = "text-sky-900";
    thermoBg = "bg-sky-50 border-sky-200";
    thermoBarBg = "bg-sky-500";
    thermoWidth = "w-2/3";
  } else {
    thermoColor = "text-amber-900";
    thermoBg = "bg-amber-50 border-amber-200";
    thermoBarBg = "bg-amber-400";
    thermoWidth = "w-full";
    longevityHighlight = `Até os ${finalAge} anos ⚠️`;
    longevityText = "Atenção: A reserva acaba um pouco mais cedo. Considere ajustar alguns custos.";
  }

  // ==========================================
  // COMPONENTES AUXILIARES
  // ==========================================
  
  // 1. Input de Moeda Editável Inline
  const InlineCurrencyInput = ({ value, onChange, className = "" }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempVal, setTempVal] = useState(value.toString());

    const handleBlur = () => {
      setIsEditing(false);
      let normalized = tempVal.replace(/\./g, '').replace(',', '.');
      let parsed = parseFloat(normalized);
      if (!isNaN(parsed) && parsed >= 0) {
        onChange(parsed);
      } else {
        setTempVal(value.toString());
      }
    };

    if (isEditing) {
      return (
        <input 
          autoFocus
          className={`bg-white border-2 border-sky-400 rounded px-1 w-20 md:w-24 text-slate-800 font-bold outline-none text-center inline-block ${className}`}
          value={tempVal}
          onChange={e => setTempVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => e.key === 'Enter' && handleBlur()}
          onClick={e => e.stopPropagation()}
        />
      );
    }

    return (
      <span 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(true); setTempVal(value.toString()); }}
        className={`cursor-pointer border-b-2 border-dashed border-sky-300 hover:bg-sky-100 hover:border-sky-500 text-sky-800 font-bold px-1 rounded transition-colors inline-block ${className}`}
        title="Clique para editar este valor"
      >
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </span>
    );
  };

  // 2. Toggle Switch Acessível
  const ToggleRow = ({ label, descNode, checked, onChange, disabled = false, disabledMsg = "" }: any) => (
    <div 
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer 
      ${disabled ? 'bg-slate-100 border-slate-200 opacity-70' : 
        checked ? 'bg-white border-sky-200 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
      
      <div className="pr-3 md:pr-4 flex-1 pointer-events-none">
        <span className="block text-lg md:text-xl font-medium text-slate-800 leading-tight">{label}</span>
        <div className="block text-sm md:text-lg text-slate-500 mt-1 leading-snug pointer-events-auto">
          {disabled && disabledMsg ? disabledMsg : descNode}
        </div>
      </div>
      
      <div className="relative inline-flex items-center shrink-0">
        <input type="checkbox" className="sr-only peer" checked={checked} readOnly />
        <div className="w-14 h-8 md:w-16 md:h-9 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 md:after:h-7 md:after:w-7 after:transition-all peer-checked:bg-sky-500"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-32 lg:pb-24 selection:bg-sky-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-6 md:py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="bg-sky-100 p-3 md:p-4 rounded-full text-sky-700 w-fit shrink-0">
            <Calculator className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800">Painel de Decisão Financeira</h1>
            <p className="text-base md:text-xl text-slate-600 mt-2 leading-relaxed max-w-3xl">
              Faça simulações ligando e desligando opções abaixo. <strong>Dica:</strong> Valores sublinhados pontilhados podem ser clicados e alterados!
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 md:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* =========================================
              COLUNA 1: PAINEL DE CONTROLE (INPUTS)
          ========================================= */}
          <section className="lg:col-span-7 space-y-10">
            
            {/* 1. Decisões de Vida */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Coffee className="w-6 h-6 md:w-7 md:h-7 text-sky-600" />
                Suas Escolhas de Vida
              </h2>
              <div className="space-y-3">
                <ToggleRow 
                  label="Continuar trabalhando na clínica" 
                  descNode={<>Adiciona <InlineCurrencyInput value={workIncome} onChange={setWorkIncome} /> / mês nas receitas.</>}
                  checked={keepWorking} 
                  onChange={setKeepWorking} 
                />
                <ToggleRow 
                  label="Recebendo ajuda com o aluguel" 
                  descNode={<>Familiares ajudam com <InlineCurrencyInput value={rentHelpSP} onChange={setRentHelpSP} /> para o aluguel em SP.</>}
                  checked={receiveRentHelpSP} 
                  onChange={setReceiveRentHelpSP} 
                  disabled={scenario !== 1}
                  disabledMsg="Válido apenas se morar de aluguel em SP."
                />
                <ToggleRow 
                  label="Ajuda da família (Residencial Cora)" 
                  descNode={<>Familiares ajudam com <InlineCurrencyInput value={coraHelp} onChange={setCoraHelp} /> no custo do residencial.</>}
                  checked={hasCoraHelp} 
                  onChange={setHasCoraHelp} 
                  disabled={scenario !== 3}
                  disabledMsg="Válido apenas no cenário Residencial Cora."
                />
                <ToggleRow 
                  label="Receber aluguel do seu imóvel próprio" 
                  descNode={<>Adiciona <InlineCurrencyInput value={rentIncome} onChange={setRentIncome} /> / mês nas receitas.</>}
                  checked={actualReceiveRent} 
                  onChange={setReceiveRent} 
                  disabled={isScenario2}
                  disabledMsg="Indisponível pois você escolheu morar nele."
                />
                <ToggleRow 
                  label="Gastos com o Kelvin" 
                  descNode={dogCare ? <>Fase atual: reserva de <InlineCurrencyInput value={kelvinCost} onChange={setKelvinCost} /> / mês para ele.</> : "Fase futura: sem custos (R$ 0)."}
                  checked={dogCare} 
                  onChange={setDogCare} 
                />
              </div>
            </div>

            {/* 2. Cenário de Moradia */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Home className="w-6 h-6 md:w-7 md:h-7 text-sky-600" />
                Onde você vai morar?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 1, title: "Apê Atual SP", costNode: <>Custo Aluguel: <InlineCurrencyInput value={rentSP} onChange={setRentSP} /> / mês</> },
                  { id: 2, title: "Mudar para Imóvel Próprio", costNode: <>Condomínio: <InlineCurrencyInput value={condoSP} onChange={setCondoSP} /> / mês</> },
                  { id: 3, title: "Residencial Cora SP", costNode: <>Custo Mensal: <InlineCurrencyInput value={coraCost} onChange={setCoraCost} /> / mês</> },
                  { id: 4, title: "Mudar para Brasília (DF)", costNode: <>Aluguel médio DF: <InlineCurrencyInput value={rentDF} onChange={setRentDF} /> / mês</> },
                ].map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => setScenario(s.id)}
                    className={`flex flex-col p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all
                    ${scenario === s.id ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3 pointer-events-none">
                      <input 
                        type="radio" 
                        checked={scenario === s.id}
                        readOnly
                        className="w-5 h-5 md:w-6 md:h-6 text-sky-600 border-slate-300 shrink-0"
                      />
                      <span className={`text-lg md:text-xl font-bold ${scenario === s.id ? 'text-sky-900' : 'text-slate-700'}`}>{s.title}</span>
                    </div>
                    <div className="text-sm md:text-lg text-slate-500 mt-2 ml-8 md:ml-9 pointer-events-auto" onClick={e => e.stopPropagation()}>
                      {s.costNode}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Lazer e Qualidade de Vida */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Heart className="w-6 h-6 md:w-7 md:h-7 text-sky-600" />
                Qualidade de Vida e Hobbies
              </h2>
              <div className="space-y-3">
                <div 
                  onClick={() => setTravel(!travel)}
                  className="flex items-center p-4 md:p-5 rounded-2xl border-2 bg-white border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" checked={travel} readOnly className="w-6 h-6 md:w-7 md:h-7 rounded text-sky-600 border-slate-300 shrink-0 pointer-events-none" />
                  <span className="ml-3 md:ml-4 text-base md:text-xl text-slate-700 pointer-events-none">
                    Fundo para Viagens Pontuais <span className="font-medium text-slate-500 block md:inline pointer-events-auto" onClick={e => e.stopPropagation()}>(+ <InlineCurrencyInput value={travelCost} onChange={setTravelCost} /> / mês)</span>
                  </span>
                </div>
                <div 
                  onClick={() => setHobbies(!hobbies)}
                  className="flex items-center p-4 md:p-5 rounded-2xl border-2 bg-white border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" checked={hobbies} readOnly className="w-6 h-6 md:w-7 md:h-7 rounded text-sky-600 border-slate-300 shrink-0 pointer-events-none" />
                  <span className="ml-3 md:ml-4 text-base md:text-xl text-slate-700 pointer-events-none">
                    Cursos, Hobbies e Academia <span className="font-medium text-slate-500 block md:inline pointer-events-auto" onClick={e => e.stopPropagation()}>(+ <InlineCurrencyInput value={hobbiesCost} onChange={setHobbiesCost} /> / mês)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Valores Fixos Editáveis */}
            <div className="bg-slate-100 rounded-2xl p-5 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-700 flex items-center gap-2">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-slate-500" /> Valores Base da Simulação
                </h3>
                <span className="hidden md:flex text-sm text-slate-500 items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                  <Pencil className="w-3 h-3" /> Editáveis
                </span>
              </div>
              <ul className="space-y-3 text-sm md:text-lg text-slate-600">
                <li className="flex justify-between border-b border-slate-200 pb-2 items-center">
                  <span>Reserva Atual XP (Base de Cálculo)</span> 
                  <InlineCurrencyInput value={xpBalance} onChange={setXpBalance} className="text-right" />
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2 items-center">
                  <span>Aposentadoria Fixa</span> 
                  <InlineCurrencyInput value={fixedIncome} onChange={setFixedIncome} className="text-right" />
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2 items-center">
                  <span>{scenario === 4 ? "Plano MedSenior DF + Terapia" : "Plano de Saúde SP + Terapia"}</span> 
                  {scenario === 4 ? (
                    <InlineCurrencyInput value={healthDF} onChange={setHealthDF} className="text-right" />
                  ) : (
                    <InlineCurrencyInput value={baseHealthCost} onChange={setBaseHealthCost} className="text-right" />
                  )}
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2 items-center">
                  <span>Contas básicas (água, luz, mercado, etc)</span> 
                  <InlineCurrencyInput value={basicBills} onChange={setBasicBills} className="text-right" />
                </li>
                {scenario === 4 && (
                  <li className="flex justify-between items-center text-amber-700 bg-amber-50 p-2 rounded-lg -mx-2 px-2 mt-2">
                    <span>Custo de Mudança SP ➔ DF (Única vez)</span>
                    <span className="font-medium">- <InlineCurrencyInput value={movingCostDF} onChange={setMovingCostDF} className="text-amber-800" /> da reserva</span>
                  </li>
                )}
              </ul>
            </div>

          </section>


          {/* =========================================
              COLUNA 2: PAINEL DE RESULTADOS (OUTPUTS)
          ========================================= */}
          <section className="lg:col-span-5 relative">
            <div className="sticky top-8 space-y-6">
              
              {/* Resumo Financeiro Principal */}
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-6 md:p-8 text-center border-b border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800">Resultado do Mês</h2>
                  <p className="text-slate-500 text-lg mt-1">Atualizado em tempo real</p>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                  
                  <div className="flex flex-col gap-4">
                    <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100 flex justify-between items-center">
                      <span className="text-xl text-slate-600">Total de Receitas</span>
                      <span className="text-2xl font-bold text-slate-800">{formatCurrency(totalIncome)}</span>
                    </div>
                    
                    <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100 flex justify-between items-center">
                      <span className="text-xl text-slate-600">Total de Despesas</span>
                      <span className="text-2xl font-bold text-slate-800">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>

                  {/* Valor a Resgatar (O mais importante) */}
                  <div className="pt-4">
                    <span className="block text-lg md:text-xl font-medium text-slate-600 mb-2">Valor a resgatar da reserva (XP)</span>
                    <div className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                      {formatCurrency(withdrawal)}
                    </div>
                    {withdrawal === 0 && (
                      <p className="text-base md:text-lg text-teal-600 font-bold mt-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> Suas rendas cobrem todos os custos!
                      </p>
                    )}
                  </div>

                  {/* Termômetro com Matemática Financeira da Idade */}
                  <div className={`mt-8 p-6 md:p-8 rounded-2xl border-2 shadow-sm ${thermoBg}`}>
                    <h3 className={`text-xl font-bold flex items-center gap-3 leading-snug ${thermoColor}`}>
                      <Calendar className="w-8 h-8 shrink-0" />
                      Até quando a reserva dura?
                    </h3>
                    
                    <div className="mt-5 space-y-2">
                      <span className={`block text-4xl font-black tracking-tight ${thermoColor}`}>
                        {longevityHighlight}
                      </span>
                      <p className={`text-lg font-medium opacity-90 ${thermoColor}`}>
                        {longevityText}
                      </p>
                    </div>

                    <div className="w-full bg-white/60 h-4 rounded-full mt-6 overflow-hidden shadow-inner">
                      <div className={`h-full ${thermoBarBg} ${thermoWidth} transition-all duration-700 ease-out rounded-full`}></div>
                    </div>
                    
                    <p className="text-sm mt-5 font-medium text-slate-500 leading-relaxed">
                      *Cálculo matemático automático baseado no patrimônio da XP ({formatCurrency(currentXpBalance)}) rendendo conservadoramente IPCA + 5% ao ano.
                    </p>
                  </div>

                </div>
              </div>

              {/* Card de Saúde e Rotina Dinâmico */}
              <div className={`p-6 md:p-8 rounded-3xl border-2 shadow-sm transition-all duration-500
                ${(scenario === 3) 
                  ? 'bg-sky-50 border-sky-200 text-sky-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 mb-3">
                  {(scenario === 3) ? <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 shrink-0" /> : <AlertCircle className="w-6 h-6 md:w-7 md:h-7 shrink-0" />}
                  Rotina e Saúde
                </h3>
                <p className="text-base md:text-xl leading-relaxed">
                  {(scenario === 3) 
                    ? "Paz de espírito: No residencial, a sua medicação, alimentação e rotina de atividades são 100% cuidadas por profissionais 24h por dia. Você não precisa se preocupar com nada."
                    : (scenario === 4)
                    ? "Morando em Brasília você estará mais perto da família. O MedSenior tem ótima rede no DF, mas ainda precisaremos organizar sua rotina de remédios e suporte no novo apartamento."
                    : "Lembrete importante: Como você morará sozinha em SP, precisaremos estruturar um apoio profissional ou familiar de perto para organizar seus medicamentos e garantir que você tenha uma rotina saudável fora de casa."
                  }
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Mobile Sticky Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] p-4 pb-6 lg:hidden z-50 flex justify-between items-center">
        <div className="flex-1">
          <span className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">A Reserva dura:</span>
          <span className={`block text-lg font-black tracking-tight leading-none ${thermoColor}`}>
            {longevityHighlight.replace(" anos", "")}
          </span>
        </div>
        <div className="text-right border-l border-slate-200 pl-4">
          <span className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Resgate Mês:</span>
          <span className="block text-xl font-black text-slate-800 leading-none">{formatCurrency(withdrawal)}</span>
        </div>
      </div>

    </div>
  );
}
