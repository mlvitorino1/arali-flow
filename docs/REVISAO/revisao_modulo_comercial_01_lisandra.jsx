import { useState } from "react";

const C = {
  bg: "#0a0c12", surface: "#11141c", card: "#161a26", border: "#1e2333",
  borderHi: "#2a3352", text: "#b0b8cc", dim: "#5c6478", bright: "#e4e9f4",
  blue: "#4a8eff", blueDim: "#142244", green: "#22c55e", greenDim: "#0a2816",
  amber: "#f59e0b", amberDim: "#261c04", red: "#ef4444", redDim: "#2a0c0c",
  purple: "#a78bfa", purpleDim: "#1c1438", cyan: "#06b6d4", cyanDim: "#041e28",
};

const Bd = ({ c = "blue", children }) => {
  const m = { blue: [C.blueDim, C.blue], green: [C.greenDim, C.green], amber: [C.amberDim, C.amber], red: [C.redDim, C.red], purple: [C.purpleDim, C.purple], cyan: [C.cyanDim, C.cyan] };
  const [bg, fg] = m[c] || m.blue;
  return <span style={{ display: "inline-flex", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: bg, color: fg, whiteSpace: "nowrap" }}>{children}</span>;
};

const Mono = ({ children }) => <code style={{ fontSize: 10, background: "#1a1e2e", color: C.purple, padding: "1px 5px", borderRadius: 3 }}>{children}</code>;
const Warn = ({ title, children }) => (
  <div style={{ marginTop: 10, background: C.bg, borderLeft: `3px solid ${C.amber}`, borderRadius: "0 6px 6px 0", padding: "10px 12px" }}>
    {title && <p style={{ fontSize: 11, fontWeight: 700, color: C.amber, marginBottom: 4 }}>{title}</p>}
    <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7 }}>{children}</p>
  </div>
);

const tabs = [
  { id: "resumo", label: "Diagnóstico" },
  { id: "colunas", label: "Colunas → Campos" },
  { id: "tag", label: "Sistema de Tags" },
  { id: "status", label: "Máquina de Status" },
  { id: "modelo", label: "Modelo Final" },
];

