# SGCE

Sistema de gestão esportiva. Projeto de extensão da UFPA (Extensão III), desenvolvido por uma equipe de 11 pessoas.

Esta versão é o protótipo do front-end: os dados ficam em memória e não há backend.

## Perfis

- **Administrador**: painel, campeonatos, equipes, atletas, sorteios e recursos
- **Representante**: campeonatos, equipes, atletas e recursos
- **Atleta**: competições, partidas e carteirinha

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui e Recharts.

## Executar

```bash
pnpm install
pnpm dev
```

Contas de demonstração (em `lib/store.ts`): `admin@sgce.com`, `representante@sgce.com` e `atleta@sgce.com`.
