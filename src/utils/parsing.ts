export function Paginate(data, total, pagination) {
  const { page, perPage } = pagination;

  const cantPages = Math.ceil(total / perPage);

  return {
    data,
    total,
    page,
    perPage,
    cantPages,
  };
}
