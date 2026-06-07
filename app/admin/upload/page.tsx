'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Upload, X, Loader2, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

type UploadedFile = { file: File; preview: string; url?: string }

export default function UploadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [published, setPublished] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [coverIndex, setCoverIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Carica dati esistenti se in modalità edit
  useEffect(() => {
    if (!editId) return
    supabase.from('posts').select('*').eq('id', editId).single().then(({ data }) => {
      if (!data) return
      setTitle(data.title)
      setDescription(data.description ?? '')
      setPublished(data.published)
    })
  }, [editId])

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  function removeFile(index: number) {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      if (coverIndex >= updated.length) setCoverIndex(0)
      return updated
    })
  }

  async function uploadFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('Photos').upload(name, file)
    if (error) throw error
    const { data } = supabase.storage.from('Photos').getPublicUrl(name)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return toast.error('Inserisci un titolo')
    if (files.length === 0 && !editId) return toast.error('Carica almeno una foto')

    setLoading(true)
    try {
      // Upload nuove foto
      const urls: string[] = []
      for (const f of files) {
        const url = await uploadFile(f.file)
        urls.push(url)
      }

      const coverUrl = urls[coverIndex] ?? urls[0]
      const otherPhotos = urls.filter((_, i) => i !== coverIndex)

      if (editId) {
        const update: Record<string, unknown> = { title, description, published }
        if (urls.length > 0) {
          update.cover_url = coverUrl
          update.photos = otherPhotos
        }
        const { error } = await supabase.from('posts').update(update).eq('id', editId)
        if (error) throw error
        toast.success('Post aggiornato!')
      } else {
        const { error } = await supabase.from('posts').insert({
          title,
          description,
          published,
          cover_url: coverUrl,
          photos: otherPhotos,
        })
        if (error) throw error
        toast.success('Post creato!')
      }

      router.push('/admin')
    } catch (err) {
      console.error(err)
      toast.error('Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm opacity-40 hover:opacity-80 transition-opacity mb-6">
        <ArrowLeft size={14} />
        admin
      </Link>

      <h1 className="text-lg font-light tracking-wider mb-6">
        {editId ? 'Modifica post' : 'Nuovo post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titolo */}
        <div>
          <label className="block text-xs opacity-50 mb-1 tracking-wider">TITOLO *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-card border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-accent/40 transition-colors"
            placeholder="Titolo del post"
            required
          />
        </div>

        {/* Descrizione */}
        <div>
          <label className="block text-xs opacity-50 mb-1 tracking-wider">DESCRIZIONE</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-card border border-border rounded px-3 py-2.5 text-sm outline-none focus:border-accent/40 transition-colors resize-none"
            placeholder="Racconto o descrizione dello scatto..."
          />
        </div>

        {/* Upload zone */}
        <div>
          <label className="block text-xs opacity-50 mb-1 tracking-wider">
            FOTO {editId ? '(lascia vuoto per mantenere le attuali)' : '*'}
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-accent/60 bg-accent/5' : 'border-border hover:border-accent/30'
            }`}
          >
            <input {...getInputProps()} />
            <Upload size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm opacity-50">
              {isDragActive ? 'Rilascia le foto qui' : 'Trascina foto o clicca per selezionare'}
            </p>
            <p className="text-xs opacity-30 mt-1">JPG, PNG, WebP</p>
          </div>
        </div>

        {/* Preview foto */}
        {files.length > 0 && (
          <div>
            <p className="text-xs opacity-50 mb-2 tracking-wider">
              ANTEPRIMA — <span className="text-yellow-400">★ = copertina</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative group rounded overflow-hidden aspect-square bg-card">
                  <Image src={f.preview} alt="" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCoverIndex(i)}
                      className={`p-1.5 rounded-full ${coverIndex === i ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
                      title="Imposta come copertina"
                    >
                      <Star size={16} fill={coverIndex === i ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1.5 rounded-full text-white/70 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {coverIndex === i && (
                    <div className="absolute top-1 left-1 bg-yellow-400 text-black text-xs px-1 rounded">cover</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pubblicato */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished((v) => !v)}
            className={`relative w-10 h-5 rounded-full transition-colors ${published ? 'bg-green-500' : 'bg-border'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${published ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm opacity-60">
            {published ? 'Pubblicato (visibile nella galleria)' : 'Bozza (solo tu lo vedi)'}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-surface font-medium py-2.5 rounded text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> salvataggio...</> : (editId ? 'Aggiorna post' : 'Pubblica post')}
        </button>
      </form>
    </div>
  )
}
