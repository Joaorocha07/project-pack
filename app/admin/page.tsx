'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, DownloadCloud, FolderPlus, ImagePlus, Loader2, LogOut, Pencil, RefreshCw, Star, Trash2, Upload, Users, X } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clearSession, getMe, importCaktoPurchases, isAdminRole, type ImportCaktoSummary, type User } from '@/lib/auth';

const emptySummary: ImportCaktoSummary = {
  totalOrdersRead: 0,
  paidPackOrders: 0,
  imported: 0,
  skipped: 0,
  emailsSent: 0,
};
const IMAGES_PER_PAGE = 24;
const IMAGE_BATCH_SIZE = 60;
const VERCEL_SAFE_UPLOAD_BYTES = Math.floor(3.8 * 1024 * 1024);
const MAX_STICKER_IMAGE_DIMENSION = 1600;

type StickerCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  totalStickers: number;
  total_stickers?: number;
  coverImageId?: string | null;
  cover_image_id?: string | null;
  coverUrl: string | null;
  cover_url?: string | null;
  coverImageUrl?: string | null;
  cover_image_url?: string | null;
  coverImage?: {
    url?: string | null;
  } | null;
  cover_image?: {
    url?: string | null;
  } | null;
};

type StickerImage = {
  id: string;
  name: string;
  originalName: string;
  original_name?: string;
  mimeType: string;
  mime_type?: string;
  size: number;
  url: string;
  downloadUrl: string;
  download_url?: string;
  imageUrl?: string;
  image_url?: string;
  createdAt: string;
};

