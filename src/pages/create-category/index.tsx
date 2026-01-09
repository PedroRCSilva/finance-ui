import { useForm } from 'react-hook-form'
import { CreateCategoryView } from './view'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaCategory } from './data/schema'
import { sanitizePrice } from '@utils/formatters'
import { useCreateCategory } from '@hooks'
import { CategoryTypeEnum } from '@pages/list-category/hooks/use-list-category/types'
import { ICategoryRequest } from '@services/category-service/types'
import { useNavigate } from 'react-router-dom'
import { toast } from '@lib/toast'

export const CreateCategory = () => {
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<z.infer<typeof schemaCategory>>({
    resolver: zodResolver(schemaCategory),
    defaultValues: {
      estimatedCost: 'R$ 0,00',
      title: '',
      type: CategoryTypeEnum.FIXED
    }
  })

  const { mutationAsync } = useCreateCategory()

  const saveCategory = async (data: z.infer<typeof schemaCategory>) => {
    const payload: ICategoryRequest = {
      description: data.title,
      type: data.type === CategoryTypeEnum.FIXED ? 'FIXED' : 'VARIABLE',
      estimatedCost: sanitizePrice(data.estimatedCost)
    }

    await mutationAsync(payload)
    navigate('/gerenciamento')
    toast.success({
      durationMs: 5000,
      title: 'Ação concluída com sucesso!',
      description: `A categoria ${data?.title} foi adicionado!`
    })
  }

  return <CreateCategoryView title="Criar Categoria" control={control} handleSubmit={handleSubmit(saveCategory)} />
}