// ======= TAB 1: DIAGNÓSTICO =======
const Resumo = () => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 800, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Diagnóstico — Planilha Controle de Entrada de Orçamento</p>

    <div style={{ background: C.card, border: `1px solid ${C.red}44`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, color: C.bright, marginBottom: 10 }}>3 Descobertas que mudam a modelagem</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.red}33` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}><Bd c="red">CRÍTICO</Bd><span style={{ fontSize: 12, fontWeight: 800, color: C.bright }}>FATOR não é número — é o nome de quem aprovou</span></div>
          <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7 }}>
            A coluna FATOR contém <strong>BIANCA</strong> (228x), <strong>LISANDRA</strong> (216x), <strong>CUCA</strong> (29x) — nomes de pessoas, não valores numéricos.
            O valor numérico do fator/margem fica nos arquivos <Mono>_SISTEMA.xlsx</Mono> dentro da pasta do projeto.
            A planilha de controle registra apenas <strong>quem validou</strong>. Isso muda o campo: em vez de <Mono>fator numeric</Mono>,
            o correto é <Mono>validado_por_id uuid</Mono> nesta entidade, e o fator numérico fica na planilha de orçamento (que será digitalizada depois).
          </p>
        </div>

        <div style={{ background: C.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.red}33` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}><Bd c="red">CRÍTICO</Bd><span style={{ fontSize: 12, fontWeight: 800, color: C.bright }}>Tag é um código estruturado, não texto livre</span></div>
          <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7 }}>
            A coluna Tag segue um padrão preciso: <Mono>N</Mono> = novo orçamento do projeto (239x),
            <Mono>E[nn]</Mono> = etapa (192x), <Mono>R[nn]</Mono> = revisão (162x),
            <Mono>E[nn] R[nn]</Mono> = etapa + revisão (93x), sufixo <Mono>CD</Mono> = crédito/débito (46x).
            OS12320 tem 19 linhas com tags de E07 até E22 — é um código que o time já opera mentalmente.
            O modelo precisa decompor isso em campos separados: <Mono>tipo_tag</Mono>, <Mono>numero_etapa</Mono>, <Mono>numero_revisao</Mono>, <Mono>is_credito_debito</Mono>.
          </p>
        </div>

        <div style={{ background: C.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.amber}33` }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}><Bd c="amber">IMPORTANTE</Bd><span style={{ fontSize: 12, fontWeight: 800, color: C.bright }}>Cada linha da planilha = 1 orçamento, não 1 proposta</span></div>
          <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7 }}>
            742 linhas, mas muitas OSs se repetem com tags diferentes. OS12320 = 19 linhas = 19 orçamentos de um mesmo projeto.
            A relação é: 1 Projeto (OS) → N Orçamentos (linhas). Cada orçamento tem tipo de proposta, valor, status e elaborador próprios.
            Isso confirma: <strong>cada linha não é um "projeto" — é um orçamento/proposta dentro do projeto</strong>.
            A tabela <Mono>propostas</Mono> do Arali Flow é essa entidade.
          </p>
        </div>
      </div>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 10 }}>Números da Planilha</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          { n: "742", l: "Linhas (orçamentos)", c: C.blue },
          { n: "47", l: "Projetos com 4+ etapas", c: C.purple },
          { n: "149", l: "Tipos de proposta únicos", c: C.amber },
          { n: "615", l: "Status 'Enviada'", c: C.green },
          { n: "4", l: "Elaboradores ativos", c: C.cyan },
          { n: "9", l: "Status distintos", c: C.amber },
          { n: "19", l: "Status Comercial distintos", c: C.red },
          { n: "63", l: "Interesse de negociação = SIM", c: C.green },
        ].map((s, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.n}</p>
            <p style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ======= TAB 2: COLUNAS → CAMPOS =======
const Colunas = () => {
  const cols = [
    { planilha: "Data", campo: "criado_em", tipo: "timestamptz", nota: "Data de entrada do orçamento na planilha" },
    { planilha: "Status", campo: "status", tipo: "enum", nota: "9 valores: Enviada, Em Pausa, Cancelada, Conferir Fator, NOVA, Elaborando, Nova, Prioridade, NFP. Normalizar para enum." },
    { planilha: "Tag", campo: "tag_raw + campos decompostos", tipo: "text + int + bool", nota: "DECOMPOR em: tag_raw, tipo_tag (N|E|R|M), numero_etapa, numero_revisao, is_credito_debito. Ver aba 'Sistema de Tags'." },
    { planilha: "Nº OS", campo: "projeto.numero_os", tipo: "text", nota: "FK para projetos. Ex: OS12789. Muitas linhas compartilham a mesma OS." },
    { planilha: "Nome do Cliente e Obra", campo: "projeto.nome + projeto.cliente_nome", tipo: "text", nota: "Nome misto: 'CASA MMXX' (obra) + 'CARLOS ALBERTO' (cliente). Separar na importação." },
    { planilha: "Solicitante", campo: "solicitante", tipo: "text", nota: "Quem solicitou o orçamento. Geralmente escritório de arquitetura ou construtora. Pode virar FK para parceiros." },
    { planilha: "Construtora", campo: "parceiro (tipo=construtora)", tipo: "FK parceiros", nota: "Ex: MFC, SERIPIERRI, NOVOMARCO. Vincular à tabela parceiros.tipo_parceiro='construtora'." },
    { planilha: "Arquitetura", campo: "parceiro (tipo=arquitetura)", tipo: "FK parceiros", nota: "Ex: STUDIO MK27, JACOBSEN. Vincular à tabela parceiros.tipo_parceiro='arquitetura'." },
    { planilha: "Gerenciadora", campo: "parceiro (tipo=gerenciadora)", tipo: "FK parceiros", nota: "Ex: SQUALY, MS TORRES, FITPLAN. Vincular à tabela parceiros.tipo_parceiro='gerenciadora'." },
    { planilha: "Status Comercial", campo: "status_comercial", tipo: "enum", nota: "19 valores com duplicatas/typos. Normalizar: EM_EXECUCAO, CONCORRENCIA, INICIANDO, MANUTENCAO, FINALIZADA, REFORMA, VIABILIDADE, etc." },
    { planilha: "Cidade/Endereço", campo: "projeto.endereco + projeto.endereco_rua (indexado)", tipo: "text", nota: "Endereço completo. Extrair rua para busca rápida. Index trigram." },
    { planilha: "Valor", campo: "valor", tipo: "numeric(12,2)", nota: "Formato 'R$ 2.349.200,00'. Parser BRL → numeric. Pode estar vazio (em elaboração)." },
    { planilha: "Tipo de Proposta", campo: "tipo_proposta", tipo: "text (normalizar)", nota: "149 valores únicos! Siglas: PM=Porta de Madeira, PN=Painel, FR=Forro, FCH=Fachada, MOB=Mobiliário, BR=Brise. Normalizar com tabela de lookup ou tags." },
    { planilha: "Elaborado", campo: "elaborado_por_id", tipo: "FK integrantes", nota: "4 pessoas ativas: BIANCA, SUELEN, MARIANA, FRANCIELE. Vincular a integrantes." },
    { planilha: "FATOR", campo: "validado_por_id", tipo: "FK integrantes", nota: "⚠ NÃO é valor numérico! É quem validou: BIANCA, LISANDRA, CUCA. Renomear para validado_por." },
    { planilha: "<----OBS", campo: "observacoes", tipo: "text", nota: "Texto livre. Ex: 'ENVIAR PROPOSTA ATÉ DIA 20/01', 'REPASSAR COM O CUCA'." },
    { planilha: "Data de Envio", campo: "enviado_em", tipo: "timestamptz", nota: "Data de envio ao cliente. Permite calcular dias sem resposta." },
    { planilha: "CONFIRMAÇÃO", campo: "confirmacao_texto", tipo: "text", nota: "Texto livre: 'CONFIRMADO VIA WHATSAPP PELA MARIANA DIA 20/02/2026'. Decompor em: confirmado_por, canal (whatsapp|email), confirmado_em." },
    { planilha: "INTERESSE DE NEGOCIAÇÃO", campo: "interesse_negociacao", tipo: "boolean", nota: "SIM (63x) / NÃO (1x) / vazio. Boolean com default null." },
    { planilha: "PEDIDO FECHADO", campo: "pedido_fechado", tipo: "boolean", nota: "FECHADO/SIM (10x total). Boolean. Quando true, trigger muda status da proposta." },
  ];

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 800, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Mapeamento: 20 Colunas da Planilha → Campos do Banco</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cols.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 10, background: C.card, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}`, alignItems: "flex-start" }}>
            <div style={{ minWidth: 130 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: C.amber, fontFamily: "monospace" }}>{c.planilha}</p>
            </div>
            <div style={{ minWidth: 10, color: C.dim, fontSize: 11 }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                <Mono>{c.campo}</Mono>
                <span style={{ fontSize: 10, color: C.cyan }}>{c.tipo}</span>
              </div>
              <p style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.6 }}>{c.nota}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ======= TAB 3: SISTEMA DE TAGS =======
