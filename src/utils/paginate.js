export default (results, page: Number = 0, limit: Number = 10) => {

  page = Math.ceil(Number(page));
  limit = Math.ceil(Number(limit));

  const max = results.length;

  if (limit > max || limit < 1) return results;

  const numPages = Math.ceil(max / limit);
  console.log(numPages);

  if (page > numPages) page = numPages;
  if (page < 1) page = 1;

  const skip = (page - 1) * limit;

  if (skip + limit > max) limit = max - skip;

  console.log(skip);
  console.log(limit);

  results = results.splice(skip, limit);

  results.pagination = {
    current: page,
    perPage: limit,
    previous: page > 0 ? page - 1 : undefined,
    next: page < numPages - 1 ? page + 1 : undefined
  };

  return results;
};
