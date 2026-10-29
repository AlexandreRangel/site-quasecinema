# site-quasecinema

Site institucional estático da **Quase Cinema Lab** (QUASE CINEMA LAB LTDA). HTML, CSS e JS puros, sem build.

Preview (GitHub Pages): https://alexandrerangel.github.io/site-quasecinema/

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Home: Arte e Tecnologia, software sob encomenda, apps, visuais ao vivo |
| `sobre.html` | Empresa: razão social, CNPJ, endereço, contatos, missão |
| `suporte.html` | Suporte e FAQ do Tecno Tarot e apps (Support URL para as lojas) |
| `privacidade.html` | Política de Privacidade PT + EN (Privacy Policy URL para as lojas) |

Idioma: português por padrão; inglês com `?lang=en` na mesma página (ex.: `suporte.html?lang=en`). O idioma é mantido nos links internos.

Arquivos compartilhados: `css/site.css`, `js/site.js` (i18n, fundo animado em canvas que fica estático com `prefers-reduced-motion` e pausa com a aba oculta), `assets/logo.svg`, `assets/favicon.svg`, `robots.txt`, `sitemap.xml`, `.nojekyll`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar no GitHub Pages

1. Settings > Pages.
2. Source: *Deploy from a branch*. Branch: `main`, pasta `/ (root)`.
3. Salvar. Em 1 ou 2 minutos o site aparece em https://alexandrerangel.github.io/site-quasecinema/

GitHub Pages também serve as páginas sem extensão (`/suporte`, `/privacidade`).

## Domínio quasecinema.org (depois, só com aprovação do Alexandre)

O domínio custom **não** está configurado e este repo **não** tem arquivo `CNAME`. Quando houver aprovação:

1. No DNS de quasecinema.org, criar registros `A` do apex para 185.199.108.153, 185.199.109.153, 185.199.110.153 e 185.199.111.153 (e `AAAA` se desejar), e `CNAME` de `www` para `alexandrerangel.github.io`.
2. Em Settings > Pages > Custom domain, informar `quasecinema.org` (isso cria o arquivo `CNAME`) e ativar *Enforce HTTPS*.
3. Trocar as URLs de `sitemap.xml` e `robots.txt` para `https://quasecinema.org/`.
4. URLs finais para as lojas: `https://quasecinema.org/suporte` e `https://quasecinema.org/privacidade`.

Atenção: se o e-mail do domínio usa registros MX, não alterá-los ao mexer no DNS.

## Regras de conteúdo

- Não publicar CPF, contatos do contador nem lista de CNAEs.
- Não citar clientes sob NDA; se preciso, "multinacional de tecnologia".
- O software se escreve sempre `quasi-dj` (minúsculo, com hífen).
- Sem travessões no texto; usar hífen ou reescrever.
