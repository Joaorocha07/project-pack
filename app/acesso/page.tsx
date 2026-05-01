'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Eye,
  Folder,
  Grid2X2,
  KeyRound,
  Loader2,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { clearSession, getMe, isAdminRole, type User } from '@/lib/auth';
import capaAcessorios from '@/images/capa-figurinhas/acessórios.png';
import capaAchadinhosShopee from '@/images/capa-figurinhas/ACHADINHOS-SHOPEE.png';
import capaBarbie from '@/images/capa-figurinhas/BARBIE.png';
import capaBronzeamento from '@/images/capa-figurinhas/BRONZEAMENTO.png';
import capaDentista from '@/images/capa-figurinhas/DENTISTA.png';
import capaEstetica from '@/images/capa-figurinhas/ESTÉTICA.png';
import capaFrasesUniversais from '@/images/capa-figurinhas/FRASES-UNIVERSAIS.png';
import capaIfood from '@/images/capa-figurinhas/IFOOD.png';
import capaJogosSlots from '@/images/capa-figurinhas/JOGOS-DE-SLOTS.png';
import capaTransparente from '@/images/capa-figurinhas/TRANSPARENTE.png';
import figurinha01 from '@/images/figurinha01.webp';
import figurinha02 from '@/images/figurinha02.webp';
import figurinha03 from '@/images/figurinha03.webp';
import figurinha04 from '@/images/figurinha04.webp';
import figurinha05 from '@/images/figurinha05.webp';

type ProductCategory = {
  id: string;
  title: string;
  description: string;
  count: string;
  cover: StaticImageData;
  previews: StaticImageData[];
  accent: string;
};

type ProtectedStickerImage = {
  id: string;
  name: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  url: string;
  downloadUrl: string;
};

type ProtectedStickerCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  totalStickers: number;
  coverUrl: string | null;
  coverImageUrl?: string | null;
  coverImage?: {
    url?: string | null;
  } | null;
};

const productCategories: ProductCategory[] = [
  {
    id: 'acessorios',
    title: 'Acessórios',
    description: 'Figurinhas para compor stories de moda, beleza, estilo, presentes e detalhes visuais.',
    count: 'Nicho organizado',
    cover: capaAcessorios,
    previews: [figurinha01, figurinha02, figurinha03, figurinha04, figurinha05],
    accent: 'bg-emerald-400 text-black',
  },
  {
    id: 'achadinhos-shopee',
    title: 'Achadinhos Shopee',
    description: 'Artes para divulgar ofertas, garimpos, links de afiliado e listas de produtos.',
    count: 'Vendas e afiliados',
    cover: capaAchadinhosShopee,
    previews: [figurinha01, figurinha04, figurinha05],
    accent: 'bg-cyan-300 text-black',
  },
  {
    id: 'barbie',
    title: 'Barbie',
    description: 'Elementos com visual divertido e feminino para stories, datas especiais e campanhas.',
    count: 'Tema especial',
    cover: capaBarbie,
    previews: [figurinha01, figurinha02, figurinha03],
    accent: 'bg-fuchsia-300 text-black',
  },
  {
    id: 'bronzeamento',
    title: 'Bronzeamento',
    description: 'Figurinhas para agenda, procedimentos, resultados, promocoes e rotina de bronze.',
    count: 'Beleza e estética',
    cover: capaBronzeamento,
    previews: [figurinha02, figurinha03, figurinha05],
    accent: 'bg-amber-300 text-black',
  },
  {
    id: 'dentista',
    title: 'Dentista',
    description: 'Conteudos visuais para clinicas, procedimentos, cuidados, agenda e antes/depois.',
    count: 'Saude e servicos',
    cover: capaDentista,
    previews: [figurinha03, figurinha01, figurinha04],
    accent: 'bg-sky-300 text-black',
  },
  {
    id: 'estetica',
    title: 'Estética',
    description: 'Materiais para procedimentos, promocoes, resultados, depoimentos e chamadas.',
    count: 'Beleza profissional',
    cover: capaEstetica,
    previews: [figurinha04, figurinha05, figurinha01],
    accent: 'bg-lime-300 text-black',
  },
  {
    id: 'frases-universais',
    title: 'Frases Universais',
    description: 'Frases prontas para engajamento, rotina, motivacao, caixinhas e stories diarios.',
    count: 'Uso diario',
    cover: capaFrasesUniversais,
    previews: [figurinha05, figurinha01, figurinha02],
    accent: 'bg-violet-300 text-black',
  },
  {
    id: 'ifood',
    title: 'iFood',
    description: 'Figurinhas para restaurantes, delivery, combos, promocoes e chamadas de pedido.',
    count: 'Delivery',
    cover: capaIfood,
    previews: [figurinha01, figurinha03, figurinha05],
    accent: 'bg-red-300 text-black',
  },
  {
    id: 'jogos-de-slots',
    title: 'Jogos de Slots',
    description: 'Elementos para conteudos de apostas, chamadas, bonus, resultados e comunidades.',
    count: 'Entretenimento',
    cover: capaJogosSlots,
    previews: [figurinha02, figurinha04, figurinha05],
    accent: 'bg-orange-300 text-black',
  },
  {
    id: 'transparente',
    title: 'Transparente',
    description: 'Pack base com elementos em fundo transparente para montar stories com liberdade.',
    count: 'Base criativa',
    cover: capaTransparente,
    previews: [figurinha03, figurinha04, figurinha01],
    accent: 'bg-zinc-200 text-black',
  },
];

