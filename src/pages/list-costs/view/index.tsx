import React from 'react'
import { IListCostsView } from './types'
import { CardItem } from '@components/ui/card-item'
import { Button } from '@components/ui/button'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

export const ListCostsView: React.FC<IListCostsView> = ({ costs, categoryName }) => {
  const navigate = useNavigate()
  return (
    <>
      <div>
        <div className="mx-auto mb-4 flex w-11/12 items-center gap-4">
          <Button
            className="flex h-5 w-5 items-center justify-center rounded-full border-none bg-transparent p-0"
            onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack size={20} className="w-10 text-black" />
          </Button>
          <div className="flex w-full gap-1">
            <strong>Saidas</strong> - <h3 className="font-medium">{categoryName}</h3>
          </div>
        </div>
        <div>
          <ul>
            {costs.length === 0 && (
              <div className="mx-auto flex h-full w-10/11 items-center justify-center py-5 text-gray-400">
                Não há saidas registradas
              </div>
            )}
            {costs.map(cost => (
              <CardItem
                amount={cost.amount * -1}
                type={cost.category.description}
                title={cost.description}
                onEdit={() => navigate(`/gerenciamento/update-cost/${cost.id}`)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
