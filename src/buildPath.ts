export function buildPathWithReplace(to: string, params: Record<string, string>): string {

  return to.replace(/\$\w+/g, (match) => params[match.slice(1)])
}

// pure string just because replace only returns string, and I don't want to handle that right now
console.log(buildPathWithReplace('/user/$id', {id: '1'}))

export function buildPath(to: string, params: Record<string, string>): string {
  const pathArr = to.split('/')

  return pathArr.map(path => path.startsWith('$') ? params[path.slice(1)] : path).join('/');
}

console.debug(buildPath('/posts/$postId/comments/$commentId', { postId: '1', commentId: '2' }))


export function buildUrl() {}