export default function AccessPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [selectedProtectedCategory, setSelectedProtectedCategory] = useState<ProtectedStickerCategory | null>(null);
  const [protectedImagesByCategory, setProtectedImagesByCategory] = useState<Record<string, ProtectedStickerImage[]>>({});
  const [protectedCategories, setProtectedCategories] = useState<ProtectedStickerCategory[]>([]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return productCategories;
    }

    return productCategories.filter((category) =>
      `${category.title} ${category.description}`.toLowerCase().includes(normalizedQuery)
    );
  }, [query]);

  const filteredProtectedCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categories = protectedCategories;

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      `${category.title} ${category.description}`.toLowerCase().includes(normalizedQuery)
    );
  }, [protectedCategories, query]);

  const selectedProtectedStickers = useMemo(() => {
    if (!selectedProtectedCategory) {
      return [];
    }

    return protectedImagesByCategory[selectedProtectedCategory.id] ?? [];
  }, [protectedImagesByCategory, selectedProtectedCategory]);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      try {
        const currentUser = await getMe();

        if (!isMounted) {
          return;
        }

        if (currentUser.temporaryPassword) {
          router.replace('/trocar-senha');
          return;
        }

        if (isAdminRole(currentUser.role)) {
          router.replace('/admin');
          return;
        }

        setUser(currentUser);

        const stickersResponse = await fetch('/api/stickers/categories', {
          credentials: 'include',
          cache: 'no-store',
        });
        const stickersData = (await stickersResponse.json().catch(() => ({}))) as {
          categories?: ProtectedStickerCategory[];
          error?: string;
        };

        if (!stickersResponse.ok) {
          throw new Error(stickersData.error || 'Nao foi possivel carregar as figurinhas protegidas.');
        }

        if (isMounted) {
          setProtectedCategories((stickersData.categories ?? []).map(normalizeCategory));
        }
      } catch {
        if (isMounted) {
          router.replace('/login');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await clearSession();
    router.replace('/login');
  }

  async function openProtectedCategory(category: ProtectedStickerCategory) {
    setSelectedProtectedCategory(category);

    if (protectedImagesByCategory[category.id]) {
      return;
    }

    const response = await fetch(`/api/stickers/categories/${encodeURIComponent(category.id)}/images`, {
      credentials: 'include',
    });
    const data = (await response.json().catch(() => ({}))) as {
      images?: ProtectedStickerImage[];
      error?: string;
    };

    if (!response.ok) {
      setError(data.error || 'Nao foi possivel carregar as figurinhas da categoria.');
      return;
    }

    setProtectedImagesByCategory((current) => ({
      ...current,
      [category.id]: (data.images ?? []).map(normalizeImage),
    }));
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando seu acesso
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs text-zinc-500">Pack do Criador</p>
            <h1 className="text-lg font-semibold text-white sm:text-xl">Area do produto</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="hidden gap-2 sm:inline-flex"
              onClick={() => router.push('/trocar-senha')}
            >
              <KeyRound className="h-4 w-4" />
              Trocar senha
            </Button>
            <Button variant="outline" className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:py-10">
        <div className="mb-8 grid gap-5 border-b border-white/10 pb-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400 text-black">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Conteudos liberados</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Bem-vindo, {user?.name || 'criador'}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Navegue pelos packs separados por categoria, visualize as figurinhas e baixe o material direto por aqui.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-4">
            <p className="text-sm font-medium text-white">Conta</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="mt-1 break-all text-zinc-200">{user?.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-zinc-500">Status</dt>
                <dd className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Acesso liberado
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-6 border-red-500/30 bg-red-500/10">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              <Grid2X2 className="h-4 w-4" />
              Vitrine
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-white">Packs de figurinhas</h3>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 border-white/10 bg-zinc-950 pl-10 text-white placeholder:text-zinc-600"
              placeholder="Buscar por categoria"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProtectedCategories.map((category) => (
            <article key={category.id} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
              <button
                type="button"
                className="group block w-full text-left"
                onClick={() => openProtectedCategory(category)}
              >
                <div className="relative aspect-[108/159] overflow-hidden bg-black">
                  {category.coverUrl ? (
                    <img
                      src={category.coverUrl}
                      alt=""
                      className="h-full w-full object-contain p-6 transition duration-300 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-emerald-400 text-black">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-300">
                      {category.totalStickers} figurinhas
                    </p>
                    <h4 className="mt-1 text-xl font-semibold text-white">{category.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-300">
                      {category.description || 'Pack de figurinhas protegido.'}
                    </p>
                  </div>
                </div>
              </button>

              <div className="space-y-3 p-3">
                <Button variant="secondary" className="w-full gap-2" onClick={() => openProtectedCategory(category)}>
                  <Eye className="h-4 w-4" />
                  Ver figurinhas
                </Button>
              </div>
            </article>
          ))}

        </div>

        {!filteredProtectedCategories.length ? (
          <div className="mt-10 rounded-lg border border-white/10 bg-zinc-950 p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-zinc-500" />
            <p className="mt-3 text-sm text-zinc-400">Nenhuma categoria encontrada para essa busca.</p>
          </div>
        ) : null}
      </section>

      <Dialog open={Boolean(selectedCategory)} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        {selectedCategory ? (
          <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-white/10 bg-zinc-950 p-0 text-white">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1fr]">
              <div className="relative aspect-[108/159] min-h-[320px] bg-black lg:min-h-[620px]">
                <Image
                  src={selectedCategory.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-contain"
                  placeholder="blur"
                />
              </div>

              <div className="p-5 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white">{selectedCategory.title}</DialogTitle>
                  <DialogDescription className="leading-6 text-zinc-400">
                    {selectedCategory.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {selectedCategory.previews.map((preview, index) => (
                    <a
                      key={`${selectedCategory.id}-preview-${index}`}
                      href={preview.src}
                      download
                      className="group relative aspect-square overflow-hidden rounded-md border border-white/10 bg-black"
                    >
                      <Image src={preview} alt="" fill sizes="120px" className="object-cover transition group-hover:scale-105" placeholder="blur" />
                      <span className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5 text-white">
                        <Download className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Button asChild className="gap-2">
                    <a href={selectedCategory.cover.src} download>
                      <Download className="h-4 w-4" />
                      Baixar capa do pack
                    </a>
                  </Button>
                  <Button variant="secondary" className="gap-2" onClick={() => router.push('/trocar-senha')}>
                    <KeyRound className="h-4 w-4" />
                    Trocar senha
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={Boolean(selectedProtectedCategory)} onOpenChange={(open) => !open && setSelectedProtectedCategory(null)}>
        {selectedProtectedCategory ? (
          <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto border-white/10 bg-zinc-950 p-5 text-white sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">{selectedProtectedCategory.title}</DialogTitle>
              <DialogDescription className="leading-6 text-zinc-400">
                {selectedProtectedCategory.description || `${selectedProtectedCategory.totalStickers} figurinhas disponiveis para baixar.`}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {selectedProtectedStickers.map((sticker) => (
                <a
                  key={sticker.id}
                  href={sticker.downloadUrl}
                  download
                  className="group overflow-hidden rounded-md border border-white/10 bg-black"
                >
                  <div className="flex aspect-square items-center justify-center p-4">
                    <img
                      src={sticker.url}
                      alt=""
                      className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-white/10 p-3">
                    <span className="truncate text-xs text-zinc-300">{sticker.name}</span>
                    <Download className="h-4 w-4 shrink-0 text-zinc-400" />
                  </div>
                </a>
              ))}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </main>
  );
}

function normalizeCategory(category: ProtectedStickerCategory) {
  const coverUrl = category.coverUrl ?? category.coverImageUrl ?? category.coverImage?.url ?? null;
  const totalStickers = Number(
    (category as ProtectedStickerCategory & { count?: number }).totalStickers ??
    (category as ProtectedStickerCategory & { count?: number }).count ??
    0
  );

  return {
    ...category,
    totalStickers,
    coverUrl: normalizeProtectedUrl(coverUrl),
  };
}

function normalizeImage(image: ProtectedStickerImage) {
  return {
    ...image,
    name: image.name || image.originalName || 'figurinha',
    url: normalizeProtectedUrl(image.url) ?? '',
    downloadUrl: normalizeProtectedUrl(image.downloadUrl) ?? '',
  };
}

function normalizeProtectedUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/api/')) {
    return url;
  }

  return url.startsWith('/') ? `/api${url}` : `/api/${url}`;
}
