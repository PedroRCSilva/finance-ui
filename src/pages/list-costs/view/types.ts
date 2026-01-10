import { ICostResponse } from '@services/cost-service/types'

export interface IListCostsView {
  costs: ICostResponse[]
  categoryName: string
}
