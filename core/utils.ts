export const cx = (mods: Record<string, boolean>): string => {
  const cns: string[] = []
  Object.keys(mods).forEach(k => mods[k] && cns.push(k))
  return cns.join(' ')
}
