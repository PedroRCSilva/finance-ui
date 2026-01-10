import { ListCostsView } from './view'
import { useParams } from 'react-router-dom'
import { useListCost } from './hooks/use-list-cost'
import { useCategoryById } from '@hooks'
export const ListCosts = () => {
  const { id } = useParams<{ id: string }>()

  const { costs } = useListCost({ id: id || '' })
  const { category } = useCategoryById(id || '')
  return <ListCostsView costs={costs.content} categoryName={category?.description || ''} />
}
