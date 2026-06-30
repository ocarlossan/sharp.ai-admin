import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { api, token } from './api';
import { T, CHART_COLORS } from './theme';

// ─── Login ──────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api<{ token: string; user: { isAdmin: boolean } }>('/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      });
      if (!res.user?.isAdmin) {
        setError('Esta conta não é administradora.');
        setLoading(false);
        return;
      }
      token.set(res.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar.');
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 380, background: T.surface, borderRadius: 16, padding: 32, border: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Logo />
          <span style={{ fontSize: 20, fontWeight: 800 }}>Sharp.ai</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, background: T.accentSoft, padding: '2px 8px', borderRadius: 6 }}>ADMIN</span>
        </div>
        <p style={{ color: T.textMid, fontSize: 13, marginBottom: 24 }}>Acesso restrito ao administrador</p>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="admin@sharp.ai" />
        <Field label="Senha" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <div style={{ color: T.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: T.textMid, marginBottom: 6, fontWeight: 600 }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 14, outline: 'none' }}
      />
    </div>
  );
}

function Logo() {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 12, height: 12, background: '#fff', transform: 'rotate(45deg)', borderRadius: 2 }} />
    </div>
  );
}

// ─── Shell (sidebar + conteúdo) ─────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◧' },
  { id: 'precisao', label: 'Precisão', icon: '◔' },
  { id: 'usuarios', label: 'Usuários', icon: '☰' },
  { id: 'bilhetes', label: 'Bilhetes', icon: '▤' },
  { id: 'ia', label: 'Desempenho IA', icon: '◇' },
  { id: 'financeiro', label: 'Financeiro', icon: '$' },
] as const;

