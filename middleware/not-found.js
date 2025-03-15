const notFound = (req, res) => {
  throw Object.assign(new Error('Route not found'), { statusCode: 404})
}

export default notFound