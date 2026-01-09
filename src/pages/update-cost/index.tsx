import { zodResolver } from '@hookform/resolvers/zod'
import { useCategory, useCostById, useRemoveCost, useUpdateCost } from '@hooks'
import { schemaCost } from '@pages/create-cost/data/schema'
import { CreateCostView } from '@pages/create-cost/view'
import { formatPrice, sanitizePrice } from '@utils/formatters'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '@lib/toast'
import { AxiosError } from 'axios'

export const UpdateCost = () => {
  const { categories } = useCategory()
  const { mutationAsync } = useUpdateCost()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const options = categories.content.map(el => ({
    label: el.description,
    value: el.id
  }))

  const { mutationAsync: removeMutationAsync } = useRemoveCost()
  const { cost } = useCostById(id || '')

  const removeCost = async () => {
    if (!id) throw new Error('ID is required for removing cost')
    setIsLoading(true)
    try {
      await removeMutationAsync(id)
      navigate('/gerenciamento')
      toast.success({
        durationMs: 5000,
        title: 'Ação concluída com sucesso!',
        description: `O custo ${cost?.description} foi removido`
      })
    } catch (error: unknown) {
      const status = error instanceof AxiosError ? error.status : null

      if (status === 404) {
        toast.destructive({
          title: 'Não foi possível prosseguir com a exclusão',
          description: 'O custo informado não existe',
          durationMs: 8000
        })
        return
      }
      toast.destructive({
        title: 'Não foi possível prosseguir com a exclusão',
        description: 'Tente novamente mais tarde.',
        durationMs: 8000
      })
    }
  }

  const onSubmit = async (data: z.infer<typeof schemaCost>) => {
    if (!id) throw new Error('ID is required for updating cost')
    const payload = {
      id,
      description: data.name,
      amount: sanitizePrice(data.amount),
      category: {
        id: data.categoryId
      }
    }

    setIsLoading(true)
    await mutationAsync(payload)
    setIsLoading(false)
    toast.success({
      durationMs: 5000,
      title: 'Ação concluída com sucesso!',
      description: `O custo ${data?.name} foi atualizado!`
    })
  }

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schemaCost),
    mode: 'onSubmit',
    values: {
      name: cost?.description || '',
      amount: formatPrice(cost?.amount || 0),
      categoryId: options.find(option => option.value === cost?.category.id)?.value || ''
    }
  })

  return (
    <CreateCostView
      title="Atualizar Saída Financeira"
      control={control}
      onSubmit={handleSubmit(onSubmit)}
      options={options}
      onRemove={removeCost}
      isLoading={isLoading}
    />
  )
}