const Tags = () => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 800, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Sistema de Tags — Decodificação Completa</p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 12 }}>Padrão da Tag: <Mono>[tipo_tag][numero_etapa] [R][numero_revisao] [CD]</Mono></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { tag: "N", desc: "Novo — primeiro orçamento do projeto. Sem etapa, sem revisão.", count: 239, pct: "32%", c: C.blue },
          { tag: "E[nn]", desc: "Etapa pura — novo orçamento de uma etapa específica (E01, E07, E15...)", count: 192, pct: "26%", c: C.green },
          { tag: "R[nn]", desc: "Revisão do orçamento base (R01 = 1ª revisão do N). Sem etapa associada.", count: 162, pct: "22%", c: C.purple },
          { tag: "E[nn] R[nn]", desc: "Revisão de uma etapa específica. Ex: E01 R02 = etapa 1, revisão 2.", count: 93, pct: "13%", c: C.amber },
          { tag: "* CD", desc: "Sufixo Crédito/Débito. Ajuste financeiro sem novo escopo de trabalho.", count: 46, pct: "6%", c: C.red },
          { tag: "M", desc: "Manutenção. Orçamento de serviço pós-obra.", count: 6, pct: "1%", c: C.cyan },
        ].map((t, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 8, padding: "12px 14px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: t.c, fontFamily: "monospace" }}>{t.tag}</span>
              <span style={{ fontSize: 10, color: C.dim }}>{t.count}x ({t.pct})</span>
            </div>
            <p style={{ fontSize: 10.5, color: C.text, lineHeight: 1.6 }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <Warn title="Como decompor no modelo">
        Campos: <Mono>tag_raw text</Mono> (valor original preservado para backwards-compat),
        <Mono>tipo_tag enum ('novo','etapa','revisao','etapa_revisao','manutencao')</Mono>,
        <Mono>numero_etapa int</Mono> (null se N ou R puro),
        <Mono>numero_revisao int</Mono> (null se N ou E puro),
        <Mono>is_credito_debito boolean DEFAULT false</Mono>.
        Parser no ETL: regex <Mono>/^(E(\d+))?\s*(R(\d+))?\s*(CD)?$/</Mono>
      </Warn>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.blue}33`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 10 }}>Exemplo Real: OS12320 — 19 orçamentos em 1 projeto</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {[
          { tag: "E07 R01", tipo: "FACHADA", val: "R$ 334.300" },
          { tag: "E08", tipo: "MOBILIÁRIO", val: "Em Pausa" },
          { tag: "E09", tipo: "MOBILIÁRIO", val: "R$ 93.900" },
          { tag: "E10", tipo: "MOBILIÁRIO", val: "R$ 34.400" },
          { tag: "E11", tipo: "LÂMINA ESCRIT.", val: "Cancelada" },
          { tag: "E12", tipo: "PAINEL", val: "R$ 53.400" },
          { tag: "E13", tipo: "FORRO", val: "R$ 61.200" },
          { tag: "E14", tipo: "CRÉD/DÉB GERAL", val: "R$ 1.023.500" },
          { tag: "E14 R01", tipo: "CRÉD/DÉB GERAL", val: "R$ 809.600" },
          { tag: "E14 R02", tipo: "CRÉD/DÉB GERAL", val: "R$ 644.200" },
          { tag: "E15", tipo: "MOBILIÁRIO", val: "R$ 585.500" },
          { tag: "E16", tipo: "ELEVADOR", val: "R$ 28.300" },
          { tag: "E17", tipo: "REF. PAINÉIS", val: "R$ 49.500" },
          { tag: "E18", tipo: "FERRAGEM", val: "R$ 27.800" },
          { tag: "E19", tipo: "PM/PN/MOB/PERG", val: "R$ 3.780.300" },
          { tag: "E20 CD", tipo: "MOBILIÁRIO", val: "R$ 32.400" },
          { tag: "E21", tipo: "MOBILIÁRIO", val: "R$ 73.200" },
          { tag: "E22 CD", tipo: "MOBILIÁRIO", val: "R$ -" },
          { tag: "E22 CD R01", tipo: "MOBILIÁRIO", val: "R$ 147.200" },
        ].map((e, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 6, padding: "6px 8px", border: `1px solid ${C.border}`, fontSize: 10 }}>
            <span style={{ fontWeight: 800, color: C.blue, fontFamily: "monospace" }}>{e.tag}</span>
            <br /><span style={{ color: C.text }}>{e.tipo}</span>
            <br /><span style={{ color: C.dim }}>{e.val}</span>
          </div>
        ))}
      </div>
      <Warn title="">
        Um único projeto pode ter etapas de E01 até E22+ com revisões e CDs intercalados.
        O tipo de proposta varia wildly: de Mobiliário a Elevador a Ferragem.
        Isso confirma que <strong>etapa ≠ escopo fixo</strong> — é qualquer pedido de orçamento sequencial.
      </Warn>
    </div>
  </div>
);

// ======= TAB 4: STATUS =======
const Status = () => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 800, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Máquina de Status — Proposta/Orçamento</p>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 14 }}>Status na planilha → Status no Arali Flow</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { planilha: "NOVA / Nova", count: 6, flow: "rascunho", desc: "Orçamento recém-registrado. Sem elaborador atribuído ainda.", c: C.dim },
          { planilha: "Prioridade", count: 2, flow: "priorizada", desc: "Marcada como prioridade na fila de elaboração. Posição destaque.", c: C.amber },
          { planilha: "Elaborando", count: 3, flow: "em_elaboracao", desc: "Elaborador atribuído e trabalhando no orçamento.", c: C.blue },
          { planilha: "Conferir Fator", count: 6, flow: "aguardando_validacao", desc: "Orçamento pronto, aguardando Lisandra/Cuca/Bianca validar e assinar.", c: C.purple },
          { planilha: "Enviada", count: 615, flow: "enviada", desc: "Proposta validada e enviada ao cliente. 83% das linhas estão aqui.", c: C.green },
          { planilha: "Em Pausa", count: 56, flow: "pausada", desc: "Orçamento pausado — geralmente aguardando info do cliente ou decisão interna.", c: C.amber },
          { planilha: "Cancelada", count: 53, flow: "cancelada", desc: "Orçamento cancelado. Não será mais trabalhado.", c: C.red },
          { planilha: "NFP", count: 1, flow: "nfp", desc: "Significado exato a confirmar com Lisandra. Possivelmente 'Não Foi Possível'.", c: C.dim },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, background: C.bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}`, alignItems: "center" }}>
            <div style={{ minWidth: 120 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.amber }}>{s.planilha}</span>
              <span style={{ fontSize: 10, color: C.dim, marginLeft: 6 }}>({s.count}x)</span>
            </div>
            <span style={{ color: C.dim }}>→</span>
            <div style={{ minWidth: 140 }}>
              <Mono>{s.flow}</Mono>
            </div>
            <p style={{ fontSize: 10.5, color: C.text, flex: 1, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 10 }}>Fluxo pós-envio (colunas da direita da planilha)</p>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <Bd c="green">Enviada</Bd><span style={{ color: C.dim }}>→</span>
        <Bd c="purple">CONFIRMAÇÃO (texto livre com quem/canal/data)</Bd><span style={{ color: C.dim }}>→</span>
        <Bd c="cyan">INTERESSE DE NEGOCIAÇÃO (SIM/NÃO)</Bd><span style={{ color: C.dim }}>→</span>
        <Bd c="amber">PEDIDO FECHADO (FECHADO/SIM)</Bd>
      </div>
      <Warn title="Modelagem do pós-envio">
        Esses 3 campos são o pipeline pós-proposta. No Arali Flow, mapear como:
        <strong> confirmacao</strong> → decompor em: <Mono>confirmado_por text</Mono>, <Mono>canal_confirmacao enum (whatsapp|email)</Mono>, <Mono>confirmado_em date</Mono>.
        <strong> interesse_negociacao</strong> → <Mono>boolean DEFAULT null</Mono>.
        <strong> pedido_fechado</strong> → <Mono>boolean DEFAULT false</Mono>. Quando true, trigger executa distribuição ao PCP.
      </Warn>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.bright, marginBottom: 10 }}>Status Comercial — do PROJETO (não do orçamento)</p>
      <p style={{ fontSize: 11.5, color: C.text, lineHeight: 1.7, marginBottom: 12 }}>
        A coluna "Status Comercial" indica a <strong>fase da obra do cliente</strong>, não do orçamento.
        É um atributo do Projeto, não da Proposta. 19 valores com typos — normalizar para enum.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {[
          { v: "CONCORRÊNCIA", n: 90, desc: "Arali disputando com outros fornecedores" },
          { v: "EM EXECUÇÃO", n: 146, desc: "Obra em andamento, Arali contratada" },
          { v: "INICIANDO", n: 36, desc: "Obra começando, primeiros orçamentos" },
          { v: "MANUTENÇÃO", n: 9, desc: "Pós-obra, serviços pontuais" },
          { v: "FINALIZADA", n: 7, desc: "Obra concluída" },
          { v: "REFORMA", n: 7, desc: "Projeto de reforma, não obra nova" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 6, padding: "8px 10px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.cyan }}>{s.v}</span>
              <span style={{ fontSize: 10, color: C.dim }}>{s.n}x</span>
            </div>
            <p style={{ fontSize: 10, color: C.dim, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ======= TAB 5: MODELO FINAL =======
const Modelo = () => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 800, color: C.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>Modelo de Dados Revisado — Propostas/Orçamentos</p>

    <div style={{ background: C.card, border: `1px solid ${C.green}33`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.green, marginBottom: 10 }}>Entidade: propostas (= cada linha da planilha)</p>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: C.text, lineHeight: 1.8, background: C.bg, borderRadius: 8, padding: 14, border: `1px solid ${C.border}`, whiteSpace: "pre-wrap" }}>
{`-- Cada linha da planilha = 1 proposta/orçamento
CREATE TABLE propostas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id      uuid NOT NULL REFERENCES projetos(id),
  pasta_projeto_id uuid REFERENCES pastas_projeto(id),

  -- TAG decomposta
  tag_raw         text NOT NULL,           -- "E01 R02 CD" preservado
  tipo_tag        text NOT NULL DEFAULT 'novo'
    CHECK (tipo_tag IN ('novo','etapa','revisao',
                        'etapa_revisao','manutencao')),
  numero_etapa    int,                     -- NULL se N ou R puro
  numero_revisao  int,                     -- NULL se N ou E puro
  is_credito_debito boolean NOT NULL DEFAULT false,

  -- Identificação
  tipo_proposta   text NOT NULL,           -- "PM/PN/FR", "MOBILIÁRIO"
  solicitante     text,
  construtora_id  uuid REFERENCES parceiros(id),
  arquitetura_id  uuid REFERENCES parceiros(id),
  gerenciadora_id uuid REFERENCES parceiros(id),
  status_comercial text,                   -- enum do projeto

  -- Valores
  valor           numeric(12,2),           -- pode ser NULL (em elab.)
  endereco        text,

  -- Status da proposta
  status          text NOT NULL DEFAULT 'rascunho'
    CHECK (status IN (
      'rascunho','priorizada','em_elaboracao',
      'aguardando_validacao','enviada',
      'pausada','cancelada','nfp'
    )),

  -- Pessoas
  elaborado_por_id  uuid REFERENCES integrantes(id),
  validado_por_id   uuid REFERENCES integrantes(id),  -- ← ERA "FATOR"
  observacoes       text,

  -- Timeline
  data_entrada      date NOT NULL,         -- coluna "Data"
  enviado_em        date,                  -- "Data de Envio"

  -- Pós-envio
  confirmado_por    text,
  canal_confirmacao text CHECK (canal_confirmacao IN
                    ('whatsapp','email','presencial')),
  confirmado_em     date,
  interesse_negociacao boolean,
  pedido_fechado    boolean NOT NULL DEFAULT false,

  -- Auditoria
  criado_por_id     uuid NOT NULL REFERENCES integrantes(id),
  criado_em         timestamptz NOT NULL DEFAULT now(),
  atualizado_em     timestamptz NOT NULL DEFAULT now(),
  deletado_em       timestamptz
);`}
      </div>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.amber}33`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.amber, marginBottom: 10 }}>Decisões Arquiteturais</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { q: "propostas_etapas como tabela filha separada?", a: "NÃO. A planilha mostra que cada etapa é uma LINHA independente, com status, valor e elaborador próprios. Não há hierarquia pai-filho — cada orçamento é atômico. A decomposição da tag em campos (numero_etapa, numero_revisao) já permite agrupar por projeto." },
          { q: "Tipo de Proposta como enum?", a: "NÃO. São 149 valores únicos, muitos com combinações livres de siglas (PM/PN/FR/FCH/MOB/BR...). Manter como text livre com busca full-text. Fase futura: tabela de lookup com siglas normalizadas e tags múltiplas." },
          { q: "Fator numérico onde fica?", a: "NÃO está nesta planilha. Fica nos arquivos _SISTEMA.xlsx dentro da pasta do projeto. Na Phase 1, o campo validado_por_id é suficiente. O fator numérico entra quando a ferramenta de orçamento for digitalizada (Phase 3+)." },
          { q: "Status Comercial é do projeto ou da proposta?", a: "DO PROJETO. Os valores (EM EXECUÇÃO, CONCORRÊNCIA, etc.) descrevem a fase da obra, não do orçamento. Mas a planilha repete o valor em cada linha. Manter como campo na proposta para backwards-compat, mas a fonte de verdade é projetos.status_comercial." },
        ].map((d, i) => (
          <div key={i} style={{ background: C.bg, borderRadius: 8, padding: "10px 14px", border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: C.bright, marginBottom: 4 }}>{d.q}</p>
            <p style={{ fontSize: 11, color: C.text, lineHeight: 1.7 }}>{d.a}</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{ background: C.card, border: `1px solid ${C.red}33`, borderRadius: 10, padding: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: C.red, marginBottom: 10 }}>O que muda na migration 0002_comercial.sql já aplicada</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          "Adicionar campos: tag_raw, tipo_tag, numero_etapa, numero_revisao, is_credito_debito",
          "Renomear conceito 'fator' → validado_por_id (FK integrantes). NÃO é numeric.",
          "Adicionar campos pós-envio: confirmado_por, canal_confirmacao, confirmado_em, interesse_negociacao, pedido_fechado",
          "Adicionar campo solicitante text (diferente de construtora/arquitetura/gerenciadora)",
          "Adicionar status: priorizada, aguardando_validacao, nfp ao enum status_proposta",
          "Remover tabela propostas_revisoes (se existir) — revisão é uma LINHA com tag R[nn], não entidade filha",
          "Criar migration incremental 0002b_propostas_ajustes.sql para não quebrar o que já rodou",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 11, color: C.red, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
            <p style={{ fontSize: 11, color: C.text, lineHeight: 1.6 }}>{item}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ======= MAIN =======
export default function App() {
  const [tab, setTab] = useState("resumo");
  return (
    <div style={{ fontFamily: "'SF Pro Text', -apple-system, sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <div style={{ padding: "20px 24px 12px", borderBottom: `1px solid ${C.border}` }}>
        <h1 style={{ fontSize: 15, fontWeight: 800, color: C.bright, letterSpacing: "-0.3px", margin: 0 }}>
          Planilha Controle de Orçamento — Análise Completa
        </h1>
        <p style={{ fontSize: 10.5, color: C.dim, marginTop: 3 }}>742 linhas · 20 colunas · 47 projetos multi-etapa · Phase 1 ESQUADRO</p>
      </div>
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, padding: "0 24px", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 16px", fontSize: 11, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer",
            color: tab === t.id ? C.blue : C.dim, borderBottom: tab === t.id ? `2px solid ${C.blue}` : "2px solid transparent",
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: "12px 24px 40px" }}>
        {tab === "resumo" && <Resumo />}
        {tab === "colunas" && <Colunas />}
        {tab === "tag" && <Tags />}
        {tab === "status" && <Status />}
        {tab === "modelo" && <Modelo />}
      </div>
    </div>
  );
}
