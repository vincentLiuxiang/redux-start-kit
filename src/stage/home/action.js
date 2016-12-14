export function refresh () {
  return {
    type: 'REFRESH_ALL',
    'url': '/getAllNews.json'
  }
}