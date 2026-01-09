import { zodResolver } from '@hookform/resolvers/zod'
import { useCategoryById, useUpdateCategory } from '@hooks'
import { toast } from '@lib/toast'
import { schemaCategory } from '@pages/create-category/data/schema'
import { CreateCategoryView } from '@pages/create-category/view'
import { CategoryTypeEnum } from '@pages/list-category/hooks/use-list-category/types'
import { ICategoryRequest } from '@services/category-service/types'
import { formatPrice, sanitizePrice } from '@utils/formatters'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import z from 'zod'

export const UpdateCategory = () => {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const { category } = useCategoryById(id || '')

  const { control, handleSubmit } = useForm<z.infer<typeof schemaCategory>>({
    resolver: zodResolver(schemaCategory),
    values: {
      estimatedCost: formatPrice(category?.estimatedCost ?? 0),
      title: category?.description ?? '',
      type: CategoryTypeEnum.FIXED
    }
  })

  const { mutationAsync } = useUpdateCategory()

  const updateCategory = async (data: z.infer<typeof schemaCategory>) => {
    if (!id) throw new Error('ID is required for updating category')
    const payload: ICategoryRequest = {
      id: id,
      description: data.title,
      type: data.type === CategoryTypeEnum.FIXED ? 'FIXED' : 'VARIABLE',
      estimatedCost: sanitizePrice(data.estimatedCost)
    }

    await mutationAsync(payload)
    navigate('/gerenciamento')
    toast.success({
      durationMs: 5000,
      title: 'Ação concluída com sucesso!',
      description: `A categoria ${data?.title} foi atualizada!`
    })
  }

  return (
    <CreateCategoryView title="Atualizar Categoria" control={control} handleSubmit={handleSubmit(updateCategory)} />
  )
}