function Shell() {
  const [tab, setTab] = useState<string>('dashboard');
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, padding: 16, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, padding: '4px 8px' }}>
          <Logo />
          <span style={{ fontSize: 16, fontWeight: 800 }}>Sharp.ai</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.accent, background: T.accentSoft, padding: '2px 6px', borderRadius: 5 }}>ADMIN</span>
        </div>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 12px', marginBottom: 4,
            borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, textAlign: 'left',
            background: tab === t.id ? T.accentSoft : 'transparent',
            color: tab === t.id ? T.accent : T.textMid,
          }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
          </button>
        ))}
        <button onClick={() => { token.clear(); location.reload(); }} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 12px', marginTop: 24,
          borderRadius: 9, border: `1px solid ${T.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: 'transparent', color: T.textDim,
        }}>↩ Sair</button>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'precisao' && <Precisao />}
        {tab === 'usuarios' && <Usuarios />}
        {tab === 'bilhetes' && <Bilhetes />}
        {tab === 'ia' && <DesempenhoIA />}
        {tab === 'financeiro' && <Financeiro />}
      </main>
    </div>
  );
}

// ─── Helpers de UI ──────────────────────────────────────────────────
const card: React.CSSProperties = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 };

function H1({ children }: any) {
  return <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>{children}</h1>;
}

function Stat({ label, value, color, sub }: { label: string; value: string | number; color?: string; sub?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, color: T.textDim, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: color || T.text, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function useFetch<T>(path: string): { data: T | null; loading: boolean; error: string; reload: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    api<T>(path)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [path, tick]);
  return { data, loading, error, reload: () => setTick((t) => t + 1) };
}

function Loading() { return <div style={{ color: T.textMid, padding: 40 }}>Carregando...</div>; }

const tooltipStyle = { background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 12 };

// ─── Dashboard ──────────────────────────────────────────────────────
function Dashboard() {
  const { data: ov, loading } = useFetch<any>('/admin/overview');
  const { data: ch } = useFetch<any>('/admin/charts');
  if (loading || !ov) return <Loading />;
  return (
    <>
      <H1>Dashboard</H1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
        <Stat label="Usuários" value={ov.totalUsers} sub={`${ov.proUsers} Pro · ${ov.freeUsers} Free`} />
        <Stat label="MRR" value={`R$ ${ov.mrr}`} color={T.green} sub={`${ov.conversion}% conversão`} />
        <Stat label="Bilhetes" value={ov.totalTickets} sub={`${ov.ticketsPending} aguardando`} />
        <Stat label="Taxa de acerto" value={`${ov.winRate}%`} color={T.accent} sub={`${ov.ticketsWon}G · ${ov.ticketsLost}P`} />
      </div>
      {ch && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={card}>
            <ChartTitle>Bilhetes por dia (30d)</ChartTitle>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={ch.days}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="label" stroke={T.textDim} fontSize={10} interval={4} />
                <YAxis stroke={T.textDim} fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="tickets" stroke={T.accent} fill="url(#g1)" strokeWidth={2} name="Bilhetes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={card}>
            <ChartTitle>Novos usuários por dia (30d)</ChartTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ch.days}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="label" stroke={T.textDim} fontSize={10} interval={4} />
                <YAxis stroke={T.textDim} fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="signups" fill={T.blue} radius={[4, 4, 0, 0]} name="Cadastros" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ ...card, gridColumn: '1 / -1' }}>
            <ChartTitle>Ganhos vs Perdas por dia</ChartTitle>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={ch.days}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="label" stroke={T.textDim} fontSize={10} interval={4} />
                <YAxis stroke={T.textDim} fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="won" stroke={T.green} strokeWidth={2} name="Ganhou" dot={false} />
                <Line type="monotone" dataKey="lost" stroke={T.red} strokeWidth={2} name="Perdeu" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

function ChartTitle({ children }: any) {
  return <div style={{ fontSize: 12, color: T.textDim, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{children}</div>;
}

// ─── Precisão dos usuários ──────────────────────────────────────────
function Precisao() {
  const { data, loading } = useFetch<any>('/admin/user-precision');
  if (loading || !data) return <Loading />;
  return (
    <>
      <H1>Precisão dos usuários</H1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <ChartTitle>Distribuição por faixa de acerto</ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="faixa" stroke={T.textDim} fontSize={11} />
              <YAxis stroke={T.textDim} fontSize={10} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Usuários">
                {data.distribution.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <ChartTitle>Top 8 usuários por precisão</ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.users.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis type="number" stroke={T.textDim} fontSize={10} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" stroke={T.textDim} fontSize={10} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="precision" fill={T.accent} radius={[0, 4, 4, 0]} name="Precisão %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={card}>
        <ChartTitle>Ranking completo</ChartTitle>
        <Table
          cols={['Usuário', 'Plano', 'Bilhetes', 'Ganhou', 'Perdeu', 'Precisão']}
          rows={data.users.map((u: any) => [
            <div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: 11, color: T.textDim }}>{u.email}</div></div>,
            <Badge text={u.plan === 'pro' ? 'PRO' : 'FREE'} color={u.plan === 'pro' ? T.accent : T.textDim} />,
            u.total, <span style={{ color: T.green }}>{u.won}</span>, <span style={{ color: T.red }}>{u.lost}</span>,
            <strong style={{ color: precColor(u.precision) }}>{u.precision}%</strong>,
          ])}
        />
      </div>
    </>
  );
}

function precColor(p: number) { return p >= 60 ? T.green : p >= 40 ? T.amber : T.red; }

// ─── Usuários ───────────────────────────────────────────────────────
function Usuarios() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, reload } = useFetch<any>(`/admin/users?search=${encodeURIComponent(search)}&page=${page}`);

  async function toggle(id: string, field: 'plan' | 'isAdmin', value: any) {
    if (field === 'isAdmin' && !confirm('Alterar permissão de admin deste usuário?')) return;
    await api(`/admin/users/${id}`, { method: 'PATCH', body: { [field]: value } });
    reload();
  }
  async function remove(id: string, name: string) {
    if (!confirm(`Excluir o usuário "${name}" e todos os seus dados? Esta ação é irreversível.`)) return;
    await api(`/admin/users/${id}`, { method: 'DELETE' });
    reload();
  }

  return (
    <>
      <H1>Usuários</H1>
      <input
        placeholder="Buscar por nome ou email..." value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ width: '100%', maxWidth: 360, padding: 11, borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, color: T.text, fontSize: 14, marginBottom: 16, outline: 'none' }}
      />
      {loading || !data ? <Loading /> : (
        <div style={card}>
          <Table
            cols={['Usuário', 'Plano', 'Bilhetes', 'Indicados', 'Cadastro', 'Ações']}
            rows={data.users.map((u: any) => [
              <div>
                <div style={{ fontWeight: 600 }}>{u.name} {u.isAdmin && <Badge text="ADMIN" color={T.purple} />}</div>
                <div style={{ fontSize: 11, color: T.textDim }}>{u.email}</div>
              </div>,
              <select value={u.plan} onChange={(e) => toggle(u.id, 'plan', e.target.value)} style={selStyle}>
                <option value="free">Free</option><option value="pro">Pro</option>
              </select>,
              u.tickets, u.referrals,
              new Date(u.createdAt).toLocaleDateString('pt-BR'),
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => toggle(u.id, 'isAdmin', !u.isAdmin)} style={btnSm(T.blue)}>{u.isAdmin ? '↓ remover admin' : '↑ admin'}</button>
                <button onClick={() => remove(u.id, u.name)} style={btnSm(T.red)}>excluir</button>
              </div>,
            ])}
          />
          <Pager page={page} total={data.total} perPage={data.perPage} onPage={setPage} />
        </div>
      )}
    </>
  );
}

const selStyle: React.CSSProperties = { padding: '6px 8px', borderRadius: 7, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontSize: 12 };
function btnSm(color: string): React.CSSProperties {
  return { padding: '5px 9px', borderRadius: 7, border: `1px solid ${color}55`, background: 'transparent', color, fontSize: 11, fontWeight: 600, cursor: 'pointer' };
}

// ─── Bilhetes ───────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; color: string }> = {
  pendente: { label: 'Aguardando', color: T.textMid },
  em_andamento: { label: 'Em andamento', color: T.amber },
  bateu: { label: 'Ganhou', color: T.green },
  nao_bateu: { label: 'Perdeu', color: T.red },
  indefinido: { label: 'Indefinido', color: T.textDim },
};

function Bilhetes() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch<any>(`/admin/tickets?status=${status}&page=${page}`);
  return (
    <>
      <H1>Bilhetes</H1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', 'pendente', 'em_andamento', 'bateu', 'nao_bateu'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }} style={{
            padding: '7px 14px', borderRadius: 8, border: `1px solid ${T.border}`, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: status === s ? T.accentSoft : 'transparent', color: status === s ? T.accent : T.textMid,
          }}>{s === '' ? 'Todos' : STATUS_CFG[s]?.label}</button>
        ))}
      </div>
      {loading || !data ? <Loading /> : (
        <div style={card}>
          <Table
            cols={['Usuário', 'Jogos', 'Competição', 'Risco', 'Odd', 'Status', 'Data']}
            rows={data.tickets.map((t: any) => [
              t.user,
              <div style={{ fontSize: 13 }}>{(t.games || []).map((g: any) => `${g.home} x ${g.away}`).join(', ')}</div>,
              t.competition, t.risk, <strong>{t.oddTotal}</strong>,
              <Badge text={STATUS_CFG[t.status]?.label || t.status} color={STATUS_CFG[t.status]?.color || T.textDim} />,
              new Date(t.createdAt).toLocaleDateString('pt-BR'),
            ])}
          />
          <Pager page={page} total={data.total} perPage={data.perPage} onPage={setPage} />
        </div>
      )}
    </>
  );
}

// ─── Desempenho IA ──────────────────────────────────────────────────
function DesempenhoIA() {
  const { data, loading } = useFetch<any>('/admin/ai-performance');
  if (loading || !data) return <Loading />;
  return (
    <>
      <H1>Desempenho da IA</H1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
        <Stat label="Taxa geral" value={`${data.overall.rate}%`} color={T.accent} />
        <Stat label="Acertos" value={data.overall.hits} color={T.green} />
        <Stat label="Erros" value={data.overall.misses} color={T.red} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={card}>
          <ChartTitle>Taxa de acerto por mercado</ChartTitle>
          <ResponsiveContainer width="100%" height={Math.max(240, data.markets.length * 32)}>
            <BarChart data={data.markets} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis type="number" stroke={T.textDim} fontSize={10} domain={[0, 100]} />
              <YAxis type="category" dataKey="market" stroke={T.textDim} fontSize={10} width={130} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} name="Acerto %">
                {data.markets.map((m: any, i: number) => <Cell key={i} fill={precColor(m.rate)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <ChartTitle>Volume acertos x erros</ChartTitle>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[{ name: 'Acertos', value: data.overall.hits }, { name: 'Erros', value: data.overall.misses }]}
                dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                <Cell fill={T.green} /><Cell fill={T.red} />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <Table
          cols={['Mercado', 'Acertos', 'Erros', 'Total', 'Taxa']}
          rows={data.markets.map((m: any) => [
            m.market, <span style={{ color: T.green }}>{m.hits}</span>, <span style={{ color: T.red }}>{m.misses}</span>,
            m.total, <strong style={{ color: precColor(m.rate) }}>{m.rate}%</strong>,
          ])}
        />
      </div>
    </>
  );
}

// ─── Financeiro ─────────────────────────────────────────────────────
function Financeiro() {
  const { data, loading } = useFetch<any>('/admin/financial');
  if (loading || !data) return <Loading />;
  return (
    <>
      <H1>Financeiro & Afiliados</H1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
        <Stat label="MRR (assinaturas ativas)" value={`R$ ${data.mrr}`} color={T.green} />
        <Stat label="Assinaturas ativas" value={data.assinaturasAtivas} />
        <Stat label="Comissões pagas" value={`R$ ${data.comissoesTotal}`} color={T.amber} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <ChartTitle>Top afiliados (indicações)</ChartTitle>
          <Table
            cols={['Afiliado', 'Código', 'Indicados']}
            rows={data.topAfiliados.map((a: any) => [
              <div><div style={{ fontWeight: 600 }}>{a.name}</div><div style={{ fontSize: 11, color: T.textDim }}>{a.email}</div></div>,
              <code style={{ fontSize: 12, color: T.accent }}>{a.code}</code>,
              <strong>{a.indicados}</strong>,
            ])}
          />
        </div>
        <div style={card}>
          <ChartTitle>Comissões recentes</ChartTitle>
          <Table
            cols={['Afiliado', 'Valor', '%', 'Período']}
            rows={data.comissoes.map((c: any) => [c.afiliado, `R$ ${c.amount}`, `${c.pct}%`, c.period])}
          />
        </div>
      </div>
      <div style={card}>
        <ChartTitle>Assinaturas</ChartTitle>
        <Table
          cols={['Usuário', 'Status', 'Valor', 'Próx. cobrança', 'Criada']}
          rows={data.assinaturas.map((s: any) => [
            s.user,
            <Badge text={s.status} color={s.status === 'ativa' ? T.green : s.status === 'cancelada' ? T.red : T.amber} />,
            `R$ ${s.amount}`,
            s.nextChargeAt ? new Date(s.nextChargeAt).toLocaleDateString('pt-BR') : '—',
            new Date(s.createdAt).toLocaleDateString('pt-BR'),
          ])}
        />
      </div>
    </>
  );
}

// ─── Componentes compartilhados ─────────────────────────────────────
function Badge({ text, color }: { text: string; color: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}22`, padding: '2px 7px', borderRadius: 5, marginLeft: 4 }}>{text}</span>;
}

function Table({ cols, rows }: { cols: string[]; rows: any[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>{cols.map((c) => <th key={c} style={{ textAlign: 'left', padding: '8px 10px', color: T.textDim, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${T.border}` }}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: 24, color: T.textDim, textAlign: 'center' }}>Nenhum registro.</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${T.border}55` }}>
              {r.map((cell, j) => <td key={j} style={{ padding: '10px' }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pager({ page, total, perPage, onPage }: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const pages = Math.ceil(total / perPage) || 1;
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 13, color: T.textMid }}>
      <span>{total} registros · página {page}/{pages}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} style={pagerBtn(page <= 1)}>‹ Anterior</button>
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} style={pagerBtn(page >= pages)}>Próxima ›</button>
      </div>
    </div>
  );
}
function pagerBtn(disabled: boolean): React.CSSProperties {
  return { padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: disabled ? T.textDim : T.text, fontSize: 12, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 };
}

// ─── App ────────────────────────────────────────────────────────────
export function App() {
  const [authed, setAuthed] = useState(!!token.get());
  return authed ? <Shell /> : <Login onLogin={() => setAuthed(true)} />;
}
