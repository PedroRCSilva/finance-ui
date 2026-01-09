import { useForm } from 'react-hook-form'
import { CreateCostView } from './view'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaCost } from './data/schema'
import { useCategory } from '@hooks'
import { useCreateCost } from '@hooks'
import z from 'zod'
import { sanitizePrice } from '@utils/formatters'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MANAGEMENT_ROUTER } from '@constants/routes'
import { toast } from '@lib/toast'

export const CreateCost = () => {
  const { categories } = useCategory()
  const { mutationAsync } = useCreateCost()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const options = categories.content.map(el => ({
    label: el.description,
    value: el.id
  }))

  const onSubmit = async (data: z.infer<typeof schemaCost>) => {
    const payload = {
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
      description: `O custo ${data?.name} foi adicionado!`
    })
    const url = MANAGEMENT_ROUTER.path ?? ''
    navigate('/' + url)
  }

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schemaCost),
    mode: 'onSubmit'
  })

  return (
    <CreateCostView
      title={'Cadastrar Saída Financeira'}
      control={control}
      isLoading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
      options={options}
    />
  )
}
