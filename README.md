# Sharp.ai — Painel Admin

App web standalone para administração do Sharp.ai. Vite + React + Recharts.
Consome a API do backend (`/admin/*`), protegida por login de admin (`isAdmin`).

## Seções
- **Dashboard** — usuários, MRR, conversão, bilhetes, taxa de acerto + gráficos (30 dias)
- **Precisão** — taxa de acerto por usuário, distribuição, ranking
- **Usuários** — listar/buscar, mudar plano, promover/remover admin, excluir
- **Bilhetes** — todos os bilhetes com filtro por status
- **Desempenho IA** — taxa de acerto por mercado
- **Financeiro** — assinaturas, comissões, top afiliados

## Rodar local
```bash
npm install
npm run dev          # http://localhost:5180
```
Por padrão aponta para o backend de produção. Para apontar para outro:
```bash
VITE_API_URL=http://localhost:3333/api npm run dev
```

## Deploy (EasyPanel)
1. Crie um serviço novo apontando para este repositório
2. Build via Dockerfile (já incluso)
3. Defina o build-arg / variável: `VITE_API_URL=https://<seu-backend>/api`
4. Deploy

## Acesso
Só usuários com `isAdmin = true` no banco conseguem entrar. Login usa o mesmo
email/senha do app. Para tornar um usuário admin:
```sql
UPDATE users SET is_admin = true WHERE email = 'seu@email.com';
```
