import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBasketStore } from '@/stores'
import { basketItemsApi } from '@/api'
import { useToast } from './useToast'
import { UnauthorizedError } from '@/lib/errors'

/**
 * Custom hook for basket operations with React Query
 */
export function useBasket() {
  const queryClient = useQueryClient()
  const { basket, setBasket, setAddedItemId, getTotalItems, getTotalPrice } = useBasketStore()
  const { showSuccess, showError } = useToast()

  // Fetch basket
  const { isLoading, error, refetch } = useQuery({
    queryKey: ['basket'],
    queryFn: async () => {
      try {
        const data = await basketItemsApi().getBasket()
        setBasket(data)
        if (data.addedItemId !== undefined && data.addedItemId !== null) {
          setAddedItemId(data.addedItemId)
        }
        return data
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          setBasket(null)
        }
        throw error
      }
    },
    retry: false,
  })

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({ catalogItemId, quantity }: { catalogItemId: number; quantity: number }) =>
      basketItemsApi().addItem(catalogItemId, quantity),
    onSuccess: (_, variables) => {
      setAddedItemId(variables.catalogItemId)
      queryClient.invalidateQueries({ queryKey: ['basket'] })
      showSuccess('商品をカートに追加しました')
    },
    onError: () => {
      showError('商品の追加に失敗しました')
    },
  })

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ catalogItemId, quantity }: { catalogItemId: number; quantity: number }) =>
      basketItemsApi().updateItem(catalogItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket'] })
    },
    onError: () => {
      showError('商品の更新に失敗しました')
    },
  })

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (catalogItemId: number) => basketItemsApi().deleteItem(catalogItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket'] })
      showSuccess('商品を削除しました')
    },
    onError: () => {
      showError('商品の削除に失敗しました')
    },
  })

  // Clear basket mutation
  const clearBasketMutation = useMutation({
    mutationFn: () => basketItemsApi().clearBasket(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['basket'] })
      showSuccess('カートをクリアしました')
    },
    onError: () => {
      showError('カートのクリアに失敗しました')
    },
  })

  return {
    basket,
    isLoading,
    error,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    refetch,
    addItem: addItemMutation.mutateAsync,
    updateItem: (catalogItemId: number, quantity: number) =>
      updateItemMutation.mutate({ catalogItemId, quantity }),
    deleteItem: (catalogItemId: number) => deleteItemMutation.mutate(catalogItemId),
    clearBasket: clearBasketMutation.mutate,
  }
}
