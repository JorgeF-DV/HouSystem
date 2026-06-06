export class NotFoundError extends Error {
  constructor(message: string = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function getOwnedResource<T>(
  model: { findFirst: (args: any) => Promise<T | null> },
  id: string,
  partnerId: string,
): Promise<T> {
  const resource = await model.findFirst({ where: { id, partnerId } });
  if (!resource) throw new NotFoundError();
  return resource;
}