type StorageUsage = {
  label?: string;
  description?: string;
  currentBytes: number;
  currentMb?: number;
  currentFormatted?: string;
  limitBytes: number | null;
  limitMb?: number | null;
  limitFormatted?: string | null;
  percentUsed?: number | null;
  remainingBytes?: number | null;
  remainingMb?: number | null;
  uploadBytes?: number;
  nextBytes?: number;
  isLimitEnabled?: boolean;
  isOverLimit?: boolean;
  wouldExceedLimit?: boolean;
  shouldBlockUploads?: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<User | null>(null);
  const [summary, setSummary] = useState<ImportCaktoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isUploadingSticker, setIsUploadingSticker] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [stickerCategory, setStickerCategory] = useState('acessorios');
  const [stickerCategories, setStickerCategories] = useState<StickerCategory[]>([]);
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null);
  const [isLoadingStorageUsage, setIsLoadingStorageUsage] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [newCategoryCover, setNewCategoryCover] = useState<File | null>(null);
  const [stickerFiles, setStickerFiles] = useState<File[]>([]);
  const [managedCategoryId, setManagedCategoryId] = useState('');
  const [managedImages, setManagedImages] = useState<StickerImage[]>([]);
  const [isLoadingManagedImages, setIsLoadingManagedImages] = useState(false);
  const [editCategoryTitle, setEditCategoryTitle] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');
  const [editingImageId, setEditingImageId] = useState('');
  const [editingImageName, setEditingImageName] = useState('');
  const [failedImageIds, setFailedImageIds] = useState<Record<string, string>>({});
  const [busyAction, setBusyAction] = useState('');
  const [imagePage, setImagePage] = useState(1);
  const [managedImageBatchPage, setManagedImageBatchPage] = useState(1);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const selectedUploadCategory = stickerCategories.find((category) => category.id === stickerCategory);
  const managedCategory = stickerCategories.find((category) => category.id === managedCategoryId);
  const selectedFolderSize = stickerFiles.reduce((total, file) => total + file.size, 0);
  const storageCurrentBytes = storageUsage?.currentBytes ?? 0;
  const storageNextBytes = storageCurrentBytes + selectedFolderSize;
  const storageLimitBytes = storageUsage?.limitBytes ?? null;
  const storagePercentUsed = getUsagePercent(storageUsage?.percentUsed, storageCurrentBytes, storageLimitBytes);
  const storageRemainingBytes = storageLimitBytes === null ? null : Math.max(0, storageLimitBytes - storageCurrentBytes);
  const storageWouldExceedLimit = Boolean(storageUsage?.shouldBlockUploads) || (storageLimitBytes !== null && storageNextBytes > storageLimitBytes);
  const totalImagePages = Math.max(1, Math.ceil(managedImages.length / IMAGES_PER_PAGE));
  const currentImagePage = Math.min(imagePage, totalImagePages);
  const paginatedManagedImages = managedImages.slice((currentImagePage - 1) * IMAGES_PER_PAGE, currentImagePage * IMAGES_PER_PAGE);
  const hasMoreManagedImages = Boolean(managedCategory && managedImages.length < managedCategory.totalStickers);

  useEffect(() => {
    if (!error && !success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError('');
      setSuccess('');
    }, 6000);

    return () => window.clearTimeout(timeoutId);
  }, [error, success]);

  useEffect(() => {
    let isMounted = true;

    async function validateAdmin() {
      try {
        const currentUser = await getMe();

        if (!isMounted) {
          return;
        }

        if (currentUser.temporaryPassword) {
          router.replace('/trocar-senha');
          return;
        }

        if (!isAdminRole(currentUser.role)) {
          router.replace('/acesso');
          return;
        }

        setAdmin(currentUser);
        await Promise.all([loadStickerCategories(), loadStorageUsage()]);
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

    validateAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await clearSession();
    router.replace('/login');
  }

  async function handleImport() {
    setError('');
    setSuccess('');
    setIsImporting(true);

    try {
      const data = await importCaktoPurchases(false, 20);
      setSummary({ ...emptySummary, ...data });
      setSuccess('Importacao concluida. Revise os usuarios e envie os acessos manualmente.');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao importar compradores.');
    } finally {
      setIsImporting(false);
    }
  }

  async function loadStickerCategories() {
    const response = await fetch('/api/admin/stickers/categories', {
      credentials: 'include',
      cache: 'no-store',
    });
    const data = (await response.json().catch(() => ({}))) as {
      categories?: StickerCategory[];
    };

    if (response.ok) {
      const categories = (data.categories ?? []).map(normalizeStickerCategory);
      setStickerCategories(categories);

      if (categories.length) {
        setStickerCategory((current) => categories.some((category) => category.id === current) ? current : categories[0].id);
        setManagedCategoryId((current) => categories.some((category) => category.id === current) ? current : categories[0].id);

        const currentManagedCategory = categories.find((category) => category.id === managedCategoryId) ?? categories[0];
        setEditCategoryTitle((current) => current || currentManagedCategory.title);
        setEditCategoryDescription((current) => current || currentManagedCategory.description);

        if (!managedImages.length) {
          void loadManagedCategoryImages(currentManagedCategory.id);
        }
      } else {
        setStickerCategory('');
        setManagedCategoryId('');
        setManagedImages([]);
        setEditCategoryTitle('');
        setEditCategoryDescription('');
      }
    }
  }

  async function loadStorageUsage() {
    setIsLoadingStorageUsage(true);

    try {
      const response = await fetch('/api/admin/stickers/storage-usage', {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = (await response.json().catch(() => ({}))) as {
        storage?: StorageUsage;
      };

      if (response.ok) {
        setStorageUsage(data.storage ?? null);
      }
    } finally {
      setIsLoadingStorageUsage(false);
    }
  }

  async function requestJson<T>(url: string, options: RequestInit = {}, fallback = 'Nao foi possivel concluir a acao.') {
    const headers = new Headers(options.headers);

    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers,
    });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string; message?: string };

    if (!response.ok) {
      throw new Error(data.error || data.message || `${fallback} Status ${response.status}.`);
    }

    return data;
  }

  async function loadManagedCategoryImages(categoryId = managedCategoryId, page = 1, resetPage = true) {
    if (!categoryId) {
      setManagedImages([]);
      return;
    }

    setIsLoadingManagedImages(true);

    try {
      const data = await requestJson<{ images?: StickerImage[] }>(
        `/api/stickers/categories/${encodeURIComponent(categoryId)}/images?page=${page}&limit=${IMAGE_BATCH_SIZE}`,
        { cache: 'no-store' },
        'Nao foi possivel carregar as figurinhas.'
      );

      const nextImages = (data.images ?? []).map(normalizeStickerImage);
      setManagedImages((current) => page === 1 ? nextImages : mergeImagesById(current, nextImages));
      setManagedImageBatchPage(page);
      setFailedImageIds({});
      if (resetPage) {
        setImagePage(1);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao carregar figurinhas.');
    } finally {
      setIsLoadingManagedImages(false);
    }
  }

  function handleManagedCategoryChange(categoryId: string) {
    const category = stickerCategories.find((item) => item.id === categoryId);

    setManagedCategoryId(categoryId);
    setEditCategoryTitle(category?.title ?? '');
    setEditCategoryDescription(category?.description ?? '');
    setEditingImageId('');
    setEditingImageName('');
    setManagedImageBatchPage(1);
    setImagePage(1);
    void loadManagedCategoryImages(categoryId, 1);
  }

  function handleLoadMoreManagedImages() {
    if (!managedCategoryId || isLoadingManagedImages) {
      return;
    }

    void loadManagedCategoryImages(managedCategoryId, managedImageBatchPage + 1, false);
  }

  async function handleNextManagedImagePage() {
    if (currentImagePage >= totalImagePages && hasMoreManagedImages) {
      await loadManagedCategoryImages(managedCategoryId, managedImageBatchPage + 1, false);
      setImagePage((page) => page + 1);
      return;
    }

    setImagePage((page) => Math.min(totalImagePages, page + 1));
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setError('');
    setSuccess('');
    setIsCreatingCategory(true);

    try {
      const response = await fetch('/api/admin/stickers/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: newCategoryTitle,
          description: newCategoryDescription,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        category?: StickerCategory;
      };

      if (!response.ok) {
        throw new Error(data.error || 'Nao foi possivel criar a categoria.');
      }

      if (newCategoryCover && data.category?.id) {
        const coverFormData = new FormData();
        coverFormData.append('files', newCategoryCover);

        const uploadResponse = await fetch(`/api/admin/stickers/categories/${encodeURIComponent(data.category.id)}/images`, {
          method: 'POST',
          body: coverFormData,
          credentials: 'include',
        });
        const uploadData = (await uploadResponse.json().catch(() => ({}))) as {
          error?: string;
          images?: Array<{ id: string }>;
        };

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Categoria criada, mas nao foi possivel enviar a capa.');
        }

        const coverImageId = uploadData.images?.[0]?.id;

        if (coverImageId) {
          const coverResponse = await fetch(`/api/admin/stickers/categories/${encodeURIComponent(data.category.id)}/cover`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ imageId: coverImageId }),
          });
          const coverData = (await coverResponse.json().catch(() => ({}))) as { error?: string };

          if (!coverResponse.ok) {
            throw new Error(coverData.error || 'Capa enviada, mas nao foi possivel vincular ao card.');
          }
        }
      }

      setNewCategoryTitle('');
      setNewCategoryDescription('');
      setNewCategoryCover(null);
      setSuccess('Categoria criada e pronta para receber figurinhas.');
      await Promise.all([loadStickerCategories(), loadStorageUsage()]);
      form.reset();

      if (data.category?.id) {
        setStickerCategory(data.category.id);
        handleManagedCategoryChange(data.category.id);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao criar categoria.');
    } finally {
      setIsCreatingCategory(false);
    }
  }

  async function handleStickerUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setError('');
    setSuccess('');

    if (!stickerFiles.length) {
      setError('Selecione uma pasta com figurinhas para enviar.');
      return;
    }

    if (!stickerCategories.length) {
      setError('Crie uma categoria antes de enviar figurinhas.');
      return;
    }

    const normalizedFiles = normalizeStickerUploadFiles(stickerFiles);

    if (!normalizedFiles.ok) {
      setError(normalizedFiles.error);
      return;
    }

    setIsUploadingSticker(true);

    try {
      setUploadProgress('Otimizando imagens antes do envio...');
      const optimizedFiles = await optimizePngFiles(normalizedFiles.files, (current, total) => {
        setUploadProgress(`Otimizando imagem ${current} de ${total}...`);
      });
      const batches = splitFilesForVercel(optimizedFiles);
      let uploaded = 0;

      for (let index = 0; index < batches.length; index += 1) {
        setUploadProgress(`Enviando lote ${index + 1} de ${batches.length}...`);
        const data = await uploadStickerBatch(stickerCategory, batches[index]);
        uploaded += data.uploaded ?? batches[index].length;
      }

      setStickerFiles([]);
      setSuccess(
        uploaded > 1
          ? `${uploaded} figurinhas enviadas com seguranca para a area protegida.`
          : 'Figurinha enviada com seguranca para a area protegida.'
      );
      await Promise.all([loadStickerCategories(), loadStorageUsage()]);
      await loadManagedCategoryImages(stickerCategory);
      form.reset();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao enviar figurinha.');
    } finally {
      setIsUploadingSticker(false);
      setUploadProgress('');
    }
  }

  async function uploadStickerBatch(categoryId: string, files: File[]) {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    const response = await fetch(`/api/admin/stickers/categories/${encodeURIComponent(categoryId)}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      uploaded?: number;
      category?: StickerCategory;
    };

    if (!response.ok) {
      throw new Error(data.error || data.message || `Nao foi possivel enviar a figurinha. Status ${response.status}.`);
    }

    return data;
  }

  async function handleUpdateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!managedCategoryId) {
      setError('Selecione uma categoria para editar.');
      return;
    }

    setBusyAction('update-category');
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/categories/${encodeURIComponent(managedCategoryId)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editCategoryTitle,
          description: editCategoryDescription,
        }),
      }, 'Nao foi possivel atualizar a categoria.');
      setSuccess('Categoria atualizada.');
      await loadStickerCategories();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao atualizar categoria.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleDeleteCategory() {
    if (!managedCategoryId || !managedCategory) {
      return;
    }

    if (!window.confirm(`Excluir a categoria "${managedCategory.title}"? Essa acao nao pode ser desfeita.`)) {
      return;
    }

    setBusyAction('delete-category');
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/categories/${encodeURIComponent(managedCategoryId)}`, {
        method: 'DELETE',
      }, 'Nao foi possivel excluir a categoria.');
      setSuccess('Categoria excluida.');
      setManagedImages([]);
      setManagedCategoryId('');
      await Promise.all([loadStickerCategories(), loadStorageUsage()]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao excluir categoria.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleSetCover(imageId: string) {
    if (!managedCategoryId) {
      return;
    }

    setBusyAction(`cover-${imageId}`);
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/categories/${encodeURIComponent(managedCategoryId)}/cover`, {
        method: 'PUT',
        body: JSON.stringify({ imageId }),
      }, 'Nao foi possivel definir a capa.');
      setSuccess('Capa atualizada.');
      await loadStickerCategories();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao definir capa.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleRemoveCover() {
    if (!managedCategoryId) {
      return;
    }

    setBusyAction('remove-cover');
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/categories/${encodeURIComponent(managedCategoryId)}/cover`, {
        method: 'DELETE',
      }, 'Nao foi possivel remover a capa.');
      setSuccess('Capa removida.');
      await loadStickerCategories();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao remover capa.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleRenameImage(imageId: string) {
    const name = editingImageName.trim();

    if (!name) {
      setError('Informe o novo nome da figurinha.');
      return;
    }

    setBusyAction(`rename-${imageId}`);
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/images/${encodeURIComponent(imageId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      }, 'Nao foi possivel renomear a figurinha.');
      setSuccess('Figurinha renomeada.');
      setEditingImageId('');
      setEditingImageName('');
      await loadManagedCategoryImages();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao renomear figurinha.');
    } finally {
      setBusyAction('');
    }
  }

  async function handleDeleteImage(image: StickerImage) {
    if (!window.confirm(`Excluir a figurinha "${image.name}"?`)) {
      return;
    }

    setBusyAction(`delete-${image.id}`);
    setError('');
    setSuccess('');

    try {
      await requestJson(`/api/admin/stickers/images/${encodeURIComponent(image.id)}`, {
        method: 'DELETE',
      }, 'Nao foi possivel excluir a figurinha.');
      setSuccess('Figurinha excluida.');
      await Promise.all([loadManagedCategoryImages(), loadStickerCategories(), loadStorageUsage()]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Erro ao excluir figurinha.');
    } finally {
      setBusyAction('');
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Validando permissao admin
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm text-zinc-400">Pack do Criador</p>
            <h1 className="text-xl font-semibold text-white">Painel admin</h1>
          </div>
          <Button variant="outline" className="gap-2 border-white/15 bg-transparent text-white hover:bg-white/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Administrador</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">Ola, {admin?.name || 'admin'}.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Importe compradores da Cakto, acompanhe usuarios e envie emails de acesso quando necessario.
            </p>
          </div>
          <Button className="gap-2" onClick={() => router.push('/admin/usuarios')}>
            <Users className="h-4 w-4" />
            Ver usuarios
          </Button>
        </div>

        <section className="mb-5 rounded-lg border border-white/10 bg-zinc-950 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-white">{storageUsage?.label ?? 'Uso do armazenamento'}</h3>
                {isLoadingStorageUsage ? <Loader2 className="h-4 w-4 animate-spin text-zinc-500" /> : null}
                {storageUsage?.shouldBlockUploads ? (
                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
                    Upload bloqueado
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {storageUsage
                  ? storageUsage.description || `${storageUsage.currentFormatted ?? formatFileSize(storageCurrentBytes)} usados`
                  : 'Nao foi possivel carregar o uso atual.'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              <StorageMetric label="Atual" value={storageUsage?.currentFormatted ?? formatFileSize(storageCurrentBytes)} tone="text-emerald-300" />
              <StorageMetric label="Limite" value={storageUsage?.limitFormatted ?? 'Sem limite'} />
              <StorageMetric
                label="Restante"
                value={storageUsage?.remainingMb != null ? `${storageUsage.remainingMb} MB` : storageRemainingBytes != null ? formatFileSize(storageRemainingBytes) : 'Sem limite'}
                tone={storageUsage?.shouldBlockUploads ? 'text-red-300' : undefined}
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              className="h-10 gap-2"
              onClick={loadStorageUsage}
              disabled={isLoadingStorageUsage}
            >
              {isLoadingStorageUsage ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Atualizar
            </Button>
          </div>

          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-black">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${Math.min(100, storagePercentUsed)}%` }}
              />
            </div>
            <div className="mt-2 flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {storageUsage?.percentUsed != null
                  ? `${Math.round(storageUsage.percentUsed)}% usado`
                  : storageLimitBytes
                    ? `${Math.round(storagePercentUsed)}% usado`
                    : 'Sem limite configurado no backend'}
              </span>
              {selectedFolderSize ? (
                <span className={storageWouldExceedLimit ? 'text-red-300' : 'text-emerald-300'}>
                  {storageWouldExceedLimit ? 'Uploads bloqueados pelo limite atual' : `Selecionado para envio: ${formatFileSize(selectedFolderSize)}`}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <Tabs defaultValue="importar" className="space-y-5">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-lg border border-white/10 bg-zinc-950 p-2 lg:grid-cols-4">
            <TabsTrigger value="importar" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-black">
              <DownloadCloud className="h-4 w-4" />
              Importar
            </TabsTrigger>
            <TabsTrigger value="criar" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-black">
              <FolderPlus className="h-4 w-4" />
              Criar card
            </TabsTrigger>
            <TabsTrigger value="enviar" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-black">
              <Upload className="h-4 w-4" />
              Enviar
            </TabsTrigger>
            <TabsTrigger value="gerenciar" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-black">
              <Pencil className="h-4 w-4" />
              Gerenciar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="importar" className="mt-0">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-white text-black">
              <DownloadCloud className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold">Importar compradores da Cakto</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              A importacao usa envio de email desativado por padrao. Depois, envie o acesso manualmente na tabela de usuarios.
            </p>
            <Button className="mt-6 gap-2" onClick={handleImport} disabled={isImporting}>
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Importar compradores
            </Button>
          </div>

          <div className="rounded-lg border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Resumo da ultima importacao</h3>
              <Button variant="ghost" className="gap-2 text-zinc-300 hover:bg-white/10 hover:text-white" onClick={() => router.push('/admin/usuarios')}>
                Usuarios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryItem label="Pedidos lidos" value={summary?.totalOrdersRead ?? 0} />
              <SummaryItem label="Pedidos pagos" value={summary?.paidPackOrders ?? 0} />
              <SummaryItem label="Importados" value={summary?.imported ?? 0} />
              <SummaryItem label="Ignorados" value={summary?.skipped ?? 0} />
              <SummaryItem label="Emails enviados" value={summary?.emailsSent ?? 0} />
            </div>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="criar" className="mt-0">
            <form onSubmit={handleCreateCategory} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-black">
                  <FolderPlus className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Criar categoria de figurinhas</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Cadastre o card que aparece na area do usuario. Depois envie uma pasta de figurinhas para essa categoria.
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-full border border-white/10 bg-black px-3 py-1 text-xs font-medium text-zinc-400">
                Card da vitrine
              </span>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Nome do card</span>
                <Input
                  value={newCategoryTitle}
                  onChange={(event) => setNewCategoryTitle(event.target.value)}
                  className="h-11 border-white/10 bg-black text-white placeholder:text-zinc-600"
                  placeholder="Acessorios"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Descricao</span>
                <Input
                  value={newCategoryDescription}
                  onChange={(event) => setNewCategoryDescription(event.target.value)}
                  className="h-11 border-white/10 bg-black text-white placeholder:text-zinc-600"
                  placeholder="Figurinhas para stories de moda e beleza"
                />
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Capa do card</span>
                <div className="rounded-lg border border-dashed border-white/15 bg-black p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 text-zinc-300">
                      <ImagePlus className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Input
                        type="file"
                        accept="image/png,image/webp,image/jpeg"
                        onChange={(event) => setNewCategoryCover(event.target.files?.[0] ?? null)}
                        className="h-11 border-white/10 bg-zinc-950 text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
                      />
                      <p className="mt-2 truncate text-xs text-zinc-500">
                        {newCategoryCover ? `${newCategoryCover.name} - ${formatFileSize(newCategoryCover.size)}` : 'PNG, JPG ou WebP. Se nao escolher, o backend pode usar a primeira figurinha como capa.'}
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              <Button type="submit" className="h-11 gap-2 px-5" disabled={isCreatingCategory}>
                {isCreatingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
                Criar card
              </Button>
            </div>
          </div>
            </form>
          </TabsContent>

          <TabsContent value="enviar" className="mt-0">
            <form onSubmit={handleStickerUpload} className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-black">
                  <Upload className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Enviar figurinhas protegidas</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Selecione uma categoria e envie uma pasta com imagens. Os arquivos ficam protegidos pelo backend.
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {stickerCategories.length} categorias
              </span>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Categoria</span>
                <select
                  value={stickerCategory}
                  onChange={(event) => setStickerCategory(event.target.value)}
                  className="flex h-11 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {stickerCategories.length ? (
                    stickerCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))
                  ) : (
                    <option value="acessorios">Crie uma categoria primeiro</option>
                  )}
                </select>
                <p className="mt-2 truncate text-xs text-zinc-500">
                  {selectedUploadCategory ? `${selectedUploadCategory.totalStickers} figurinhas cadastradas` : 'Nenhuma categoria disponivel'}
                </p>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Pasta de figurinhas</span>
                <div className="rounded-lg border border-dashed border-white/15 bg-black p-3">
                  <Input
                    type="file"
                    accept="image/png,.png"
                    multiple
                    onChange={(event) => setStickerFiles(Array.from(event.target.files ?? []))}
                    className="h-11 border-white/10 bg-zinc-950 text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
                    {...{ webkitdirectory: '', directory: '' }}
                  />
                  <div className="mt-3 flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      {uploadProgress || (stickerFiles.length ? `${stickerFiles.length} arquivos selecionados` : 'Escolha uma pasta apenas com arquivos PNG.')}
                    </span>
                    {stickerFiles.length ? <span>{formatFileSize(selectedFolderSize)}</span> : null}
                  </div>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-zinc-500">
                O envio remove subpastas, aceita apenas PNG, renomeia em sequencia e divide em lotes seguros para a Vercel.
              </p>
              <Button type="submit" className="h-11 gap-2 px-5" disabled={isUploadingSticker || !stickerCategories.length}>
                {isUploadingSticker ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Enviar figurinhas
              </Button>
            </div>
          </div>
            </form>
          </TabsContent>

          <TabsContent value="gerenciar" className="mt-0">
            <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
          <div className="border-b border-white/10 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                  <Pencil className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar categorias e figurinhas</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Edite o card, escolha a capa, renomeie figurinhas ou remova itens enviados.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-10 gap-2"
                onClick={() => managedCategoryId && loadManagedCategoryImages(managedCategoryId)}
                disabled={!managedCategoryId || isLoadingManagedImages}
              >
                {isLoadingManagedImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Atualizar
              </Button>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-300">Categoria</span>
                <select
                  value={managedCategoryId}
                  onChange={(event) => handleManagedCategoryChange(event.target.value)}
                  className="flex h-11 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {stickerCategories.length ? (
                    stickerCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))
                  ) : (
                    <option value="">Nenhuma categoria</option>
                  )}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryItem label="Figurinhas" value={managedCategory?.totalStickers ?? 0} />
                <div className="rounded-md border border-white/10 bg-black p-4 sm:col-span-2">
                  <p className="text-sm text-zinc-500">Capa atual</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-white">{managedCategory?.coverUrl ? 'Capa definida' : 'Sem capa definida'}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 gap-2 text-zinc-300 hover:bg-white/10 hover:text-white"
                      onClick={handleRemoveCover}
                      disabled={!managedCategory?.coverUrl || busyAction === 'remove-cover'}
                    >
                      {busyAction === 'remove-cover' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateCategory} className="rounded-lg border border-white/10 bg-black p-4">
              <div className="grid gap-4 lg:grid-cols-[260px_1fr_auto_auto] lg:items-end">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">Nome</span>
                  <Input
                    value={editCategoryTitle}
                    onChange={(event) => setEditCategoryTitle(event.target.value)}
                    className="h-11 border-white/10 bg-zinc-950 text-white"
                    placeholder="Nome da categoria"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">Descricao</span>
                  <Input
                    value={editCategoryDescription}
                    onChange={(event) => setEditCategoryDescription(event.target.value)}
                    className="h-11 border-white/10 bg-zinc-950 text-white"
                    placeholder="Descricao do card"
                  />
                </label>
                <Button type="submit" className="h-11 gap-2" disabled={!managedCategoryId || busyAction === 'update-category'}>
                  {busyAction === 'update-category' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-11 gap-2"
                  onClick={handleDeleteCategory}
                  disabled={!managedCategoryId || busyAction === 'delete-category'}
                >
                  {busyAction === 'delete-category' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Excluir
                </Button>
              </div>
            </form>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Figurinhas da categoria</h4>
                <span className="text-xs text-zinc-500">
                  {managedImages.length ? `${(currentImagePage - 1) * IMAGES_PER_PAGE + 1}-${Math.min(currentImagePage * IMAGES_PER_PAGE, managedImages.length)} de ${managedImages.length}` : '0 carregadas'}
                </span>
              </div>

              {isLoadingManagedImages ? (
                <div className="rounded-lg border border-white/10 bg-black p-8 text-center text-sm text-zinc-400">
                  <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
                  Carregando figurinhas
                </div>
              ) : managedImages.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedManagedImages.map((image) => {
                    const isCover = managedCategory?.coverImageId === image.id || managedCategory?.coverUrl === image.url;
                    const isEditing = editingImageId === image.id;

                    return (
                      <article key={image.id} className="overflow-hidden rounded-lg border border-white/10 bg-black">
                        <div className="relative flex aspect-square items-center justify-center border-b border-white/10 bg-[linear-gradient(45deg,#111_25%,transparent_25%),linear-gradient(-45deg,#111_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#111_75%),linear-gradient(-45deg,transparent_75%,#111_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] p-5">
                          <img
                            src={image.url}
                            alt=""
                            loading="lazy"
                            className="max-h-full max-w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
                            onLoad={() => {
                              setFailedImageIds((current) => {
                                if (!current[image.id]) {
                                  return current;
                                }

                                const { [image.id]: _failedImage, ...next } = current;
                                return next;
                              });
                            }}
                            onError={() => {
                              setFailedImageIds((current) => ({
                                ...current,
                                [image.id]: image.url,
                              }));
                            }}
                          />
                          {failedImageIds[image.id] ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center">
                              <AlertCircle className="h-5 w-5 text-red-300" />
                              <p className="text-xs font-medium text-red-200">Imagem nao carregou</p>
                              <p className="max-w-full break-all text-[11px] leading-4 text-zinc-500">
                                {failedImageIds[image.id]}
                              </p>
                            </div>
                          ) : null}
                          {isCover ? (
                            <span className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-400 px-2.5 py-1 text-xs font-semibold text-black">
                              Capa
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-3 p-3">
                          <div className="min-w-0">
                            {isEditing ? (
                              <Input
                                value={editingImageName}
                                onChange={(event) => setEditingImageName(event.target.value)}
                                className="h-9 border-white/10 bg-zinc-950 text-sm text-white"
                              />
                            ) : (
                              <p className="truncate text-sm font-semibold text-white" title={image.name}>
                                {image.name}
                              </p>
                            )}
                            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-zinc-500">
                              <span>{formatFileSize(image.size)}</span>
                              <span className="truncate">{image.mimeType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-zinc-950/70 p-3">
                          {isEditing ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                className="col-span-2 gap-2"
                                onClick={() => handleRenameImage(image.id)}
                                disabled={busyAction === `rename-${image.id}`}
                              >
                                {busyAction === `rename-${image.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                                Salvar
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="px-2"
                                onClick={() => {
                                  setEditingImageId('');
                                  setEditingImageName('');
                                }}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="gap-2"
                                onClick={() => {
                                  setEditingImageId(image.id);
                                  setEditingImageName(image.name);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Nome</span>
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="gap-2"
                                onClick={() => handleSetCover(image.id)}
                                disabled={busyAction === `cover-${image.id}` || isCover}
                              >
                                {busyAction === `cover-${image.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
                                <span className="hidden sm:inline">Capa</span>
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                className="gap-2"
                                onClick={() => handleDeleteImage(image)}
                                disabled={busyAction === `delete-${image.id}`}
                              >
                                {busyAction === `delete-${image.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                <span className="hidden sm:inline">Excluir</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-black p-8 text-center text-sm text-zinc-500">
                  Selecione uma categoria e atualize para carregar as figurinhas.
                </div>
              )}

              {managedImages.length > IMAGES_PER_PAGE ? (
                <div className="mt-5 flex flex-col gap-3 rounded-lg border border-white/10 bg-black p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-400">
                    Pagina {currentImagePage} de {totalImagePages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={() => setImagePage((page) => Math.max(1, page - 1))}
                      disabled={currentImagePage <= 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                      onClick={handleNextManagedImagePage}
                      disabled={currentImagePage >= totalImagePages && !hasMoreManagedImages}
                    >
                      Proxima
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null}

              {hasMoreManagedImages ? (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={handleLoadMoreManagedImages}
                    disabled={isLoadingManagedImages}
                  >
                    {isLoadingManagedImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Carregar mais {Math.min(IMAGE_BATCH_SIZE, (managedCategory?.totalStickers ?? 0) - managedImages.length)}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>

      {error || success ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className={`w-full max-w-md overflow-hidden rounded-lg border shadow-2xl shadow-black/60 ${
              error ? 'border-red-500/30 bg-zinc-950' : 'border-emerald-500/30 bg-zinc-950'
            }`}
          >
            <div className={`h-1 ${error ? 'bg-red-500' : 'bg-emerald-400'}`} />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${
                  error ? 'bg-red-500/10 text-red-300' : 'bg-emerald-400/10 text-emerald-300'
                }`}>
                  {error ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {error ? 'Algo precisa de atencao' : 'Tudo certo'}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {error || success}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                  }}
                  aria-label="Fechar mensagem"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  type="button"
                  className={error ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-emerald-400 text-black hover:bg-emerald-300'}
                  onClick={() => {
                    setError('');
                    setSuccess('');
                  }}
                >
                  Entendi
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StorageMetric({ label, value, tone = 'text-white' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function getUsagePercent(percentUsed: number | null | undefined, currentBytes: number, limitBytes: number | null) {
  if (typeof percentUsed === 'number') {
    return Math.max(0, Math.min(100, percentUsed));
  }

  if (!limitBytes) {
    return 0;
  }

  return Math.min(100, (currentBytes / limitBytes) * 100);
}

function formatFileSize(bytes: number) {
  if (!bytes) {
    return '0 KB';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function normalizeStickerUploadFiles(files: File[]) {
  const pngFiles = files.filter(isPngFile);

  if (!pngFiles.length) {
    return {
      ok: false as const,
      error: 'Nenhum arquivo PNG foi encontrado na pasta selecionada.',
    };
  }

  const sortedFiles = [...pngFiles].sort((a, b) => getUploadSortName(a).localeCompare(getUploadSortName(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  }));

  return {
    ok: true as const,
    files: sortedFiles.map((file, index) => new File([file], `${index + 1}.png`, {
      type: 'image/png',
      lastModified: file.lastModified,
    })),
  };
}

function splitFilesForVercel(files: File[]) {
  const batches: File[][] = [];
  let batch: File[] = [];
  let size = 0;

  for (const file of files) {
    if (batch.length && size + file.size > VERCEL_SAFE_UPLOAD_BYTES) {
      batches.push(batch);
      batch = [];
      size = 0;
    }

    batch.push(file);
    size += file.size;
  }

  if (batch.length) {
    batches.push(batch);
  }

  return batches;
}

async function optimizePngFiles(files: File[], onProgress: (current: number, total: number) => void) {
  const optimizedFiles: File[] = [];

  for (let index = 0; index < files.length; index += 1) {
    onProgress(index + 1, files.length);
    optimizedFiles.push(await optimizePngFile(files[index]));
  }

  return optimizedFiles;
}

async function optimizePngFile(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_STICKER_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d', {
      alpha: true,
      willReadFrequently: false,
    });

    if (!context) {
      bitmap.close();
      return file;
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await canvasToBlob(canvas, 'image/png');

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File([blob], file.name, {
      type: 'image/png',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type);
  });
}

function isPngFile(file: File) {
  return file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
}

function getUploadSortName(file: File) {
  return ((file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name).replace(/\\/g, '/');
}

function normalizeStickerCategory(category: StickerCategory) {
  const coverUrl =
    category.coverUrl ??
    category.cover_url ??
    category.coverImageUrl ??
    category.cover_image_url ??
    category.coverImage?.url ??
    category.cover_image?.url ??
    null;
  const coverImageId = category.coverImageId ?? category.cover_image_id ?? null;
  const totalStickers = Number(
    category.totalStickers ??
    category.total_stickers ??
    (category as StickerCategory & { count?: number }).count ??
    0
  );

  return {
    ...category,
    coverImageId,
    totalStickers,
    coverUrl: normalizeProtectedUrl(coverUrl),
  };
}

function normalizeStickerImage(image: StickerImage) {
  const imageUrl = image.url ?? image.imageUrl ?? image.image_url ?? null;
  const downloadUrl = image.downloadUrl ?? image.download_url ?? imageUrl;

  return {
    ...image,
    name: image.name || image.originalName || image.original_name || 'figurinha',
    mimeType: image.mimeType ?? image.mime_type ?? '',
    url: normalizeProtectedUrl(imageUrl) ?? '',
    downloadUrl: normalizeProtectedUrl(downloadUrl) ?? '',
  };
}

function mergeImagesById(current: StickerImage[], next: StickerImage[]) {
  const seen = new Set(current.map((image) => image.id));
  const uniqueNext = next.filter((image) => {
    if (seen.has(image.id)) {
      return false;
    }

    seen.add(image.id);
    return true;
  });

  return [...current, ...uniqueNext];
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
