export function usePagination<T>(items: Ref<T[]> | T[], pageSize: number = 5) {
  const page = ref(1)
  
  const paginatedItems = computed(() => {
    const data = unref(items)
    const start = (page.value - 1) * pageSize
    return data.slice(start, start + pageSize)
  })

  return {
    page,
    paginatedItems,
    pageSize
  }
}
