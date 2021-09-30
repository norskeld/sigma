export async function identity<T>(value: T): Promise<T> {
  return value
}
