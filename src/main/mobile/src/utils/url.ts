export const buildUrlWithParam = (url: string, params: Record<string, any>): string => {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => Boolean(value)))

  const queryString = new URLSearchParams(filteredParams).toString()
  return queryString ? `${url}?${queryString}` : url
}
